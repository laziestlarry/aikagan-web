import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Shield, Star, TrendingUp, Zap } from "lucide-react";
import CheckoutLink from "@/components/ui/CheckoutLink";
import ExitIntentModal from "@/components/ui/ExitIntentModal";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products
    .filter((product) => product.priceModel === "one_time")
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.priceModel !== "one_time") {
    return { title: "Product Not Found | AutonomaX" };
  }

  return {
    title: `${product.name} | AutonomaX`,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

const comparisonRows = [
  { feature: "Price", starter: "$29", pro: "$79", commander: "$149" },
  { feature: "Full Blueprint", starter: "✓", pro: "✓", commander: "✓" },
  { feature: "Offer Templates", starter: "3", pro: "5", commander: "Unlimited" },
  { feature: "Automation Workflows", starter: "—", pro: "6", commander: "Full OS" },
  { feature: "Traffic Playbook", starter: "—", pro: "✓", commander: "✓" },
  { feature: "Scale Sprint", starter: "—", pro: "—", commander: "60-day" },
  { feature: "White-label Rights", starter: "✗", pro: "✗", commander: "✓" },
  { feature: "KPI Dashboard", starter: "—", pro: "—", commander: "✓" },
  { feature: "Golden Delivery Bonus", starter: "Starter Pack", pro: "Pro Pack", commander: "Commander Pack" },
];

const tiers = [
  { slug: "masterclass-starter", name: "Starter", price: "$29", accent: "text-green-400", border: "border-green-400/20" },
  { slug: "masterclass-pro", name: "Pro", price: "$79", accent: "text-amber-300", border: "border-amber-300/20" },
  { slug: "masterclass-commander", name: "Commander", price: "$149", accent: "text-purple-400", border: "border-purple-400/20" },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.priceModel !== "one_time") notFound();

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const isMasterclass = product.slug.startsWith("masterclass-");
  const deliverySteps = product.deliverySteps ?? [
    "Checkout completes through the first verified payment rail available for this offer.",
    "A successful provider webhook issues the secure delivery token and records the order.",
    "Open the delivered pack and read START_HERE first to map the included files.",
    "Use the execution checklist, scripts, and templates directly in your operating workflow.",
  ];

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-16 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Link href="/products" className="text-sm text-amber-300 hover:text-amber-200">
            ← Back to products
          </Link>

          {product.image ? (
            <div className="mb-6 mt-8 max-w-md overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={product.image}
                alt={`${product.name} Pack`}
                width={480}
                height={300}
                className="h-auto w-full"
                priority
              />
            </div>
          ) : null}

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
              {deliverySteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex-shrink-0 font-bold text-amber-300">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            {product.fulfillmentWindow ? (
              <p className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-300/5 px-4 py-3 text-sm text-sky-100">
                Fulfillment target: {product.fulfillmentWindow}.
              </p>
            ) : null}
          </div>

          {isMasterclass ? (
            <>
              <div className="mt-8 rounded-3xl border border-amber-300/10 bg-black/40 p-8">
                <h2 className="text-2xl font-semibold">Compare plans</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-6 text-left font-medium text-neutral-400">Feature</th>
                        <th className="py-2 pr-6 text-center font-medium text-green-400">Starter</th>
                        <th className="py-2 pr-6 text-center font-medium text-amber-300">Pro</th>
                        <th className="py-2 text-center font-medium text-purple-400">Commander</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-300">
                      {comparisonRows.map((row) => (
                        <tr key={row.feature} className="border-b border-white/5">
                          <td className="py-2.5 pr-6 text-neutral-400">{row.feature}</td>
                          <td className={`py-2.5 pr-6 text-center ${product.slug === "masterclass-starter" ? "font-medium text-green-400" : ""}`}>{row.starter}</td>
                          <td className={`py-2.5 pr-6 text-center ${product.slug === "masterclass-pro" ? "font-medium text-amber-300" : ""}`}>{row.pro}</td>
                          <td className={`py-2.5 text-center ${product.slug === "masterclass-commander" ? "font-medium text-purple-400" : ""}`}>{row.commander}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-amber-300/10 bg-black/40 p-8">
                <h2 className="text-2xl font-semibold">License rights</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-8 text-left font-medium text-neutral-400">Pack</th>
                        <th className="py-2 pr-8 text-left font-medium text-neutral-400">Personal / Client</th>
                        <th className="py-2 text-left font-medium text-neutral-400">Resell / White-label</th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-300">
                      <tr className="border-b border-white/5"><td className="py-2 pr-8 font-medium text-green-400">Starter</td><td className="py-2 pr-8">✓</td><td className="py-2 text-neutral-500">✗</td></tr>
                      <tr className="border-b border-white/5"><td className="py-2 pr-8 font-medium text-amber-300">Pro</td><td className="py-2 pr-8">✓</td><td className="py-2 text-neutral-500">✗</td></tr>
                      <tr><td className="py-2 pr-8 font-medium text-purple-400">Commander</td><td className="py-2 pr-8">✓</td><td className="py-2 text-green-400">✓ (white-label)</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-neutral-500">
                  Results depend on effort and implementation. This is an execution toolkit, not a guaranteed-income program. Full terms are available in the <Link href="/legal/terms" className="text-amber-300 underline">terms</Link>.
                </p>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-3xl border border-sky-300/10 bg-black/40 p-8">
              <h2 className="text-2xl font-semibold">Best-fit use cases</h2>
              <ul className="mt-5 grid gap-3 text-neutral-300 md:grid-cols-2">
                {[
                  "You have an idea but no clear business model.",
                  "You have dormant assets and need a practical launch path.",
                  "You want an offer, funnel, and execution sequence before building more software.",
                  "You need a structured operating summary before deeper implementation.",
                ].map((item) => (
                  <li key={item} className="flex gap-3"><span className="text-sky-300">✓</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="sticky top-8 space-y-6">
          <div className="rounded-3xl border border-amber-300/30 bg-[#0d1119] p-8 shadow-[0_0_50px_rgba(251,191,36,0.12)]">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
              {product.deliveryMode === "service" ? "Structured Delivery" : "Digital Pack"}
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-6xl font-bold text-amber-300">${product.price}</p>
              {product.originalPrice && product.originalPrice > product.price ? (
                <>
                  <span className="text-2xl text-neutral-500 line-through">${product.originalPrice}</span>
                  <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-bold text-green-400">Save {discountPct}%</span>
                </>
              ) : null}
            </div>
            <p className="mt-4 text-neutral-300">
              One-time purchase. {product.deliveryMode === "service" ? "Tracked intake and delivery." : "Secure digital fulfillment."}
            </p>

            <div className="mt-5 rounded-xl border border-amber-300/10 bg-amber-300/5 px-4 py-3 text-sm text-amber-100">
              Checkout is routed only through a provider verified by the production readiness gate.
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

            <Link href="/legal/refund" className="mt-4 block text-center text-sm text-neutral-400 hover:text-white">
              {product.guarantee ?? "View refund policy"}
            </Link>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-6 text-sm text-neutral-400">
              <p className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" /> {product.deliveryMode === "service" ? "Post-purchase intake and tracked delivery" : "Secure fulfillment after provider confirmation"}</p>
              <p className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-400" /> One-time payment, no subscription</p>
              <p className="flex items-center gap-2"><Star className="h-4 w-4 text-purple-400" /> Provider webhooks issue expiring download access</p>
            </div>
          </div>

          {isMasterclass ? (
            <div className="rounded-3xl border border-white/10 bg-[#0d1119]/60 p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Compare tiers</p>
              <div className="space-y-3">
                {tiers.map((tier) => {
                  const active = product.slug === tier.slug;
                  return (
                    <Link
                      key={tier.slug}
                      href={`/products/${tier.slug}`}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${active ? `${tier.border} ${tier.accent} bg-white/5` : "border-white/5 text-neutral-400 hover:border-white/20 hover:text-white"}`}
                    >
                      <div className="flex items-center gap-2">
                        {active ? <ArrowUpRight className={`h-3.5 w-3.5 ${tier.accent}`} /> : null}
                        <span className={`text-sm font-medium ${active ? tier.accent : ""}`}>{tier.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{tier.price}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/5 bg-[#0d1119]/30 p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Need help deciding?</p>
            <a href="mailto:hello@aikagan.com?subject=Help%20choosing%20a%20plan" className="flex items-center gap-2 text-sm text-amber-300 transition hover:text-amber-200">
              <TrendingUp className="h-4 w-4" /> Email support — response target within 24 hours
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
