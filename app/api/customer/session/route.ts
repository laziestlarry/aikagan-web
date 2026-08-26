import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE, CUSTOMER_SESSION_TTL_MS, customerIdForEmail, signCustomerSession } from "@/lib/customer-session";
import { customerStore } from "@/lib/customer-store";
import { tokenStore } from "@/lib/token-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { transaction_id?: string } = {};
  try { body = await req.json(); } catch {}
  const transactionId = body.transaction_id?.trim();
  if (!transactionId) return NextResponse.json({ error: "Missing transaction_id" }, { status: 400 });

  const purchase = await tokenStore.get(transactionId);
  if (!purchase?.slug || !purchase.email || purchase.email === "unknown@checkout") {
    return NextResponse.json({ status: "processing" }, { status: 202 });
  }

  const customerId = customerIdForEmail(purchase.email);
  const downloadHref = purchase.token ? `/api/download/${purchase.token}` : null;
  const record = await customerStore.grantEntitlement(customerId, purchase.email, purchase.slug, transactionId, downloadHref);
  const session = signCustomerSession(purchase.email);

  const response = NextResponse.json({
    authenticated: true,
    customerId,
    entitlement: purchase.slug,
    workspace: "https://app.aikagan.com/dashboard",
    entitlements: record.entitlements.filter((e) => e.status === "active").map((e) => e.slug),
  });

  response.cookies.set(CUSTOMER_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(CUSTOMER_SESSION_TTL_MS / 1000),
    ...(process.env.NODE_ENV === "production" ? { domain: ".aikagan.com" } : {}),
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    ...(process.env.NODE_ENV === "production" ? { domain: ".aikagan.com" } : {}),
  });
  return response;
}
