"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAttribution } from "@/src/lib/attribution";

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
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const router = useRouter();

  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [nextHref, setNextHref] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const attribution = getAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slug,
          website: honeypot,
          utm_source: urlParams.get("utm_source") ?? attribution.utm_source ?? undefined,
          utm_medium: urlParams.get("utm_medium") ?? attribution.utm_medium ?? undefined,
          utm_campaign: urlParams.get("utm_campaign") ?? attribution.utm_campaign ?? undefined,
          utm_term: urlParams.get("utm_term") ?? attribution.utm_term ?? undefined,
          utm_content: urlParams.get("utm_content") ?? attribution.utm_content ?? undefined,
          click_id: urlParams.get("click_id") ?? attribution.click_id ?? undefined,
          fbclid: urlParams.get("fbclid") ?? attribution.fbclid ?? undefined,
          igshid: urlParams.get("igshid") ?? attribution.igshid ?? undefined,
          ref: urlParams.get("ref") ?? attribution.ref ?? undefined,
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
          <div className="mt-3 space-y-2 text-xs text-neutral-400">
            <p>Taking you to the next upgrade in a moment…</p>
            <Link href={nextHref} className="inline-flex items-center justify-center text-amber-300 underline hover:text-amber-200">
              See the recommended next step now
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Honeypot field - visually hidden but available to screen readers / bots */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
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
