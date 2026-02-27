import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import Stripe from "stripe";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const REFERRERS_FILE = "/tmp/lobster-referrers.json";

interface Referrer {
  code: string;
  email: string;
  wallet: string;
  createdAt: string;
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

function saveReferrers(referrers: Referrer[]): void {
  const dir = path.dirname(REFERRERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(REFERRERS_FILE, JSON.stringify(referrers, null, 2));
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
  if (!wallet) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  // Check if already registered
  const referrers = loadReferrers();
  const existing = referrers.find(
    (r) => r.email.toLowerCase() === user.email.toLowerCase()
  );
  if (existing) {
    return NextResponse.json({
      code: existing.code,
      referralUrl: `https://lobsterfarmer.com?ref=${existing.code}`,
      message: "Already registered",
    });
  }

  // Verify user has purchase records (query Stripe)
  const stripe = getStripe();
  if (stripe) {
    try {
      const sessions = await stripe.checkout.sessions.list({
        limit: 10,
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
          { error: "You need to purchase a product before becoming a referrer" },
          { status: 403 }
        );
      }
    } catch (err) {
      console.error("Stripe check failed:", err);
      // Allow registration even if Stripe check fails
    }
  }

  // Generate referral code
  const code = generateRefCode();
  const newReferrer: Referrer = {
    code,
    email: user.email.toLowerCase(),
    wallet,
    createdAt: new Date().toISOString(),
  };

  referrers.push(newReferrer);
  saveReferrers(referrers);

  return NextResponse.json({
    code,
    referralUrl: `https://lobsterfarmer.com?ref=${code}`,
  });
}
