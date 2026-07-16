import { kvGet, kvSet } from "./kv";

const API_BASE = "https://api.gumroad.com/v2";
const ACCESS_CACHE_KEY = "ops:gumroad:sales-access";
const ACCESS_CACHE_TTL_S = 15 * 60;

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
  created_at?: string;
  sale_timestamp?: string;
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

async function gumroadRequest<T>(path: string, query: Record<string, string> = {}): Promise<GumroadApiResult<T>> {
  const token = accessToken();
  if (!token) return { ok: false, status: 503, body: null, detail: "GUMROAD_ACCESS_TOKEN missing" };

  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("access_token", token);
  for (const [key, value] of Object.entries(query)) {
    if (value) url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "AIKAGAN-ProfitOS/1.0" },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const parsed = (await response.json().catch(() => null)) as T | null;
    return {
      ok: response.ok,
      status: response.status,
      body: parsed,
      detail: response.ok ? undefined : `Gumroad API HTTP ${response.status}`,
    };
  } catch (error) {
    return { ok: false, status: 503, body: null, detail: error instanceof Error ? error.message : String(error) };
  }
}

export function isGumroadApiConfigured(): boolean {
  return Boolean(accessToken());
}

export async function listGumroadSales(options: {
  after?: string;
  before?: string;
  pageKey?: string;
} = {}): Promise<{
  ok: boolean;
  sales: GumroadSale[];
  nextPageKey?: string;
  detail?: string;
}> {
  const result = await gumroadRequest<any>("/sales", {
    after: options.after ?? "",
    before: options.before ?? "",
    page_key: options.pageKey ?? "",
  });
  if (!result.ok || (result.body as any)?.success === false) {
    return { ok: false, sales: [], detail: result.detail ?? "Could not list Gumroad sales" };
  }
  const sales = Array.isArray((result.body as any)?.sales) ? (result.body as any).sales as GumroadSale[] : [];
  const nextPageKey = String((result.body as any)?.next_page_key ?? "").trim() || undefined;
  return { ok: true, sales, nextPageKey };
}

export async function verifyGumroadSalesAccess(): Promise<{ ready: boolean; detail?: string }> {
  if (!isGumroadApiConfigured()) return { ready: false, detail: "GUMROAD_ACCESS_TOKEN missing" };
  const cached = await kvGet<{ ready: boolean; checkedAt: number }>(ACCESS_CACHE_KEY).catch(() => null);
  if (cached?.ready && Date.now() - cached.checkedAt < ACCESS_CACHE_TTL_S * 1000) return { ready: true };

  const after = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const result = await listGumroadSales({ after });
  if (!result.ok) return { ready: false, detail: result.detail };
  await kvSet(ACCESS_CACHE_KEY, { ready: true, checkedAt: Date.now() }, ACCESS_CACHE_TTL_S).catch(() => undefined);
  return { ready: true };
}

export async function verifyGumroadSale(saleId: string): Promise<{ verified: boolean; sale: GumroadSale | null; detail?: string }> {
  if (!saleId) return { verified: false, sale: null, detail: "Missing sale ID" };

  const direct = await gumroadRequest<any>(`/sales/${encodeURIComponent(saleId)}`);
  let sale = direct.ok
    ? ((direct.body as any)?.sale ?? (direct.body as any)?.purchase ?? direct.body) as GumroadSale | null
    : null;

  if (!sale && direct.status === 404) {
    const after = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    let pageKey: string | undefined;
    for (let page = 0; page < 5; page += 1) {
      const listed = await listGumroadSales({ after, pageKey });
      if (!listed.ok) return { verified: false, sale: null, detail: listed.detail };
      sale = listed.sales.find((candidate) => String(candidate.id ?? candidate.sale_id ?? "") === saleId) ?? null;
      if (sale || !listed.nextPageKey) break;
      pageKey = listed.nextPageKey;
    }
  }

  if (!sale) return { verified: false, sale: null, detail: direct.detail ?? "Sale lookup failed" };
  const resolvedId = String(sale.id ?? sale.sale_id ?? "");
  if (resolvedId && resolvedId !== saleId) return { verified: false, sale: null, detail: "Sale ID mismatch" };
  if (sale.refunded || sale.disputed || sale.chargebacked || sale.chargebacked_at) {
    return { verified: false, sale: null, detail: "Sale is refunded or disputed" };
  }
  return { verified: true, sale };
}
