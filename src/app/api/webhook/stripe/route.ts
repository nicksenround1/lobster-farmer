import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import crypto from "crypto";

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";
const COMMISSION_RATE = 0.25; // 25%

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function generateDownloadToken(product: string): string {
  const hour = Math.floor(Date.now() / 3600000);
  return crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(product + hour)
    .digest("hex")
    .substring(0, 16);
}

// Map Stripe product IDs to our product slugs
const productMap: Record<string, { name: string; slug: string }> = {
  "prod_U2kCKFHP7zts2r": { name: "Starter Pack", slug: "starter-pack" },
  "prod_U2hnK4QosbVdpE": { name: "Lobster Persona", slug: "lobster-persona" },
  "prod_U2hnhpQ5THu5uh": { name: "Lobster Bundle", slug: "lobster-bundle" },
  "prod_U2hnEpnOlolVU0": { name: "Lobster Bundle", slug: "lobster-bundle" },
};

// Fallback: match by amount (cents)
function resolveProductByAmount(cents: number): { name: string; slug: string } {
  if (cents <= 150) return { name: "Starter Pack", slug: "starter-pack" };
  if (cents <= 5500) return { name: "Lobster Persona", slug: "lobster-persona" };
  return { name: "Lobster Bundle", slug: "lobster-bundle" };
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

// Find referrer by code from Stripe Customer metadata
async function findReferrerByCode(
  stripe: Stripe,
  refCode: string
): Promise<{ email: string; wallet: string } | null> {
  try {
    const customers = await stripe.customers.search({
      query: `metadata["ref_code"]:"${refCode}"`,
      limit: 1,
    });
    if (customers.data.length > 0) {
      const c = customers.data[0];
      return {
        email: c.email || "",
        wallet: c.metadata?.ref_wallet || "",
      };
    }
  } catch (err) {
    console.error("Stripe customer search failed:", err);
  }
  return null;
}

async function processReferralCommission(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  productName: string
) {
  const refId = session.client_reference_id;
  if (!refId || !refId.startsWith("ref_")) return;

  const refCode = refId.replace("ref_", "");
  const buyerEmail =
    session.customer_details?.email?.toLowerCase() ||
    session.customer_email?.toLowerCase() ||
    "";

  // Find referrer from Stripe Customer metadata
  const referrer = await findReferrerByCode(stripe, refCode);
  if (!referrer) {
    console.log(`Referral code ${refCode} not found in Stripe customers`);
    return;
  }

  // Self-referral check
  if (referrer.email.toLowerCase() === buyerEmail) {
    console.log(`Self-referral blocked: ${buyerEmail}`);
    return;
  }

  const amountTotal = (session.amount_total || 0) / 100;
  const commission = Math.round(amountTotal * COMMISSION_RATE * 100) / 100;

  // Update Stripe session metadata with referral info
  try {
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        referral_code: refCode,
        referrer_email: referrer.email,
        commission_amount: commission.toString(),
        commission_currency: session.currency || "usd",
      },
    });
  } catch (err) {
    console.error("Failed to update Stripe session metadata:", err);
  }

  console.log(
    `✅ Commission recorded: ${refCode} → $${commission} from ${buyerEmail} (${productName})`
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verify Stripe signature if webhook secret is configured
    const stripe = getStripe();
    let event: Stripe.Event;

    if (stripe && webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // Fallback: parse without verification (log warning)
      console.warn("Webhook signature not verified — STRIPE_WEBHOOK_SECRET not set");
      if (!sig) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
      }
      event = JSON.parse(body) as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail =
        session.customer_details?.email || session.customer_email;

      if (!customerEmail) {
        console.log("No customer email found");
        return NextResponse.json({ received: true });
      }

      // Resolve product: try expanding line_items via Stripe API
      let productName = "Your Purchase";
      let productSlug = "starter-pack";

      if (stripe) {
        try {
          const fullSession = await stripe.checkout.sessions.retrieve(
            session.id,
            { expand: ["line_items.data.price.product"] }
          );
          const lineItems = fullSession.line_items?.data || [];
          for (const item of lineItems) {
            const prodId =
              typeof item.price?.product === "string"
                ? item.price.product
                : (item.price?.product as Stripe.Product)?.id;
            if (prodId && productMap[prodId]) {
              productName = productMap[prodId].name;
              productSlug = productMap[prodId].slug;
              break;
            }
          }
          // If no match from line items, use product name from description
          if (productName === "Your Purchase" && lineItems.length > 0) {
            const desc = lineItems[0].description?.toLowerCase() || "";
            if (desc.includes("bundle")) {
              productName = "Lobster Bundle";
              productSlug = "lobster-bundle";
            } else if (desc.includes("persona")) {
              productName = "Lobster Persona";
              productSlug = "lobster-persona";
            } else if (desc.includes("starter")) {
              productName = "Starter Pack";
              productSlug = "starter-pack";
            }
          }
        } catch (e) {
          console.warn("Failed to expand line_items, using amount fallback:", e);
        }
      }

      // Final fallback: match by amount
      if (productName === "Your Purchase") {
        const resolved = resolveProductByAmount(session.amount_total || 0);
        productName = resolved.name;
        productSlug = resolved.slug;
      }

      // Generate secure download token (valid 72 hours)
      const token = generateDownloadToken(productSlug);
      const downloadUrl = `https://lobsterfarmer.com/api/download?product=${productSlug}&token=${token}`;

      // Send delivery email
      const resend = getResend();
      if (resend) {
        await resend.emails.send({
          from: "养虾户 Lobster Farmer <noreply@lobsterfarmer.com>",
          to: [customerEmail],
          subject: `🦞 Your ${productName} is ready!`,
          html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { text-align: center; margin-bottom: 30px; }
  .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .btn { display: inline-block; background: #E74C3C; color: white; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 14px; }
  .code { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 16px; font-family: monospace; font-size: 13px; color: #4ade80; word-break: break-all; }
  h1 { color: white; }
  h2 { color: white; font-size: 18px; margin-top: 0; }
  p { color: #a0a0a0; line-height: 1.6; }
  .footer { text-align: center; margin-top: 30px; color: #555; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🦞 感谢购买 / Thank You!</h1>
    <p>Your <strong>${productName}</strong> is ready to download.</p>
  </div>

  <div class="card">
    <h2>📦 Download</h2>
    <p>Click below to download your files (link valid for 72 hours):</p>
    <a href="${downloadUrl}" class="btn">Download ${productName}</a>
    <p style="font-size: 12px; color: #666; margin-top: 12px;">Link expired? Go to <a href="https://lobsterfarmer.com/dashboard" style="color: #E74C3C;">lobsterfarmer.com/dashboard</a> to get a new one.</p>
  </div>

  <div class="card">
    <h2>⚡ One-Click Install</h2>
    <p>Send this command to your OpenClaw agent (paste it in chat!):</p>
    <div class="code">curl -fsSL "${downloadUrl}&mode=script" | bash</div>
    <p style="margin-top: 12px;">Your agent will install everything automatically and report what it learned! 🦞</p>
    <p style="font-size:12px;color:#666;margin-top:8px;">Or download manually and run: <code>unzip ${productSlug}-v1.0.zip -d ~/clawd/</code></p>
  </div>

  <div class="card">
    <h2>💬 Need Help?</h2>
    <a href="https://t.me/+2p-LBUUrJ1BjMjNl" class="btn" style="background: #333;">Join TG Group →</a>
  </div>

  <div class="footer">
    <p>🦞 养虾户 / Lobster Farmer — <a href="https://lobsterfarmer.com" style="color: #E74C3C;">lobsterfarmer.com</a></p>
    <p>Questions? support@lobsterfarmer.com</p>
  </div>
</div>
</body>
</html>`,
        });
        console.log(`✅ Email sent to ${customerEmail} for ${productName}`);
      }

      // Process referral commission
      if (stripe) {
        try {
          await processReferralCommission(stripe, session, productName);
        } catch (err) {
          console.error("Referral commission processing error:", err);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
