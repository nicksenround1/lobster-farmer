import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return NextResponse.json({
    length: key.length,
    prefix: key.substring(0, 7),
    suffix: key.substring(key.length - 4),
    hasNewline: key.includes("\n"),
    hasQuote: key.includes('"'),
    hasSpace: key.includes(" "),
    // Check for common issues
    startsWithSk: key.startsWith("sk_"),
  });
}
