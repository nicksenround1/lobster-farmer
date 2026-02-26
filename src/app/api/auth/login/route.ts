import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createOTPToken, generateOTP } from "@/lib/auth";

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
    const code = generateOTP();
    const otpToken = await createOTPToken(cleanEmail, code);

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: "Email service unavailable" }, { status: 500 });
    }

    await resend.emails.send({
      from: "养虾户 Lobster Farmer <noreply@lobsterfarmer.com>",
      to: [cleanEmail],
      subject: `🦞 Your login code: ${code}`,
      html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body{font-family:-apple-system,sans-serif;background:#0a0a0a;color:#e0e0e0;margin:0;padding:0}
  .c{max-width:400px;margin:0 auto;padding:40px 20px;text-align:center}
  h1{color:white;font-size:24px}
  .code{font-size:36px;font-weight:bold;letter-spacing:8px;color:#E74C3C;margin:24px 0;font-family:monospace}
  p{color:#a0a0a0;line-height:1.6}
  .f{margin-top:30px;color:#555;font-size:12px}
</style>
</head>
<body>
<div class="c">
  <h1>🦞</h1>
  <p>Your login code:</p>
  <div class="code">${code}</div>
  <p>Enter this code on the login page.<br>Valid for 10 minutes.</p>
  <p style="font-size:13px;color:#666;">If you didn't request this, ignore this email.</p>
  <div class="f">
    <p>养虾户 / Lobster Farmer — <a href="https://lobsterfarmer.com" style="color:#E74C3C;">lobsterfarmer.com</a></p>
  </div>
</div>
</body>
</html>`,
    });

    // Return OTP token (contains encrypted code + email, client sends it back with user's input)
    return NextResponse.json({ success: true, otpToken });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
