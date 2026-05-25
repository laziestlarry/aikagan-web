"use client";

import type { ReactNode } from "react";
import { trackCheckoutIntent } from "@/src/lib/attribution";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface Props {
  href: string;
  slug: string;
  price: number;
  children: ReactNode;
  className?: string;
}

/**
 * Checkout CTA that fires Meta Pixel InitiateCheckout + internal revenue-ops
 * tracking, then opens the LemonSqueezy checkout AS AN IN-PAGE OVERLAY.
 * The `lemonsqueezy-button` class is picked up by lemon.js (loaded in
 * app/layout.tsx) which intercepts the click and opens the checkout in a
 * modal — the buyer never leaves aikagan.com.
 */
export default function CheckoutButton({ href, slug, price, children, className }: Props) {
  function handleClick() {
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
      href={href}
      onClick={handleClick}
      className={`lemonsqueezy-button${className ? ` ${className}` : ""}`}
    >
      {children}
    </a>
  );
}
