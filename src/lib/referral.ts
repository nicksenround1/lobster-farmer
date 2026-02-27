// Referral utility functions
// Handles ref code capture, storage, and retrieval

const REF_KEY = "lobster_ref";
const REF_TIMESTAMP_KEY = "lobster_ref_ts";
const REF_EXPIRY_DAYS = 30;

/**
 * Save a referral code to localStorage with timestamp
 */
export function saveRefCode(code: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REF_KEY, code);
  localStorage.setItem(REF_TIMESTAMP_KEY, Date.now().toString());
}

/**
 * Get the stored referral code (returns null if expired or not set)
 */
export function getRefCode(): string | null {
  if (typeof window === "undefined") return null;

  const code = localStorage.getItem(REF_KEY);
  const ts = localStorage.getItem(REF_TIMESTAMP_KEY);

  if (!code || !ts) return null;

  const savedAt = parseInt(ts, 10);
  const now = Date.now();
  const expiryMs = REF_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  if (now - savedAt > expiryMs) {
    // Expired — clean up
    clearRefCode();
    return null;
  }

  return code;
}

/**
 * Clear stored referral code
 */
export function clearRefCode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(REF_KEY);
  localStorage.removeItem(REF_TIMESTAMP_KEY);
}

/**
 * Append client_reference_id to a Stripe Payment Link if a ref code exists
 */
export function appendRefToLink(stripeLink: string): string {
  const refCode = getRefCode();
  if (!refCode) return stripeLink;

  const separator = stripeLink.includes("?") ? "&" : "?";
  return `${stripeLink}${separator}client_reference_id=ref_${refCode}`;
}

/**
 * Generate an 8-char referral code (format: LF-xxxxxxxx)
 */
export function generateRefCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LF-${result}`;
}
