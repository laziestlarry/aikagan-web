"use client";

import { useCallback, useState } from "react";
import { appendAttribution, trackCheckoutIntent } from "@/src/lib/attribution";

interface Props {
  href: string;
  slug: string;
  children: React.ReactNode;
  className?: string;
}

declare global {
  interface Window {
    Paddle?: {
      Checkout: {
        open: (config: { transactionId: string }) => Promise<void>;
      };
    };
  }
}

/**
 * Paddle Checkout Button.
 *
 * Uses Paddle.js overlay checkout (loaded in root layout).
 * Falls back to redirect-to-checkout if Paddle.js isn't available.
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

      const { transactionId: txnId, url, provider } = await res.json();

      // Use Paddle.js overlay if available AND this is actually a Paddle checkout
      const isPaddleProvider = !provider || provider === "paddle";
      const isPaddleTxn = typeof txnId === "string" && txnId.startsWith("txn_");

      if (isPaddleProvider && isPaddleTxn && window.Paddle?.Checkout) {
        // Open the checkout overlay
        window.Paddle.Checkout.open({ transactionId: txnId });
        setLoading(false);
        
        // Listen for completion — Paddle fires 'checkout.completed' on window
        const onComplete = () => {
          window.removeEventListener('checkout.completed', onComplete);
          window.location.href = `/checkout-success?transaction_id=${txnId}`;
        };
        window.addEventListener('checkout.completed', onComplete);
      } else {
        // Fallback or non-Paddle provider — redirect to checkout URL
        setLoading(false);
        window.location.href = url ?? `/products/${slug}`;
      }
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
