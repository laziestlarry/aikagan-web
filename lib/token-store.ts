// ─────────────────────────────────────────────────────────────────────────────
// Shared in-memory token store for Paddle transactions.
//
// Populated by:  POST /api/webhooks/paddle  (on transaction.completed)
//                  or  GET /api/session-token  (direct Paddle API fallback)
// Consumed by:   GET  /api/session-token      (success page polling)
//
// For single-instance deployments this works fine. If you deploy to Vercel's
// multi-instance serverless, swap to an external KV store:
//   import { kv } from "@vercel/kv";
//   await kv.set(`paddle:txn:${transactionId}`, token, { ex: 86400 });
// ─────────────────────────────────────────────────────────────────────────────

export interface TokenRecord {
  token: string;
  slug: string;
  email: string;
  exp: number; // epoch ms
}

export const tokenStore = new Map<string, TokenRecord>();
