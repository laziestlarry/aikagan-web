"use client";

import type { ReactNode } from "react";
import { trackCheckoutIntent, getAttribution } from "@/src/lib/attribution";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface Props {
  href: string | null;
  slug: string;
  price: number;
  children: ReactNode;
  className?: string;
}

function decorate(raw: string, slug: string): string {
  try {
    const u = new URL(raw);
    u.searchParams.set("checkout[custom][product_slug]", slug);
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://aikagan.com";
    u.searchParams.set("checkout[success_url]", `${origin}/checkout-success`);
    return u.toString();
  } catch {
    return raw;
  }
}

/**
 * Checkout CTA.
 *
 * Resolution order at click time:
 *   1. If `href` is a real URL (Paddle hosted checkout / LemonSqueezy overlay
 *      URL etc.), decorate it with success_url + product_slug and follow it.
 *   2. Otherwise (the typical case — `href` is the "paddle" sentinel),
 *      call /api/income/checkout synchronously. The endpoint always returns
 *      a working URL (Paddle first, then LS, then /checkout/manual).
 *   3. Fires Pixel InitiateCheckout + GTM dataLayer push + records the
 *      intent in the income ledger (server-side).
 */
export default function CheckoutButton({ href, slug, price, children, className }: Props) {
  const isRealHref = typeof href === "string" && href.startsWith("http");
  // Default href is a non-navigating sentinel; the click handler is the only
  // path that resolves a real checkout URL. This prevents the page from
  // accidentally navigating to /checkout/manual if JS is slow to hydrate.
  const finalHref = isRealHref
    ? decorate(href!, slug)
    : (typeof href === "string" && href.length > 0 ? href : "#");

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Always fire the browser pixel event
    window.fbq?.("track", "InitiateCheckout", {
      value: price,
      currency: "USD",
      content_ids: [slug],
      content_type: "product",
    });
    if (typeof window !== "undefined") {
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({
        event: "begin_checkout",
        value: price,
        currency: "USD",
        items: [{ item_id: slug, item_name: slug, price }],
      });
    }
    trackCheckoutIntent(slug);

    // If href is a hosted URL, let the browser navigate (LemonSqueezy overlay
    // is opened by the `lemonsqueezy-button` class; Paddle hosted checkout is
    // a normal navigation).
    if (isRealHref) return;

    // Otherwise — call our self-healing checkout endpoint and navigate to the
    // returned URL (Paddle hosted page or LS overlay). If the server reports
    // `checkout_unavailable`, we surface a real error instead of routing to
    // /checkout/manual — manual checkout is reserved for environments where
    // no payment provider is configured.
    e.preventDefault();
    const attrs = getAttribution();
    fetch("/api/income/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        ref: typeof attrs.ref === "string" ? attrs.ref : null,
        utm_source: typeof attrs.utm_source === "string" ? attrs.utm_source : null,
        utm_medium: typeof attrs.utm_medium === "string" ? attrs.utm_medium : null,
        utm_campaign: typeof attrs.utm_campaign === "string" ? attrs.utm_campaign : null,
        utm_term: typeof attrs.utm_term === "string" ? attrs.utm_term : null,
        utm_content: typeof attrs.utm_content === "string" ? attrs.utm_content : null,
      }),
      keepalive: true,
    })
      .then(async (r) => {
        const data = await r.json().catch(() => null);
        if (r.ok && data?.url) {
          window.location.href = data.url;
          return;
        }
        // Real provider error — show inline error, do NOT silently route to /checkout/manual
        if (data?.error === "checkout_unavailable") {
          showCheckoutError(data.detail ?? "Payment is temporarily unavailable. Please try again.");
          return;
        }
        // Defensive fallback (no real URL) — only if no provider is configured
        if (data?.provider === "manual" && data?.url) {
          window.location.href = data.url;
          return;
        }
        showCheckoutError("Could not start checkout. Please refresh and try again.");
      })
      .catch(() => {
        showCheckoutError("Network error starting checkout. Please check your connection and try again.");
      });
  }

  function showCheckoutError(message: string) {
    if (typeof window === "undefined") return;
    // Use the existing page's error surface if present; otherwise an alert.
    const banner = document.getElementById("checkout-error-banner");
    if (banner) {
      banner.textContent = message;
      banner.classList.remove("hidden");
      return;
    }
    // Last resort: surface to the user without dead-ending
    window.alert(message);
  }

  return (
    <a
      href={finalHref}
      onClick={handleClick}
      className={`lemonsqueezy-button${className ? ` ${className}` : ""}`}
      data-product-slug={slug}
    >
      {children}
    </a>
  );
}
