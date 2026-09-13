"use client";

import { appendAttribution, trackCheckoutIntent } from "@/src/lib/attribution";

interface Props {
  href: string;
  slug: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Simple hosted checkout link. Paid digital products are resolved by the
 * canonical /api/income/checkout controller and pinned to Gumroad.
 */
export default function CheckoutButton({ href, slug, children, className }: Props) {
  const url = appendAttribution(href);
  return (
    <a
      href={url}
      onClick={() => trackCheckoutIntent(slug)}
      className={className}
      rel="noopener"
      data-product-slug={slug}
      data-checkout-provider="gumroad"
    >
      {children}
    </a>
  );
}
