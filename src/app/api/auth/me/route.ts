import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

// Extract session token from either cookie or Authorization header
export function getSessionToken(req: NextRequest): string | null {
  // Try Authorization header first (localStorage-based auth)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // Fallback to cookie
  return req.cookies.get("session")?.value || null;
}

export async function GET(req: NextRequest) {
  const token = getSessionToken(req);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await verifySessionToken(token);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({ email: user.email });
}
