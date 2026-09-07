import { NextRequest, NextResponse } from "next/server";
import { drainFulfillmentQueue } from "@/lib/fulfillment";
import { reconcileRecentGumroadSales } from "@/lib/gumroad-reconcile";
import { isCronRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  return isCronRequest(req);
}

async function run(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gumroad = await reconcileRecentGumroadSales(7);
  const queued = await drainFulfillmentQueue();

  return NextResponse.json({
    ok: gumroad.ok,
    simulated: false,
    gumroad,
    queued,
    timestamp: new Date().toISOString(),
  }, { status: gumroad.ok ? 200 : 503 });
}

export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}
