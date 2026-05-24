import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Signed Download Token utilities
//
// Self-contained HMAC-SHA256 token issued by the LemonSqueezy webhook and
// verified by /api/download/[token]. No DB required.
// Format: base64url( JSON payload ) . base64url( HMAC-SHA256 signature )
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET ?? "";

// Token TTL: 48 hours
export const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

export function generateDownloadToken(slug: string, orderId: string, email: string): string {
  if (!TOKEN_SECRET) throw new Error("DOWNLOAD_TOKEN_SECRET is not set");
  const payload = {
    slug,
    orderId,
    email,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}
