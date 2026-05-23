"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getProduct, getProduct as findProduct, products } from "@/lib/products";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const STEPS = [
  { icon: "\uD83C\uDF89", label: "Payment confirmed" },
  { icon: "\u2B07\uFE0F",  label: "Download your pack" },
  { icon: "\uD83D\uDCC2", label: "Open START_HERE" },
  { icon: "\uD83D\uDE80", label: "Execute day one" },
  { icon: "\uD83D\uDCAC", label: "Support always available" },
];

function OrderBump({ currentSlug }: { currentSlug: string }) {
  const current = getProduct(currentSlug);
  if (!current?.nextSlug) return null;
  const next = getProduct(current.nextSlug);
  if (!next || next.priceModel === "free" || !next.checkoutUrl) return null;

  return (
    <div className="mt-8 rounded-3xl border border-amber-300/40 bg-amber-300/5 p-8">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300">One-time upgrade offer</p>
      <h3 className="mt-3 text-2xl font-bold">
        Upgrade to {next.name} — just ${next.price - current.price} more
      </h3>
      <p className="mt-3 text-neutral-300">{next.description}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-neutral-400">
        {next.bullets.slice(0, 3).map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-0.5 text-amber-300">✓</span>
            {b}
          </li>
        ))}
      </ul>
      <a
        href={next.checkoutUrl!}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-7 py-4 font-semibold text-black hover:bg-amber-200"
      >
        Upgrade to {next.name} →
      </a>
    </div>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const slugParam = searchParams.get("product"); // fallback for legacy links
  const [activeStep, setActiveStep] = useState(0);

  // Resolve which product to show (declare before effects so effects can reference it)
  const product =
    (token ? undefined : slugParam ? findProduct(slugParam) : undefined) ||
    products.find((p) => p.ladderTier !== "lead_magnet" && p.priceModel === "one_time") ||
    products[2]; // fallback: golden-delivery-starter

  // Animate steps in on mount
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setActiveStep(i);
      if (i >= STEPS.length) clearInterval(id);
    }, 400);
    return () => clearInterval(id);
  }, []);

  // Fire Meta Pixel Purchase event once product is resolved
  useEffect(() => {
    if (!product || product.priceModel !== "one_time") return;
    window.fbq?.("track", "Purchase", {
      value: product.price,
      currency: "USD",
      content_ids: [product.slug],
      content_type: "product",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug]);

  const downloadHref = token
    ? `/api/download/${token}`
    : product?.zipFilename
    ? `/api/download/demo-${product.slug}` // dev fallback
    : null;

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        {/* Header */}
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Order confirmed</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
          Your Golden Delivery pack is ready.
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          Follow the steps below to claim your download and start day one.
        </p>

        {/* Progress steps */}
        <ol className="mt-10 space-y-3">
          {STEPS.map((step, i) => (
            <li
              key={step.label}
              className={`flex items-center gap-4 rounded-2xl border px-6 py-4 transition-all duration-500 ${
                i < activeStep
                  ? "border-amber-300/30 bg-amber-300/10 text-white"
                  : "border-white/5 bg-white/2 text-neutral-500"
              }`}
            >
              <span className="text-2xl">{step.icon}</span>
              <span className={`font-medium ${i < activeStep ? "text-white" : "text-neutral-500"}`}>
                {step.label}
              </span>
              {i < activeStep && (
                <span className="ml-auto text-amber-300 text-sm">✓</span>
              )}
            </li>
          ))}
        </ol>

        {/* Download card */}
        <div className="mt-10 rounded-3xl border border-amber-300/20 bg-[#111827] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            {product?.tier ?? "Your pack"}
          </p>
          <h2 className="mt-3 text-3xl font-semibold">{product?.name ?? "Your pack"}</h2>
          <p className="mt-3 text-neutral-300">{product?.description}</p>

          {downloadHref ? (
            <a
              href={downloadHref}
              download
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-amber-300 px-7 py-4 font-semibold text-black hover:bg-amber-200"
            >
              <span>\u2B07\uFE0F</span> Download ZIP Pack
            </a>
          ) : (
            <p className="mt-6 rounded-xl bg-red-900/30 border border-red-500/30 px-5 py-4 text-sm text-red-300">
              Download link not found. Please check your confirmation email or{" "}
              <a href="mailto:lazylarries@gmail.com" className="underline">contact support</a>.
            </p>
          )}

          <p className="mt-4 text-xs text-neutral-500">
            Link valid for 48 hours. Re-download from your confirmation email if it expires.
          </p>
        </div>

        {/* What to do next */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-8">
          <h2 className="text-xl font-semibold">Your first 24 hours</h2>
          <ol className="mt-5 space-y-3 text-neutral-300">
            <li className="flex gap-3"><span className="text-amber-300 font-bold">1.</span>Download and unzip the pack.</li>
            <li className="flex gap-3"><span className="text-amber-300 font-bold">2.</span>Open <strong>START_HERE.pdf</strong> first — it maps the exact execution sequence.</li>
            <li className="flex gap-3"><span className="text-amber-300 font-bold">3.</span>Complete the 24-Hour Quick Win Checklist.</li>
            <li className="flex gap-3"><span className="text-amber-300 font-bold">4.</span>Questions? Email <a href="mailto:lazylarries@gmail.com" className="text-amber-300 underline">lazylarries@gmail.com</a>.</li>
          </ol>
        </div>

        {/* Order bump */}
        {product && <OrderBump currentSlug={product.slug} />}

        <Link href="/" className="mt-10 inline-block text-sm text-neutral-400 hover:text-white">
          ← Back to AIKAGAN
        </Link>
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
