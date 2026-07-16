import { kvGet, kvSet } from "./kv";

const API_BASE = "https://api.gumroad.com/v2";
const SUBSCRIPTION_CACHE_KEY = "ops:gumroad:sale-subscription";
const SUBSCRIPTION_CACHE_TTL_S = 6 * 60 * 60;

export interface GumroadSale {
  id?: string;
  sale_id?: string;
  email?: string;
  purchaser_email?: string;
  full_name?: string;
  purchaser_name?: string;
  product_id?: string;
  product_permalink?: string;
  permalink?: string;
  product_name?: string;
  price?: number | string;
  currency?: string;
  refunded?: boolean;
  disputed?: boolean;
  chargebacked?: boolean;
  chargebacked_at?: string | null;
}

interface GumroadApiResult<T> {
  ok: boolean;
  status: number;
  body: T | null;
  detail?: string;
}

function accessToken(): string {
  return process.env.GUMROAD_ACCESS_TOKEN?.trim() ?? "";
}

async function gumroadRequest<T>(path: string, init: RequestInit = {}): Promise<GumroadApiResult<T>> {
  const token = accessToken();
  if (!token) return { ok: false, status: 503, body: null, detail: "GUMROAD_ACCESS_TOKEN missing" };

  const url = new URL(`${API_BASE}${path}`);
  const method = (init.method ?? "GET").toUpperCase();
  let body = init.body;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("User-Agent", "AIKAGAN-ProfitOS/1.0");

  if (method === "GET" || method === "DELETE") {
    url.searchParams.set("access_token", token);
  } else {
    const form = body instanceof URLSearchParams ? body : new URLSearchParams();
    form.set("access_token", token);
    body = form;
    headers.set("Content-Type", "application/x-www-form-urlencoded");
  }

  try {
    const response = await fetch(url, {
      ...init,
      method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const parsed = (await response.json().catch(() => null)) as T | null;
    return { ok: response.ok, status: response.status, body: parsed, detail: response.ok ? undefined : `Gumroad API HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, status: 503, body: null, detail: error instanceof Error ? error.message : String(error) };
  }
}

export function isGumroadApiConfigured(): boolean {
  return Boolean(accessToken());
}

export async function ensureGumroadSaleSubscription(postUrl: string): Promise<{ ready: boolean; created: boolean; detail?: string }> {
  if (!isGumroadApiConfigured()) return { ready: false, created: false, detail: "GUMROAD_ACCESS_TOKEN missing" };

  const cached = await kvGet<{ postUrl: string; verifiedAt: number }>(SUBSCRIPTION_CACHE_KEY).catch(() => null);
  if (cached?.postUrl === postUrl && Date.now() - cached.verifiedAt < SUBSCRIPTION_CACHE_TTL_S * 1000) {
    return { ready: true, created: false };
  }

  const listed = await gumroadRequest<any>("/resource_subscriptions");
  if (!listed.ok) return { ready: false, created: false, detail: listed.detail ?? "Could not list Gumroad subscriptions" };

  const subscriptions = Array.isArray((listed.body as any)?.resource_subscriptions)
    ? (listed.body as any).resource_subscriptions
    : Array.isArray(listed.body) ? listed.body : [];
  const existing = subscriptions.find((subscription: any) =>
    subscription?.resource_name === "sale" && subscription?.post_url === postUrl,
  );

  if (existing) {
    await kvSet(SUBSCRIPTION_CACHE_KEY, { postUrl, verifiedAt: Date.now() }, SUBSCRIPTION_CACHE_TTL_S).catch(() => undefined);
    return { ready: true, created: false };
  }

  const created = await gumroadRequest<any>("/resource_subscriptions", {
    method: "POST",
    body: new URLSearchParams({ resource_name: "sale", post_url: postUrl }),
  });
  if (!created.ok || (created.body as any)?.success === false) {
    return { ready: false, created: false, detail: created.detail ?? "Could not create Gumroad sale subscription" };
  }

  await kvSet(SUBSCRIPTION_CACHE_KEY, { postUrl, verifiedAt: Date.now() }, SUBSCRIPTION_CACHE_TTL_S).catch(() => undefined);
  return { ready: true, created: true };
}

export async function verifyGumroadSale(saleId: string): Promise<{ verified: boolean; sale: GumroadSale | null; detail?: string }> {
  if (!saleId) return { verified: false, sale: null, detail: "Missing sale ID" };
  const result = await gumroadRequest<any>(`/sales/${encodeURIComponent(saleId)}`);
  if (!result.ok || (result.body as any)?.success === false) {
    return { verified: false, sale: null, detail: result.detail ?? "Sale lookup failed" };
  }

  const sale = ((result.body as any)?.sale ?? (result.body as any)?.purchase ?? result.body) as GumroadSale | null;
  if (!sale) return { verified: false, sale: null, detail: "Sale payload missing" };
  const resolvedId = sale.id ?? sale.sale_id;
  if (resolvedId && resolvedId !== saleId) return { verified: false, sale: null, detail: "Sale ID mismatch" };
  if (sale.refunded || sale.disputed || sale.chargebacked || sale.chargebacked_at) {
    return { verified: false, sale: null, detail: "Sale is refunded or disputed" };
  }
  return { verified: true, sale };
}
