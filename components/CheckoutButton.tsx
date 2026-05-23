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
 * tracking before handing off to the LemonSqueezy checkout page.
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
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
