import Link from "next/link";
import { products } from "@/lib/products";

const productStyles: Record<string, { accent: string; glow: string; badge: string; ribbon?: string; icon: string; cta: string }> = {
  "golden-delivery-starter": {
    accent: "border-emerald-400/30",
    glow: "",
    badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    icon: "🚀",
    cta: "Get Starter — $29",
  },
  "golden-delivery-pro": {
    accent: "border-amber-300/50",
    glow: "shadow-amber-300/10 shadow-2xl",
    badge: "bg-amber-300 text-black border-amber-200",
    ribbon: "MOST POPULAR",
    icon: "⚡",
    cta: "Get Pro — $79",
  },
  "golden-delivery-commander": {
    accent: "border-purple-400/40",
    glow: "",
    badge: "bg-purple-400/10 text-purple-300 border-purple-400/30",
    icon: "👑",
    cta: "Get Commander — $149",
  },
};

const faq = [
  {
    q: "Who are these packs actually for?",
    a: "Anyone building an AI-assisted revenue stream — freelancers, consultants, creators, and small operators. No audience required for the Starter Pack. No paid ads required for any of them.",
  },
  {
    q: "Is this just templates and PDFs that will sit in my downloads folder?",
    a: "No. Every file is an execution document — specific tasks, copy you can paste, checklists with checkboxes, and benchmarks to measure progress. We cut everything that isn't directly actionable.",
  },
  {
    q: "What if I buy the Starter and want to upgrade to Pro or Commander?",
    a: "Each pack stands alone. You can buy in sequence or jump straight to Commander if you already have momentum. There's no forced upgrade path.",
  },
  {
    q: "I've bought courses before and gotten nothing from them. Why is this different?",
    a: "This isn't a course — no videos to watch, no modules to unlock before the good stuff. You open the file, follow the checklist, execute. The 7-day blueprint tells you exactly what to do each day.",
  },
  {
    q: "What's the refund policy?",
    a: "30-day money-back guarantee on all packs. Follow the execution plan, get nothing from it, email us — full refund. No hoops.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#08080a] text-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,197,66,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.06),transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-amber-300 mb-8 uppercase">
                AutonomaX Golden Delivery
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
                Stop<br />Preparing.<br />
                <span className="text-amber-300">Start Getting<br />Paid.</span>
              </h1>

              <p className="mt-8 text-lg text-zinc-300 leading-relaxed max-w-lg">
                Three download packs. One complete system. First sale in 7 days at $29 — or scale to $10K+/month at $149. No audience. No ads. No guesswork.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/products/golden-delivery-starter"
                  className="rounded-full bg-amber-300 px-7 py-3.5 text-sm font-black text-black hover:bg-amber-200 transition-colors">
                  Start at $29 →
                </Link>
                <Link href="#packs"
                  className="rounded-full border border-white/30 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-zinc-300 hover:border-amber-300/50 hover:bg-amber-300/5 hover:text-amber-300 transition-colors">
                  See all three packs
                </Link>
              </div>

              <p className="mt-5 text-xs text-zinc-500">
                ✓ Instant download &nbsp;·&nbsp; ✓ 30-day guarantee &nbsp;·&nbsp; ✓ One-time payment
              </p>
            </div>

            {/* Right — visual card stack */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {/* Back card */}
                <div className="absolute -top-4 -right-4 w-full rounded-2xl border border-purple-400/20 bg-[#0d1119] p-5 rotate-3 opacity-60">
                  <div className="text-xs text-purple-300 font-bold mb-2">Commander — $149</div>
                  <div className="text-sm text-zinc-400">12 files · Empire architecture · White-label rights</div>
                </div>
                {/* Mid card */}
                <div className="absolute -top-2 -left-3 w-full rounded-2xl border border-emerald-400/20 bg-[#0d1119] p-5 -rotate-2 opacity-70">
                  <div className="text-xs text-emerald-300 font-bold mb-2">Starter — $29</div>
                  <div className="text-sm text-zinc-400">7 files · First sale in 7 days · Zero audience</div>
                </div>
                {/* Front card */}
                <div className="relative rounded-2xl border border-amber-300/40 bg-[#111827] p-6 shadow-2xl shadow-amber-300/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-widest">Pro Pack</span>
                    <span className="rounded-full bg-amber-300 px-2.5 py-0.5 text-xs font-black text-black">POPULAR</span>
                  </div>
                  <div className="text-4xl font-black text-amber-300 mb-1">$79</div>
                  <div className="text-xs text-zinc-500 line-through mb-4">$297</div>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {["Funnel Master Guide", "AI Tools Stack", "30-Day Revenue Calendar", "5 Offer Templates", "+ 5 more files"].map(i => (
                      <li key={i} className="flex gap-2"><span className="text-amber-300">✓</span>{i}</li>
                    ))}
                  </ul>
                  <Link href="/products/golden-delivery-pro"
                    className="mt-5 block text-center rounded-full bg-amber-300 px-4 py-2.5 text-xs font-black text-black hover:bg-amber-200 transition-colors">
                    Get Pro Access →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="border-y border-white/5 bg-[#0d1119]">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: "3", label: "Execution packs" },
            { n: "28", label: "Total files across all packs" },
            { n: "7", label: "Days to first sale (Starter)" },
            { n: "$10K+", label: "Monthly target (Commander)" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-black text-amber-300">{s.n}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VALUE LADDER ── */}
      <section className="px-6 py-24 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] text-amber-300 uppercase mb-3">The Value Ladder</p>
          <h2 className="text-3xl md:text-4xl font-black">Three packs. One complete system.</h2>
          <p className="mt-3 text-zinc-400 text-sm max-w-md mx-auto">Start at $29. Add only what you need, when you need it.</p>
        </div>

        <div className="space-y-4">
          {[
            {
              price: "$29", name: "Starter Pack", tag: "Launch Ignition", goal: "First sale in 7 days",
              files: "7 files", desc: "Blueprint, DM scripts, offer worksheet, objection crusher, activation checklist.",
              href: "/products/golden-delivery-starter", color: "border-emerald-400/25 hover:border-emerald-400/50",
              priceColor: "text-emerald-300",
            },
            {
              price: "$79", name: "Pro Pack", tag: "Revenue Operations", goal: "$1K/month system",
              files: "9 files", desc: "Funnels, AI tools stack, traffic playbook, 30-day calendar, 5 offer templates.",
              href: "/products/golden-delivery-pro", color: "border-amber-300/40 hover:border-amber-300/70 bg-amber-300/[0.03]",
              priceColor: "text-amber-300", highlight: true,
            },
            {
              price: "$149", name: "Commander Pack", tag: "Empire Architecture", goal: "$10K+/month framework",
              files: "12 files", desc: "White-label rights, 60-day sprint, partnerships, automation OS, KPI dashboard.",
              href: "/products/golden-delivery-commander", color: "border-purple-400/25 hover:border-purple-400/50",
              priceColor: "text-purple-300",
            },
          ].map(tier => (
            <div key={tier.name}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border ${tier.color} bg-[#0d1119] px-6 py-5 transition-colors`}>
              <div className="flex items-start sm:items-center gap-5">
                <div className={`text-2xl font-black ${tier.priceColor} w-14 shrink-0 pt-0.5`}>{tier.price}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-black text-white text-sm">{tier.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${tier.color} ${tier.priceColor} opacity-80`}>{tier.tag}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{tier.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                <div className="text-right">
                  <div className={`text-xs font-bold ${tier.priceColor}`}>{tier.goal}</div>
                  <div className="text-xs text-zinc-600">{tier.files}</div>
                </div>
                <Link href={tier.href}
                  className={`rounded-full px-5 py-2.5 text-xs font-black transition-colors whitespace-nowrap
                    ${tier.highlight
                      ? "bg-amber-300 text-black hover:bg-amber-200"
                      : "border border-white/20 text-zinc-200 hover:border-amber-300/50 hover:bg-amber-300/5 hover:text-amber-300"}`}>
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT CARDS ── */}
      <section id="packs" className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] text-amber-300 uppercase mb-3">Choose Your Pack</p>
            <h2 className="text-3xl md:text-4xl font-black">Everything that's inside.</h2>
            <p className="mt-3 text-zinc-500 text-sm">Every file listed. No placeholder promises.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {products.map((product: any) => {
              const style = productStyles[product.slug] ?? productStyles["golden-delivery-starter"];
              return (
                <article key={product.slug}
                  className={`relative flex flex-col rounded-2xl border ${style.accent} ${style.glow} bg-[#0d1119] p-6`}>
                  {style.ribbon && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-300 px-4 py-1 text-xs font-black text-black whitespace-nowrap">
                      {style.ribbon}
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4 mt-2">
                    <span className="text-2xl">{style.icon}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${style.badge}`}>
                      {product.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black mb-1">{product.name} Pack</h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-amber-300">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-zinc-600 line-through text-sm">${product.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-zinc-500 text-xs leading-relaxed mb-5 flex-1">{product.description}</p>

                  <ul className="space-y-2 mb-6">
                    {(product.bullets ?? []).slice(0, 5).map((item: string) => (
                      <li key={item} className="flex gap-2 text-xs text-zinc-300">
                        <span className="text-amber-300 shrink-0 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`/products/${product.slug}`}
                    className={`mt-auto block text-center rounded-full px-5 py-3 text-sm font-black transition-colors
                      ${style.ribbon
                        ? "bg-amber-300 text-black hover:bg-amber-200"
                        : "border border-white/20 text-zinc-200 hover:border-amber-300/50 hover:bg-amber-300/5 hover:text-amber-300"}`}>
                    {style.cta}
                  </Link>
                  <p className="text-xs text-zinc-500 text-center mt-2">{product.guarantee}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] text-amber-300 uppercase mb-3">How It Works</p>
            <h2 className="text-3xl font-black">Download. Execute. Get paid.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: "01", title: "Download", desc: "One-time payment. Files in your hands in 60 seconds." },
              { n: "02", title: "Start Here", desc: "Every pack has an orientation doc with the exact order to work through files." },
              { n: "03", title: "Execute", desc: "Follow the day-by-day blueprint. Use the scripts. Check the checklist." },
              { n: "04", title: "Get Paid", desc: "Starter: first sale in 7 days. Pro: $1K in 30. Commander: $10K in 60." },
            ].map(s => (
              <div key={s.n} className="relative pl-10">
                <div className="absolute left-0 top-0 text-3xl font-black text-white/5">{s.n}</div>
                <div className="w-8 h-px bg-amber-300/40 mb-4" />
                <h3 className="font-black text-white mb-2 text-sm break-normal">{s.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <div className="border-y border-white/5 bg-[#0d1119]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap justify-center gap-8">
          {["✓ 30-Day Money-Back Guarantee", "✓ Instant Download", "✓ One-Time Payment, Yours Forever", "✓ Zero Fluff — All Execution"].map(t => (
            <span key={t} className="text-xs font-semibold text-zinc-400">{t}</span>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.3em] text-amber-300 uppercase mb-3">FAQ</p>
            <h2 className="text-3xl font-black">Every objection, answered.</h2>
          </div>
          <div className="divide-y divide-white/5">
            {faq.map(item => (
              <div key={item.q} className="py-7">
                <h3 className="font-black text-white mb-3 text-sm">{item.q}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-300/8 to-transparent p-12 md:p-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Pick your level.<br />Start today.
            </h2>
            <p className="text-zinc-400 mb-10 max-w-md mx-auto">
              $29 for your first sale. $79 for your first thousand. $149 for the empire.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/products/golden-delivery-starter"
                className="rounded-full bg-amber-300 px-7 py-3.5 text-sm font-black text-black hover:bg-amber-200 transition-colors">
                Starter — $29
              </Link>
              <Link href="/products/golden-delivery-pro"
                className="rounded-full border border-amber-300/30 px-7 py-3.5 text-sm font-semibold text-amber-200 hover:bg-amber-300/10 transition-colors">
                Pro — $79
              </Link>
              <Link href="/products/golden-delivery-commander"
                className="rounded-full border border-purple-400/30 px-7 py-3.5 text-sm font-semibold text-purple-300 hover:bg-purple-400/10 transition-colors">
                Commander — $149
              </Link>
            </div>
            <p className="mt-6 text-xs text-zinc-500">All packs · 30-day guarantee · Instant download · One-time payment</p>
          </div>
        </div>
      </section>

    </div>
  );
}
