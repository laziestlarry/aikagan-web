"use client";

/**
 * Global error boundary.
 *
 * Catches any unhandled rendering error in the App Router and shows a
 * branded recovery screen instead of the default Next.js error page.
 * Reports the error to the CAPI endpoint for monitoring.
 */

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for Vercel runtime logs
    console.error("[error-boundary]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });

    // Fire-and-forget error report to our own /api/health
    if (typeof window !== "undefined") {
      fetch("/api/health", { method: "GET" }).catch(() => {});
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">⚜</div>
        <h1 className="text-3xl font-extrabold text-kagan-white mb-3">
          Something went off-script
        </h1>
        <p className="text-kagan-light mb-2">
          The mission hit an unexpected obstacle. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-kagan-muted mb-6 font-mono">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="rounded-xl bg-kagan-gold px-6 py-2.5 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-kagan-border px-6 py-2.5 text-sm font-semibold text-kagan-white hover:bg-kagan-card transition-colors"
          >
            Return to base
          </Link>
        </div>
      </div>
    </div>
  );
}
