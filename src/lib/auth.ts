import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lobster-jwt-secret-2026-change-me"
);

// Session token (7 days)
export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email: email.toLowerCase() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

// OTP: generate a 6-digit code embedded in a JWT (10 min expiry)
export async function createOTPToken(
  email: string,
  code: string
): Promise<string> {
  return new SignJWT({
    email: email.toLowerCase(),
    code,
    type: "otp",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(JWT_SECRET);
}

export async function verifyOTPToken(
  token: string,
  code: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== "otp") return null;
    if (payload.code !== code) return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}
