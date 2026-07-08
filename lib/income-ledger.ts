/**
 * AIKAGAN — Income Evidence Ledger
 *
 * The single source of truth for income, traffic, and conversion. Every
 * revenue-bearing event (lead, checkout-intent, purchase) is written to
 * Vercel KV by a key scheme this module owns.
 *
 * Key scheme (all in seconds-TTL to bound cost):
 *   tx:<provider>:<orderId>     — full transaction record (180d)
 *   tx:index:recent            — sorted set of recent orderIds (90d)
 *   tx:index:by-day:<YYYY-MM-DD> — set of orderIds for that UTC day (365d)
 *   lead:<email>:<slug>        — lead record (180d)
 *   lead:index:recent          — list of lead keys (90d)
 *   intent:<slug>:<sessionId>  — checkout-intent record (30d)
 *   intent:index:recent        — list of intent keys (30d)
 *   pv:<YYYY-MM-DD>            — daily pageview counter (365d)
 *   cv:<YYYY-MM-DD>            — daily checkout-intent counter (365d)
 *   p:<YYYY-MM-DD>             — daily purchase count + revenue (365d)
 *
 * The module is intentionally synchronous-looking but every write is awaited
 * once before the webhook returns, so evidence is durable before we ack.
 */

import { getKv, kvSet, kvGet, kvIncrBy, kvZadd, kvLpush, kvLrange, kvZrevrange, kvExpire, kvDel } from "./kv";

// CAPI attempts
const CAPI_TTL_S = 30 * 24 * 60 * 60;

export interface CapiAttemptRecord {
  event_name: string;
  event_id: string;
  attempted: boolean;
  ok: boolean;
  status?: number;
  error?: string;
  source: string;
  timestamp: number;
}

/** Commission rates by product slug. */
export function getCommissionRate(slug: string): number {
  const map: Record<string, number> = {
    "masterclass-starter": 30,
    "masterclass-pro": 25,
    "masterclass-commander": 25,
    "golden-delivery-starter": 30,
    "golden-delivery-pro": 25,
    "golden-delivery-commander": 25,
  };
  return map[slug] ?? 25;
}

export async function recordCapiAttempt(rec: CapiAttemptRecord): Promise<void> {
  const day = dayKey(rec.timestamp);
  const id = `${rec.timestamp}.${Math.random().toString(36).slice(2, 8)}`;
  await kvSet(`capi:${day}:${id}`, rec, CAPI_TTL_S);
  await kvIncrBy(`capi:${day}:count`, 1, CAPI_TTL_S);
  if (rec.attempted) {
    await kvIncrBy(`capi:${day}:attempted`, 1, CAPI_TTL_S);
    if (rec.ok) await kvIncrBy(`capi:${day}:ok`, 1, CAPI_TTL_S);
    else await kvIncrBy(`capi:${day}:failed`, 1, CAPI_TTL_S);
  } else {
    await kvIncrBy(`capi:${day}:dropped`, 1, CAPI_TTL_S);
  }
  await kvIncrBy(`capi:${day}:count:${rec.event_name}`, 1, CAPI_TTL_S);
}

export type Provider = "paddle" | "lemonsqueezy" | "gumroad" | "manual";

export interface TransactionRecord {
  /** Provider order/transaction id. */
  orderId: string;
  provider: Provider;
  slug: string;
  email: string;
  /** Order total in USD. */
  value: number;
  currency: string;
  /** Affiliate ref code, if any. */
  refCode: string | null;
  /** UTM and click attribution as captured at checkout time. */
  utm: Record<string, string>;
  /** Epoch ms when the webhook fired. */
  capturedAt: number;
  /** Raw event id for dedup reference. */
  eventId: string;
  /** Affiliate commission in USD (precomputed, recorded once). */
  commission: number;
  /** Whether CAPI Purchase was fired (true) or skipped (false). */
  capiFired: boolean;
  /** Optional notes. */
  note?: string;
}

export interface LeadRecord {
  email: string;
  slug: string;
  capturedAt: number;
  utm: Record<string, string>;
  ref: string | null;
  capiFired: boolean;
}

export interface IntentRecord {
  slug: string;
  price: number;
  capturedAt: number;
  utm: Record<string, string>;
  ref: string | null;
  source: string; // "checkout_button" | "buy_now" | etc.
}

// ─── Transaction ledger ─────────────────────────────────────────────────────

const TX_TTL_S = 180 * 24 * 60 * 60; // 180 days
const TX_INDEX_TTL_S = 90 * 24 * 60 * 60; // 90 days
const DAY_TTL_S = 365 * 24 * 60 * 60; // 365 days

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/** List of self-test seeded transaction ids, for /api/income/clear-test-data. */
const SELF_TEST_INDEX = "tx:index:selftest";

export async function recordTransaction(tx: TransactionRecord): Promise<void> {
  const day = dayKey(tx.capturedAt);
  const txKey = `tx:${tx.provider}:${tx.orderId}`;
  const dayKeyName = `tx:index:by-day:${day}`;
  const recentKey = `tx:index:recent`;

  await kvSet(txKey, tx, TX_TTL_S);
  await kvZadd(recentKey, tx.capturedAt, tx.orderId, TX_INDEX_TTL_S);
  await kvExpire(dayKeyName, DAY_TTL_S);
  // Use a Set for the daily index (faster scan, bounded size)
  const kv = await getKv();
  if (kv) {
    try {
      // Upstash KV uses SADD, but our wrapper is kv-incr based — use sadd via raw
      // We don't have a typed wrapper; use a separate list path below
      await kv.sadd?.(dayKeyName, tx.orderId);
    } catch {
      // ignore
    }
  }
  // Daily aggregates
  await kvIncrBy(`p:${day}:count`, 1, DAY_TTL_S);
  // Store revenue as cents (int) to avoid float precision
  const cents = Math.round(tx.value * 100);
  await kvIncrBy(`p:${day}:revenue_cents`, cents, DAY_TTL_S);
  // Index by provider
  await kvIncrBy(`p:${day}:count:${tx.provider}`, 1, DAY_TTL_S);
  if (tx.refCode) {
    await kvIncrBy(`p:${day}:affiliated_count`, 1, DAY_TTL_S);
  }
  // Track self-test seed for later cleanup
  if (tx.eventId.startsWith("self_test_evt_")) {
    await kvLpush(SELF_TEST_INDEX, tx.orderId, 7 * 24 * 60 * 60);
  }
}

export async function getTransaction(
  provider: Provider,
  orderId: string,
): Promise<TransactionRecord | null> {
  const v = await kvGet<TransactionRecord>(`tx:${provider}:${orderId}`);
  return v ?? null;
}

/** Delete a transaction record and decrement daily aggregates. */
export async function deleteTransaction(
  provider: Provider,
  orderId: string,
): Promise<void> {
  const tx = await getTransaction(provider, orderId);
  if (!tx) return;
  const txKey = `tx:${provider}:${orderId}`;
  const day = dayKey(tx.capturedAt);
  await kvDel(txKey);
  // We can't decrement counters atomically without racing; the safer approach
  // is to set the day's value to max(0, current - tx.value) via read-modify-write.
  // For the in-memory case this is fine; for KV it may briefly drift. The
  // operator should re-seed or treat the cleared day as a known drift.
  const currentCount = (await kvGet<number>(`p:${day}:count`)) ?? 0;
  const currentRev = (await kvGet<number>(`p:${day}:revenue_cents`)) ?? 0;
  const newCount = Math.max(0, Number(currentCount) - 1);
  const newRev = Math.max(0, Number(currentRev) - Math.round(tx.value * 100));
  await kvSet(`p:${day}:count`, newCount, DAY_TTL_S);
  await kvSet(`p:${day}:revenue_cents`, newRev, DAY_TTL_S);
}

/** List self-test orderIds (for clear endpoint). */
export async function listSelfTestOrderIds(): Promise<string[]> {
  return kvLrange<string>(SELF_TEST_INDEX, 0, 1000);
}

export async function listRecentTransactions(limit = 50): Promise<TransactionRecord[]> {
  // tx:index:recent is a sorted set (zadd) keyed by capturedAt — read in reverse (newest first).
  const recent = await kvZrevrange<string>("tx:index:recent", 0, limit - 1);
  if (recent.length === 0) return [];
  const out: TransactionRecord[] = [];
  for (const orderId of recent) {
    // Try each provider prefix; first hit wins
    for (const p of ["paddle", "lemonsqueezy", "gumroad", "manual"] as Provider[]) {
      const tx = await getTransaction(p, orderId);
      if (tx) {
        out.push(tx);
        break;
      }
    }
  }
  return out;
}

export async function countTransactionsSince(sinceMs: number): Promise<{
  count: number;
  revenueCents: number;
}> {
  // Walk UTC days from sinceMs to today, sum counters.
  const start = new Date(sinceMs);
  start.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let count = 0;
  let revenueCents = 0;
  for (let d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
    const k = dayKey(d.getTime());
    const c = (await kvGet<number>(`p:${k}:count`)) ?? 0;
    const r = (await kvGet<number>(`p:${k}:revenue_cents`)) ?? 0;
    count += Number(c) || 0;
    revenueCents += Number(r) || 0;
  }
  return { count, revenueCents };
}

// ─── Lead ledger ─────────────────────────────────────────────────────────────

const LEAD_TTL_S = 180 * 24 * 60 * 60;

export async function recordLead(lead: LeadRecord): Promise<void> {
  const day = dayKey(lead.capturedAt);
  const key = `lead:${lead.email.toLowerCase()}:${lead.slug}`;
  await kvSet(key, lead, LEAD_TTL_S);
  await kvLpush("lead:index:recent", key, 90 * 24 * 60 * 60);
  await kvIncrBy(`lead:${day}:count`, 1, DAY_TTL_S);
  await kvIncrBy(`lead:${day}:count:${lead.slug}`, 1, DAY_TTL_S);
  if (lead.ref) await kvIncrBy(`lead:${day}:affiliated_count`, 1, DAY_TTL_S);
}

export async function countLeadsSince(sinceMs: number): Promise<number> {
  const start = new Date(sinceMs);
  start.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let count = 0;
  for (let d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
    const c = (await kvGet<number>(`lead:${dayKey(d.getTime())}:count`)) ?? 0;
    count += Number(c) || 0;
  }
  return count;
}

// ─── Checkout-intent ledger ──────────────────────────────────────────────────

const INTENT_TTL_S = 30 * 24 * 60 * 60;

export async function recordIntent(intent: IntentRecord, sessionId: string): Promise<void> {
  const day = dayKey(intent.capturedAt);
  const key = `intent:${intent.slug}:${sessionId}`;
  await kvSet(key, intent, INTENT_TTL_S);
  await kvIncrBy(`cv:${day}:count`, 1, DAY_TTL_S);
  await kvIncrBy(`cv:${day}:count:${intent.slug}`, 1, DAY_TTL_S);
  if (intent.ref) await kvIncrBy(`cv:${day}:affiliated_count`, 1, DAY_TTL_S);
}

export async function countIntentsSince(sinceMs: number): Promise<number> {
  const start = new Date(sinceMs);
  start.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let count = 0;
  for (let d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
    const c = (await kvGet<number>(`cv:${dayKey(d.getTime())}:count`)) ?? 0;
    count += Number(c) || 0;
  }
  return count;
}

// ─── Pageview ledger ────────────────────────────────────────────────────────

export async function recordPageview(path: string, ts: number = Date.now()): Promise<void> {
  const day = dayKey(ts);
  await kvIncrBy(`pv:${day}:count`, 1, DAY_TTL_S);
  await kvIncrBy(`pv:${day}:count:all`, 1, DAY_TTL_S);
  // Best-effort per-path bucket (10-char hash to bound key length)
  if (path && path.length < 200) {
    const safe = path.replace(/[^a-zA-Z0-9/_-]/g, "_").slice(0, 80);
    await kvIncrBy(`pv:${day}:path:${safe}`, 1, DAY_TTL_S);
  }
}

export async function countPageviewsSince(sinceMs: number): Promise<number> {
  const start = new Date(sinceMs);
  start.setUTCHours(0, 0, 0, 0);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  let count = 0;
  for (let d = new Date(start); d <= today; d.setUTCDate(d.getUTCDate() + 1)) {
    const c = (await kvGet<number>(`pv:${dayKey(d.getTime())}:count`)) ?? 0;
    count += Number(c) || 0;
  }
  return count;
}

// ─── Aggregated reality feed (the dashboard's ground truth) ────────────────

export interface IncomeReality {
  generatedAt: string;
  sources: {
    kv: boolean;
    paddle: boolean;
    capi: boolean;
    ga4: boolean;
  };
  windowDays: number;
  traffic: {
    pageviews: number;
    checkoutIntents: number;
    leads: number;
    purchases: number;
    leadRatePct: number; // leads / pageviews
    intentRatePct: number; // intents / pageviews
    purchaseIntentPct: number; // purchases / intents
    leadToPurchasePct: number; // purchases / leads
  };
  revenue: {
    grossUsd: number;
    transactionsCount: number;
    affiliatedCount: number;
    averageOrderUsd: number;
  };
  /** Last 7 days, day-by-day (revenue, purchases, leads, intents, pageviews). */
  daily: Array<{
    day: string;
    pageviews: number;
    intents: number;
    leads: number;
    purchases: number;
    revenueCents: number;
  }>;
  /** Most recent N transactions for the evidence trail. */
  recentTransactions: Array<{
    orderId: string;
    provider: Provider;
    slug: string;
    value: number;
    capturedAt: string;
    ref: string | null;
    capiFired: boolean;
  }>;
  /** Sources of evidence (for the audit panel). */
  evidence: {
    kvRecords: { transactions: number; leads: number; intents: number };
    paddleApi?: { ok: boolean; message: string };
    capi?: { configured: boolean; message: string };
  };
}

const DEFAULT_WINDOW_DAYS = 7;

export async function getIncomeReality(windowDays = DEFAULT_WINDOW_DAYS): Promise<IncomeReality> {
  const sinceMs = Date.now() - windowDays * 24 * 60 * 60 * 1000;
  const [pv, intents, leads, txs] = await Promise.all([
    countPageviewsSince(sinceMs),
    countIntentsSince(sinceMs),
    countLeadsSince(sinceMs),
    countTransactionsSince(sinceMs),
  ]);

  // Build daily breakdown
  const daily: IncomeReality["daily"] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    const day = dayKey(d.getTime());
    const [pvC, intC, leadC, pC, pR] = await Promise.all([
      kvGet<number>(`pv:${day}:count`),
      kvGet<number>(`cv:${day}:count`),
      kvGet<number>(`lead:${day}:count`),
      kvGet<number>(`p:${day}:count`),
      kvGet<number>(`p:${day}:revenue_cents`),
    ]);
    daily.push({
      day,
      pageviews: Number(pvC) || 0,
      intents: Number(intC) || 0,
      leads: Number(leadC) || 0,
      purchases: Number(pC) || 0,
      revenueCents: Number(pR) || 0,
    });
  }

  const recentRaw = await listRecentTransactions(20);
  const recent = recentRaw.map((t) => ({
    orderId: t.orderId,
    provider: t.provider,
    slug: t.slug,
    value: t.value,
    capturedAt: new Date(t.capturedAt).toISOString(),
    ref: t.refCode,
    capiFired: t.capiFired,
  }));

  const kvAvailable = (await getKv()) !== null;
  const capiConfigured = Boolean(
    (process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID) &&
    process.env.META_CAPI_ACCESS_TOKEN,
  );
  const paddleConfigured = Boolean(process.env.PADDLE_API_KEY);

  // Sanity ratio
  const leadRate = pv > 0 ? (leads / pv) * 100 : 0;
  const intentRate = pv > 0 ? (intents / pv) * 100 : 0;
  const purchaseIntent = intents > 0 ? (txs.count / intents) * 100 : 0;
  const leadToPurchase = leads > 0 ? (txs.count / leads) * 100 : 0;

  return {
    generatedAt: new Date().toISOString(),
    sources: {
      kv: kvAvailable,
      paddle: paddleConfigured,
      capi: capiConfigured,
      ga4: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    },
    windowDays,
    traffic: {
      pageviews: pv,
      checkoutIntents: intents,
      leads,
      purchases: txs.count,
      leadRatePct: round2(leadRate),
      intentRatePct: round2(intentRate),
      purchaseIntentPct: round2(purchaseIntent),
      leadToPurchasePct: round2(leadToPurchase),
    },
    revenue: {
      grossUsd: round2(txs.revenueCents / 100),
      transactionsCount: txs.count,
      affiliatedCount: recentRaw.filter((t) => Boolean(t.refCode)).length,
      averageOrderUsd: txs.count > 0 ? round2(txs.revenueCents / 100 / txs.count) : 0,
    },
    daily,
    recentTransactions: recent,
    evidence: {
      kvRecords: {
        transactions: recentRaw.length,
        leads: leads,
        intents: intents,
      },
      capi: {
        configured: capiConfigured,
        message: capiConfigured
          ? "CAPI token present — server-side Purchase/Lead events will be accepted by Meta"
          : "CAPI not configured: META_PIXEL_ID or META_CAPI_ACCESS_TOKEN missing. Server-side events are dropped.",
      },
    },
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
