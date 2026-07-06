/**
 * /checkout/manual
 *
 * Fallback page when no payment provider is reachable. Captures the buyer's
 * email + intent id so:
 *   1. The lead is in the income ledger.
 *   2. A human can reconcile the order offline and issue a download token.
 *   3. The funnel never dead-ends.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { getProduct } from "@/lib/products";

function ManualCheckoutInner() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const intentId = params.get("intent") || "";

  const product = slug ? getProduct(slug) : undefined;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          slug,
          name,
          note: `manual_checkout intent=${intentId} ${note}`.trim(),
        }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${r.status}`);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Section variant="hero">
        <div className="max-w-2xl mx-auto text-center py-20">
          <Badge variant="green" className="mb-4">Received</Badge>
          <h1 className="text-4xl font-extrabold text-kagan-white mb-4">
            We got it.
          </h1>
          <p className="text-kagan-light">
            Your interest in the <strong>{product?.name ?? slug}</strong> toolkit is recorded.
            The team will reach out personally with a secure payment link and your
            download within 24 hours.
          </p>
          <p className="text-xs text-kagan-muted mt-6">
            Reference: <code className="font-mono">{intentId}</code>
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section variant="hero">
      <div className="max-w-xl mx-auto">
        <Badge variant="amber" className="mb-4">Manual Checkout</Badge>
        <h1 className="text-3xl font-extrabold text-kagan-white mb-3">
          Complete your order — {product?.name ?? slug}
        </h1>
        <p className="text-kagan-light mb-2">
          The card payment system is temporarily down. Leave your email and a human
          will reach out within 24 hours with a secure payment link and your download.
        </p>
        <p className="text-xs text-kagan-muted mb-6">
          {product?.description ?? "AIKAGAN Masterclass digital toolkit."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-kagan-muted mb-1">Your name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-kagan-muted mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold"
            />
          </div>
          <div>
            <label className="block text-sm text-kagan-muted mb-1">Anything we should know? (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-kagan-gold px-6 py-3 text-sm font-semibold text-black hover:bg-kagan-gold-light disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </form>
      </div>
    </Section>
  );
}

export default function ManualCheckoutPage() {
  return (
    <Suspense fallback={<Section variant="hero"><div className="text-kagan-muted">Loading…</div></Section>}>
      <ManualCheckoutInner />
    </Suspense>
  );
}
