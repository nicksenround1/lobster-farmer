import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, createSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lobsterfarmer.com";

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/login?error=missing_token`);
  }

  const result = await verifyMagicLinkToken(token);
  if (!result) {
    return NextResponse.redirect(`${baseUrl}/login?error=expired`);
  }

  // Create session JWT (7 days)
  const sessionToken = await createSessionToken(result.email);

  const response = NextResponse.redirect(`${baseUrl}/dashboard`);
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
