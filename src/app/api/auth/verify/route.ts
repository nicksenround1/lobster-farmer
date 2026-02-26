import { NextRequest, NextResponse } from "next/server";
import { verifyOTPToken, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { otpToken, code } = await req.json();

    if (!otpToken || !code) {
      return NextResponse.json({ error: "Missing otpToken or code" }, { status: 400 });
    }

    const result = await verifyOTPToken(otpToken, code.toString().trim());
    if (!result) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    // Create session JWT (7 days)
    const sessionToken = await createSessionToken(result.email);

    return NextResponse.json({
      success: true,
      sessionToken,
      email: result.email,
    });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
