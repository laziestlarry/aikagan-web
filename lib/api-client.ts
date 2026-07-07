/**
 * Frontend API client for the Aikagan dashboard.
 *
 * Lightweight wrapper around fetch with:
 *  - Timeout support
 *  - Consistent error response shape
 *  - Single place to change base URL / version prefix
 */

const API_BASE = ""; // relative — proxied through Vercel

export interface ApiResult<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}

/**
 * Fetch JSON from an API endpoint with a timeout.
 *
 * Example:
 *   const { data } = await api<DashboardPayload>("/api/revenue-ops/api/dashboard");
 */
export async function api<T = unknown>(
  path: string,
  options?: { method?: string; body?: unknown; timeoutMs?: number },
): Promise<ApiResult<T>> {
  const { method = "GET", body, timeoutMs = 10_000 } = options ?? {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, data: null, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }

    const data = (await res.json()) as T;
    return { ok: true, data, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, data: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}
