/**
 * Shared token store for Paddle transactions.
 *
 * Populated by:  POST /api/webhooks/paddle   (on transaction.completed)
 *                  or  GET /api/session-token  (direct Paddle API fallback)
 * Consumed by:   GET  /api/session-token       (success page polling)
 *
 * Storage layers (tried in order):
 *   1. Vercel KV  — persists across serverless instances (best for production)
 *   2. In-memory  — single-instance fallback (local dev / hobby plan)
 *
 * Keys are namespaced as "paddle:txn:<transactionId>".
 * TTL: 48 hours (matches download token expiry).
 */

import type { TokenRecord } from "./token-store.types";

export type { TokenRecord };

const KV_PREFIX = "paddle:txn:";
const TTL_S = 48 * 60 * 60; // 48 hours

let _kv: { get: Function; set: Function; del: Function } | null = null;

/**
 * Lazily load @vercel/kv so it is never imported at module scope.
 * This keeps the build working when KV env vars are not set.
 */
async function getKv() {
  if (_kv) return _kv;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      _kv = kv;
    }
  } catch {
    // @vercel/kv not installed or unavailable — use in-memory fallback
  }
  return _kv;
}

// ── In-memory fallback ─────────────────────────────────────────────────────

const _memoryStore = new Map<string, TokenRecord>();

// Periodic cleanup of expired entries (runs every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of _memoryStore) {
      if (now > record.exp) _memoryStore.delete(key);
    }
  }, 300_000).unref();
}

// ── Public API ─────────────────────────────────────────────────────────────

export const tokenStore = {
  /**
   * Retrieve a token record. Checks KV first, falls back to in-memory.
   */
  get: async (transactionId: string): Promise<TokenRecord | undefined> => {
    const kv = await getKv();
    if (kv) {
      try {
        const record = await kv.get(`${KV_PREFIX}${transactionId}`);
        if (record) return record as TokenRecord;
      } catch {
        // KV error — fall through to memory
      }
    }
    return _memoryStore.get(transactionId);
  },

  /**
   * Store a token record. Writes to KV (if available) and in-memory.
   */
  set: async (transactionId: string, record: TokenRecord): Promise<void> => {
    // Always write to in-memory for instant local access
    _memoryStore.set(transactionId, record);

    const kv = await getKv();
    if (kv) {
      try {
        await kv.set(`${KV_PREFIX}${transactionId}`, record, { ex: TTL_S });
      } catch {
        // Non-blocking — in-memory copy is sufficient for current request
      }
    }
  },

  /**
   * Delete a token record from both stores.
   */
  delete: async (transactionId: string): Promise<void> => {
    _memoryStore.delete(transactionId);
    const kv = await getKv();
    if (kv) {
      try {
        await kv.del(`${KV_PREFIX}${transactionId}`);
      } catch {
        // Non-blocking
      }
    }
  },
};
