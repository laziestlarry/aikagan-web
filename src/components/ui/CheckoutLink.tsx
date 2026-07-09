"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { appendAttribution, trackCheckoutIntent } from "@/src/lib/attribution";

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
 * For paid products this calls POST /api/income/checkout, which is the
 * live checkout router wired to Paddle + income ledger intent tracking.
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

  const isPaddle = href === "paddle";

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Push GTM begin_checkout event
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

    if (!isPaddle) {
      // If not a Paddle product (e.g. legacy link), navigate directly
      if (href) window.location.href = href;
      return;
    }

    // Multi-provider flow: router picks Paddle → LemonSqueezy → Gumroad
    setLoading(true);
    try {
      // Build attribution payload from sessionStorage
      const attrs = (window as any).__attrs__ ?? {};

      // Read coupon from URL query param (e.g. ?coupon=TESTXXX)
      let coupon: string | null = null;
      if (typeof window !== "undefined") {
        const sp = new URLSearchParams(window.location.search);
        coupon = sp.get("coupon");
      }

      const res = await fetch("/api/income/checkout", {
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

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("❌ Checkout error:", err.error);
        // 502 = real provider outage (Paddle configured but failed) — surface
        // a clear error, do NOT silently route to /checkout/manual.
        if (res.status === 502 || err?.error === "checkout_unavailable") {
          showCheckoutError(err?.detail ?? "Payment is temporarily unavailable. Please try again in a moment.");
          return;
        }
        // Other failure: show actionable error (don't silently bounce).
        showCheckoutError("Could not start checkout. Please refresh and try again.");
        return;
      }

      const { url, provider } = await res.json();

      // Fire InitiateCheckout pixel event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "begin_checkout", {
          currency: "USD",
          value: price,
          items: [{ item_id: productSlug, item_name: productName, price, quantity: 1 }],
          provider,
        });
      }

      // Paddle: redirect to checkout URL (has _ptxn param)
      // Paddle.js detects _ptxn and opens overlay on checkout-success page
      if (url) {
        // Only follow manual fallback if the server explicitly returned it
        // (i.e. no payment provider configured at all).
        if (provider === "manual") {
          window.location.href = url;
          return;
        }
        // Fallback: redirect to checkout URL (LS, Gumroad)
        window.location.href = url;
      } else {
        showCheckoutError("Checkout URL was not returned. Please try again.");
      }
    } catch (err) {
      console.error("❌ Checkout network error:", err);
      showCheckoutError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }

    onClick?.(e);
  }, [href, isPaddle, productSlug, productName, price, onClick]);

  function showCheckoutError(message: string) {
    if (typeof window === "undefined") return;
    const banner = document.getElementById("checkout-error-banner");
    if (banner) {
      banner.textContent = message;
      banner.classList.remove("hidden");
      setLoading(false);
      setErrorMessage(message);
      return;
    }
    setErrorMessage(message);
    setLoading(false);
  }

  // For free/lead-magnet products, pass through normally
  if (!isPaddle && href) {
    const finalHref = appendAttribution(href);
    return (
      <a {...rest} href={finalHref} onClick={onClick}>
        {children}
      </a>
    );
  }

  // If no checkout available, redirect to /products
  if (!href) {
    return (
      <Link
        href="/products"
        className={rest.className}
        style={rest.style}
      >
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
      {errorMessage && (
        <span className="mt-2 block text-xs text-red-300" role="alert">
          {errorMessage}
        </span>
      )}
    </>
  );
}
