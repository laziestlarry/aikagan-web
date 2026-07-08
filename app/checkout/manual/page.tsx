/**
 * /checkout/manual
 *
 * Fallback checkout page when the automated router falls through.
 * Shows live payment provider status with direct checkout links,
 * plus a manual form as last resort.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { getProduct } from "@/lib/products";

/* ── Provider status card ───────────────────────────────────────────────── */

interface ProviderInfo {
  id: string;
  name: string;
  description: string;
  status: "active" | "available" | "manual";
  isMoR: boolean;
  methods: string[];
  checkoutUrl: string | null;
  accentColor: string;
}

const LIVE_PROVIDERS: ProviderInfo[] = [
  {
    id: "paddle",
    name: "Paddle",
    description: "Card, PayPal, Apple Pay, Google Pay — global MoR",
    status: "active",
    isMoR: true,
    methods: ["Visa", "MC", "Amex", "PayPal", "Apple Pay"],
    checkoutUrl: null, // set dynamically
    accentColor: "text-amber-300",
  },
  {
    id: "lemonsqueezy",
    name: "LemonSqueezy",
    description: "Card + PayPal — global MoR",
    status: "available",
    isMoR: true,
    methods: ["Visa", "MC", "PayPal"],
    checkoutUrl: null,
    accentColor: "text-purple-400",
  },
  {
    id: "gumroad",
    name: "Gumroad",
    description: "Card, PayPal, Apple/Google Pay — global MoR",
    status: "available",
    isMoR: true,
    methods: ["Visa", "MC", "Amex", "PayPal", "Google Pay"],
    checkoutUrl: null,
    accentColor: "text-green-400",
  },
  {
    id: "manual",
    name: "Manual Checkout",
    description: "Human-processed within 24 hours",
    status: "manual",
    isMoR: false,
    methods: ["Any"],
    checkoutUrl: null,
    accentColor: "text-blue-400",
  },
];

/* ── Component ──────────────────────────────────────────────────────────── */

function ManualCheckoutInner() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const intentId = params.get("intent") || "";
  const urlCoupon = params.get("coupon") || "";

  const product = slug ? getProduct(slug) : undefined;
  const effectivePrice = urlCoupon ? "$1.00" : product ? `$${product.price}` : "—";
  const [providerUrls, setProviderUrls] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingUrls, setLoadingUrls] = useState(true);

  // Fetch checkout URLs for each provider
  useEffect(() => {
    if (!slug) return;
    const providers = ["paddle", "lemonsqueezy", "gumroad"];
    Promise.all(
      providers.map(async (provider) => {
        try {
          const endpoint =
            provider === "paddle"
              ? "/api/paddle-checkout"
              : provider === "lemonsqueezy"
                ? "/api/lemonsqueezy-checkout"
                : "/api/gumroad-checkout";
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug, coupon: urlCoupon || undefined }),
          });
          const data = await res.json();
          return { provider, url: data.url || null };
        } catch {
          return { provider, url: null };
        }
      }),
    ).then((results) => {
      const urls: Record<string, string> = {};
      results.forEach((r) => {
        if (r.url) urls[r.provider] = r.url;
      });
      setProviderUrls(urls);
      setLoadingUrls(false);
    });
  }, [slug, urlCoupon]);

  function getCheckoutUrl(providerId: string): string | null {
    return providerUrls[providerId] || null;
  }

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
          note: `manual_checkout intent=${intentId} ${urlCoupon ? `coupon=${urlCoupon}` : ""} ${note}`.trim(),
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

  /* ── Success ─────────────────────────────────────────────────────── */
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
          {urlCoupon && (
            <p className="text-sm text-kagan-gold mt-4">
              Test coupon noted — $1 price confirmed.
            </p>
          )}
          <p className="text-xs text-kagan-muted mt-6">
            Reference: <code className="font-mono">{intentId || slug}</code>
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-xl bg-kagan-gold px-6 py-3 text-sm font-semibold text-black hover:bg-kagan-gold-light"
          >
            Back to products
          </Link>
        </div>
      </Section>
    );
  }

  /* ── Main Form + Live Providers ──────────────────────────────────── */
  return (
    <Section variant="hero">
      <div className="max-w-4xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────── */}
        <Badge variant="amber" className="mb-4">
          {urlCoupon ? "Test Purchase" : "Complete Your Purchase"}
        </Badge>
        <h1 className="text-3xl font-extrabold text-kagan-white mb-2">
          {product?.name ?? (slug || "Checkout")}
        </h1>
        <p className="text-kagan-light mb-6">
          <span className="text-kagan-gold font-bold text-2xl">{effectivePrice}</span>
          {product?.originalPrice && product.originalPrice > product.price && (
            <span className="ml-2 text-sm text-kagan-muted line-through">
              ${product.originalPrice}
            </span>
          )}
          {urlCoupon && (
            <span className="ml-3 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
              TEST — $1 coupon active
            </span>
          )}
        </p>

        {slug && (
          <div className="grid md:grid-cols-5 gap-8 mt-8">
            {/* ── LEFT: Live checkout options (3/5) ──────────────── */}
            <div className="md:col-span-3">
              <h2 className="text-lg font-semibold text-kagan-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Checkout is available
              </h2>

              {loadingUrls ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-kagan-border bg-kagan-black/40 p-5 animate-pulse">
                      <div className="h-4 bg-kagan-border/30 rounded w-24 mb-2" />
                      <div className="h-3 bg-kagan-border/20 rounded w-48" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {LIVE_PROVIDERS.filter((p) => p.status !== "manual").map((provider) => {
                    const url = providerUrls[provider.id] || null;
                    return (
                      <div
                        key={provider.id}
                        className={`rounded-xl border transition-all ${
                          url
                            ? "border-green-500/20 bg-green-500/[0.03] hover:border-green-500/40"
                            : "border-kagan-border bg-kagan-black/40 opacity-60"
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-kagan-white">
                                {provider.name}
                              </span>
                              {url ? (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                                  Pay now
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                  Unavailable
                                </span>
                              )}
                            </div>
                            {provider.isMoR && (
                              <span className="text-[10px] text-kagan-muted">MoR</span>
                            )}
                          </div>
                          <p className="text-xs text-kagan-muted">{provider.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {provider.methods.map((m) => (
                              <span
                                key={m}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-kagan-black/60 text-kagan-muted"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                          {url && (
                            <a
                              href={url}
                              className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                                provider.id === "paddle"
                                  ? "bg-amber-300 text-black hover:bg-amber-200"
                                  : provider.id === "lemonsqueezy"
                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                                    : "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                              }`}
                            >
                              Pay with {provider.name} →
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── RIGHT: Manual fallback form (2/5) ───────────────── */}
            <div className="md:col-span-2">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-5">
                <h2 className="text-sm font-semibold text-kagan-white mb-1">
                  Still need help?
                </h2>
                <p className="text-xs text-kagan-muted mb-4">
                  Leave your details and we&apos;ll reach out with a manual payment link within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold"
                    />
                  </div>
                  <div>
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
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Anything we should know? (optional)"
                      className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-amber-500/20 border border-amber-500/30 px-4 py-2.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/30 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? "Submitting..." : "Request manual payment"}
                  </button>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                </form>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/products"
                  className="text-xs text-kagan-muted hover:text-kagan-gold transition-colors"
                >
                  ← Browse all products
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── No slug ──────────────────────────────────────────── */}
        {!slug && (
          <div className="text-center py-12">
            <p className="text-kagan-light mb-4">No product selected.</p>
            <Link
              href="/products"
              className="inline-block rounded-xl bg-kagan-gold px-6 py-3 text-sm font-semibold text-black hover:bg-kagan-gold-light"
            >
              Browse products
            </Link>
          </div>
        )}
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
