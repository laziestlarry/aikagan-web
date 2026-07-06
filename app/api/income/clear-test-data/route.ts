/**
 * POST /api/income/clear-test-data
 *
 * Wipe every transaction that was tagged source=self_test (i.e. seeded by
 * /api/income/seed) so the dashboard is clean before real traffic arrives.
 *
 * Also zeroes the daily aggregates that those transactions contributed to.
 * Pageviews, leads, and intents that were self-test are NOT individually
 * tracked (we don't store per-record UTM), so the pageview/lead/intent
 * counters will still reflect the self-test data. To reset those, the
 * operator should:
 *   1. Call this endpoint
 *   2. Delete the Vercel KV namespace (or wait for the daily counters to
 *      naturally roll over after a day boundary)
 *
 * Auth: ADMIN_SECRET (header, body, or query).
 */

import { NextRequest, NextResponse } from "next/server";
import { deleteTransaction, listSelfTestOrderIds } from "@/lib/income-ledger";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authOk(req: NextRequest, body: any): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret");
  if (header === secret) return true;
  if (body?.adminSecret === secret) return true;
  if (req.nextUrl.searchParams.get("secret") === secret) return true;
  return false;
}

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-clear"), max: 5, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = (await req.json().catch(() => ({}))) as { adminSecret?: string };
  if (!authOk(req, body)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderIds = await listSelfTestOrderIds();
  let deleted = 0;
  // Try each provider prefix; tx is stored as tx:<provider>:<orderId>
  for (const id of orderIds) {
    for (const provider of ["paddle", "lemonsqueezy", "gumroad", "manual"] as const) {
      try {
        await deleteTransaction(provider, id);
        deleted++;
        break;
      } catch {
        // continue
      }
    }
  }

  return NextResponse.json({
    ok: true,
    found: orderIds.length,
    deleted,
    note:
      "Transactions deleted. Pageview/lead/intent counters are not per-record and may still reflect self-test data — to fully reset, clear the Vercel KV namespace.",
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    ok: true,
    instructions:
      "POST /api/income/clear-test-data with x-admin-secret / body.adminSecret / ?secret= matching ADMIN_SECRET. Removes every transaction tagged source=self_test.",
  });
}
