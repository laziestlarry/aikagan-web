/**
 * Webhook idempotency — tracks provider events after successful processing.
 *
 * Provider retries must remain retryable until the critical order path has
 * completed. Marking an event before ledger/fulfillment work finishes can turn
 * a transient failure into a permanently paid-but-unfulfilled order.
 *
 * Storage: in-memory Map (fast) + Vercel KV (durable when configured). Event
 * IDs are kept for 7 days, which is longer than the normal provider retry
 * window.
 */

const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const _seen = new Map<string, number>(); // eventId → expiresAt

let _kv: { get: Function; set: Function } | null = null;

async function getKv() {
  if (_kv) return _kv;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      _kv = kv;
    }
  } catch {
    // ignore — callers still have in-memory protection
  }
  return _kv;
}

function cleanup() {
  const now = Date.now();
  for (const [id, exp] of _seen) {
    if (now > exp) _seen.delete(id);
  }
}

if (typeof setInterval !== "undefined") {
  const t = setInterval(cleanup, 60_000);
  if (typeof (t as { unref?: () => void }).unref === "function") {
    (t as { unref?: () => void }).unref();
  }
}

/** Read-only duplicate check. Does not consume the provider retry. */
export async function hasProcessedEvent(provider: string, eventId: string): Promise<boolean> {
  if (!eventId) return false;
  const key = `${provider}:${eventId}`;
  const now = Date.now();

  const exp = _seen.get(key);
  if (exp && now < exp) return true;

  const kv = await getKv();
  if (kv) {
    try {
      const stored = (await kv.get(`webhook:${key}`)) as string | null;
      if (stored) {
        _seen.set(key, now + TTL_MS);
        return true;
      }
    } catch {
      // A failed dedup lookup must not block a legitimate provider retry.
    }
  }
  return false;
}

/** Persist completion only after the caller's critical processing succeeds. */
export async function markEventProcessed(provider: string, eventId: string): Promise<void> {
  if (!eventId) return;
  const key = `${provider}:${eventId}`;
  const now = Date.now();

  _seen.set(key, now + TTL_MS);
  const kv = await getKv();
  if (kv) {
    try {
      await kv.set(`webhook:${key}`, "1", { ex: TTL_MS / 1000 });
    } catch {
      // In-memory dedup still protects this warm instance. Provider-side
      // transaction IDs and downstream ledgers provide the second guard.
    }
  }
}

/**
 * Backwards-compatible check-and-mark helper used by older webhook handlers.
 * New revenue-critical handlers should call hasProcessedEvent() first and
 * markEventProcessed() only after durable ledger + fulfillment work succeeds.
 */
export async function markEventIfNew(provider: string, eventId: string): Promise<boolean> {
  if (!eventId) return true;
  if (await hasProcessedEvent(provider, eventId)) return false;
  await markEventProcessed(provider, eventId);
  return true;
}
