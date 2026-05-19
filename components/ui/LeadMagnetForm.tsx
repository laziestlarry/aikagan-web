"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      setState("done");
      if (data.assetPath) {
        // Redirect to next tier after short delay
        setTimeout(() => {
          if (data.nextSlug) router.push(`/products/${data.nextSlug}`);
        }, 3000);
      }
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className={`rounded-2xl border border-amber-300/30 bg-amber-300/10 px-6 py-5 text-center ${className}`}>
        <p className="font-semibold text-amber-300">\u2713 You\u2019re in! Check your inbox.</p>
        <p className="mt-1 text-sm text-neutral-400">Redirecting you to your first upgrade\u2026</p>
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
        {state === "loading" ? "Sending\u2026" : leadMagnetLabel}
      </button>
      {state === "error" && (
        <p className="w-full text-xs text-red-400">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
