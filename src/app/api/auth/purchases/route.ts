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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineItems = (session as any).line_items as
    | { data?: Array<{ price?: { product?: string }; description?: string }> }
    | undefined;
  if (lineItems?.data) {
    for (const item of lineItems.data) {
      const prodId = item.price?.product as string;
      if (prodId && productSlugMap[prodId]) {
        return productSlugMap[prodId];
      }
    }
  }
  const amount = session.amount_total || 0;
  if (amount <= 200) return { name: "Starter Pack", slug: "starter-pack" };
  if (amount <= 5500) return { name: "Lobster Persona", slug: "lobster-persona" };
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
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }

  try {
    // List ONLY completed sessions (not all sessions)
    // Paginate to ensure we get all completed ones
    const allCompleted: Stripe.Checkout.Session[] = [];
    let hasMore = true;
    let startingAfter: string | undefined;

    while (hasMore) {
      const params: Stripe.Checkout.SessionListParams = {
        limit: 100,
        status: "complete",
        expand: ["data.line_items"],
      };
      if (startingAfter) params.starting_after = startingAfter;

      const batch = await stripe.checkout.sessions.list(params);
      allCompleted.push(...batch.data);
      hasMore = batch.has_more;
      if (batch.data.length > 0) {
        startingAfter = batch.data[batch.data.length - 1].id;
      }
    }

    const purchases = allCompleted
      .filter((s) => {
        const detailEmail = s.customer_details?.email?.toLowerCase();
        const custEmail = s.customer_email?.toLowerCase();
        return detailEmail === user.email || custEmail === user.email;
      })
      .map((s) => {
        const product = resolveProduct(s);
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
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}
