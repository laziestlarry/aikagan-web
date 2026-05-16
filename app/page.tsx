import Link from "next/link";
import { products } from "@/lib/products";

const productStyles: Record<string, any> = {
  "golden-delivery-starter": {
    accent: "border-emerald-400/40",
    glow: "shadow-emerald-400/10",
    badge: "bg-emerald-400/15 text-emerald-300 border-emerald-300/30",
    icon: "🟢",
  },
  "golden-delivery-pro": {
    accent: "border-amber-300/60",
    glow: "shadow-amber-300/20",
    badge: "bg-amber-300 text-black border-amber-200",
    ribbon: "MOST POPULAR",
    icon: "⚡",
  },
  "golden-delivery-commander": {
    accent: "border-purple-400/50",
    glow: "shadow-purple-400/20",
    badge: "bg-purple-400/15 text-purple-300 border-purple-300/30",
    icon: "👑",
  },
};

const faq = [
  {
    q: "Who are these packs actually for?",
    a: "Anyone who wants to build an AI-assisted revenue stream — freelancers, consultants, creators, and small operators. No audience required for the Starter Pack. No paid ads required for any of them.",
  },
  {
    q: "Is this just templates and PDFs that will sit in my downloads folder?",
    a: "No. Every file is an execution document — meaning it has specific tasks, copy you can paste, checklists with checkboxes, and benchmarks to measure progress. We cut everything that isn't directly actionable.",
  },
  {
    q: "What if I buy the Starter and want to upgrade to Pro or Commander?",
    a: "Each pack stands alone and has its own checkout. You can buy in sequence or jump straight to Commander if you already have momentum. There's no forced upgrade path.",
  },
  {
    q: "I've bought courses before and gotten nothing from them. Why is this different?",
    a: "Fair question. This isn't a course — there's no video to watch, no module to complete before you get to the 'good stuff.' You open the file, follow the checklist, and execute. The Starter Pack's 7-day blueprint tells you exactly what to do each day. That's it.",
  },
  {
    q: "What's the refund policy?",
    a: "30-day money-back guarantee on all packs. If you followed the execution plan and got nothing from it, email us and we'll refund you in full. We've never had a complaint from someone who actually ran the blueprint.",
  },
  {
    q: "Where does the AutonomaX system fit in?",
    a: "AutonomaX is the AI revenue engine that powers the analysis, offer modeling, and behavior tracking behind these packs. Each pack includes a System Access Guide showing you how to use it for your specific tier.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#08080a]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-black tracking-[0.25em] text-amber-300">
            AIKAGAN
          </Link>
          <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            {["Home", "Products", "About", "Blog", "Contact"].map((item) => (
              <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="transition hover:text-amber-300">
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/products/golden-delivery-starter"
              className="rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-black hover:bg-amber-200">
              Start at $29
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_75%_20%,rgba(245,197,66,0.18),transparent_35%),linear-gradient(135deg,#08080a,#0d1119_50%,#111827)]">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:py-36">
          <p className="mb-5 text-sm font-bold tracking-[0.35em] text-amber-300">
            AUTONOMAX GOLDEN DELIVERY
          </p>
          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Stop Preparing.<br />
            <span className="text-amber-300">Start Getting Paid.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-xl leading-8 text-zinc-300">
            Three download packs. One complete system. First sale in 7 days at $29 —
            or scale to $10K+/month at $149. No audience. No ads. No guesswork.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/products/golden-delivery-starter"
              className="rounded-full bg-amber-300 px-8 py-4 text-base font-black text-black hover:bg-amber-200">
              Get the Starter Pack — $29
            </Link>
            <Link href="#packs"
              className="rounded-full border border-amber-300/40 px-8 py-4 text-base font-bold text-amber-200 hover:bg-amber-300/10">
              See All Three Packs
            </Link>
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            ✓ Instant download &nbsp;·&nbsp; ✓ 30-day money-back guarantee &nbsp;·&nbsp; ✓ One-time payment
          </p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            Most people have the skill.<br />
            <span className="text-amber-300">They're missing the system.</span>
          </h2>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl mx-auto">
            You know AI can generate revenue. You've seen others do it. But between "I should do this" and "I made money today" there's a gap filled with vague advice, conflicting information, and decision fatigue.
          </p>
          <p className="text-zinc-300 text-lg leading-relaxed max-w-2xl mx-auto mt-4">
            The Golden Delivery packs close that gap. Not with videos to watch or courses to complete — with execution blueprints, copy-paste scripts, and day-by-day plans you follow once and deploy.
          </p>
        </div>
      </section>

      {/* VALUE LADDER */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-bold tracking-[0.3em] text-amber-300 mb-3">THE VALUE LADDER</p>
            <h2 className="text-3xl md:text-4xl font-black">Three packs. One complete system.</h2>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto">Each pack builds on the last. Start at $29 and add only what you need, when you need it.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                price: "$29",
                name: "Starter Pack",
                tag: "Launch Ignition",
                goal: "First sale in 7 days",
                files: "7 files",
                desc: "Blueprint, scripts, checklist. Zero audience required.",
                href: "/products/golden-delivery-starter",
                color: "border-emerald-400/30",
                textColor: "text-emerald-300",
              },
              {
                price: "$79",
                name: "Pro Pack",
                tag: "Revenue Operations",
                goal: "$1,000/month system",
                files: "9 files",
                desc: "Funnels, traffic, AI tools, 30-day calendar, offer templates.",
                href: "/products/golden-delivery-pro",
                color: "border-amber-300/50",
                textColor: "text-amber-300",
                highlight: true,
              },
              {
                price: "$149",
                name: "Commander Pack",
                tag: "Empire Architecture",
                goal: "$10K+/month framework",
                files: "12 files",
                desc: "White-label rights, 60-day sprint, partnerships, automation OS.",
                href: "/products/golden-delivery-commander",
                color: "border-purple-400/40",
                textColor: "text-purple-300",
              },
            ].map((tier) => (
              <div key={tier.name}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border ${tier.color} ${tier.highlight ? "bg-amber-300/5" : "bg-[#0d1119]"} px-6 py-5`}>
                <div className="flex items-center gap-5">
                  <div className={`text-3xl font-black ${tier.textColor} w-16 shrink-0`}>{tier.price}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-white">{tier.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${tier.color} ${tier.textColor}`}>{tier.tag}</span>
                    </div>
                    <p className="text-sm text-zinc-400">{tier.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <div className={`text-sm font-bold ${tier.textColor}`}>{tier.goal}</div>
                    <div className="text-xs text-zinc-500">{tier.files}</div>
                  </div>
                  <Link href={tier.href}
                    className={`rounded-full px-5 py-2.5 text-sm font-black transition ${tier.highlight ? "bg-amber-300 text-black hover:bg-amber-200" : "border border-white/20 text-white hover:border-amber-300/50 hover:text-amber-300"}`}>
                    View Pack →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section id="packs" className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold tracking-[0.3em] text-amber-300 mb-3">CHOOSE YOUR PACK</p>
            <h2 className="text-4xl font-black md:text-5xl">Everything that's inside.</h2>
            <p className="mt-4 text-zinc-400">No vague promises. No placeholder content. Every file is listed.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {products.map((product: any) => {
              const style = productStyles[product.slug] ?? productStyles["golden-delivery-starter"];
              return (
                <article key={product.slug}
                  className={`relative flex flex-col rounded-[2rem] border ${style.accent} bg-[#0d1119] p-7 shadow-2xl ${style.glow}`}>
                  {style.ribbon && (
                    <div className="absolute right-6 top-6 rounded-full bg-amber-300 px-4 py-1 text-xs font-black text-black">
                      {style.ribbon}
                    </div>
                  )}
                  <div className="mb-5 text-3xl">{style.icon}</div>
                  <span className={`inline-flex self-start rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}>
                    {product.badge ?? product.tier}
                  </span>
                  <h3 className="mt-4 text-2xl font-black">{product.name} Pack</h3>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-4xl font-black text-amber-300">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-neutral-500 line-through text-lg">${product.originalPrice}</span>
                    )}
                  </div>
                  <p className="mt-4 text-zinc-400 text-sm leading-relaxed flex-grow">
                    {product.description}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm text-zinc-300">
                    {(product.bullets ?? []).slice(0, 5).map((item: string) => (
                      <li key={item} className="flex gap-3">
                        <span className="text-amber-300 shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 space-y-3">
                    <Link href={`/products/${product.slug}`}
                      className="inline-flex w-full justify-center rounded-full bg-amber-300 px-5 py-3.5 font-black text-black hover:bg-amber-200 transition">
                      Get for ${product.price} →
                    </Link>
                    <p className="text-xs text-center text-zinc-500">{product.guarantee}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-sm font-bold tracking-[0.3em] text-amber-300 mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl md:text-4xl font-black">From download to revenue in 4 steps.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Download instantly", desc: "One-time payment. Files in your hands in 60 seconds." },
              { step: "02", title: "Read Start Here", desc: "Every pack has an orientation doc that tells you exactly what order to work through files." },
              { step: "03", title: "Execute the blueprint", desc: "Follow the day-by-day plan. Use the scripts verbatim. Check off the checklist." },
              { step: "04", title: "Get paid", desc: "The Starter Pack benchmark is a first sale in 7 days. Pro targets $1K in 30. Commander targets $10K in 60." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-amber-300/40 bg-amber-300/10 flex items-center justify-center text-amber-300 font-black text-sm">
                  {item.step}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-white/10 bg-[#111827]">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "◆", text: "30-Day Money-Back Guarantee" },
            { icon: "◆", text: "Instant Download — 60 Seconds" },
            { icon: "◆", text: "One-Time Payment, Yours Forever" },
            { icon: "◆", text: "Zero Fluff — All Execution" },
          ].map((item) => (
            <div key={item.text} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center text-sm font-bold text-zinc-200">
              <span className="mr-2 text-amber-300">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-sm font-bold tracking-[0.3em] text-amber-300 mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black">Every objection, answered.</h2>
          </div>
          <div className="space-y-8">
            {faq.map((item) => (
              <div key={item.q} className="border-b border-white/5 pb-8">
                <h3 className="font-black text-lg text-white mb-3">{item.q}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-300/10 via-[#111827] to-black p-10 text-center shadow-2xl shadow-amber-300/10 md:p-16">
            <h2 className="text-4xl font-black md:text-5xl">
              Pick your level. Start today.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-zinc-300 text-lg">
              $29 if you need your first sale. $79 if you need your first thousand. $149 if you're building the empire.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/products/golden-delivery-starter"
                className="rounded-full bg-amber-300 px-7 py-4 font-black text-black hover:bg-amber-200">
                Starter — $29
              </Link>
              <Link href="/products/golden-delivery-pro"
                className="rounded-full border border-amber-300/50 px-7 py-4 font-bold text-amber-200 hover:bg-amber-300/10">
                Pro — $79
              </Link>
              <Link href="/products/golden-delivery-commander"
                className="rounded-full border border-purple-400/40 px-7 py-4 font-bold text-purple-300 hover:bg-purple-400/10">
                Commander — $149
              </Link>
            </div>
            <p className="mt-6 text-xs text-zinc-500">All packs include 30-day money-back guarantee · Instant download · One-time payment</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black tracking-[0.25em] text-amber-300">AIKAGAN</h3>
            <p className="mt-4 max-w-md text-zinc-400 text-sm leading-relaxed">
              AI-assisted revenue systems for operators who are done preparing and ready to ship. Three packs. One complete system. Start at $29.
            </p>
            <form className="mt-6 flex max-w-md gap-3">
              <input type="email" placeholder="Email address"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-zinc-500 text-sm" />
              <button className="rounded-full bg-amber-300 px-5 py-3 font-black text-black text-sm">Join</button>
            </form>
          </div>
          {[
            ["Products", [
              ["Starter Pack ($29)", "/products/golden-delivery-starter"],
              ["Pro Pack ($79)", "/products/golden-delivery-pro"],
              ["Commander Pack ($149)", "/products/golden-delivery-commander"],
            ]],
            ["Company", [
              ["About", "/about"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ]],
            ["Support", [
              ["Refund Policy", "/legal/refund"],
              ["Legal", "/legal"],
              ["Help", "/help"],
            ]],
          ].map(([title, links]) => (
            <div key={title as string}>
              <h4 className="font-black text-white text-sm">{title as string}</h4>
              <div className="mt-4 space-y-3 text-sm text-zinc-400">
                {(links as [string, string][]).map(([label, href]) => (
                  <Link key={label} href={href} className="block hover:text-amber-300 transition">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
          © 2026 AIKAGAN · AutonomaX Golden Delivery System. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
