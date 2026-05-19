"use client";

import { useCallback } from "react";
import { appendAttribution, trackCheckoutIntent } from "@/src/lib/attribution";

interface Props {
  href: string;
  slug: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps a checkout link to append UTM attribution params
 * and fire a checkout_intent event to revenue ops.
 */
export default function CheckoutButton({ href, slug, children, className }: Props) {
  const handleClick = useCallback(() => {
    trackCheckoutIntent(slug);
  }, [slug]);

  const url = appendAttribution(href);

  return (
    <a
      href={url}
      onClick={handleClick}
      className={className}
      rel="noopener"
    >
      {children}
    </a>
  );
}
