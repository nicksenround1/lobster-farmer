import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await verifySessionToken(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  return NextResponse.json({ email: user.email });
}
