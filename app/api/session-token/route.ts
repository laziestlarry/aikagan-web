/**
 * GET /api/session-token
 *
 * Verifies a completed transaction, returns its delivery token, grants the
 * matching customer entitlement, and establishes the signed cross-subdomain
 * customer session used by app.aikagan.com.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/paddle-client";
import { generateDownloadToken } from "@/lib/download-token";
import { getProduct } from "@/lib/products";
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

  if (!transactionId.startsWith("txn_")) {
    return NextResponse.json({ status: "processing" }, { status: 202 });
  }

  const paddle = getPaddleClient();
  if (!paddle) return NextResponse.json({ status: "processing" }, { status: 202 });

  try {
    const transaction = await paddle.transactions.get(transactionId);
    if (transaction.status !== "completed" && transaction.status !== "paid") {
      return NextResponse.json({ status: "processing" }, { status: 202 });
    }

    const slug: string | undefined = (transaction.customData as any)?.product_slug;
    if (!slug) return NextResponse.json({ error: "Transaction missing product_slug" }, { status: 404 });
    const product = getProduct(slug);
    if (!product) return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 404 });

    const email: string = transaction.customer?.email ?? "unknown@checkout";
    if (email === "unknown@checkout") return NextResponse.json({ status: "processing" }, { status: 202 });

    if (product.deliveryMode === "service" || !product.zipFilename) {
      const record: TokenRecord = { token: null, slug, email, exp: Date.now() + 48 * 60 * 60 * 1000 };
      await tokenStore.set(transactionId, record);
      return verifiedResponse(transactionId, record, { service: true });
    }

    const token = generateDownloadToken(slug, transactionId, email);
    const record: TokenRecord = { token, slug, email, exp: Date.now() + 48 * 60 * 60 * 1000 };
    await tokenStore.set(transactionId, record);
    return verifiedResponse(transactionId, record);
  } catch (err: any) {
    console.error("❌ Session-token lookup error:", err.message);
    return NextResponse.json({ status: "processing" }, { status: 202 });
  }
}
