"use client";

/**
 * PageviewBeacon — fires a single `pageview` event to the income ledger
 * (KV-backed) on every page load. Uses `sendBeacon` so it survives
 * page transitions.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageviewBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = pathname || window.location.pathname;
    const body = JSON.stringify({ kind: "pageview", path });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/income/track", blob);
      } else {
        fetch("/api/income/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // never block the page
    }
  }, [pathname]);

  return null;
}
