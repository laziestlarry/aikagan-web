"use client";

import { useEffect } from "react";
import { initAttribution, getAttribution } from "@/src/lib/attribution";

/** Drop into any layout to capture UTM params on every page load. */
export default function AttributionInit() {
  useEffect(() => {
    initAttribution();
    // Expose attribution globally so CheckoutLink can read it
    const attrs = getAttribution();
    (window as unknown as { __attrs__: typeof attrs }).__attrs__ = attrs;

    // Fire affiliate click (non-blocking) if ref is present
    if (attrs.ref) {
      fetch("/api/affiliate/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: attrs.ref }),
        keepalive: true,
      }).catch(() => {
        // ignore
      });
    }
  }, []);
  return null;
}
