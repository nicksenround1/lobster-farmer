import crypto from "crypto";

const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || "lobster-dl-secret-2026";

export function generateDownloadToken(product: string): string {
  const hour = Math.floor(Date.now() / 3600000);
  return crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(product + hour)
    .digest("hex")
    .substring(0, 16);
}

export function verifyDownloadToken(product: string, token: string): boolean {
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

export const productSlugMap: Record<string, string> = {
  "prod_U2kCKFHP7zts2r": "starter-pack",
  "prod_U2hnK4QosbVdpE": "lobster-persona",
  "prod_U2hnhpQ5THu5uh": "lobster-bundle",
  "prod_U2hnEpnOlolVU0": "lobster-bundle",
};

export const productNameMap: Record<string, { zh: string; en: string }> = {
  "starter-pack": { zh: "入门包", en: "Starter Pack" },
  "lobster-persona": { zh: "龙虾人格", en: "Lobster Persona" },
  "lobster-bundle": { zh: "龙虾全家桶", en: "Lobster Bundle" },
};

export const productFiles: Record<string, string> = {
  "starter-pack": "starter-pack-v1.0.zip",
  "lobster-persona": "lobster-persona-v1.0.zip",
  "lobster-bundle": "lobster-bundle-v1.0.zip",
};
