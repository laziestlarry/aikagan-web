"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface Props {
  slug: string;
  leadMagnetLabel?: string;
  className?: string;
}

/**
 * Inline email capture form for lead magnet opt-ins.
 * POSTs to /api/lead, then redirects to the asset if available.
 */
export default function LeadMagnetForm({ slug, leadMagnetLabel = "Get Free Access", className }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const router = useRouter();

  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [nextHref, setNextHref] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slug,
          utm_source: new URLSearchParams(window.location.search).get("utm_source") ?? undefined,
          ref: new URLSearchParams(window.location.search).get("ref") ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      // Fire Meta Pixel Lead event on successful opt-in
      window.fbq?.("track", "Lead", { content_name: slug, content_category: "lead_magnet" });
      setAssetUrl(data.assetPath ?? null);
      setNextHref(data.nextSlug ? `/products/${data.nextSlug}` : null);
      setState("done");

      // Auto-download: programmatically trigger asset download immediately
      if (data.assetPath) {
        const a = document.createElement("a");
        a.href = data.assetPath;
        a.download = "";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Soft redirect to upsell after 5s (gives time for download to start)
        if (data.nextSlug) {
          setTimeout(() => router.push(`/products/${data.nextSlug}`), 5000);
        }
      }
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className={`rounded-2xl border border-amber-300/30 bg-amber-300/10 px-6 py-5 text-center ${className}`}>
        <p className="font-semibold text-amber-300">✓ You&apos;re in! Your download is starting.</p>
        {assetUrl && (
          <p className="mt-2 text-sm text-neutral-300">
            Didn&apos;t auto-start?{" "}
            <a href={assetUrl} download className="text-amber-300 underline hover:text-amber-200">
              Click here to download manually
            </a>.
          </p>
        )}
        {nextHref && (
          <p className="mt-3 text-xs text-neutral-400">
            Taking you to the next upgrade in a moment…
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-300"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black hover:bg-amber-200 disabled:opacity-50"
      >
        {state === "loading" ? "Sending…" : leadMagnetLabel}
      </button>
      {state === "error" && (
        <p className="w-full text-xs text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
