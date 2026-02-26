import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import Stripe from "stripe";
import crypto from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function verifyDownloadToken(product: string, token: string): boolean {
  const hour = Math.floor(Date.now() / 3600000);
  // Check current hour and previous hour (grace period)
  for (const h of [hour, hour - 1]) {
    const expected = crypto
      .createHmac("sha256", DOWNLOAD_SECRET)
      .update(product + h)
      .digest("hex")
      .substring(0, 16);
    if (expected === token) return true;
  }
  return false;
}

const productFileMap: Record<string, string> = {
  "starter-pack": "starter-pack-v1.0.zip",
  "lobster-persona": "lobster-persona-v1.0.zip",
  "lobster-bundle": "lobster-bundle-v1.0.zip",
};

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get("product");
  const token = req.nextUrl.searchParams.get("token");
  const mode = req.nextUrl.searchParams.get("mode"); // "script" for install script

  if (!product || !token) {
    return NextResponse.json({ error: "Missing product or token" }, { status: 400 });
  }

  if (!verifyDownloadToken(product, token)) {
    return NextResponse.json({ error: "Invalid or expired download token" }, { status: 403 });
  }

  const filename = productFileMap[product];
  if (!filename) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  // Mode: script — return a bash one-liner that downloads + installs
  if (mode === "script") {
    const downloadUrl = `${req.nextUrl.origin}/api/download?product=${product}&token=${token}`;
    const script = `#!/usr/bin/env bash
set -euo pipefail
echo "🦞 Downloading ${product}..."
TMPDIR=$(mktemp -d)
curl -fsSL "${downloadUrl}" -o "$TMPDIR/${filename}"
echo "🦞 Installing..."
curl -fsSL "${req.nextUrl.origin}/install.sh" | bash -s -- "$TMPDIR/${filename}"
rm -rf "$TMPDIR"
`;
    return new NextResponse(script, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  // Mode: default — return the zip file
  try {
    // Try multiple paths for the zip file
    const paths = [
      join(process.cwd(), "private-downloads", filename),
      join(process.cwd(), "..", "private-downloads", filename),
      join("/var/task", "private-downloads", filename),
    ];

    let fileBuffer: Buffer | null = null;
    for (const p of paths) {
      try {
        fileBuffer = Buffer.from(readFileSync(p));
        break;
      } catch {
        continue;
      }
    }

    if (!fileBuffer) {
      return NextResponse.json({ error: "File not found on server" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
