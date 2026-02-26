import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import crypto from "crypto";

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";

function verifyToken(product: string, token: string): boolean {
  const now = Math.floor(Date.now() / 3600000);
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
      {
        error:
          "Invalid or expired download link. Log in at lobsterfarmer.com/dashboard to get a fresh link, or contact support@lobsterfarmer.com",
      },
      { status: 403 }
    );
  }

  // Try multiple paths (Vercel serverless has different cwd than local)
  const fileName = productFiles[product];
  const possiblePaths = [
    join(process.cwd(), "private-downloads", fileName),
    join(process.cwd(), "..", "private-downloads", fileName),
    join("/var/task", "private-downloads", fileName),
  ];

  let fileBuffer: Buffer | null = null;
  for (const filePath of possiblePaths) {
    try {
      if (existsSync(filePath)) {
        fileBuffer = await readFile(filePath);
        break;
      }
    } catch {
      continue;
    }
  }

  if (!fileBuffer) {
    console.error(
      `File not found: ${fileName}. Tried: ${possiblePaths.join(", ")}`
    );
    return NextResponse.json(
      {
        error:
          "File temporarily unavailable. Please contact support@lobsterfarmer.com",
      },
      { status: 500 }
    );
  }

  return new NextResponse(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
