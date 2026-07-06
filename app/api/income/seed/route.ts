/**
 * POST /api/income/seed
 *
 * Populate the income ledger with a realistic self-test dataset so the
 * income dashboard has something to render. This is the bridge to "fully
 * live" before real traffic arrives: the operator can see the funnel,
 * daily chart, and recent transactions all populated with tagged
 * self-test data, then clear the test data and start capturing real.
 *
 * Auth: requires either
 *   - x-admin-secret header matching ADMIN_SECRET env, OR
 *   - body.adminSecret matching ADMIN_SECRET env, OR
 *   - ?secret=... query param matching ADMIN_SECRET env
 *
 * Tagging: every seeded record is marked source="self_test" in its UTM,
 * so the operator can tell at a glance what is real traffic vs. test.
 *
 * Action: POST with optional body { "days": 7, "scale": 1.0 }
 *   - days: how many days back to seed (default 7, max 30)
 *   - scale: multiplier on the base counts (default 1.0; set 2.0 to double)
 *
 * Response:
 *   { ok, seeded: { pageviews, intents, leads, transactions }, note }
 */

import { NextRequest, NextResponse } from "next/server";
import {
  recordPageview,
  recordIntent,
  recordLead,
  recordTransaction,
  type TransactionRecord,
  type LeadRecord,
  type IntentRecord,
} from "@/lib/income-ledger";
import { rateLimit, clientKey, rateLimitResponse } from "@/lib/rate-limit";
import { fireCapi as fireCapiEvent } from "@/lib/capi-fire";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Base rates per day for a freshly-launched funnel
const BASE_PAGEVIEWS_PER_DAY = 240;
const BASE_INTENT_RATE = 0.06;     // 6% of visitors click a checkout CTA
const BASE_LEAD_RATE = 0.025;      // 2.5% submit a free-gift form
const BASE_PURCHASE_RATE = 0.012;  // 1.2% of visitors purchase (paid)

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

function authOk(req: NextRequest, body: any): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-admin-secret");
  if (header === secret) return true;
  if (body?.adminSecret === secret) return true;
  if (req.nextUrl.searchParams.get("secret") === secret) return true;
  return false;
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

function jitter(base: number, jitter: number = 0.4): number {
  // Returns base * (1 ± jitter), min 0
  const r = 1 + (Math.random() * 2 - 1) * jitter;
  return Math.max(0, Math.round(base * r));
}

export async function POST(req: NextRequest) {
  const limit = rateLimit({ key: clientKey(req, "income-seed"), max: 10, windowMs: 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit);

  const body = (await req.json().catch(() => ({}))) as { days?: number; scale?: number; adminSecret?: string };
  if (!authOk(req, body)) {
    return NextResponse.json({ error: "Unauthorized — set ADMIN_SECRET env var and pass it via x-admin-secret header, body.adminSecret, or ?secret=..." }, { status: 401 });
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

    // Pageviews — 8 buckets across the day
    for (let slot = 0; slot < 8; slot++) {
      const ts = dayBucket(d, slot).getTime();
      const count = Math.round(pv / 8);
      for (let i = 0; i < count; i++) {
        await recordPageview("/seed", ts + i * 1000);
        totalPageviews++;
      }
    }

    // Intents
    for (let i = 0; i < intents; i++) {
      const slug = rand(PRODUCT_SLUGS);
      const ts = dayBucket(d, i % 8).getTime();
      await recordIntent(
        {
          slug,
          price: PRODUCT_PRICES[slug] ?? 29,
          capturedAt: ts,
          utm: { utm_source: "self_test" },
          ref: null,
          source: "self_test",
        },
        `seed-intent-${d}-${i}`,
      );
      totalIntents++;
    }

    // Leads
    for (let i = 0; i < leads; i++) {
      const ts = dayBucket(d, i % 8).getTime();
      const email = rand(TEST_DOMAINS);
      const lead: LeadRecord = {
        email,
        slug: "weekly-operating-map",
        capturedAt: ts,
        utm: { utm_source: "self_test" },
        ref: null,
        capiFired: false,
      };
      await recordLead(lead);
      totalLeads++;

      // Fire CAPI Lead (will be dropped if not configured, audit-recorded either way)
      const res = await fireCapiEvent(
        {
          event_name: "Lead",
          email,
          content_ids: ["weekly-operating-map"],
          utm: { utm_source: "self_test" },
        },
        { source: "self_test" },
      );
      capiAttempts.push({
        ok: res.ok,
        configured: res.attempted,
        error: res.error,
      });
    }

    // Purchases (transactions)
    for (let i = 0; i < purchases; i++) {
      const slug = rand(PRODUCT_SLUGS);
      const price = PRODUCT_PRICES[slug] ?? 29;
      const ts = dayBucket(d, i % 8).getTime();
      const txId = `self_test_tx_${d}_${i}_${crypto.randomBytes(3).toString("hex")}`;

      const tx: TransactionRecord = {
        orderId: txId,
        provider: "paddle",
        slug,
        email: rand(TEST_DOMAINS),
        value: price,
        currency: "USD",
        refCode: null,
        utm: { utm_source: "self_test" },
        capturedAt: ts,
        eventId: `self_test_evt_${txId}`,
        commission: 0,
        capiFired: false,
      };
      await recordTransaction(tx);
      totalTransactions++;

      // Fire CAPI Purchase
      const res = await fireCapiEvent(
        {
          event_name: "Purchase",
          event_id: txId,
          email: tx.email,
          value: price,
          currency: "USD",
          content_ids: [slug],
          utm: { utm_source: "self_test" },
        },
        { source: "self_test" },
      );
      capiAttempts.push({
        ok: res.ok,
        configured: res.attempted,
        error: res.error,
      });
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
    note:
      "All seeded records are tagged source=self_test in the UTM, so you can identify and clear them once real traffic arrives.",
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    ok: true,
    instructions:
      "POST /api/income/seed with x-admin-secret header, body.adminSecret, or ?secret=... matching ADMIN_SECRET. Body: { days?: 7, scale?: 1.0 }. All seeded data is tagged source=self_test.",
  });
}
