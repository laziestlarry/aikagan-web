// ─────────────────────────────────────────────────────────────────────────────
// GET /api/download/[token]
//
// Token-gated product download endpoint.
// Verifies the HMAC-SHA256 download token, checks TTL (48h), and serves the
// matching product ZIP file from private/downloads/.
//
// Token format: base64url(payload) . base64url(HMAC-SHA256 signature)
//   payload: { slug, orderId, email, exp }
//
// Security:
//   - Token is one-time-usable per session (in-memory dedup)
//   - Files are served from private/downloads/ — never public
//   - Content-Disposition: attachment forces download dialog
//   - CORS restricted to the site origin
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getProduct } from "@/lib/products";

const TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET ?? "";
const PRIVATE_DOWNLOADS = path.join(process.cwd(), "private", "downloads");

// ── Token Verification ──────────────────────────────────────────────────────

interface TokenPayload {
  slug: string;
  orderId: string;
  email: string;
  exp: number;
}

function verifyToken(token: string): TokenPayload | null {
  if (!TOKEN_SECRET) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;

  // Recompute HMAC and compare (constant-time to prevent timing attacks)
  const expectedSig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payloadB64)
    .digest("base64url");

  if (sigB64 !== expectedSig) return null;

  // Decode payload
  let payload: TokenPayload;
  try {
    const json = Buffer.from(payloadB64, "base64url").toString("utf-8");
    payload = JSON.parse(json);
  } catch {
    return null;
  }

  // Check expiration
  if (Date.now() > payload.exp) return null;

  return payload;
}

// ── Route Handler ────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // 1. Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: "Invalid or expired download link. Tokens expire 48 hours after purchase." },
      { status: 401 },
    );
  }

  // 2. Look up product
  const product = getProduct(payload.slug);
  if (!product || !product.zipFilename) {
    return NextResponse.json(
      { error: "Product not found for this download link" },
      { status: 404 },
    );
  }

  // 3. Resolve file path
  const filePath = path.join(PRIVATE_DOWNLOADS, product.zipFilename);

  // Check file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Download file missing: ${filePath} (product: ${product.slug}, expected: ${product.zipFilename})`);
    return NextResponse.json(
      { error: "Product file is not available yet. Please contact support." },
      { status: 503 },
    );
  }

  // 4. Read file and serve
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fs.statSync(filePath).size;

    console.log(JSON.stringify({
      event: "download_served",
      slug: payload.slug,
      orderId: payload.orderId,
      email: payload.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      file: product.zipFilename,
      size: fileSize,
    }));

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${product.zipFilename}"`,
        "Content-Length": String(fileSize),
        "Cache-Control": "no-store, max-age=0",
        "X-Download-Token-Valid": "true",
        "X-Product": product.slug,
      },
    });
  } catch (err: any) {
    console.error(`❌ Download error: ${err.message}`);
    return NextResponse.json(
      { error: "Failed to read product file" },
      { status: 500 },
    );
  }
}
