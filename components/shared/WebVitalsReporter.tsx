"use client";

/**
 * WebVitalsReporter — reports Core Web Vitals to /api/vitals.
 *
 * Uses the `web-vitals` library (lazy-loaded) so it does not bloat the
 * initial bundle. Falls back to no-op if the library isn't available.
 */

import { useEffect } from "react";

type Metric = {
  name: string;
  value: number;
  id: string;
  rating?: string;
  delta?: number;
  navigationType?: string;
};

export default function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    let onMetric: ((m: Metric) => void) | null = null;

    (async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import("web-vitals");
        if (cancelled) return;

        onMetric = (m: Metric) => {
          // Use `sendBeacon` if available for non-blocking delivery
          const body = JSON.stringify(m);
          if (navigator.sendBeacon) {
            navigator.sendBeacon("/api/vitals", new Blob([body], { type: "application/json" }));
          } else {
            fetch("/api/vitals", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
              keepalive: true,
            }).catch(() => {});
          }
        };

        onCLS(onMetric as never);
        onINP(onMetric as never);
        onFCP(onMetric as never);
        onLCP(onMetric as never);
        onTTFB(onMetric as never);
      } catch {
        // web-vitals not installed; no-op
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
