import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE, verifyCustomerSession } from "@/lib/customer-session";
import { customerStore } from "@/lib/customer-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = verifyCustomerSession(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
  const customer = await customerStore.ensure(session.customerId, session.email);
  return NextResponse.json({ authenticated: true, customer });
}
