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

  // Create session JWT
  const sessionToken = await createSessionToken(result.email);

  // Redirect to dashboard with session token in URL fragment (not query param for security)
  // The dashboard page will pick it up from the hash and store in localStorage
  return NextResponse.redirect(
    `${baseUrl}/dashboard#token=${sessionToken}`
  );
}
