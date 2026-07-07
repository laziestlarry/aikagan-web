/**
 * Typed KV wrapper with in-memory fallback.
 *
 * Resolution order (first match wins):
 *   1. Upstash Redis REST (KV_REST_API_URL + KV_REST_API_TOKEN env vars)
 *   2. Vercel KV (@vercel/kv SDK auto-loads from KV_* env vars)
 *   3. In-memory Map (single instance only, resets on cold-start)
 *
 * The income ledger, token store, webhook idempotency, and affiliate system
 * all share this single module so the rest of the codebase is provider-agnostic.
 */

import { createHash } from "node:crypto";

// ─── In-memory shim ──────────────────────────────────────────────────────────

interface Entry {
  value: unknown;
  exp: number;
}

const _store = new Map<string, Entry>();

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

function hashKey(key: string): string {
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
  const e = _store.get(memKey(key));
  _store.set(memKey(key), { value: next, exp: e?.exp ?? 0 });
  return next;
}
function pushListMem(key: string, value: unknown, maxLen = 1000): void {
  const cur = (getMem(key) as unknown[] | undefined) ?? [];
  if (!Array.isArray(cur)) return;
  cur.unshift(value);
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

// ─── Upstash Redis REST client (the new fast path) ───────────────────────────

/**
 * Direct Upstash REST client. Avoids @vercel/kv's Vercel-KV-only assumptions
 * and works with the free tier on Upstash's hosted control plane.
 *
 * Auth: Authorization: Bearer <KV_REST_API_TOKEN>
 * Body: pipeline as JSON array of [command, ...args] tuples
 * Response: { result: [per-command results] } or  { error: ... }
 *
 * Reference: https://upstash.com/docs/redis/api/rest
 */

interface UpstashClient {
  readonly type: "upstash";
  pipeline<T = unknown>(commands: unknown[][]): Promise<T[]>;
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ex?: number): Promise<unknown>;
  del(key: string): Promise<number>;
  incrby(key: string, n: number): Promise<number>;
  expire(key: string, sec: number): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<number>;
  zincrby(key: string, score: number, member: string): Promise<number>;
  zrange(key: string, start: number, stop: number, opts?: { rev?: boolean }): Promise<string[]>;
  lpush(key: string, value: string): Promise<number>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  llen(key: string): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  scan(cursor: number, match: string, count: number): Promise<[number, string[]]>;
  /** Test connectivity — used by /api/health */
  ping(): Promise<boolean>;
}

let _upstash: UpstashClient | null = null;
let _upstashChecked = false;

async function tryLoadUpstash(): Promise<UpstashClient | null> {
  if (_upstashChecked) return _upstash;
  _upstashChecked = true;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  // Permissive readiness: any successful HTTP response (even an empty one)
  // means the URL+auth work. Reads/writes will fall back to memory if
  // individual operations fail. This avoids false negatives from PING
  // or single-command round-trips that may be flaky on the free tier.
  try {
    const probeRes = await fetch(`${url.replace(/\/+$/, "")}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["PING"]]),
      cache: "no-store",
    });
    if (!probeRes.ok && probeRes.status !== 0) {
      // Allow 0 (network) and 5xx (server) — try the client anyway;
      // ops will fall back per-call.
      _upstash = makeUpstashClient(url, token);
      return _upstash;
    }
    _upstash = makeUpstashClient(url, token);
    return _upstash;
  } catch {
    _upstash = makeUpstashClient(url, token);
    return _upstash;
  }
}

function makeUpstashClient(url: string, token: string): UpstashClient {
  const endpoint = url.replace(/\/+$/, "");
  async function call<T = unknown>(commands: unknown[][]): Promise<T[]> {
    // Upstash REST API /pipeline returns an array of { result: <value> }
    // objects — one per command. We unwrap each to the inner value.
    const r = await fetch(`${endpoint}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      throw new Error(`upstash ${r.status}: ${text.slice(0, 200)}`);
    }
    const out = (await r.json()) as unknown;
    if (!Array.isArray(out)) {
      if (out && typeof out === "object" && "error" in (out as Record<string, unknown>)) {
        throw new Error(`upstash: ${(out as { error?: string }).error}`);
      }
      return [];
    }
    // Each item is { result: <value> } or { error: "..." } or null (for SET).
    return out.map((item) => {
      if (item === null || item === undefined) return item as T;
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        if ("error" in obj) {
          // Per-command error — return null so caller knows
          return null as T;
        }
        if ("result" in obj) {
          // Unwrap the { result: <value> } envelope
          return obj.result as T;
        }
      }
      return item as T;
    });
  }
  async function callOne<T = unknown>(cmd: unknown[]): Promise<T> {
    const out = await call<T>([cmd]);
    return out[0] as T;
  }
  function valToUpstashString(v: unknown): string {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return JSON.stringify(v);
  }
  function coerce<T>(v: unknown): T {
    if (typeof v === "string") {
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as unknown as T;
      }
    }
    return v as T;
  }
  return {
    type: "upstash",
    pipeline: call,
    async get<T>(key: string) {
      const r = await callOne<T | null>(["GET", key]);
      if (r === null || r === undefined) return null;
      // Upstash JSON-parses objects; primitives come back as strings.
      if (typeof r === "string") {
        try {
          return JSON.parse(r) as T;
        } catch {
          return r as unknown as T;
        }
      }
      return r;
    },
    async set(key, value, ex) {
      const v = valToUpstashString(value);
      if (ex && ex > 0) return callOne(["SET", key, v, "EX", String(ex)]);
      return callOne(["SET", key, v]);
    },
    async del(key) {
      return callOne<number>(["DEL", key]);
    },
    async incrby(key, n) {
      return callOne<number>(["INCRBY", key, String(n)]);
    },
    async expire(key, sec) {
      return callOne<number>(["EXPIRE", key, String(sec)]);
    },
    async zadd(key, score, member) {
      return callOne<number>(["ZADD", key, String(score), member]);
    },
    async zincrby(key, score, member) {
      return callOne<number>(["ZINCRBY", key, String(score), member]);
    },
    async zrange(key, start, stop, opts) {
      const cmd = ["ZRANGE", key, String(start), String(stop)];
      if (opts?.rev) cmd.push("REV");
      return callOne<string[]>(cmd);
    },
    async lpush(key, value) {
      return callOne<number>(["LPUSH", key, value]);
    },
    async lrange(key, start, stop) {
      return callOne<string[]>(["LRANGE", key, String(start), String(stop)]);
    },
    async llen(key) {
      return callOne<number>(["LLEN", key]);
    },
    async sadd(key, ...members) {
      return callOne<number>(["SADD", key, ...members]);
    },
    async smembers(key) {
      return callOne<string[]>(["SMEMBERS", key]);
    },
    async scan(cursor, match, count) {
      return callOne<[number, string[]]>(["SCAN", String(cursor), "MATCH", match, "COUNT", String(count)]);
    },
    async ping() {
      const r = await callOne<string>(["PING"]);
      return r === "PONG";
    },
  };
}

// ─── Vercel KV client (kept for Pro-plan users) ──────────────────────────────

interface VercelKvClient {
  readonly type: "vercel";
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
}

let _vercel: VercelKvClient | null = null;
let _vercelChecked = false;

async function tryLoadVercel(): Promise<VercelKvClient | null> {
  if (_vercelChecked) return _vercel;
  _vercelChecked = true;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      // Only attempt @vercel/kv if the URL doesn't look like Upstash
      // (Upstash URLs end in .upstash.io; Vercel KV URLs are different)
      const url = process.env.KV_REST_API_URL;
      if (!url.endsWith(".upstash.io")) {
        const { kv } = await import("@vercel/kv");
        _vercel = kv as unknown as VercelKvClient;
      }
    }
  } catch {
    _vercel = null;
  }
  return _vercel;
}

// ─── Public: getKv() returns whichever client is available ──────────────────

export type AnyKvClient = UpstashClient | VercelKvClient | null;

export async function getKv(): Promise<AnyKvClient> {
  // Upstash first (most common with KV_REST_API_*)
  const u = await tryLoadUpstash();
  if (u) return u;
  return await tryLoadVercel();
}

// ─── Public typed API (auto-routes to whichever client is configured) ───────

export async function kvGet<T>(key: string): Promise<T | null> {
  const kv = await getKv();
  if (kv) {
    try {
      if (kv.type === "upstash") {
        return (await (kv as UpstashClient).get<T>(key)) ?? null;
      }
      const v = await (kv as VercelKvClient).get(key);
      return (v as T) ?? null;
    } catch {
      // fall through
    }
  }
  return (getMem(key) as T | null) ?? null;
}

export async function kvSet(key: string, value: unknown, exSeconds?: number): Promise<void> {
  const kv = await getKv();
  if (kv) {
    try {
      if (kv.type === "upstash") {
        await (kv as UpstashClient).set(key, value, exSeconds);
        return;
      }
      await (kv as VercelKvClient).set(
        key,
        value as never,
        exSeconds ? { ex: exSeconds } : undefined,
      );
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
      if (kv.type === "upstash") {
        await (kv as UpstashClient).del(key);
        return;
      }
      await (kv as VercelKvClient).del(key);
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
      if (kv.type === "upstash") {
        const v = await (kv as UpstashClient).incrby(key, by);
        if (exSeconds) await (kv as UpstashClient).expire(key, exSeconds);
        return Number(v) || 0;
      }
      const v = await (kv as VercelKvClient).incrby(key, by);
      if (exSeconds) await (kv as VercelKvClient).expire?.(key, exSeconds);
      return Number(v) || 0;
    } catch {
      // fall through
    }
  }
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
  if (kv) {
    try {
      if (kv.type === "upstash") {
        await (kv as UpstashClient).zadd(key, score, member);
        if (exSeconds) await (kv as UpstashClient).expire(key, exSeconds);
        return;
      }
      await (kv as VercelKvClient).zadd?.(key, score, member);
      if (exSeconds) await (kv as VercelKvClient).expire?.(key, exSeconds);
      return;
    } catch {
      // fall through
    }
  }
  const cur = (getMem(key) as Array<[number, string]> | undefined) ?? [];
  const filtered = cur.filter(([, m]) => m !== member);
  filtered.push([score, member]);
  filtered.sort((a, b) => b[0] - a[0]);
  setMem(key, filtered.slice(0, 1000), exSeconds);
}

export async function kvLpush(
  key: string,
  value: string,
  exSeconds?: number,
): Promise<number> {
  const kv = await getKv();
  if (kv) {
    try {
      if (kv.type === "upstash") {
        const v = await (kv as UpstashClient).lpush(key, value);
        if (exSeconds) await (kv as UpstashClient).expire(key, exSeconds);
        return Number(v) || 0;
      }
      const v = await (kv as VercelKvClient).lpush?.(key, value);
      if (exSeconds) await (kv as VercelKvClient).expire?.(key, exSeconds);
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
  if (kv) {
    try {
      if (kv.type === "upstash") {
        const v = await (kv as UpstashClient).lrange(key, start, stop);
        return (v as T[]) ?? [];
      }
      const v = (await (kv as VercelKvClient).lrange?.(key, start, stop)) as T[];
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
  if (kv) {
    try {
      if (kv.type === "upstash") {
        const v = await (kv as UpstashClient).zrange(key, start, stop, { rev: true });
        return (v as T[]) ?? [];
      }
      const vc = kv as VercelKvClient;
      let v: T[] | undefined;
      if (vc.zrange) {
        const fn = vc.zrange as unknown as (
          k: string,
          s: number,
          e: number,
          o?: { rev?: boolean },
        ) => Promise<T[]>;
        v = await fn(key, start, stop, { rev: true });
      }
      return v ?? [];
    } catch {
      // fall through
    }
  }
  const mem = getMem(key);
  if (!Array.isArray(mem)) return [];
  const sliced = mem.slice(start, stop < 0 ? mem.length + stop + 1 : stop + 1) as Array<[number, T]>;
  return sliced.map(([, m]) => m);
}

export async function kvLlen(key: string): Promise<number> {
  const kv = await getKv();
  if (kv) {
    try {
      if (kv.type === "upstash") {
        return Number(await (kv as UpstashClient).llen(key)) || 0;
      }
      return Number(await (kv as VercelKvClient).llen?.(key)) || 0;
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
  if (kv) {
    try {
      if (kv.type === "upstash") {
        return (await (kv as UpstashClient).smembers(key)) ?? [];
      }
      return (await (kv as VercelKvClient).smembers?.(key)) ?? [];
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
  if (kv) {
    try {
      if (kv.type === "upstash") {
        const v = await (kv as UpstashClient).sadd(key, member);
        if (exSeconds) await (kv as UpstashClient).expire(key, exSeconds);
        return Number(v) || 0;
      }
      const v = await (kv as VercelKvClient).sadd?.(key, member);
      if (exSeconds) await (kv as VercelKvClient).expire?.(key, exSeconds);
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
  if (kv) {
    try {
      if (kv.type === "upstash") {
        await (kv as UpstashClient).expire(key, exSeconds);
        return;
      }
      await (kv as VercelKvClient).expire?.(key, exSeconds);
      return;
    } catch {
      // fall through
    }
  }
  const cur = getMem(key);
  if (cur !== null) setMem(key, cur, exSeconds);
}

export async function kvScan(match: string, count = 100): Promise<string[]> {
  const kv = await getKv();
  if (kv) {
    try {
      if (kv.type === "upstash") {
        const out: string[] = [];
        let cursor = 0;
        do {
          const [next, keys] = await (kv as UpstashClient).scan(cursor, match, count);
          cursor = Number(next) || 0;
          if (Array.isArray(keys)) out.push(...keys);
        } while (cursor !== 0);
        return out;
      }
      const out: string[] = [];
      let cursor = 0;
      do {
        const [next, keys] = (await (kv as VercelKvClient).scan?.(cursor, {
          match,
          count,
        })) ?? [0, []];
        cursor = Number(next) || 0;
        if (Array.isArray(keys)) out.push(...keys);
      } while (cursor !== 0);
      return out;
    } catch {
      // fall through
    }
  }
  const needle = match.replace(/\*/g, "");
  const out: string[] = [];
  for (const k of _store.keys()) {
    if (!match.includes("*") || k.includes(needle)) out.push(k);
    if (out.length >= count) break;
  }
  return out;
}

/**
 * Batch-write helper. Sends all commands in a single pipeline request to
 * Upstash (one HTTP round-trip). Falls back to per-key writes against the
 * in-memory store and (in best-effort) Vercel KV.
 *
 * Each command is an array: [op, ...args]. Supported ops for batched writes:
 *   - ["SET", key, value, "EX", seconds?]
 *   - ["INCRBY", key, n]
 *   - ["EXPIRE", key, seconds]
 *   - ["ZADD", key, score, member]
 *   - ["LPUSH", key, value]
 *   - ["SADD", key, member]
 *   - ["DEL", key]
 *
 * For memory fallback, the per-key write path is invoked sequentially.
 */
export type BatchOp =
  | ["SET", string, string | number, "EX", number]
  | ["INCRBY", string, number]
  | ["EXPIRE", string, number]
  | ["ZADD", string, number, string]
  | ["LPUSH", string, string]
  | ["SADD", string, string]
  | ["DEL", string];

export async function kvBatch(ops: BatchOp[]): Promise<void> {
  if (ops.length === 0) return;
  const kv = await getKv();
  if (kv) {
    try {
      if (kv.type === "upstash") {
        await (kv as UpstashClient).pipeline(ops);
        return;
      }
      // Vercel KV: fall back to sequential
      for (const op of ops) {
        const vc = kv as VercelKvClient;
        const cmd = op[0] as string;
        if (cmd === "SET") {
          await vc.set(op[1] as string, op[2] as unknown, { ex: op[4] as number });
        } else if (cmd === "INCRBY") {
          await vc.incrby(op[1] as string, op[2] as number);
        } else if (cmd === "EXPIRE") {
          await vc.expire?.(op[1] as string, op[2] as number);
        } else if (cmd === "ZADD") {
          await vc.zadd?.(op[1] as string, op[2] as number, op[3] as string);
        } else if (cmd === "LPUSH") {
          await vc.lpush?.(op[1] as string, op[2] as string);
        } else if (cmd === "SADD") {
          await vc.sadd?.(op[1] as string, op[2] as string);
        } else if (cmd === "DEL") {
          await vc.del(op[1] as string);
        }
      }
      return;
    } catch {
      // fall through to memory
    }
  }
  // Memory: write each op
  for (const op of ops) {
    const cmd = op[0] as string;
    if (cmd === "SET") {
      setMem(op[1] as string, op[2] as unknown, op[4] as number);
    } else if (cmd === "INCRBY") {
      incrMem(op[1] as string, op[2] as number);
    } else if (cmd === "EXPIRE") {
      const cur = getMem(op[1] as string);
      if (cur !== null) setMem(op[1] as string, cur, op[2] as number);
    } else if (cmd === "ZADD") {
      const cur = (getMem(op[1] as string) as Array<[number, string]> | undefined) ?? [];
      const filtered = cur.filter(([, m]) => m !== (op[3] as string));
      filtered.push([op[2] as number, op[3] as string]);
      filtered.sort((a, b) => b[0] - a[0]);
      setMem(op[1] as string, filtered.slice(0, 1000));
    } else if (cmd === "LPUSH") {
      const cur = (getMem(op[1] as string) as unknown[] | undefined) ?? [];
      if (Array.isArray(cur)) {
        cur.unshift(op[2] as string);
        while (cur.length > 1000) cur.pop();
        setMem(op[1] as string, cur);
      }
    } else if (cmd === "SADD") {
      addSetMem(op[1] as string, op[2] as string);
    } else if (cmd === "DEL") {
      _store.delete(memKey(op[1] as string));
    }
  }
}

export function _resetMemory(): void {
  _store.clear();
}

export function _memorySize(): number {
  return _store.size;
}
