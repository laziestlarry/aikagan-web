"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, Download, FileText, Mail, Sparkles, Zap, Shield } from "lucide-react";
import { getProduct, getProduct as findProduct, products } from "@/lib/products";
import CheckoutLink from "@/components/ui/CheckoutLink";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const STEPS = [
  { icon: CheckCircle, label: "Payment confirmed" },
  { icon: Download, label: "Download your pack" },
  { icon: FileText, label: "Open START_HERE" },
  { icon: Zap, label: "Execute day one" },
  { icon: Mail, label: "Support always available" },
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
      <CheckoutLink
        href={next.checkoutUrl!}
        productSlug={next.slug}
        productName={next.name}
        price={next.price}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-7 py-4 font-semibold text-black hover:bg-amber-200"
      >
        Upgrade to {next.name} →
      </CheckoutLink>
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
    products[0];

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
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white relative overflow-hidden">
      {/* Confetti particles (CSS) */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: float-up linear forwards;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${80 + Math.random() * 30}%`,
            background: ['#D4AF37','#a78bfa','#34d399','#d97706','#6F42C1'][i % 5],
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <section className="mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-amber-300">
          <Sparkles className="h-4 w-4" />
          Order confirmed
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
          Your {product?.name ?? "AIKAGAN"} pack is ready.
        </h1>
        <p className="mt-4 text-lg text-neutral-400">
          Follow the steps below to claim your download and start day one.
        </p>

        {/* Progress steps */}
        <ol className="mt-10 space-y-3">
          {STEPS.map(({ icon: StepIcon, label }, i) => (
            <li
              key={label}
              className={`flex items-center gap-4 rounded-2xl border px-6 py-4 transition-all duration-500 ${
                i < activeStep
                  ? "border-amber-300/30 bg-amber-300/10 text-white"
                  : "border-white/5 bg-white/2 text-neutral-500"
              }`}
            >
              <StepIcon className={`h-5 w-5 ${i < activeStep ? 'text-amber-300' : 'text-neutral-600'}`} />
              <span className={`font-medium ${i < activeStep ? "text-white" : "text-neutral-500"}`}>
                {label}
              </span>
              {i < activeStep && (
                <CheckCircle className="ml-auto h-4 w-4 text-amber-300" />
              )}
            </li>
          ))}
        </ol>

        {/* Download card */}
        <div className="mt-10 rounded-3xl border border-amber-300/20 bg-[#111827] p-8 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #D4AF37 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />

          <div className="relative flex flex-col md:flex-row gap-6">
            {/* Product preview */}
            <div className="flex-shrink-0">
              <div className="w-full md:w-36 h-36 rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 to-purple-300/10 flex items-center justify-center">
                {product?.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-contain p-3"
                  />
                ) : (
                  <div className="text-center">
                    <Download className="h-10 w-10 text-amber-300/40 mx-auto" />
                    <p className="text-[10px] text-amber-300/30 mt-1 uppercase tracking-wider">Digital Pack</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                {product?.tier ?? "Your pack"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{product?.name ?? "Your pack"}</h2>
              <p className="mt-2 text-neutral-300">{product?.description}</p>

              {downloadHref ? (
                <a
                  href={downloadHref}
                  download
                  className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-amber-300 px-7 py-4 font-semibold text-black hover:bg-amber-200 transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                >
                  <Download className="h-5 w-5" /> Download ZIP Pack
                </a>
              ) : (
                <div className="mt-5 rounded-xl bg-amber-300/10 border border-amber-300/30 px-5 py-4 text-sm text-amber-200">
                  <p className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Your download is on its way.
                  </p>
                  <p className="mt-1 text-neutral-300">
                    Within ~60 seconds you&apos;ll receive a confirmation email with your secure
                    download link (valid 48 hours). If it doesn&apos;t arrive, check your spam
                    folder, or email{" "}
                    <a href="mailto:kagan@aikagan.com" className="text-amber-300 underline">
                      kagan@aikagan.com
                    </a>{" "}
                    with your order number and we&apos;ll re-send it manually within an hour.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Trust row */}
          <div className="relative mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-xs text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400/60" /> Secure Payment
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-amber-400/60" /> Instant Download
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-purple-400/60" /> 48h Link Validity
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-400/60" /> Email Backup
            </span>
          </div>
        </div>

        {/* What to do next */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-300" /> Your first 24 hours
          </h2>
          <ol className="mt-5 space-y-4 text-neutral-300">
            {[
              { icon: Download, text: 'Download and unzip the pack.' },
              { icon: FileText, text: <><strong>Open START_HERE.pdf</strong> first — it maps the exact execution sequence.</> },
              { icon: CheckCircle, text: 'Complete the 24-Hour Quick Win Checklist.' },
              { icon: Mail, text: <>Questions? Email <a href="mailto:kagan@aikagan.com" className="text-amber-300 underline">kagan@aikagan.com</a></> },
            ].map(({ icon: ItemIcon, text }, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-300/10 border border-amber-300/20 flex-shrink-0 mt-0.5">
                  <ItemIcon className="h-3.5 w-3.5 text-amber-300" />
                </span>
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Order bump */}
        {product && <OrderBump currentSlug={product.slug} />}

        <Link href="/" className="mt-10 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors">
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
