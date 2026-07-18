import Link from "next/link";
import { ArrowRight, Check, Download, Gauge, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import CheckoutLink from "@/components/ui/CheckoutLink";
import ExitIntentModal from "@/components/ui/ExitIntentModal";
import SocialProof from "@/components/home/SocialProof";
import { products } from "@/lib/products";

const flagship =
  products.find((product) => product.slug === "masterclass-starter") ??
  products.find((product) => product.slug === "masterclass-pro") ??
  products.find((product) => product.priceModel === "one_time") ??
  products[0];

const paidPacks = ["masterclass-starter", "masterclass-pro", "masterclass-commander"]
  .map((slug) => products.find((product) => product.slug === slug))
  .filter((product): product is NonNullable<typeof product> => Boolean(product));

const freePacks = products.filter((product) => product.priceModel === "free").slice(0, 3);

const accents: Record<string, { border: string; text: string; button: string }> = {
  "masterclass-starter": {
    border: "border-emerald-400/25",
    text: "text-emerald-300",
    button: "border-emerald-300/40 text-emerald-200 hover:bg-emerald-300/10",
  },
  "masterclass-pro": {
    border: "border-amber-300/40",
    text: "text-amber-300",
    button: "bg-amber-300 text-black hover:bg-amber-200",
  },
  "masterclass-commander": {
    border: "border-purple-400/30",
    text: "text-purple-300",
    button: "border-purple-300/40 text-purple-200 hover:bg-purple-300/10",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <div className="border-b border-amber-300/20 bg-[linear-gradient(90deg,#130d02,#241803,#130d02)] px-5 py-3 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
          Current launch pricing · one-time digital offers · results depend on implementation
        </p>
      </div>

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(212,175,55,0.20),transparent_35%),linear-gradient(145deg,#08080a_0%,#120d04_55%,#08080a_100%)]" />
        <div className="absolute inset-4 border border-amber-300/[0.07]" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
              <span className="h-px w-10 bg-amber-300/50" />
              AIKAGAN Golden Delivery
            </div>

            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.96] tracking-[-0.04em] text-amber-300 sm:text-6xl lg:text-7xl">
              ProfitOS products built for execution, checkout, and delivery
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#c5b47a]">
              Practical digital operating systems, scripts, checklists, and launch blueprints. Every paid order is routed through a configured provider and fulfilled only after verified payment evidence.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <CheckoutLink
                href={flagship.checkoutUrl}
                productSlug={flagship.slug}
                productName={flagship.name}
                price={flagship.price}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black transition hover:bg-amber-200"
              >
                Start Building — ${flagship.price}
                <ArrowRight className="h-4 w-4" />
              </CheckoutLink>
              <Link
                href="/free/golden-delivery-sample"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.04] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-400/10"
              >
                Start Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#packs"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-300/35 bg-amber-300/[0.04] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-amber-200 transition hover:bg-amber-300/10"
              >
                Compare packs
              </Link>
            </div>

            <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Verified rail", body: "Provider configuration is checked before checkout is declared ready." },
                { icon: Download, title: "Secure access", body: "Payment webhooks issue expiring delivery tokens." },
                { icon: Gauge, title: "Truth dashboard", body: "Mission Control exposes blockers instead of simulated success." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-xl border border-amber-300/15 bg-black/30 p-4">
                  <Icon className="h-5 w-5 text-amber-300" />
                  <p className="mt-3 text-sm font-bold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-400">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-[90px]" />
            <div className="relative rounded-[32px] border border-amber-300/35 bg-[linear-gradient(145deg,#151005,#090909)] p-4 shadow-[0_0_80px_rgba(212,175,55,0.15)]">
              <div className="rounded-[24px] border border-amber-300/20 bg-black/40 p-8 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300/70">Flagship ProfitOS pack</p>
                <h2 className="mt-5 text-4xl font-black text-amber-300">{flagship.name}</h2>
                <p className="mt-4 text-sm leading-7 text-neutral-300">{flagship.description}</p>
                <ul className="mt-7 space-y-3">
                  {flagship.bullets.slice(0, 5).map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">One-time · digital delivery</p>
                    <p className="mt-1 text-4xl font-black text-white">${flagship.price}</p>
                  </div>
                  <Link href={`/products/${flagship.slug}`} className="text-sm font-bold text-amber-300 hover:text-amber-200">
                    Full scope →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0e]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Start without a card</p>
              <h2 className="mt-4 text-4xl font-black">See the delivery quality first</h2>
              <p className="mt-5 leading-7 text-neutral-400">
                Test the structure, writing quality, and execution style before spending a dollar. Each free asset delivers immediately on email submit.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {freePacks.map((product) => (
                <Link
                  key={product.slug}
                  href={`/free/${product.slug}`}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.03] p-5 transition hover:border-emerald-300/45 hover:bg-emerald-400/[0.07]"
                >
                  <Sparkles className="h-5 w-5 text-emerald-300" />
                  <h3 className="mt-4 font-bold text-white">{product.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">{product.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-emerald-300">Get free access <ArrowRight className="h-3 w-3" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="packs" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Paid tiers</p>
          <h2 className="mt-4 text-4xl font-black sm:text-5xl">Starter → Pro → Commander</h2>
          <p className="mt-5 text-neutral-400">
            Start at $29 and upgrade as your operation grows. Each tier unlocks deeper automation, more assets, and licensing rights.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {paidPacks.map((product) => {
            const accent = accents[product.slug] ?? accents["masterclass-pro"];
            return (
              <article key={product.slug} className={`flex flex-col rounded-3xl border ${accent.border} bg-[#0d0d10] p-7 shadow-2xl`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-[0.25em] ${accent.text}`}>{product.badge ?? product.tier}</p>
                    <h3 className="mt-3 text-3xl font-black">{product.name}</h3>
                  </div>
                  {product.originalPrice ? (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-500 line-through">${product.originalPrice}</span>
                  ) : null}
                </div>

                <p className={`mt-6 text-5xl font-black ${accent.text}`}>${product.price}</p>
                <p className="mt-5 text-sm leading-7 text-neutral-400">{product.description}</p>
                <ul className="mt-7 space-y-3">
                  {product.bullets.slice(0, 6).map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm text-neutral-300">
                      <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${accent.text}`} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <CheckoutLink
                    href={product.checkoutUrl}
                    productSlug={product.slug}
                    productName={product.name}
                    price={product.price}
                    className={`block w-full rounded-xl border px-5 py-3.5 text-center text-sm font-black uppercase tracking-wider transition ${accent.button}`}
                  >
                    Buy {product.name} — ${product.price}
                  </CheckoutLink>
                  <Link href={`/products/${product.slug}`} className="mt-4 block text-center text-xs text-neutral-500 hover:text-white">
                    Review contents and terms →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Workflow, title: "1. Checkout intent", body: "The storefront records product, source, campaign, and session evidence before requesting a provider URL." },
            { icon: ShieldCheck, title: "2. Payment confirmation", body: "Provider evidence is verified, duplicate events are rejected, and the order is written to the ledger." },
            { icon: Download, title: "3. Golden Delivery", body: "Make.com receives the purchase job while the KV queue preserves a retryable copy for fulfillment continuity." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <Icon className="h-6 w-6 text-amber-300" />
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <SocialProof />

      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/30 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15),transparent_55%),#0d0d10] px-7 py-14 text-center sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Production visibility</p>
          <h2 className="mt-4 text-4xl font-black">See the live release gates before relying on the system</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">
            Mission Control reports active payment rails, download-token configuration, fulfillment webhook, durable queue, and advisory telemetry status.
          </p>
          <Link href="/mission-control" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black hover:bg-amber-200">
            Open Mission Control <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <ExitIntentModal
        productName={flagship.name}
        checkoutUrl={flagship.checkoutUrl ?? undefined}
        productSlug={flagship.slug}
        price={flagship.price}
        fallbackHref="/free/golden-delivery-sample"
      />
    </main>
  );
}
