const DEFAULT_SITE_ORIGIN = "https://aikagan.com";
export const PADDLE_CHECKOUT_ORIGIN = "https://app.aikagan.com";

export const FIRST_PARTY_HOSTS = new Set([
  "aikagan.com",
  "www.aikagan.com",
  "app.aikagan.com",
  "checkout.aikagan.com",
  "localhost",
  "127.0.0.1",
]);

export function safeOrigin(value?: string | null, fallback = DEFAULT_SITE_ORIGIN): string {
  const raw = value?.trim();
  if (!raw) return new URL(fallback).origin;
  try {
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(normalized);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("unsupported protocol");
    return url.origin;
  } catch {
    return new URL(fallback).origin;
  }
}

export function canonicalSiteOrigin(requestOrigin?: string | null): string {
  return safeOrigin(process.env.NEXT_PUBLIC_SITE_URL, safeOrigin(requestOrigin, DEFAULT_SITE_ORIGIN));
}

export function paddleCheckoutOrigin(): string {
  return safeOrigin(process.env.NEXT_PUBLIC_PADDLE_CHECKOUT_BASE_URL, PADDLE_CHECKOUT_ORIGIN);
}

export function isFirstPartyCommerceHost(hostname: string): boolean {
  return FIRST_PARTY_HOSTS.has(hostname.toLowerCase());
}
