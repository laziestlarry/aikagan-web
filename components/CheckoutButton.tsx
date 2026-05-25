"use client";

import type { ReactNode } from "react";
import { trackCheckoutIntent } from "@/src/lib/attribution";

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
 * Checkout CTA that fires Meta Pixel InitiateCheckout + internal revenue-ops
 * tracking, then opens the LemonSqueezy checkout AS AN IN-PAGE OVERLAY.
 * The `lemonsqueezy-button` class is picked up by lemon.js (loaded in
 * app/layout.tsx) which intercepts the click and opens the checkout in a
 * modal — the buyer never leaves aikagan.com.
 */
export default function CheckoutButton({ href, slug, price, children, className }: Props) {
  const hasHref = typeof href === "string" && href.startsWith("http");
  const finalHref = hasHref ? decorate(href!, slug) : "/products";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!hasHref) {
      e.preventDefault();
      window.location.href = "/products";
      return;
    }
    window.fbq?.("track", "InitiateCheckout", {
      value: price,
      currency: "USD",
      content_ids: [slug],
      content_type: "product",
    });
    trackCheckoutIntent(slug);
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
