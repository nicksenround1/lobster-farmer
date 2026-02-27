import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getSessionToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies.get("session")?.value || null;
}

function resolveProductName(cents: number): string {
  if (cents <= 150) return "Starter Pack";
  if (cents <= 5500) return "Lobster Persona";
  return "Lobster Bundle";
}

export async function GET(req: NextRequest) {
  // Auth
  const token = getSessionToken(req);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payment system unavailable" },
      { status: 500 }
    );
  }

  // Find customer by email
  const customers = await stripe.customers.list({
    email: user.email.toLowerCase(),
    limit: 1,
  });

  if (customers.data.length === 0 || !customers.data[0].metadata?.ref_code) {
    return NextResponse.json({ registered: false });
  }

  const customer = customers.data[0];
  const refCode = customer.metadata.ref_code;
  const refWallet = customer.metadata.ref_wallet || "";

  // Query Stripe sessions for commissions (matching client_reference_id)
  let commissions: {
    product: string;
    amount: number;
    commission: number;
    currency: string;
    date: string;
    settled: boolean;
  }[] = [];

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
    });

    commissions = sessions.data
      .filter((s) => {
        const refId = s.client_reference_id;
        return refId === `ref_${refCode}`;
      })
      .filter((s) => {
        // Self-referral check
        const buyerEmail =
          s.customer_details?.email?.toLowerCase() ||
          s.customer_email?.toLowerCase();
        return buyerEmail !== user.email.toLowerCase();
      })
      .map((s) => {
        const amountTotal = (s.amount_total || 0) / 100;
        const commission = Math.round(amountTotal * 25) / 100; // 25%
        return {
          product: resolveProductName(s.amount_total || 0),
          amount: amountTotal,
          commission,
          currency: (s.currency || "usd").toUpperCase(),
          date: new Date((s.created || 0) * 1000).toISOString(),
          settled: false,
        };
      });
  } catch (err) {
    console.error("Stripe commission query failed:", err);
  }

  const totalReferrals = commissions.length;
  const totalCommission = commissions.reduce((sum, c) => sum + c.commission, 0);
  const settledCommission = commissions
    .filter((c) => c.settled)
    .reduce((sum, c) => sum + c.commission, 0);
  const pendingCommission = totalCommission - settledCommission;

  return NextResponse.json({
    registered: true,
    code: refCode,
    wallet: refWallet,
    referralUrl: `https://lobsterfarmer.com?ref=${refCode}`,
    stats: {
      totalReferrals,
      totalCommission: Math.round(totalCommission * 100) / 100,
      settledCommission: Math.round(settledCommission * 100) / 100,
      pendingCommission: Math.round(pendingCommission * 100) / 100,
    },
    commissions,
  });
}
