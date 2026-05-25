"use client";

import React from "react";

interface CheckoutLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** LemonSqueezy checkout URL (may be null/undefined — we render a safe fallback). */
  href?: string | null;
  productSlug: string;
  productName: string;
  price: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Decorate the raw LS URL with:
//   • checkout[custom][product_slug] → consumed by /api/webhooks/lemonsqueezy
//     to resolve which ZIP to deliver
//   • checkout[success_url]          → LemonSqueezy redirects the buyer here
//     after purchase, so they land on our in-domain /checkout-success page
function decorateCheckoutUrl(rawHref: string, productSlug: string): string {
  try {
    // Use a base just to allow URLSearchParams editing on absolute URLs
    const url = new URL(rawHref);
    url.searchParams.set("checkout[custom][product_slug]", productSlug);
    // Always send buyers back to our own success page so the funnel stays in-domain.
    const successUrl =
      typeof window !== "undefined" && window.location?.origin
        ? `${window.location.origin}/checkout-success`
        : "https://aikagan.com/checkout-success";
    url.searchParams.set("checkout[success_url]", successUrl);
    return url.toString();
  } catch {
    return rawHref;
  }
}

export default function CheckoutLink({
  href,
  productSlug,
  productName,
  price,
  children,
  onClick,
  ...rest
}: CheckoutLinkProps) {
  // Safe-fallback: if the env var is missing AND the hardcoded fallback was
  // dropped, render an outline link that opens the /products page rather
  // than an inert <a> the user can click with no effect.
  const hasHref = typeof href === "string" && href.startsWith("http");

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!hasHref) {
      // Don't let the broken link silently fail — route them to /products
      e.preventDefault();
      window.location.href = "/products";
      return;
    }
    // Push GTM begin_checkout event
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "USD",
          value: price,
          items: [
            {
              item_id: productSlug,
              item_name: productName,
              price: price,
              quantity: 1,
            },
          ],
        },
      });
    }
    onClick?.(e);
  }

  const finalHref = hasHref ? decorateCheckoutUrl(href!, productSlug) : "/products";

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...rest}
      href={finalHref}
      className={`lemonsqueezy-button${rest.className ? ` ${rest.className}` : ""}`}
      onClick={handleClick}
      data-product-slug={productSlug}
    >
      {children}
    </a>
  );
}
