import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE, CUSTOMER_SESSION_TTL_MS, customerIdForEmail, signCustomerSession } from "@/lib/customer-session";
import { customerStore } from "@/lib/customer-store";
import { clientKey, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "customer-register"), max: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "A valid JSON request body is required" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
  }

  const customerId = customerIdForEmail(email);
  const existingCustomer = await customerStore.get(customerId);
  if (existingCustomer) {
    return NextResponse.json(
      {
        error: "An existing workspace must be accessed through a verified checkout session.",
        access: "verification_required",
      },
      { status: 409 },
    );
  }

  const customer = await customerStore.ensure(customerId, email);
  const response = NextResponse.json({
    authenticated: true,
    customer,
    workspace: "https://app.aikagan.com/dashboard",
    access: "planning",
    notice: "Workspace registration does not grant a paid entitlement or confirm fulfillment.",
  }, { status: 201 });

  response.cookies.set(CUSTOMER_SESSION_COOKIE, signCustomerSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(CUSTOMER_SESSION_TTL_MS / 1000),
    ...(process.env.NODE_ENV === "production" ? { domain: ".aikagan.com" } : {}),
  });
  return response;
}
