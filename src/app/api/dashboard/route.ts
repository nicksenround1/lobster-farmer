import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { verifySessionToken } from "@/lib/auth";

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

interface Purchase {
  product: string;
  slug: string;
  date: string;
  amount: string;
  downloadUrl: string;
  installCmd: string;
}

export async function GET(req: NextRequest) {
  // Auth check
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const session = await verifySessionToken(sessionCookie);
  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }

  const email = session.email;
  const purchases: Purchase[] = [];

  // Search checkout sessions (covers both guest and registered)
  const sessions = await stripe.checkout.sessions.list({ limit: 100 });
  const matchingSessions = sessions.data.filter(
    (s) =>
      s.status === "complete" &&
      (s.customer_details?.email?.toLowerCase() === email ||
        s.customer_email?.toLowerCase() === email)
  );

  for (const s of matchingSessions) {
    let productName = "Purchase";
    let productSlug = "starter-pack";

    // Match by amount
    if (s.amount_total) {
      if (s.amount_total <= 200) {
        productName = "Starter Pack";
        productSlug = "starter-pack";
      } else if (s.amount_total <= 5000) {
        productName = "Lobster Persona";
        productSlug = "lobster-persona";
      } else {
        productName = "Lobster Bundle";
        productSlug = "lobster-bundle";
      }
    }

    // Try line items for more accurate match
    const lineItems = s.line_items?.data || [];
    for (const item of lineItems) {
      const prodId = item.price?.product as string;
      if (prodId && productSlugMap[prodId]) {
        productName = productSlugMap[prodId].name;
        productSlug = productSlugMap[prodId].slug;
      }
    }

    const token = generateDownloadToken(productSlug);

    purchases.push({
      product: productName,
      slug: productSlug,
      date: new Date((s.created || 0) * 1000).toISOString(),
      amount: ((s.amount_total || 0) / 100).toFixed(2),
      downloadUrl: `/api/download?product=${productSlug}&token=${token}`,
      installCmd: `unzip ${productSlug}-v1.0.zip -d ~/clawd/`,
    });
  }

  // Also try customer-based lookup
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length > 0) {
    const customerSessions = await stripe.checkout.sessions.list({
      customer: customers.data[0].id,
      limit: 20,
    });
    for (const s of customerSessions.data) {
      if (s.status !== "complete") continue;
      // Avoid duplicates
      if (matchingSessions.some((ms) => ms.id === s.id)) continue;

      let productName = "Purchase";
      let productSlug = "starter-pack";
      if (s.amount_total) {
        if (s.amount_total <= 200) { productName = "Starter Pack"; productSlug = "starter-pack"; }
        else if (s.amount_total <= 5000) { productName = "Lobster Persona"; productSlug = "lobster-persona"; }
        else { productName = "Lobster Bundle"; productSlug = "lobster-bundle"; }
      }

      const token = generateDownloadToken(productSlug);
      purchases.push({
        product: productName,
        slug: productSlug,
        date: new Date((s.created || 0) * 1000).toISOString(),
        amount: ((s.amount_total || 0) / 100).toFixed(2),
        downloadUrl: `/api/download?product=${productSlug}&token=${token}`,
        installCmd: `unzip ${productSlug}-v1.0.zip -d ~/clawd/`,
      });
    }
  }

  return NextResponse.json({
    email,
    purchases,
  });
}

// Keep POST for backward compat (email-based flow)
export { GET as POST };
