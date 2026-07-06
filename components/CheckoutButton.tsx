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
  const finalHref = isRealHref ? decorate(href!, slug) : `/checkout/manual?slug=${encodeURIComponent(slug)}`;

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
    // returned URL (Paddle hosted page, LS overlay, or /checkout/manual).
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
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.url) {
          window.location.href = data.url;
        } else {
          // Defensive: never dead-end the buyer
          window.location.href = `/checkout/manual?slug=${encodeURIComponent(slug)}`;
        }
      })
      .catch(() => {
        window.location.href = `/checkout/manual?slug=${encodeURIComponent(slug)}`;
      });
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
