import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import Stripe from "stripe";
import fs from "fs";

const REFERRERS_FILE = "/tmp/lobster-referrers.json";
const COMMISSIONS_FILE = "/tmp/lobster-commissions.json";

interface Referrer {
  code: string;
  email: string;
  wallet: string;
  createdAt: string;
}

interface Commission {
  sessionId: string;
  refCode: string;
  referrerEmail: string;
  buyerEmail: string;
  amount: number;
  commission: number;
  currency: string;
  product: string;
  createdAt: string;
  settled: boolean;
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function loadReferrers(): Referrer[] {
  try {
    if (fs.existsSync(REFERRERS_FILE)) {
      const data = fs.readFileSync(REFERRERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    console.error("Failed to load referrers file");
  }
  return [];
}

function loadCommissions(): Commission[] {
  try {
    if (fs.existsSync(COMMISSIONS_FILE)) {
      const data = fs.readFileSync(COMMISSIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    console.error("Failed to load commissions file");
  }
  return [];
}

function getSessionToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies.get("session")?.value || null;
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

  // Find referrer
  const referrers = loadReferrers();
  const referrer = referrers.find(
    (r) => r.email.toLowerCase() === user.email.toLowerCase()
  );

  if (!referrer) {
    return NextResponse.json({ registered: false });
  }

  // Load commission data — first try local JSON backup
  let commissions = loadCommissions().filter(
    (c) => c.refCode === referrer.code
  );

  // If no local data, try querying Stripe sessions as fallback
  if (commissions.length === 0) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const sessions = await stripe.checkout.sessions.list({
          limit: 100,
          status: "complete",
        });

        commissions = sessions.data
          .filter((s) => {
            const refId = s.client_reference_id;
            return refId === `ref_${referrer.code}`;
          })
          .filter((s) => {
            // Self-referral check: referrer email ≠ buyer email
            const buyerEmail =
              s.customer_details?.email?.toLowerCase() ||
              s.customer_email?.toLowerCase();
            return buyerEmail !== referrer.email.toLowerCase();
          })
          .map((s) => {
            const amountTotal = (s.amount_total || 0) / 100;
            return {
              sessionId: s.id,
              refCode: referrer.code,
              referrerEmail: referrer.email,
              buyerEmail:
                s.customer_details?.email || s.customer_email || "unknown",
              amount: amountTotal,
              commission: Math.round(amountTotal * 25) / 100, // 25%
              currency: (s.currency || "usd").toUpperCase(),
              product: resolveProductName(s.amount_total || 0),
              createdAt: new Date((s.created || 0) * 1000).toISOString(),
              settled: false,
            };
          });
      } catch (err) {
        console.error("Stripe query failed:", err);
      }
    }
  }

  const totalReferrals = commissions.length;
  const totalCommission = commissions.reduce((sum, c) => sum + c.commission, 0);
  const settledCommission = commissions
    .filter((c) => c.settled)
    .reduce((sum, c) => sum + c.commission, 0);
  const pendingCommission = totalCommission - settledCommission;

  return NextResponse.json({
    registered: true,
    code: referrer.code,
    wallet: referrer.wallet,
    referralUrl: `https://lobsterfarmer.com?ref=${referrer.code}`,
    stats: {
      totalReferrals,
      totalCommission: Math.round(totalCommission * 100) / 100,
      settledCommission: Math.round(settledCommission * 100) / 100,
      pendingCommission: Math.round(pendingCommission * 100) / 100,
    },
    commissions: commissions.map((c) => ({
      product: c.product,
      amount: c.amount,
      commission: c.commission,
      currency: c.currency,
      date: c.createdAt,
      settled: c.settled,
    })),
  });
}

function resolveProductName(cents: number): string {
  if (cents <= 150) return "Starter Pack";
  if (cents <= 5500) return "Lobster Persona";
  return "Lobster Bundle";
}
