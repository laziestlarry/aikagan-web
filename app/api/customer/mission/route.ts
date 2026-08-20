import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_SESSION_COOKIE, verifyCustomerSession } from "@/lib/customer-session";
import { customerStore } from "@/lib/customer-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEXT_ACTION: Record<string, string> = {
  founder: "Define the offer, buyer, proof requirement, and shortest path to first conversion.",
  ecommerce: "Map the product, checkout, fulfillment, retention, and measurement flow.",
  creator: "Package the audience problem into an offer and build the conversion-to-delivery path.",
  agency: "Create a repeatable client delivery workflow with approvals, evidence, and reusable assets.",
  sme: "Select the highest-friction operating process and turn it into a measurable automation mission.",
  enterprise: "Define stakeholders, controls, approval gates, data boundaries, and measurable deployment success.",
  developer: "Define the integration contract, events, APIs, failure states, and verification tests.",
};

export async function POST(req: NextRequest) {
  const session = verifyCustomerSession(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  let body: { title?: string; segment?: string; objective?: string } = {};
  try { body = await req.json(); } catch {}
  const objective = body.objective?.trim();
  if (!objective) return NextResponse.json({ error: "Objective is required" }, { status: 400 });
  const segment = (body.segment || "founder").toLowerCase();
  const title = body.title?.trim() || "Outcome mission";
  const mission = await customerStore.createMission(session.customerId, session.email, {
    title,
    segment,
    objective,
    nextAction: NEXT_ACTION[segment] || NEXT_ACTION.founder,
  });
  return NextResponse.json({ mission }, { status: 201 });
}
