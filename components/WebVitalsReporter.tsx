"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

export default function WebVitalsReporter() {
  useEffect(() => {
    const report = (metric: Metric) => {
      void fetch("/api/income/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "vital", name: metric.name, value: metric.value }),
        keepalive: true,
      }).catch(() => undefined);
    };
    onCLS(report);
    onFCP(report);
    onINP(report);
    onLCP(report);
    onTTFB(report);
  }, []);

  return null;
}
