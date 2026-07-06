/**
 * Typed Vercel KV wrapper with in-memory fallback.
 *
 * One module, one consistent API, no scattered ad-hoc reads.
 * Used by token-store, webhook-idempotency, referral, and the new
 * income-ledger so the rest of the codebase can stay provider-agnostic.
 */

import { createHash } from "node:crypto";

// ─── In-memory shim ──────────────────────────────────────────────────────────
// Each Map is keyed by a namespaced key; values carry their own expiry so we
// can sweep them in one pass.

interface Entry {
  value: unknown;
  exp: number; // epoch ms; 0 = never
}

const _store = new Map<string, Entry>();

let _kv: {
  get: (k: string) => Promise<unknown>;
  set: (k: string, v: unknown, opts?: { ex?: number }) => Promise<unknown>;
  del: (k: string) => Promise<unknown>;
  incrby: (k: string, n: number) => Promise<number>;
  zincrby?: (k: string, n: number, member: string) => Promise<unknown>;
  zadd?: (k: string, score: number, member: string) => Promise<unknown>;
  zrange?: (k: string, start: number, stop: number) => Promise<unknown[]>;
  lpush?: (k: string, ...vals: unknown[]) => Promise<number>;
  lrange?: (k: string, start: number, stop: number) => Promise<unknown[]>;
  llen?: (k: string) => Promise<number>;
  sadd?: (k: string, ...members: string[]) => Promise<number>;
  smembers?: (k: string) => Promise<string[]>;
  expire?: (k: string, seconds: number) => Promise<number>;
  scan?: (cursor: number, opts?: { match?: string; count?: number }) => Promise<[number, string[]]>;
} | null = null;

let _kvLoadTried = false;
async function tryLoadKv() {
  if (_kvLoadTried) return _kv;
  _kvLoadTried = true;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      _kv = kv as unknown as typeof _kv;
    }
  } catch {
    _kv = null;
  }
  return _kv;
}

export async function getKv(): Promise<typeof _kv> {
  return tryLoadKv();
}

// Periodic in-memory cleanup
if (typeof setInterval !== "undefined") {
  const t = setInterval(() => {
    const now = Date.now();
    for (const [k, e] of _store) {
      if (e.exp > 0 && now > e.exp) _store.delete(k);
    }
  }, 60_000);
  if (typeof (t as { unref?: () => void }).unref === "function") {
    (t as { unref?: () => void }).unref();
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function hashKey(key: string): string {
  // Bound the in-memory key length to keep memory & sweep fast
  return createHash("sha1").update(key).digest("hex").slice(0, 24);
}

function memKey(key: string): string {
  return hashKey(key);
}

function setMem(key: string, value: unknown, exSeconds?: number): void {
  const exp = exSeconds && exSeconds > 0 ? Date.now() + exSeconds * 1000 : 0;
  _store.set(memKey(key), { value, exp });
}

function getMem(key: string): unknown | null {
  const e = _store.get(memKey(key));
  if (!e) return null;
  if (e.exp > 0 && Date.now() > e.exp) {
    _store.delete(memKey(key));
    return null;
  }
  return e.value;
}

function incrMem(key: string, by: number): number {
  const cur = Number(getMem(key)) || 0;
  const next = cur + by;
  // Preserve existing TTL by re-reading the entry; simplistic — re-set with same
  // exp horizon: we just re-set with the same remaining if known
  const e = _store.get(memKey(key));
  const exp = e?.exp ?? 0;
  _store.set(memKey(key), { value: next, exp });
  return next;
}

function pushListMem(key: string, value: unknown, maxLen = 1000): void {
  const cur = (getMem(key) as unknown[] | undefined) ?? [];
  if (!Array.isArray(cur)) return;
  cur.unshift(value);
  // Trim
  while (cur.length > maxLen) cur.pop();
  const e = _store.get(memKey(key));
  _store.set(memKey(key), { value: cur, exp: e?.exp ?? 0 });
}

function rangeListMem(key: string, start: number, stop: number): unknown[] {
  const cur = (getMem(key) as unknown[] | undefined) ?? [];
  if (!Array.isArray(cur)) return [];
  const end = stop < 0 ? cur.length + stop + 1 : stop + 1;
  return cur.slice(start, end);
}

function addSetMem(key: string, member: string): number {
  const cur = (getMem(key) as Set<string> | undefined) ?? new Set<string>();
  if (!(cur instanceof Set)) return 0;
  const before = cur.size;
  cur.add(member);
  const e = _store.get(memKey(key));
  _store.set(memKey(key), { value: cur, exp: e?.exp ?? 0 });
  return cur.size - before;
}

function setSetMem(key: string): string[] {
  const cur = getMem(key);
  if (cur instanceof Set) return Array.from(cur);
  return [];
}

// ─── Public typed API ───────────────────────────────────────────────────────

export async function kvGet<T>(key: string): Promise<T | null> {
  const kv = await getKv();
  if (kv) {
    try {
      const v = await kv.get(key);
      return (v as T) ?? null;
    } catch {
      // fall through to memory
    }
  }
  return (getMem(key) as T | null) ?? null;
}

export async function kvSet(key: string, value: unknown, exSeconds?: number): Promise<void> {
  const kv = await getKv();
  if (kv) {
    try {
      await kv.set(key, value as never, exSeconds ? { ex: exSeconds } : undefined);
      return;
    } catch {
      // fall through
    }
  }
  setMem(key, value, exSeconds);
}

export async function kvDel(key: string): Promise<void> {
  const kv = await getKv();
  if (kv) {
    try {
      await kv.del(key);
      return;
    } catch {
      // fall through
    }
  }
  _store.delete(memKey(key));
}

export async function kvIncrBy(key: string, by: number, exSeconds?: number): Promise<number> {
  const kv = await getKv();
  if (kv) {
    try {
      const v = await kv.incrby(key, by);
      if (exSeconds) await kv.expire?.(key, exSeconds);
      return Number(v) || 0;
    } catch {
      // fall through
    }
  }
  // Initialize with TTL if not present
  if (getMem(key) === null && exSeconds) {
    setMem(key, 0, exSeconds);
  }
  return incrMem(key, by);
}

export async function kvZadd(
  key: string,
  score: number,
  member: string,
  exSeconds?: number,
): Promise<void> {
  const kv = await getKv();
  if (kv && typeof kv.zadd === "function") {
    try {
      await kv.zadd(key, score, member);
      if (exSeconds) await kv.expire?.(key, exSeconds);
      return;
    } catch {
      // fall through
    }
  }
  // Memory fallback: maintain a sorted array of [score, member]
  const cur = (getMem(key) as Array<[number, string]> | undefined) ?? [];
  const filtered = cur.filter(([, m]) => m !== member);
  filtered.push([score, member]);
  filtered.sort((a, b) => b[0] - a[0]);
  if (exSeconds) setMem(key, filtered.slice(0, 1000), exSeconds);
  else setMem(key, filtered.slice(0, 1000));
}

export async function kvLpush(
  key: string,
  value: string,
  exSeconds?: number,
): Promise<number> {
  const kv = await getKv();
  if (kv && typeof kv.lpush === "function") {
    try {
      const v = await kv.lpush(key, value);
      if (exSeconds) await kv.expire?.(key, exSeconds);
      return Number(v) || 0;
    } catch {
      // fall through
    }
  }
  if (getMem(key) === null && exSeconds) setMem(key, [], exSeconds);
  pushListMem(key, value);
  return ((getMem(key) as unknown[]).length) || 0;
}

export async function kvLrange<T>(key: string, start: number, stop: number): Promise<T[]> {
  const kv = await getKv();
  if (kv && typeof kv.lrange === "function") {
    try {
      const v = (await kv.lrange(key, start, stop)) as T[];
      return v ?? [];
    } catch {
      // fall through
    }
  }
  return (rangeListMem(key, start, stop) as T[]) ?? [];
}

/** Read a sorted set range (zrange with REV so newest first). */
export async function kvZrevrange<T>(key: string, start: number, stop: number): Promise<T[]> {
  const kv = await getKv();
  if (kv && typeof kv.zrange === "function") {
    try {
      // Upstash @vercel/kv supports { rev: true } for reverse order
      const v = (await (kv.zrange as (k: string, s: number, e: number, o?: { rev?: boolean }) => Promise<unknown[]>)(key, start, stop, { rev: true })) as T[];
      return v ?? [];
    } catch {
      // fall through
    }
  }
  // Memory fallback — read the in-memory sorted array
  const mem = getMem(key);
  if (!Array.isArray(mem)) return [];
  const sliced = mem.slice(start, stop < 0 ? mem.length + stop + 1 : stop + 1) as Array<[number, T]>;
  return sliced.map(([, m]) => m);
}

export async function kvLlen(key: string): Promise<number> {
  const kv = await getKv();
  if (kv && typeof kv.llen === "function") {
    try {
      const v = await kv.llen(key);
      return Number(v) || 0;
    } catch {
      // fall through
    }
  }
  const v = getMem(key);
  if (Array.isArray(v)) return v.length;
  return 0;
}

export async function kvSmembers(key: string): Promise<string[]> {
  const kv = await getKv();
  if (kv && typeof kv.smembers === "function") {
    try {
      const v = await kv.smembers(key);
      return v ?? [];
    } catch {
      // fall through
    }
  }
  return setSetMem(key);
}

export async function kvSadd(
  key: string,
  member: string,
  exSeconds?: number,
): Promise<number> {
  const kv = await getKv();
  if (kv && typeof kv.sadd === "function") {
    try {
      const v = await kv.sadd(key, member);
      if (exSeconds) await kv.expire?.(key, exSeconds);
      return Number(v) || 0;
    } catch {
      // fall through
    }
  }
  if (getMem(key) === null && exSeconds) setMem(key, new Set(), exSeconds);
  return addSetMem(key, member);
}

export async function kvExpire(key: string, exSeconds: number): Promise<void> {
  const kv = await getKv();
  if (kv && typeof kv.expire === "function") {
    try {
      await kv.expire(key, exSeconds);
      return;
    } catch {
      // fall through
    }
  }
  // Memory: re-write entry with new exp
  const cur = getMem(key);
  if (cur !== null) setMem(key, cur, exSeconds);
}

export async function kvScan(match: string, count = 100): Promise<string[]> {
  const kv = await getKv();
  if (kv && typeof kv.scan === "function") {
    try {
      const out: string[] = [];
      let cursor = 0;
      do {
        const [next, keys] = await kv.scan(cursor, { match, count });
        cursor = Number(next) || 0;
        if (Array.isArray(keys)) out.push(...keys);
      } while (cursor !== 0);
      return out;
    } catch {
      // fall through
    }
  }
  // Memory fallback: scan local keys (we lose the original key string but can match by stored value)
  const needle = match.replace(/\*/g, "");
  const out: string[] = [];
  for (const k of _store.keys()) {
    if (!match.includes("*") || k.includes(needle)) out.push(k);
    if (out.length >= count) break;
  }
  return out;
}

/** Hard-clear the in-memory fallback only (test helper). */
export function _resetMemory(): void {
  _store.clear();
}

/** Visible for tests. */
export function _memorySize(): number {
  return _store.size;
}
