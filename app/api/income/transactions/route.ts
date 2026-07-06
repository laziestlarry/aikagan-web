/**
 * GET /api/income/transactions
 *
 * List recent transactions for the evidence trail. Powers the
 * "Recent activity" panel on the income dashboard.
 */

import { NextResponse } from "next/server";
import { listRecentTransactions } from "@/lib/income-ledger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(200, Number(url.searchParams.get("limit") || 50)));
  const txs = await listRecentTransactions(limit);
  return NextResponse.json(
    {
      count: txs.length,
      transactions: txs.map((t) => ({
        orderId: t.orderId,
        provider: t.provider,
        slug: t.slug,
        email: t.email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        value: t.value,
        currency: t.currency,
        refCode: t.refCode,
        capturedAt: new Date(t.capturedAt).toISOString(),
        eventId: t.eventId,
        commission: t.commission,
        capiFired: t.capiFired,
      })),
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
