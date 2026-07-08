/**
 * /checkout/manual
 *
 * Fallback page when no payment provider is reachable. Captures the buyer's
 * email + intent id so:
 *   1. The lead is in the income ledger.
 *   2. A human can reconcile the order offline and issue a download token.
 *   3. The funnel never dead-ends.
 *
 * Also shows alternative payment rails (Gumroad, Squarespace, Shopier, etc.)
 * so the buyer has more options than just waiting 24 hours.
 *
 * If a valid ?coupon= is present, the price shown reflects the $1 test price.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { getProduct } from "@/lib/products";

/* ── Types ───────────────────────────────────────────────────────────────── */

interface Rail {
  id: string;
  name: string;
  description: string;
  status: string;
  isMoR: boolean;
  methods: string[];
  hasCheckoutLink: boolean;
  needsSetup: boolean;
}

interface RailsResponse {
  rails: Rail[];
  adminCoupon: { configured: boolean; code: string | null; testPrice: string };
}

/* ── Default rails when API is unreachable ──────────────────────────────── */

const FALLBACK_RAILS: Rail[] = [
  { id: "paddle", name: "Paddle", description: "Card + PayPal + Apple/Google Pay", status: "onboarding", isMoR: true, methods: ["Visa","MC","PayPal"], hasCheckoutLink: false, needsSetup: true },
  { id: "lemonsqueezy", name: "LemonSqueezy", description: "Card + PayPal + Apple Pay", status: "onboarding", isMoR: true, methods: ["Visa","MC","PayPal"], hasCheckoutLink: false, needsSetup: true },
  { id: "gumroad", name: "Gumroad", description: "Card + PayPal + Apple/Google Pay", status: "needs_setup", isMoR: true, methods: ["Visa","MC","Amex","PayPal"], hasCheckoutLink: false, needsSetup: true },
  { id: "squarespace", name: "Squarespace", description: "Full e‑commerce storefront", status: "needs_setup", isMoR: false, methods: ["Card","PayPal"], hasCheckoutLink: false, needsSetup: true },
  { id: "shopier", name: "Shopier", description: "Turkish gateway (iyzico)", status: "needs_setup", isMoR: false, methods: ["Card","TR bank"], hasCheckoutLink: false, needsSetup: true },
  { id: "binance", name: "Binance Pay", description: "Crypto — no chargebacks", status: "needs_setup", isMoR: false, methods: ["USDT","BTC"], hasCheckoutLink: false, needsSetup: true },
  { id: "manual", name: "Manual Checkout", description: "Human processes in 24h", status: "manual", isMoR: false, methods: ["Any"], hasCheckoutLink: true, needsSetup: false },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  onboarding: "Coming Soon",
  needs_setup: "Setup Needed",
  manual: "Available Now",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/30",
  onboarding: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  needs_setup: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  manual: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

/* ── Component ───────────────────────────────────────────────────────────── */

function ManualCheckoutInner() {
  const params = useSearchParams();
  const slug = params.get("slug") || "";
  const intentId = params.get("intent") || "";
  const urlCoupon = params.get("coupon") || "";

  const product = slug ? getProduct(slug) : undefined;
  const effectivePrice = urlCoupon ? "$1.00" : product ? `$${product.price}` : "—";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rails, setRails] = useState<Rail[]>(FALLBACK_RAILS);
  const [isCouponValid, setIsCouponValid] = useState(false);

  useEffect(() => {
    fetch("/api/rails")
      .then((r) => r.json())
      .then((data: RailsResponse) => {
        setRails(data.rails);
        if (urlCoupon && data.adminCoupon.code) {
          setIsCouponValid(urlCoupon === data.adminCoupon.code);
        }
      })
      .catch(() => { /* use fallback */ });
  }, [urlCoupon]);

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
            Reference: <code className="font-mono">{intentId}</code>
          </p>
        </div>
      </Section>
    );
  }

  /* ── Main Form + Alternatives ────────────────────────────────────── */
  return (
    <Section variant="hero">
      <div className="max-w-4xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────── */}
        <Badge variant="amber" className="mb-4">
          {isCouponValid ? "Test Purchase" : "Manual Checkout"}
        </Badge>
        <h1 className="text-3xl font-extrabold text-kagan-white mb-2">
          {product?.name ?? slug}
        </h1>
        <p className="text-kagan-light mb-1">
          <span className="text-kagan-gold font-bold">{effectivePrice}</span>
          {isCouponValid && (
            <span className="ml-2 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
              TEST — $1 coupon active
            </span>
          )}
        </p>
        {urlCoupon && !isCouponValid && (
          <p className="text-xs text-red-400 mb-3">Coupon code not recognized.</p>
        )}

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* ── LEFT: Manual form ──────────────────────────────────── */}
          <div>
            <h2 className="text-lg font-semibold text-kagan-white mb-3">
              Leave your details
            </h2>
            <p className="text-sm text-kagan-muted mb-4">
              All payment systems are being set up. Leave your email and we will
              send a secure payment link within 24 hours.
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

          {/* ── RIGHT: Alternative rails ───────────────────────────── */}
          <div>
            <h2 className="text-lg font-semibold text-kagan-white mb-3">
              Pay another way
            </h2>
            <p className="text-sm text-kagan-muted mb-4">
              More payment options are being activated. Here&apos;s the full status:
            </p>

            <div className="space-y-2">
              {rails.map((rail) => (
                <div
                  key={rail.id}
                  className="rounded-xl border border-kagan-border bg-kagan-black/40 px-4 py-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-kagan-white">
                      {rail.name}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        STATUS_COLORS[rail.status] ?? "text-gray-400 border-gray-600"
                      }`}
                    >
                      {STATUS_LABELS[rail.status] ?? rail.status}
                    </span>
                  </div>
                  <p className="text-xs text-kagan-muted">{rail.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {rail.methods.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-kagan-black/60 text-kagan-muted"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-kagan-muted mt-4">
              <span className="text-kagan-gold">Paddle</span> and{" "}
              <span className="text-kagan-gold">LemonSqueezy</span> are being
              approved. <span className="text-kagan-gold">Gumroad</span> can be
              activated fastest — reach out if you want to use it.
            </p>
          </div>
        </div>
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
