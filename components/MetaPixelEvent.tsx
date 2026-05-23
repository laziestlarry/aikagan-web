"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type StandardEvent =
  | "ViewContent"
  | "InitiateCheckout"
  | "Purchase"
  | "Lead"
  | "CompleteRegistration";

interface Props {
  event: StandardEvent;
  params?: Record<string, unknown>;
}

/**
 * Drop into any page to fire a Meta Pixel standard event on mount.
 * Requires the Meta Pixel base code to be loaded (via GTM-NZW2CP6H).
 */
export default function MetaPixelEvent({ event, params }: Props) {
  useEffect(() => {
    window.fbq?.("track", event, params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
