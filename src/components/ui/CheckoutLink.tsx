"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { appendAttribution, trackCheckoutIntent } from "@/src/lib/attribution";
import { hasGumroadProduct } from "@/lib/gumroad-products";

interface CheckoutLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Product slug — used to call POST /api/income/checkout */
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

/**
 * Checkout Link — production checkout path.
 *
 * The public storefront only opens the managed checkout router when the product
 * has a concrete hosted provider mapping. Unmapped services are routed to an
 * availability request instead of producing a checkout error.
 */
export default function CheckoutLink({
  href,
  productSlug,
  productName,
  price,
  children,
  onClick,
  ...rest
}: CheckoutLinkProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isManagedCheckout = href === "paddle";
  const hasVerifiedHostedCheckout = hasGumroadProduct(productSlug);

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "USD",
          value: price,
          items: [{ item_id: productSlug, item_name: productName, price, quantity: 1 }],
        },
      });
      trackCheckoutIntent(productSlug);
    }

    if (!isManagedCheckout) {
      if (href) window.location.href = href;
      return;
    }

    setLoading(true);
    try {
      const attrs = (window as typeof window & { __attrs__?: Record<string, string> }).__attrs__ ?? {};
      const searchParams = new URLSearchParams(window.location.search);
      const coupon = searchParams.get("coupon");

      const response = await fetch("/api/income/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: productSlug,
          ref: attrs.ref ?? null,
          utm_source: attrs.utm_source ?? null,
          utm_medium: attrs.utm_medium ?? null,
          utm_campaign: attrs.utm_campaign ?? null,
          coupon,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Checkout error:", error.error);
        if (response.status === 502 || error?.error === "checkout_unavailable") {
          showCheckoutError(error?.detail ?? "Payment is temporarily unavailable. Please try again in a moment.");
          return;
        }
        showCheckoutError("Could not start checkout. Please refresh and try again.");
        return;
      }

      const { url, provider } = await response.json();

      if (typeof window !== "undefined" && (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", "begin_checkout", {
          currency: "USD",
          value: price,
          items: [{ item_id: productSlug, item_name: productName, price, quantity: 1 }],
          provider,
        });
      }

      if (url) {
        window.location.href = url;
      } else {
        showCheckoutError("Checkout URL was not returned. Please try again.");
      }
    } catch (error) {
      console.error("Checkout network error:", error);
      showCheckoutError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }

    onClick?.(event);
  }, [href, isManagedCheckout, onClick, price, productName, productSlug]);

  function showCheckoutError(message: string) {
    if (typeof window === "undefined") return;
    const banner = document.getElementById("checkout-error-banner");
    if (banner) {
      banner.textContent = message;
      banner.classList.remove("hidden");
    }
    setErrorMessage(message);
    setLoading(false);
  }

  if (isManagedCheckout && !hasVerifiedHostedCheckout) {
    return (
      <Link
        href={`/contact?product=${encodeURIComponent(productSlug)}`}
        className={rest.className}
        style={rest.style}
        data-product-slug={productSlug}
      >
        Request availability
      </Link>
    );
  }

  if (!isManagedCheckout && href) {
    const finalHref = appendAttribution(href);
    return (
      <a {...rest} href={finalHref} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (!href) {
    return (
      <Link href="/products" className={rest.className} style={rest.style}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <a
        {...rest}
        href="/api/income/checkout"
        onClick={handleClick}
        data-product-slug={productSlug}
        style={{ ...(rest.style ?? {}), cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Opening checkout..." : children}
      </a>
      {errorMessage ? (
        <span className="mt-2 block text-xs text-red-300" role="alert">
          {errorMessage}
        </span>
      ) : null}
    </>
  );
}
