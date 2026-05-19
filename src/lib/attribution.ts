/**
 * Attribution utility — captures UTM params and ref on page load,
 * persists to sessionStorage, and appends them to checkout URLs.
 *
 * Usage (in a Client Component):
 *   import { initAttribution, appendAttribution } from "@/src/lib/attribution";
 *
 *   // Call once in a layout or root component:
 *   useEffect(() => initAttribution(), []);
 *
 *   // Append to any checkout URL:
 *   const url = appendAttribution(checkoutUrl);
 */

const STORAGE_KEY = "autonomax_attribution";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "ref",
  "click_id",
] as const;

export type AttributionData = Partial<Record<typeof UTM_KEYS[number], string>>;

/** Read UTM params from the current URL and persist to sessionStorage. */
export function initAttribution(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const current: AttributionData = {};
  for (const key of UTM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) current[key] = val;
  }
  if (Object.keys(current).length === 0) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // sessionStorage unavailable (private browsing on some Safari versions)
  }
}

/** Retrieve stored attribution data. */
export function getAttribution(): AttributionData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Append attribution params to a checkout URL.
 * Preserves any existing query params in the URL.
 */
export function appendAttribution(checkoutUrl: string): string {
  if (!checkoutUrl) return checkoutUrl;
  const attrs = getAttribution();
  if (Object.keys(attrs).length === 0) return checkoutUrl;
  try {
    const url = new URL(checkoutUrl);
    for (const [key, val] of Object.entries(attrs)) {
      if (val && !url.searchParams.has(key)) {
        url.searchParams.set(key, val);
      }
    }
    // Always tag the source as aikagan
    if (!url.searchParams.has("ref")) url.searchParams.set("ref", "aikagan");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/**
 * Fire a non-blocking attribution event to the revenue ops backend.
 * Called when a user clicks a checkout CTA.
 */
export function trackCheckoutIntent(slug: string): void {
  if (typeof window === "undefined") return;
  const attrs = getAttribution();
  const payload = {
    event: "checkout_intent",
    slug,
    source: "aikagan",
    url: window.location.href,
    ...attrs,
    timestamp: new Date().toISOString(),
  };
  // Non-blocking — use sendBeacon so it fires even on navigation
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/revenue-ops/api/mission/tick", JSON.stringify(payload));
  } else {
    fetch("/api/revenue-ops/api/mission/tick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}
