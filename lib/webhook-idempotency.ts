/**
 * Webhook idempotency — ensures each provider event is processed at most once.
 *
 * Paddle and LemonSqueezy both retry webhooks on non-2xx. Without dedup, a
 * retried webhook can:
 *   - Send the customer a duplicate "Order confirmed" email
 *   - Double-count an affiliate commission
 *   - Re-trigger the CAPI Purchase event (skewed attribution)
 *
 * Storage: in-memory Set (fast) + Vercel KV (durable). Event IDs are kept
 * for 7 days, which is longer than any reasonable provider retry window.
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
    // ignore
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

/** Check if an event has already been seen. Records it on first call. */
export async function markEventIfNew(provider: string, eventId: string): Promise<boolean> {
  if (!eventId) return true; // No event id — can't dedup, allow through
  const key = `${provider}:${eventId}`;
  const now = Date.now();

  // In-memory check (fast path)
  const exp = _seen.get(key);
  if (exp && now < exp) {
    return false; // already seen
  }

  // Try KV for cross-instance dedup
  const kv = await getKv();
  if (kv) {
    try {
      const stored = (await kv.get(`webhook:${key}`)) as string | null;
      if (stored) {
        _seen.set(key, now + TTL_MS);
        return false;
      }
    } catch {
      // fall through — allow and mark
    }
  }

  // First time we see this event
  _seen.set(key, now + TTL_MS);
  if (kv) {
    try {
      await kv.set(`webhook:${key}`, "1", { ex: TTL_MS / 1000 });
    } catch {
      // Non-blocking — in-memory dedup still protects
    }
  }
  return true;
}
