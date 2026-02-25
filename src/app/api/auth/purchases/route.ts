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

const productSlugMap: Record<string, { name: string; slug: string }> = {
  "prod_U2kCKFHP7zts2r": { name: "Starter Pack", slug: "starter-pack" },
  "prod_U2hnK4QosbVdpE": { name: "Lobster Persona", slug: "lobster-persona" },
  "prod_U2hnhpQ5THu5uh": { name: "Lobster Bundle", slug: "lobster-bundle" },
  "prod_U2hnEpnOlolVU0": { name: "Lobster Bundle", slug: "lobster-bundle" },
};

function resolveProduct(session: Stripe.Checkout.Session) {
  // Try line items first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItems = (session as any).line_items as { data?: Array<{ price?: { product?: string }; description?: string }> } | undefined;
  if (lineItems?.data) {
    for (const item of lineItems.data) {
      const prodId = item.price?.product as string;
      if (prodId && productSlugMap[prodId]) {
        return productSlugMap[prodId];
      }
    }
  }
  // Fallback: match by amount
  const amount = session.amount_total || 0;
  if (amount <= 200) return { name: "Starter Pack", slug: "starter-pack" };
  if (amount <= 5000) return { name: "Lobster Persona", slug: "lobster-persona" };
  return { name: "Lobster Bundle", slug: "lobster-bundle" };
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await verifySessionToken(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }

  try {
    // Search checkout sessions by email
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ["data.line_items"],
    });

    const purchases = sessions.data
      .filter(
        (s) =>
          s.status === "complete" &&
          (s.customer_details?.email?.toLowerCase() === user.email ||
            s.customer_email?.toLowerCase() === user.email)
      )
      .map((s) => {
        const product = resolveProduct(s);
        const token = generateDownloadToken(product.slug);
        return {
          id: s.id,
          product: product.name,
          slug: product.slug,
          date: new Date((s.created || 0) * 1000).toISOString(),
          amount: ((s.amount_total || 0) / 100).toFixed(2),
          currency: (s.currency || "usd").toUpperCase(),
          downloadUrl: `/api/download?product=${product.slug}&token=${token}`,
          installCmd: `unzip ${product.slug}-v1.0.zip -d ~/clawd/`,
        };
      });

    return NextResponse.json({
      email: user.email,
      purchases,
    });
  } catch (err) {
    console.error("Purchases API error:", err);
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
