"use client";

import { useEffect } from "react";
import { initAttribution } from "@/src/lib/attribution";

/** Drop into any layout to capture UTM params on every page load. */
export default function AttributionInit() {
  useEffect(() => {
    initAttribution();
  }, []);
  return null;
}
