"use client";

import { useCallback, useState } from "react";
import { appendAttribution, trackCheckoutIntent } from "@/src/lib/attribution";

interface Props {
  href: string;
  slug: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Paddle Checkout Button.
 *
 * Calls POST /api/paddle-checkout and redirects to Paddle.
 */
export default function CheckoutButton({ href, slug, children, className }: Props) {
  const [loading, setLoading] = useState(false);
  const isPaddle = href === "paddle";

  const handleClick = useCallback(async () => {
    trackCheckoutIntent(slug);

    if (!isPaddle) {
      if (href) window.location.href = href;
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/paddle-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        window.location.href = `/products/${slug}`;
        return;
      }

      const { url } = await res.json();
      window.location.href = url ?? `/products/${slug}`;
    } catch {
      window.location.href = `/products/${slug}`;
    } finally {
      setLoading(false);
    }
  }, [href, isPaddle, slug]);

  if (!isPaddle && href) {
    const url = appendAttribution(href);
    return (
      <a
        href={url}
        onClick={() => trackCheckoutIntent(slug)}
        className={className}
        rel="noopener"
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className}
      style={{ cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
    >
      {loading ? "Opening checkout..." : children}
    </button>
  );
}
