import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import crypto from "crypto";

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";

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

const productSlugMap: Record<string, string> = {
  "prod_U2kCKFHP7zts2r": "starter-pack",
  "prod_U2hnK4QosbVdpE": "lobster-persona",
  "prod_U2hnhpQ5THu5uh": "lobster-bundle",
  "prod_U2hnEpnOlolVU0": "lobster-bundle",
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }

    // Find customer by email
    const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
    
    if (customers.data.length === 0) {
      // Also check checkout sessions by email (for guest checkouts)
      const sessions = await stripe.checkout.sessions.list({ limit: 100 });
      const matchingSessions = sessions.data.filter(
        (s) => s.status === "complete" && 
        (s.customer_details?.email?.toLowerCase() === email.toLowerCase() ||
         s.customer_email?.toLowerCase() === email.toLowerCase())
      );

      if (matchingSessions.length === 0) {
        return NextResponse.json({ error: "No purchases found for this email" }, { status: 404 });
      }

      // Build purchase list from sessions
      const purchases = matchingSessions.map((s) => {
        const lineItems = s.line_items?.data || [];
        let productName = "Purchase";
        let productSlug = "starter-pack";
        
        // Try to get product from metadata or amount
        if (s.amount_total) {
          if (s.amount_total <= 200) { productName = "Starter Pack"; productSlug = "starter-pack"; }
          else if (s.amount_total <= 5000) { productName = "Lobster Persona"; productSlug = "lobster-persona"; }
          else { productName = "Lobster Bundle"; productSlug = "lobster-bundle"; }
        }

        for (const item of lineItems) {
          const prodId = item.price?.product as string;
          if (prodId && productSlugMap[prodId]) {
            productSlug = productSlugMap[prodId];
            productName = item.description || productName;
          }
        }

        const token = generateDownloadToken(productSlug);

        return {
          product: productName,
          slug: productSlug,
          date: new Date((s.created || 0) * 1000).toISOString(),
          amount: ((s.amount_total || 0) / 100).toFixed(2),
          downloadUrl: `https://lobsterfarmer.com/api/download?product=${productSlug}&token=${token}`,
        };
      });

      // Send email with all download links
      const resend = getResend();
      if (resend) {
        const purchaseRows = purchases
          .map((p) => `
            <tr>
              <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);color:#e0e0e0;">${p.product}</td>
              <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);color:#a0a0a0;">$${p.amount}</td>
              <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);color:#a0a0a0;">${new Date(p.date).toLocaleDateString()}</td>
              <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);">
                <a href="${p.downloadUrl}" style="background:#E74C3C;color:white;padding:6px 16px;border-radius:20px;text-decoration:none;font-size:13px;">Download</a>
              </td>
            </tr>`)
          .join("");

        await resend.emails.send({
          from: "养虾户 Lobster Farmer <noreply@lobsterfarmer.com>",
          to: [email],
          subject: "🦞 Your Lobster Farmer Purchases",
          html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  h1 { color: white; text-align: center; }
  p { color: #a0a0a0; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { text-align: left; padding: 12px; border-bottom: 2px solid rgba(255,255,255,0.2); color: #888; font-size: 13px; }
  .footer { text-align: center; margin-top: 30px; color: #555; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <h1>🦞 Your Purchases</h1>
  <p style="text-align:center;">Here are your download links (valid for 72 hours):</p>
  <table>
    <tr><th>Product</th><th>Price</th><th>Date</th><th></th></tr>
    ${purchaseRows}
  </table>
  <p style="text-align:center;font-size:13px;color:#666;">Links expired? Visit lobsterfarmer.com/dashboard to request new ones.</p>
  <div class="footer">
    <p>🦞 养虾户 / Lobster Farmer<br><a href="https://lobsterfarmer.com" style="color:#E74C3C;">lobsterfarmer.com</a></p>
  </div>
</div>
</body>
</html>`,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Download links sent to your email",
        count: purchases.length,
      });
    }

    // Customer found — same logic
    const customer = customers.data[0];
    const charges = await stripe.charges.list({ customer: customer.id, limit: 20 });
    
    // Get checkout sessions for this customer
    const sessions = await stripe.checkout.sessions.list({ customer: customer.id, limit: 20 });
    const completedSessions = sessions.data.filter((s) => s.status === "complete");

    if (completedSessions.length === 0 && charges.data.length === 0) {
      return NextResponse.json({ error: "No purchases found for this email" }, { status: 404 });
    }

    const purchases = completedSessions.map((s) => {
      let productName = "Purchase";
      let productSlug = "starter-pack";

      if (s.amount_total) {
        if (s.amount_total <= 200) { productName = "Starter Pack"; productSlug = "starter-pack"; }
        else if (s.amount_total <= 5000) { productName = "Lobster Persona"; productSlug = "lobster-persona"; }
        else { productName = "Lobster Bundle"; productSlug = "lobster-bundle"; }
      }

      const token = generateDownloadToken(productSlug);

      return {
        product: productName,
        slug: productSlug,
        date: new Date((s.created || 0) * 1000).toISOString(),
        amount: ((s.amount_total || 0) / 100).toFixed(2),
        downloadUrl: `https://lobsterfarmer.com/api/download?product=${productSlug}&token=${token}`,
      };
    });

    // Send email
    const resend = getResend();
    if (resend && purchases.length > 0) {
      const purchaseRows = purchases
        .map((p) => `
          <tr>
            <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);color:#e0e0e0;">${p.product}</td>
            <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);color:#a0a0a0;">$${p.amount}</td>
            <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);color:#a0a0a0;">${new Date(p.date).toLocaleDateString()}</td>
            <td style="padding:12px;border-bottom:1px solid rgba(255,255,255,0.1);">
              <a href="${p.downloadUrl}" style="background:#E74C3C;color:white;padding:6px 16px;border-radius:20px;text-decoration:none;font-size:13px;">Download</a>
            </td>
          </tr>`)
        .join("");

      await resend.emails.send({
        from: "养虾户 Lobster Farmer <noreply@lobsterfarmer.com>",
        to: [email],
        subject: "🦞 Your Lobster Farmer Purchases",
        html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  h1 { color: white; text-align: center; }
  p { color: #a0a0a0; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { text-align: left; padding: 12px; border-bottom: 2px solid rgba(255,255,255,0.2); color: #888; font-size: 13px; }
  .footer { text-align: center; margin-top: 30px; color: #555; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <h1>🦞 Your Purchases</h1>
  <p style="text-align:center;">Here are your download links (valid for 72 hours):</p>
  <table>
    <tr><th>Product</th><th>Price</th><th>Date</th><th></th></tr>
    ${purchaseRows}
  </table>
  <p style="text-align:center;font-size:13px;color:#666;">Links expired? Visit lobsterfarmer.com/dashboard to request new ones.</p>
  <div class="footer">
    <p>🦞 养虾户 / Lobster Farmer<br><a href="https://lobsterfarmer.com" style="color:#E74C3C;">lobsterfarmer.com</a></p>
  </div>
</div>
</body>
</html>`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Download links sent to your email",
      count: purchases.length,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
