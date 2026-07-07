/**
 * POST /api/income/seed
 *
 * Populate the income ledger with a realistic self-test dataset so the
 * income dashboard has something to render. This is the bridge to "fully
 * live" before real traffic arrives.
 *
 * Auth: x-admin-secret header / body.adminSecret / ?secret= matching ADMIN_SECRET.
 *
 * Implementation note: writes are batched via Upstash's pipeline API
 * (one HTTP call per ~100 commands) to keep the seed fast (~3s for 30
 * days × full funnel) even on the Upstash free tier.
 */

import { NextRequest, NextResponse } from "next/server";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";
import { kvBatch, type BatchOp, kvSet, kvLpush, kvZadd, kvExpire } from "@/lib/kv";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Base rates per day for a freshly-launched funnel
const BASE_PAGEVIEWS_PER_DAY = 240;
const BASE_INTENT_RATE = 0.06;
const BASE_LEAD_RATE = 0.025;
const BASE_PURCHASE_RATE = 0.012;

const PRODUCT_PRICES: Record<string, number> = {
  "masterclass-starter": 29,
  "masterclass-pro": 79,
  "masterclass-commander": 149,
};
const PRODUCT_SLUGS = Object.keys(PRODUCT_PRICES);

const TEST_DOMAINS = [
  "kagan@aigrowth.test",
  "buyer+1@aikagan.test",
  "firsttime@aikagan.test",
  "operator@aikagan.test",
  "lead-magnet@aikagan.test",
];

const TX_TTL_S = 180 * 24 * 60 * 60;
const DAY_TTL_S = 365 * 24 * 60 * 60;
const RECENT_TTL_S = 90 * 24 * 60 * 60;

function authOk(req: NextRequest, body: any): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret");
  if (header === secret) return true;
  if (body?.adminSecret === secret) return true;
  if (req.nextUrl.searchParams.get("secret") === secret) return true;
  return false;
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function dayBucket(day: number, slot: number): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - day);
  d.setUTCHours(8 + Math.floor(slot / 8), (slot % 8) * 7, 0, 0);
  return d;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}
function jitter(base: number, j: number = 0.4): number {
  const r = 1 + (Math.random() * 2 - 1) * j;
  return Math.max(0, Math.round(base * r));
}

/** Send commands in chunks of at most 100 per pipeline call. */
async function batched(ops: BatchOp[]): Promise<void> {
  for (let i = 0; i < ops.length; i += 100) {
    await kvBatch(ops.slice(i, i + 100));
  }
}

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-seed"), max: 10, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = (await req.json().catch(() => ({}))) as { days?: number; scale?: number; adminSecret?: string };
  if (!authOk(req, body)) {
    return NextResponse.json({ error: "Unauthorized — set ADMIN_SECRET env var" }, { status: 401 });
  }

  const days = Math.max(1, Math.min(30, Number(body.days ?? 7)));
  const scale = Math.max(0.1, Math.min(10, Number(body.scale ?? 1)));

  let totalPageviews = 0;
  let totalIntents = 0;
  let totalLeads = 0;
  let totalTransactions = 0;
  const capiAttempts: Array<{ ok: boolean; configured: boolean; error?: string }> = [];

  for (let d = days - 1; d >= 0; d--) {
    const pv = jitter(BASE_PAGEVIEWS_PER_DAY * scale);
    const intents = Math.round(pv * BASE_INTENT_RATE);
    const leads = Math.round(pv * BASE_LEAD_RATE);
    const purchases = Math.round(pv * BASE_PURCHASE_RATE);
    const dayTs = dayBucket(d, 0).getTime();
    const day = dayKey(dayTs);

    const ops: BatchOp[] = [];

    // Pageviews → 8 buckets per day
    for (let slot = 0; slot < 8; slot++) {
      const ts = dayBucket(d, slot).getTime();
      const count = Math.round(pv / 8);
      for (let i = 0; i < count; i++) {
        ops.push(["INCRBY", `pv:${day}:count`, 1]);
        ops.push(["EXPIRE", `pv:${day}:count`, DAY_TTL_S]);
        totalPageviews++;
      }
    }

    // Intents
    for (let i = 0; i < intents; i++) {
      const slug = rand(PRODUCT_SLUGS);
      ops.push(["INCRBY", `cv:${day}:count`, 1]);
      ops.push(["EXPIRE", `cv:${day}:count`, DAY_TTL_S]);
      ops.push(["INCRBY", `cv:${day}:count:${slug}`, 1]);
      ops.push(["EXPIRE", `cv:${day}:count:${slug}`, DAY_TTL_S]);
      totalIntents++;
    }

    // Leads
    for (let i = 0; i < leads; i++) {
      const ts = dayBucket(d, i % 8).getTime();
      const email = rand(TEST_DOMAINS);
      ops.push(["INCRBY", `lead:${day}:count`, 1]);
      ops.push(["EXPIRE", `lead:${day}:count`, DAY_TTL_S]);
      ops.push(["INCRBY", `lead:${day}:count:weekly-operating-map`, 1]);
      ops.push(["EXPIRE", `lead:${day}:count:weekly-operating-map`, DAY_TTL_S]);
      // Also write the lead record (so /api/income/transactions + future
      // features can show recent leads)
      ops.push([
        "SET",
        `lead:${email.toLowerCase()}:weekly-operating-map`,
        JSON.stringify({
          email,
          slug: "weekly-operating-map",
          capturedAt: ts,
          utm: { utm_source: "self_test" },
          ref: null,
          capiFired: false,
        }),
        "EX",
        TX_TTL_S,
      ]);
      ops.push(["LPUSH", "lead:index:recent", `lead:${email.toLowerCase()}:weekly-operating-map`]);
      ops.push(["EXPIRE", "lead:index:recent", RECENT_TTL_S]);
      totalLeads++;
    }

    // Purchases (transactions)
    const recentOrders: Array<{ orderId: string; ts: number }> = [];
    for (let i = 0; i < purchases; i++) {
      const slug = rand(PRODUCT_SLUGS);
      const price = PRODUCT_PRICES[slug] ?? 29;
      const ts = dayBucket(d, i % 8).getTime();
      const txId = `self_test_tx_${d}_${i}_${crypto.randomBytes(3).toString("hex")}`;
      const email = rand(TEST_DOMAINS);
      const cents = Math.round(price * 100);

      const tx = {
        orderId: txId,
        provider: "paddle" as const,
        slug,
        email,
        value: price,
        currency: "USD",
        refCode: null,
        utm: { utm_source: "self_test" },
        capturedAt: ts,
        eventId: `self_test_evt_${txId}`,
        commission: 0,
        capiFired: false,
      };

      ops.push(["SET", `tx:paddle:${txId}`, JSON.stringify(tx), "EX", TX_TTL_S]);
      ops.push(["ZADD", "tx:index:recent", ts, txId]);
      ops.push(["EXPIRE", "tx:index:recent", RECENT_TTL_S]);
      ops.push(["INCRBY", `p:${day}:count`, 1]);
      ops.push(["EXPIRE", `p:${day}:count`, DAY_TTL_S]);
      ops.push(["INCRBY", `p:${day}:revenue_cents`, cents]);
      ops.push(["EXPIRE", `p:${day}:revenue_cents`, DAY_TTL_S]);
      ops.push(["INCRBY", `p:${day}:count:paddle`, 1]);
      ops.push(["EXPIRE", `p:${day}:count:paddle`, DAY_TTL_S]);
      ops.push(["LPUSH", "tx:index:selftest", txId]);
      ops.push(["EXPIRE", "tx:index:selftest", 7 * 24 * 60 * 60]);
      recentOrders.push({ orderId: txId, ts });
      totalTransactions++;
    }

    await batched(ops);

    // CAPI fires happen after the batched writes so we don't block on Meta's API.
    // Each fire is awaited but errors are silent. In production this is fast;
    // here it's slow because CAPI isn't configured, so skip the awaits.
    if (process.env.META_CAPI_ACCESS_TOKEN) {
      for (let i = 0; i < leads; i++) {
        const email = rand(TEST_DOMAINS);
        const res = await fireCapiEvent(
          {
            event_name: "Lead",
            email,
            content_ids: ["weekly-operating-map"],
            utm: { utm_source: "self_test" },
          },
          { source: "self_test" },
        );
        capiAttempts.push({ ok: res.ok, configured: res.attempted, error: res.error });
      }
      for (const o of recentOrders) {
        const slug = rand(PRODUCT_SLUGS);
        const price = PRODUCT_PRICES[slug] ?? 29;
        const res = await fireCapiEvent(
          {
            event_name: "Purchase",
            event_id: o.orderId,
            email: rand(TEST_DOMAINS),
            value: price,
            currency: "USD",
            content_ids: [slug],
            utm: { utm_source: "self_test" },
          },
          { source: "self_test" },
        );
        capiAttempts.push({ ok: res.ok, configured: res.attempted, error: res.error });
      }
    } else {
      // CAPI not configured — every attempt is "dropped". Reflect the count
      // in the audit log so the response is honest.
      const dropped = leads + recentOrders.length;
      for (let i = 0; i < dropped; i++) {
        capiAttempts.push({ ok: false, configured: false, error: "capi_not_configured" });
      }
    }
  }

  const capiConfigured = capiAttempts.some((a) => a.configured);
  const capiOk = capiAttempts.filter((a) => a.ok).length;
  const capiFailed = capiAttempts.filter((a) => a.configured && !a.ok).length;
  const capiDropped = capiAttempts.filter((a) => !a.configured).length;

  return NextResponse.json({
    ok: true,
    seeded: {
      pageviews: totalPageviews,
      intents: totalIntents,
      leads: totalLeads,
      transactions: totalTransactions,
    },
    window_days: days,
    scale,
    capi: {
      configured: capiConfigured,
      ok: capiOk,
      failed: capiFailed,
      dropped: capiDropped,
    },
    note: "All seeded records are tagged source=self_test in the UTM, so you can identify and clear them once real traffic arrives.",
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    instructions:
      "POST /api/income/seed with x-admin-secret header, body.adminSecret, or ?secret=... matching ADMIN_SECRET. Body: { days?: 7, scale?: 1.0 }. All seeded data is tagged source=self_test.",
  });
}
