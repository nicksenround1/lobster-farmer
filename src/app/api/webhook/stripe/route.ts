import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY not set, emails will not be sent");
    return null;
  }
  return new Resend(key);
}

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;

      if (!customerEmail) {
        console.log("No customer email found");
        return NextResponse.json({ received: true });
      }

      // Match product
      const lineItems = session.line_items?.data || [];
      let productName = "Your Purchase";
      let productSlug = "starter-pack";

      for (const item of lineItems) {
        const prodId = item.price?.product;
        if (prodId && productMap[prodId]) {
          productName = productMap[prodId].name;
          productSlug = productMap[prodId].slug;
          break;
        }
      }

      // Generate secure download token (valid 72 hours)
      const token = generateDownloadToken(productSlug);
      const downloadUrl = `https://lobsterfarmer.com/api/download?product=${productSlug}&token=${token}`;
      const successUrl = `https://lobsterfarmer.com/checkout/success?product=${productSlug}&token=${token}`;

      // Send delivery email with secure download link
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
    <h2>📦 Step 1: Download</h2>
    <p>Click below to download your product files (link valid for 72 hours):</p>
    <a href="${downloadUrl}" class="btn">Download ${productName}</a>
    <p style="font-size: 12px; color: #666; margin-top: 12px;">Link expired? Contact support@lobsterfarmer.com for a new one.</p>
  </div>

  <div class="card">
    <h2>🎯 Step 2: Install & Customize</h2>
    <p>Extract the zip to your OpenClaw workspace, then edit:</p>
    <p>→ <code>USER.md</code> — Add your info<br>→ <code>SOUL.md</code> — Tweak Agent personality<br>→ <code>HEARTBEAT.md</code> — Set up auto-checks</p>
  </div>

  <div class="card">
    <h2>💬 Need Help?</h2>
    <p>Join our Telegram community for free tech support:</p>
    <a href="https://t.me/+2p-LBUUrJ1BjMjNl" class="btn" style="background: #333;">Join TG Group →</a>
  </div>

  <div class="footer">
    <p>🦞 养虾户 / Lobster Farmer<br>
    <a href="https://lobsterfarmer.com" style="color: #E74C3C;">lobsterfarmer.com</a></p>
    <p>Questions? Reply to this email or contact support@lobsterfarmer.com</p>
  </div>
</div>
</body>
</html>
          `,
        });

        console.log(`Delivery email sent to ${customerEmail} for ${productName} (token: ${token})`);
      } else {
        console.log(`Resend not configured, skipping email for ${customerEmail}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
