import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function secretsMatch(expected: string, supplied: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && crypto.timingSafeEqual(expectedBuffer, suppliedBuffer);
}

function isSecretHeaderValid(request: NextRequest | Request, headerName: string, secretName: string, prefix = ""): boolean {
  const expected = process.env[secretName]?.trim();
  const supplied = request.headers.get(headerName)?.trim();
  const candidate = prefix && supplied?.startsWith(prefix) ? supplied.slice(prefix.length) : supplied;
  return Boolean(expected && candidate && secretsMatch(expected, candidate));
}

export function isAdminRequest(request: NextRequest | Request): boolean {
  return isSecretHeaderValid(request, "x-admin-secret", "ADMIN_SECRET");
}

export function hasAdminSecretHeader(request: NextRequest | Request): boolean {
  return Boolean(request.headers.get("x-admin-secret")?.trim());
}

export function isCronRequest(request: NextRequest | Request): boolean {
  return isSecretHeaderValid(request, "authorization", "CRON_SECRET", "Bearer ");
}

export function adminUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "Cache-Control": "no-store, max-age=0", Vary: "x-admin-secret" } },
  );
}
