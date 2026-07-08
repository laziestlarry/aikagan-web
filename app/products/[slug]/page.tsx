import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import CheckoutLink from "@/components/ui/CheckoutLink";
import ExitIntentModal from "@/components/ui/ExitIntentModal";
import { TrendingUp, Users, Star, Shield, Zap, Clock, ArrowUpRight } from "lucide-react";

export function generateStaticParams() {
  return products
    .filter((product) => product.priceModel === "one_time")
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.priceModel !== "one_time") {
    return {
      title: "Product Not Found | AutonomaX"
    };
  }

  return {
    title: `${product.name} | AutonomaX`,
    description: product.description
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.priceModel !== "one_time") {
    notFound();
  }

  const isPaddle = product.checkoutUrl === "paddle";

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-16 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Link href="/" className="text-sm text-amber-300">
            ← Back to AutonomaX
          </Link>

          {/* Product visual */}
          {product.image && (
            <div className="mt-8 mb-6 rounded-2xl overflow-hidden border border-white/10 max-w-md">
              <Image
                src={product.image}
                alt={`${product.name} Pack`}
                width={480}
                height={300}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-amber-300">
            {product.tier}
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
            {product.name}
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-neutral-300">
            {product.description}
          </p>

          <div className="mt-10 rounded-3xl border border-amber-300/20 bg-[#111827] p-8">
            <h2 className="text-2xl font-semibold">What you receive</h2>

            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {product.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-neutral-300">
                  <span className="text-amber-300">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-2xl font-semibold">What happens after purchase</h2>
            <ol className="mt-5 space-y-3 text-neutral-300">
              {[
                "Checkout completes via Paddle — you're redirected back to aikagan.com where your download link appears instantly.",
                "Open the ZIP and read START_HERE.pdf first — it maps every file in the pack.",
                "Follow the included execution checklist and use the scripts and templates directly.",
                "Need help? Email hello@aikagan.com within 30 days.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-amber-300 font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Quick comparison vs other tiers */}
          <div className="mt-8 rounded-3xl border border-amber-300/10 bg-black/40 p-8">
            <h2 className="text-2xl font-semibold">Compare plans</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-6 text-neutral-400 font-medium">Feature</th>
                    <th className="text-center py-2 pr-6 text-green-400 font-medium">Starter</th>
                    <th className="text-center py-2 pr-6 text-amber-300 font-medium">Pro</th>
                    <th className="text-center py-2 text-purple-400 font-medium">Commander</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  {[
                    { feature: "Price", starter: "$29", pro: "$79", commander: "$149" },
                    { feature: "Full Blueprint", starter: "✓", pro: "✓", commander: "✓" },
                    { feature: "Offer Templates", starter: "3", pro: "5", commander: "Unlimited" },
                    { feature: "Automation Workflows", starter: "—", pro: "6", commander: "Full OS" },
                    { feature: "Traffic Playbook", starter: "—", pro: "✓", commander: "✓" },
                    { feature: "Scale Sprint", starter: "—", pro: "—", commander: "60-day" },
                    { feature: "White-label Rights", starter: "✗", pro: "✗", commander: "✓" },
                    { feature: "KPI Dashboard", starter: "—", pro: "—", commander: "✓" },
                    { feature: "Golden Delivery Bonus", starter: "Starter Pack", pro: "Pro Pack", commander: "Commander Pack" },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-white/5">
                      <td className="py-2.5 pr-6 text-neutral-400">{row.feature}</td>
                      <td className={`py-2.5 pr-6 text-center ${product.slug === "masterclass-starter" ? "text-green-400 font-medium" : ""}`}>{row.starter}</td>
                      <td className={`py-2.5 pr-6 text-center ${product.slug === "masterclass-pro" ? "text-amber-300 font-medium" : ""}`}>{row.pro}</td>
                      <td className={`py-2.5 text-center ${product.slug === "masterclass-commander" ? "text-purple-400 font-medium" : ""}`}>{row.commander}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-neutral-500">
              Not sure which tier fits? <a href="mailto:hello@aikagan.com" className="text-amber-300 underline">Email us</a> — we'll help you choose.
            </p>
          </div>

          {/* License rights table */}
          <div className="mt-8 rounded-3xl border border-amber-300/10 bg-black/40 p-8">
            <h2 className="text-2xl font-semibold">License rights</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-8 text-neutral-400 font-medium">Pack</th>
                    <th className="text-left py-2 pr-8 text-neutral-400 font-medium">Personal / Client</th>
                    <th className="text-left py-2 text-neutral-400 font-medium">Resell / White-label</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-8 text-green-400 font-medium">Starter</td>
                    <td className="py-2 pr-8">✓</td>
                    <td className="py-2 text-neutral-500">✗</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-8 text-amber-300 font-medium">Pro</td>
                    <td className="py-2 pr-8">✓</td>
                    <td className="py-2 text-neutral-500">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-8 text-purple-400 font-medium">Commander</td>
                    <td className="py-2 pr-8">✓</td>
                    <td className="py-2 text-green-400">✓ (white-label)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Results depend on effort and implementation — this is an execution toolkit, not a guaranteed income program.
              Full terms at <a href="/legal/terms/" className="text-amber-300 underline">aikagan.com/legal/terms</a>.
            </p>
          </div>
        </div>

        <aside className="sticky top-8 space-y-6">
          {/* Main checkout card */}
          <div className="rounded-3xl border border-amber-300/30 bg-[#0d1119] p-8 shadow-[0_0_50px_rgba(251,191,36,0.12)]">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
              Instant Digital Pack
            </p>

            {/* Price with original strikethrough */}
            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-6xl font-bold text-amber-300">
                ${product.price}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-2xl text-neutral-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-bold text-green-400">
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 text-neutral-300">
              One-time purchase. Instant access. Built for execution.
            </p>

            {/* Social proof banner */}
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-amber-300/5 border border-amber-300/10 px-4 py-3 text-sm">
              <Users className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-amber-200">
                <strong>128+ builders</strong> have joined this month
              </span>
            </div>

            <CheckoutLink
              href={product.checkoutUrl}
              productSlug={product.slug}
              productName={product.name}
              price={product.price}
              className="mt-5 block w-full rounded-2xl bg-amber-300 px-6 py-4 text-center font-semibold text-black transition hover:bg-amber-200 hover:shadow-[0_0_30px_rgba(251,191,36,0.25)]"
            >
              Buy Now — ${product.price}
            </CheckoutLink>

            <Link
              href="/legal/refund"
              className="mt-4 block text-center text-sm text-neutral-400 hover:text-white"
            >
              {product.guarantee} · View refund policy
            </Link>

            <div className="mt-6 border-t border-white/10 pt-6 text-sm text-neutral-400 space-y-2">
              <p className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" /> Instant download after checkout</p>
              <p className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-400" /> One-time payment, no subscription</p>
              <p className="flex items-center gap-2"><Star className="h-4 w-4 text-purple-400" /> Secure checkout via Paddle or LemonSqueezy</p>
            </div>
          </div>

          {/* Tier comparison card */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1119]/60 p-6">
            <p className="text-xs text-neutral-500 mb-4 uppercase tracking-widest font-semibold">Compare tiers</p>
            <div className="space-y-3">
              {[
                { slug: "masterclass-starter", name: "Starter", price: "$29", accent: "text-green-400", border: "border-green-400/20", active: product.slug === "masterclass-starter" },
                { slug: "masterclass-pro", name: "Pro", price: "$79", accent: "text-amber-300", border: "border-amber-300/20", active: product.slug === "masterclass-pro" },
                { slug: "masterclass-commander", name: "Commander", price: "$149", accent: "text-purple-400", border: "border-purple-400/20", active: product.slug === "masterclass-commander" },
              ].map((tier) => (
                <Link
                  key={tier.slug}
                  href={`/products/${tier.slug}`}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                    tier.active
                      ? `${tier.border} ${tier.accent} bg-white/5`
                      : "border-white/5 text-neutral-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {tier.active && <ArrowUpRight className={`h-3.5 w-3.5 ${tier.accent}`} />}
                    <span className={`text-sm font-medium ${tier.active ? tier.accent : ""}`}>{tier.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{tier.price}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Support card */}
          <div className="rounded-3xl border border-white/5 bg-[#0d1119]/30 p-6">
            <p className="text-xs text-neutral-500 mb-3 uppercase tracking-widest font-semibold">Need help deciding?</p>
            <a
              href="mailto:hello@aikagan.com?subject=Help%20choosing%20a%20plan"
              className="flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200 transition"
            >
              <TrendingUp className="h-4 w-4" />
              Email us — we respond within 2 hours
            </a>
          </div>
        </aside>
      </section>

      <ExitIntentModal
        productName={product.name}
        checkoutUrl={product.checkoutUrl ?? undefined}
        productSlug={product.slug}
        price={product.price}
        fallbackHref="/free/golden-delivery-sample"
      />
    </main>
  );
}
