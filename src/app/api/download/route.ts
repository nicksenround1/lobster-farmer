import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";

// Simple token-based download protection
// Token is generated at checkout and included in success page URL + email
const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";

function verifyToken(product: string, token: string): boolean {
  // Token format: HMAC-SHA256(product + timestamp_hour, secret)
  // Valid for 72 hours (we check current hour ± 72)
  const now = Math.floor(Date.now() / 3600000); // current hour
  for (let i = -72; i <= 0; i++) {
    const expected = crypto
      .createHmac("sha256", DOWNLOAD_SECRET)
      .update(product + (now + i))
      .digest("hex")
      .substring(0, 16);
    if (token === expected) return true;
  }
  return false;
}

export function generateDownloadToken(product: string): string {
  const hour = Math.floor(Date.now() / 3600000);
  return crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(product + hour)
    .digest("hex")
    .substring(0, 16);
}

const productFiles: Record<string, string> = {
  "starter-pack": "starter-pack-v1.0.zip",
  "lobster-persona": "lobster-persona-v1.0.zip",
  "lobster-bundle": "lobster-bundle-v1.0.zip",
};

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get("product");
  const token = req.nextUrl.searchParams.get("token");

  if (!product || !token) {
    return NextResponse.json(
      { error: "Missing product or token" },
      { status: 400 }
    );
  }

  if (!productFiles[product]) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  if (!verifyToken(product, token)) {
    return NextResponse.json(
      { error: "Invalid or expired download link. Please check your email for a valid link, or contact support@lobsterfarmer.com" },
      { status: 403 }
    );
  }

  try {
    const filePath = join(process.cwd(), "private-downloads", productFiles[product]);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${productFiles[product]}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "File not found" },
      { status: 500 }
    );
  }
}
