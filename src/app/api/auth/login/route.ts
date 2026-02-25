import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createMagicLinkToken } from "@/lib/auth";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const token = await createMagicLinkToken(cleanEmail);
    const magicLink = `https://lobsterfarmer.com/api/auth/verify?token=${token}`;

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: "Email service unavailable" }, { status: 500 });
    }

    await resend.emails.send({
      from: "养虾户 Lobster Farmer <noreply@lobsterfarmer.com>",
      to: [cleanEmail],
      subject: "🦞 Sign in to Lobster Farmer",
      html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
  .container { max-width: 500px; margin: 0 auto; padding: 40px 20px; }
  h1 { color: white; text-align: center; font-size: 24px; }
  p { color: #a0a0a0; line-height: 1.6; text-align: center; }
  .btn { display: block; width: fit-content; margin: 24px auto; background: #E74C3C; color: white; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: bold; font-size: 15px; }
  .footer { text-align: center; margin-top: 30px; color: #555; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <h1>🦞 Sign In</h1>
  <p>Click the button below to sign in to your Lobster Farmer dashboard. This link expires in 15 minutes.</p>
  <a href="${magicLink}" class="btn">Sign In →</a>
  <p style="font-size:13px;color:#666;">If you didn't request this, you can safely ignore this email.</p>
  <div class="footer">
    <p>🦞 养虾户 / Lobster Farmer<br><a href="https://lobsterfarmer.com" style="color:#E74C3C;">lobsterfarmer.com</a></p>
  </div>
</div>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Magic link error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
