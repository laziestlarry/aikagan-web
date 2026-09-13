/**
 * GET /api/session-token
 *
 * Verifies a completed transaction, returns its delivery token, grants the
 * matching customer entitlement, and establishes the signed cross-subdomain
 * customer session used by app.aikagan.com.
 */

import { NextRequest, NextResponse } from "next/server";
import { tokenStore, type TokenRecord } from "@/lib/token-store";
import { CUSTOMER_SESSION_COOKIE, CUSTOMER_SESSION_TTL_MS, customerIdForEmail, signCustomerSession } from "@/lib/customer-session";
import { customerStore } from "@/lib/customer-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifiedResponse(transactionId: string, record: TokenRecord, extra: Record<string, unknown> = {}) {
  const customerId = customerIdForEmail(record.email);
  const downloadHref = record.token ? `/api/download/${record.token}` : null;
  await customerStore.grantEntitlement(customerId, record.email, record.slug, transactionId, downloadHref);

  const response = NextResponse.json({
    token: record.token,
    slug: record.slug,
    email: record.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
    workspace: "https://app.aikagan.com/dashboard",
    ...extra,
  });

  response.cookies.set(CUSTOMER_SESSION_COOKIE, signCustomerSession(record.email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(CUSTOMER_SESSION_TTL_MS / 1000),
    ...(process.env.NODE_ENV === "production" ? { domain: ".aikagan.com" } : {}),
  });
  return response;
}

export async function GET(req: NextRequest) {
  const transactionId = req.nextUrl.searchParams.get("transaction_id");
  if (!transactionId) return NextResponse.json({ error: "Missing transaction_id parameter" }, { status: 400 });

  const cached = await tokenStore.get(transactionId);
  if (cached?.slug && cached.email && cached.email !== "unknown@checkout") {
    return verifiedResponse(transactionId, cached, cached.token ? {} : { service: true });
  }

  // Hosted sales are verified and written by the Gumroad webhook or the
  // reconciliation job. Until that evidence exists, remain in processing.
  return NextResponse.json({ status: "processing" }, { status: 202 });
}
