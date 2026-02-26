import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import Stripe from "stripe";
import crypto from "crypto";

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function generateDownloadToken(product: string): string {
  const hour = Math.floor(Date.now() / 3600000);
  return crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(product + hour)
    .digest("hex")
    .substring(0, 16);
}

function resolveProductByAmount(cents: number): { name: string; slug: string } {
  if (cents <= 150) return { name: "Starter Pack", slug: "starter-pack" };
  if (cents <= 5500) return { name: "Lobster Persona", slug: "lobster-persona" };
  return { name: "Lobster Bundle", slug: "lobster-bundle" };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.cookies.get("session")?.value;

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
      { email: user.email, purchases: [], debug: "stripe_unavailable" },
      { status: 200 }
    );
  }

  try {
    // List only completed sessions, no expand (fast)
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
    });

    const purchases = sessions.data
      .filter((s) => {
        const detailEmail = s.customer_details?.email?.toLowerCase();
        const custEmail = s.customer_email?.toLowerCase();
        return detailEmail === user.email || custEmail === user.email;
      })
      .map((s) => {
        const product = resolveProductByAmount(s.amount_total || 0);
        const dlToken = generateDownloadToken(product.slug);
        return {
          id: s.id,
          product: product.name,
          slug: product.slug,
          date: new Date((s.created || 0) * 1000).toISOString(),
          amount: ((s.amount_total || 0) / 100).toFixed(2),
          currency: (s.currency || "usd").toUpperCase(),
          downloadUrl: `/api/download?product=${product.slug}&token=${dlToken}`,
          installCmd: `unzip ${product.slug}-v1.0.zip -d ~/clawd/`,
        };
      });

    return NextResponse.json({
      email: user.email,
      purchases,
    });
  } catch (err) {
    console.error("Purchases API error:", err);
    // Return empty purchases instead of 500, so dashboard still shows
    return NextResponse.json({
      email: user.email,
      purchases: [],
      debug: String(err).substring(0, 200),
    });
  }
}
