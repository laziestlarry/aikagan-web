"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { appendAttribution, trackCheckoutIntent } from "@/src/lib/attribution";

interface CheckoutLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Product slug — used to call POST /api/paddle-checkout */
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
 * Checkout Link — Paddle edition.
 *
 * When clicked, calls POST /api/paddle-checkout with { slug },
 * then redirects the user to the Paddle Checkout URL.
 *
 * Prices come from lib/products.ts.
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

  const isPaddle = href === "paddle";

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

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

    // Paddle flow: create checkout session via our API
    setLoading(true);
    try {
      const res = await fetch("/api/paddle-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: productSlug }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("❌ Checkout error:", err.error);
        // Fallback: redirect to product page
        window.location.href = `/products/${productSlug}`;
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        window.location.href = `/products/${productSlug}`;
      }
    } catch (err) {
      console.error("❌ Checkout network error:", err);
      window.location.href = `/products/${productSlug}`;
    } finally {
      setLoading(false);
    }

    onClick?.(e);
  }, [href, isPaddle, productSlug, productName, price, onClick]);

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
    <a
      {...rest}
      href="/api/paddle-checkout"
      onClick={handleClick}
      data-product-slug={productSlug}
      style={{ ...(rest.style ?? {}), cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
    >
      {loading ? "Opening checkout..." : children}
    </a>
  );
}
