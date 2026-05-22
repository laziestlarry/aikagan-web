import Link from "next/link";
import { products } from "@/lib/products";

export const metadata = {
  title: "AutonomaX Golden Delivery Commander Pack — Scale to $10K+/Month",
  description:
    "12-file Empire Architecture. White-label rights, 60-day sprint, partnership playbook, automation OS, KPI dashboard, and $10K+/month revenue path models. $149 one-time.",
};

export default function Page() {
  const product = products.find((p) => p.slug === "golden-delivery-commander");
  if (!product) return <main className="p-10">Product not found.</main>;

  return (
    <main className="min-h-screen bg-[#08080a] text-white">

      {/* HERO */}
      <section className="px-6 pt-24 pb-16 mx-auto max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-300">
          AutonomaX Golden Delivery · Commander Pack
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          Build the Empire.<br />
          <span className="text-amber-300">$10K+/Month. Yours to Scale.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-neutral-300 leading-relaxed">
          12 files that give you the complete architecture for a 5-layer AI revenue empire — including white-label rights to resell the system, a 60-day scaling sprint, partnership deal templates, a full automation OS, and three modeled paths to $10K+/month.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <a
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
          >
            Get Commander Access — $149
          </a>
          <span className="text-sm text-neutral-400 line-through">${product.originalPrice} regular price</span>
        </div>
        <p className="mt-3 text-xs text-neutral-500">✓ Instant download &nbsp;·&nbsp; ✓ 30-day money-back guarantee &nbsp;·&nbsp; ✓ One-time payment</p>
      </section>

      {/* THE COMMANDER SHIFT */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            At $1K/month, you&apos;ve proven the model. The Commander Pack exists to break the ceiling.
          </h2>
          <p className="mt-4 text-neutral-300 text-lg leading-relaxed max-w-3xl">
            Most operators plateau because they&apos;re still running manual systems at volume. Commander gives you the architecture, automation OS, and strategic frameworks to run a business that scales without your time being the bottleneck.
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">What&apos;s Inside</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-12">12 files. Empire architecture.</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Master System Map",
                desc: "Complete 5-layer empire architecture with ASCII diagram, offer ladder table, three buyer path models (Natural Ladder, Skip-Level, Continuity Anchor), revenue modeling template, and system health indicators.",
              },
              {
                num: "02",
                title: "White-Label Guide",
                desc: "4-step process to license and resell AutonomaX as your own brand. Covers positioning options, brand creation, content transformation requirements, three pricing models (one-time / bundled license / agency), and a 4-week launch checklist.",
              },
              {
                num: "03",
                title: "60-Day Scale Sprint",
                desc: "Week 0 baseline audit plus 8 themed weeks: Foundation Hardening, Traffic Multiplier, Offer Expansion, Partnership Launch, Automation Depth, Scale Experiment, Continuity Launch, and Review. KPI targets and experiments for each week.",
              },
              {
                num: "04",
                title: "Partnership Playbook",
                desc: "5 deal types (Content Swap, Affiliate/Commission, Co-Creation, Bundle, Podcast/YouTube) with commission rate tables, outreach templates, a qualification framework (green/yellow/red), and monthly targets.",
              },
              {
                num: "05",
                title: "Automation OS",
                desc: "Full automation stack map across 6 layers, human-machine decision matrix, 5 failure modes with prevention protocols, monthly health checklist, and cron-style automation schedule.",
              },
              {
                num: "06",
                title: "KPI Dashboard",
                desc: "4 metric tiers (Revenue, Funnel, Acquisition, Retention), weekly dashboard template, 5 diagnostic scenarios with response playbooks, and a red-flags list to catch problems before they compound.",
              },
              {
                num: "07",
                title: "Revenue Paths Deep Dive",
                desc: "Three modeled paths — Digital Products ($11K/mo conservative model), Services ($10K/mo model with sales process), and Hybrid ($11K/mo at 25–30 hrs/week) — each with a stage-by-stage roadmap and decision framework.",
              },
              {
                num: "08",
                title: "Advanced Workflows (8 systems)",
                desc: "Multi-Product Funnel Orchestration, Automated Objection Re-Engagement, Customer Success Loop, Win-Back Sequence, Partnership Revenue Tracking, Content Repurposing Engine, Launch Sequence, and Monthly Business Review.",
              },
              {
                num: "09",
                title: "VIP Onboarding System",
                desc: "Commander onboarding checklist for your first 7 days, plus 4 customer-facing email templates: welcome, 24h check-in, 7-day results, and testimonial request — with psychology explanation for each.",
              },
              {
                num: "10",
                title: "Start Here — Commander Orientation",
                desc: "5 Commander capabilities explained, the first week plan, and the mindset shift that separates operators who scale from those who stay stuck.",
              },
              {
                num: "11",
                title: "System Access Guide (Commander Tier)",
                desc: "Full Commander-tier unlock of the AutonomaX engine — all advanced analytics, automation triggers, and white-label configuration tools.",
              },
              {
                num: "12",
                title: "Commander Pack Index (README)",
                desc: "Complete file index with reading order recommendation based on your current monthly revenue.",
              },
            ].map((item) => (
              <div key={item.num} className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <span className="text-xs text-amber-300 font-mono">{item.num}</span>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVENUE MODELS */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Revenue Path Models</p>
          <h2 className="text-2xl font-semibold mb-8">Three documented paths to $10K+/month:</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                path: "Digital Products",
                target: "$11K/mo",
                desc: "5-product portfolio, automated delivery, audience-driven — 10–15 hrs/week",
                timeline: "Months 3–6",
              },
              {
                path: "Services",
                target: "$10K/mo",
                desc: "4–8 clients, premium offer stack, referral-driven — 25–30 hrs/week",
                timeline: "Months 2–4",
              },
              {
                path: "Hybrid",
                target: "$11K/mo",
                desc: "Digital products + 2–3 services clients + recurring — 25 hrs/week",
                timeline: "Months 4–8",
              },
            ].map((item) => (
              <div key={item.path} className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <div className="text-amber-300 font-semibold text-sm mb-1">{item.path}</div>
                <div className="text-3xl font-semibold mb-2">{item.target}</div>
                <p className="text-xs text-neutral-400 mb-3">{item.desc}</p>
                <div className="text-xs text-neutral-500 border-t border-white/10 pt-3">Timeline: {item.timeline}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Who This Is For</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">✓ Commander is for you if…</h3>
              <ul className="space-y-3 text-neutral-300 text-sm">
                {[
                  "You're making $500–$2K/month and want to break $10K",
                  "You want to license and resell this system as your own brand",
                  "You need a structured 60-day sprint with week-by-week milestones",
                  "You want to add partner revenue streams alongside your own",
                  "You're ready to build systems that run without your daily input",
                ].map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-400 mb-4">The value ladder complete:</h3>
              <div className="space-y-3">
                {[
                  { pack: "Starter ($29)", desc: "First sale in 7 days" },
                  { pack: "Pro ($79)", desc: "Systems to $1K/month" },
                  { pack: "Commander ($149)", desc: "Architecture to $10K+/month" },
                ].map((item) => (
                  <div key={item.pack} className="flex gap-3 items-start text-sm">
                    <span className="text-amber-300 shrink-0">→</span>
                    <span><strong className="text-white">{item.pack}</strong>: {item.desc}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-neutral-500">
                Commander includes conceptual reference to all three levels — no prior packs required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / PRICING */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Get Commander Access</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            12 files. 60 days. $10K/month.
          </h2>
          <p className="text-neutral-300 mb-8 text-lg">
            Full empire architecture — including white-label rights to resell it as your own system.
          </p>

          <div className="rounded-3xl border border-amber-300/50 bg-[#111827] p-8 text-left mb-8">
            <div className="text-xs text-amber-300 uppercase tracking-widest mb-3 font-medium">Maximum Value</div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-semibold text-amber-300">${product.price}</span>
              <span className="text-neutral-400 line-through text-xl">${product.originalPrice}</span>
            </div>
            <p className="text-sm text-neutral-400 mb-6">One-time payment. Instant download. Includes white-label rights.</p>
            <ul className="space-y-2 text-sm text-neutral-300 mb-8">
              {product.bullets?.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-amber-300 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
              className="w-full inline-flex justify-center rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
            >
              Get Commander Access — $149
            </a>
            <p className="mt-4 text-xs text-neutral-500 text-center">
              ✓ 30-day money-back guarantee — results or full refund.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">FAQ</p>
          <h2 className="text-2xl font-semibold mb-10">Questions, answered.</h2>
          <div className="space-y-8">
            {[
              {
                q: "Do I need the Starter or Pro Pack first?",
                a: "No. Commander is self-contained. The orientation doc includes a reading order based on your current revenue level. If you're starting from zero, the Starter Pack is a faster on-ramp — but Commander will still get you there.",
              },
              {
                q: "What exactly do 'white-label rights' mean?",
                a: "You can rebrand and resell the AutonomaX system under your own business name. The White-Label Guide walks you through 4 steps: choose your brand, adapt the content, set your pricing model, and launch — with a 4-week checklist.",
              },
              {
                q: "The revenue path models show $10K+/month. How realistic is that?",
                a: "The models show conservative assumptions — not best case. They require consistent execution and the right offer-market fit. Think of them as a planning tool to understand what variables matter, not a guarantee.",
              },
              {
                q: "Is the 60-Day Scale Sprint rigid or flexible?",
                a: "Flexible. Each week has a theme and KPI targets, but the specific experiments are options you pick based on your current bottleneck. Week 1's Foundation Hardening, for instance, has 5 possible tasks — you choose 2-3 that apply.",
              },
              {
                q: "How long does it take to implement everything?",
                a: "Most people read the Master System Map and White-Label Guide in week one, then work through the 60-Day Sprint systematically. You won't implement all 12 files simultaneously — the orientation doc tells you what order to follow.",
              },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 py-16 border-t border-white/5 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold mb-4">Build the empire. Own the system. Scale on your terms.</h2>
          <a
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
          >
            Download the Commander Pack — $149
          </a>
          <p className="mt-4 text-xs text-neutral-500">30-day guarantee · Instant download · Includes white-label rights</p>
        </div>
      </section>

      <div className="px-6 py-8 text-center border-t border-white/5">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">
          ← Back to AIKAGAN
        </Link>
      </div>
    </main>
  );
}
