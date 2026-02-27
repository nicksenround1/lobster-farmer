import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import Stripe from "stripe";
import crypto from "crypto";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function generateRefCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(8);
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return `LF-${result}`;
}

function getSessionToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies.get("session")?.value || null;
}

// Find or create Stripe customer by email
async function findOrCreateCustomer(
  stripe: Stripe,
  email: string
): Promise<Stripe.Customer> {
  const existing = await stripe.customers.list({
    email: email.toLowerCase(),
    limit: 1,
  });
  if (existing.data.length > 0) {
    return existing.data[0];
  }
  return await stripe.customers.create({ email: email.toLowerCase() });
}

export async function POST(req: NextRequest) {
  // Auth
  const token = getSessionToken(req);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // Parse body
  let body: { wallet?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const wallet = body.wallet?.trim();
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json(
      { error: "Valid EVM wallet address is required (0x...)" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payment system unavailable" },
      { status: 500 }
    );
  }

  // Find or create Stripe customer
  const customer = await findOrCreateCustomer(stripe, user.email);

  // Check if already registered (metadata has ref code)
  if (customer.metadata?.ref_code) {
    // Update wallet if different
    if (customer.metadata.ref_wallet !== wallet) {
      await stripe.customers.update(customer.id, {
        metadata: { ...customer.metadata, ref_wallet: wallet },
      });
    }
    return NextResponse.json({
      code: customer.metadata.ref_code,
      referralUrl: `https://lobsterfarmer.com?ref=${customer.metadata.ref_code}`,
      message: "Already registered",
    });
  }

  // Verify user has purchase records
  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
    });
    const hasPurchase = sessions.data.some((s) => {
      const detailEmail = s.customer_details?.email?.toLowerCase();
      const custEmail = s.customer_email?.toLowerCase();
      return (
        detailEmail === user.email.toLowerCase() ||
        custEmail === user.email.toLowerCase()
      );
    });
    if (!hasPurchase) {
      return NextResponse.json(
        {
          error: "You need to purchase a product before becoming a referrer",
        },
        { status: 403 }
      );
    }
  } catch (err) {
    console.error("Stripe purchase check failed:", err);
  }

  // Generate referral code and store in Stripe customer metadata
  const code = generateRefCode();
  await stripe.customers.update(customer.id, {
    metadata: {
      ref_code: code,
      ref_wallet: wallet,
      ref_created: new Date().toISOString(),
    },
  });

  return NextResponse.json({
    code,
    referralUrl: `https://lobsterfarmer.com?ref=${code}`,
  });
}
