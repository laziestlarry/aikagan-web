import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE, verifyCustomerSession } from "@/lib/customer-session";
import { customerStore } from "@/lib/customer-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = verifyCustomerSession(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let body: { subject?: string; message?: string } = {};
  try { body = await req.json(); } catch {}
  const subject = body.subject?.trim();
  const message = body.message?.trim();
  if (!subject || !message) return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  const ticket = await customerStore.createSupportTicket(session.customerId, session.email, subject, message);
  return NextResponse.json({ ticket }, { status: 201 });
}
