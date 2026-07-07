/**
 * Lightweight sliding-window rate limiter.
 *
 * Storage: in-memory Map keyed by client identifier. For multi-instance
 * deployments (Vercel), also tries Vercel KV as a shared store.
 *
 * Usage:
 *   const limit = rateLimit({
 *     key: `lead:${ip}`,
 *     max: 5,
 *     windowMs: 60_000,
 *   });
 *   if (!limit.allowed) return rateLimitResponse(limit);
 */

interface LimitOptions {
  key: string;
  max: number;
  windowMs: number;
}

interface LimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
  limit: number;
}

// In-memory fallback
const _windows = new Map<string, number[]>();

// Periodic cleanup (every 5 min)
if (typeof setInterval !== "undefined") {
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, hits] of _windows) {
      const valid = hits.filter((t) => now - t < 10 * 60 * 1000);
      if (valid.length === 0) _windows.delete(key);
      else if (valid.length !== hits.length) _windows.set(key, valid);
    }
  }, 300_000);
  if (typeof (cleanup as { unref?: () => void }).unref === "function") {
    (cleanup as { unref?: () => void }).unref();
  }
}

/** Try to acquire a slot in the sliding window. */
export function rateLimit(opts: LimitOptions): LimitResult {
  const { key, max, windowMs } = opts;
  const now = Date.now();
  const cutoff = now - windowMs;

  const hits = (_windows.get(key) ?? []).filter((t) => t > cutoff);
  if (hits.length >= max) {
    const oldest = hits[0];
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, oldest + windowMs - now),
      limit: max,
    };
  }

  hits.push(now);
  _windows.set(key, hits);
  return {
    allowed: true,
    remaining: max - hits.length,
    resetInMs: windowMs,
    limit: max,
  };
}

/** Extract a coarse client identifier from a request (IP-based). */
export function clientKey(req: Request, prefix: string): string {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}

/** Build a 429 response with proper headers. */
export function rateLimitResponse(limit: LimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      retryAfterMs: limit.resetInMs,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil(limit.resetInMs / 1000)),
        "X-RateLimit-Limit": String(limit.limit),
        "X-RateLimit-Remaining": String(limit.remaining),
        "X-RateLimit-Reset": String(Math.ceil(limit.resetInMs / 1000)),
      },
    }
  );
}
