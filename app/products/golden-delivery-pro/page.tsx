import Link from "next/link";
import { products } from "@/lib/products";

export const metadata = {
  title: "AutonomaX Golden Delivery Pro Pack — Hit $1K/Month with Funnels + AI Tools",
  description:
    "9-file Revenue Operations System. Funnels, AI stack, 30-day calendar, traffic playbook, and 5 ready-to-sell offer templates — everything to systematically hit $1K/month. $79 one-time.",
};

export default function Page() {
  const product = products.find((p) => p.slug === "golden-delivery-pro");
  if (!product) return <main className="p-10">Product not found.</main>;

  return (
    <main className="min-h-screen bg-[#08080a] text-white">

      {/* HERO */}
      <section className="px-6 pt-24 pb-16 mx-auto max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-300">
          AutonomaX Golden Delivery · Pro Pack
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          From First Sale to<br />
          <span className="text-amber-300">$1,000/Month.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-neutral-300 leading-relaxed">
          9 files that give you three complete funnel architectures, a curated AI tools stack with exact prompts, a 30-day revenue calendar, traffic playbooks for 5 organic channels, and 5 ready-to-sell offer templates — at price points from $27 to $197.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <a
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
          >
            Get Pro Access — $79
          </a>
          <span className="text-sm text-neutral-400 line-through">${product.originalPrice} regular price</span>
        </div>
        <p className="mt-3 text-xs text-neutral-500">✓ Instant download &nbsp;·&nbsp; ✓ 30-day money-back guarantee &nbsp;·&nbsp; ✓ One-time payment</p>
      </section>

      {/* TRANSITION SECTION */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            You made your first sale. Now the real question: how do you make it repeatable?
          </h2>
          <p className="mt-4 text-neutral-300 text-lg leading-relaxed max-w-3xl">
            One sale is proof. Ten sales is a business. The Pro Pack gives you the systems — funnel architecture, automated workflows, traffic cadences — that turn a one-off win into a reliable monthly number.
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">What's Inside</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-12">9 files. Full ops system.</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Funnel Master Guide",
                desc: "Three complete, ready-to-build funnel architectures: Digital Product Ladder, Audit-to-System Hybrid, and Service Funnel. Each includes full copy templates, tool lists, time estimates, and performance benchmarks.",
              },
              {
                num: "02",
                title: "AI Tools Stack",
                desc: "Seven essential tools (Claude, Perplexity, MailerLite, Carrd, Gumroad, Canva AI, Opus Clip) with setup instructions, exact prompt templates, and a monthly cost breakdown — from $0 to $76/month.",
              },
              {
                num: "03",
                title: "Traffic Playbook",
                desc: "Five organic channels (LinkedIn, X/Twitter, Reddit, Facebook Groups, YouTube Shorts) plus two paid options. Each channel includes a post formula, growth expectations, and a traffic priority sequence.",
              },
              {
                num: "04",
                title: "30-Day Revenue Calendar",
                desc: "Day-by-day plan for the full month with primary and secondary tasks, weekly KPI targets, and high-leverage day markers. Includes a 30-day tracking scorecard.",
              },
              {
                num: "05",
                title: "5 Complete Offer Templates",
                desc: "AI Revenue Audit ($29–$49), Automation Blueprint ($79), 1-Hour Setup Service ($97–$197), Template Library ($29–$49), Monthly Membership ($27–$47/mo) — each with headline, bullets, price anchoring, and CTA.",
              },
              {
                num: "06",
                title: "6 Automation Workflow Templates",
                desc: "Lead Magnet → Nurture → Offer, Purchase → Delivery → Upsell, Social Post → DM Sequence, Weekly Content System, Testimonial → Social Proof loop, and Weekly Revenue Review.",
              },
              {
                num: "07",
                title: "Pro Offer Creation Guide",
                desc: "Advanced worksheet for positioning multiple offers, building a value ladder, pricing psychology, and upsell sequencing.",
              },
              {
                num: "08",
                title: "Start Here — Pro Orientation",
                desc: "The Starter-to-Pro shift explained. What changes at this level, what to build first, and the first 48-hour plan to get your Pro systems live.",
              },
              {
                num: "09",
                title: "System Access Guide (Pro Tier)",
                desc: "Unlocked Pro capabilities in the AutonomaX engine — funnel analysis, offer testing, conversion tracking, and automation monitoring.",
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

      {/* RESULTS TARGETS */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">What You're Building Toward</p>
          <h2 className="text-2xl font-semibold mb-8">The Pro Pack 30-day benchmark targets:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { metric: "Week 1", target: "Funnel live + first offer posted" },
              { metric: "Week 2", target: "5+ leads generated from traffic plan" },
              { metric: "Week 3", target: "2nd offer live, upsell triggered" },
              { metric: "Week 4", target: "$500–$1,000 in revenue" },
            ].map((item) => (
              <div key={item.metric} className="rounded-2xl border border-white/10 bg-[#111827] p-5 text-center">
                <div className="text-amber-300 font-semibold text-sm mb-2">{item.metric}</div>
                <div className="text-xs text-neutral-300">{item.target}</div>
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
              <h3 className="text-xl font-semibold text-green-400 mb-4">✓ This is for you if…</h3>
              <ul className="space-y-3 text-neutral-300 text-sm">
                {[
                  "You've made at least one sale and want to systematize it",
                  "You want a funnel built and running this month",
                  "You need a clear traffic strategy that doesn't require paid ads",
                  "You want ready-made offer templates at multiple price points",
                  "You're targeting $500–$2K/month in the next 30–60 days",
                ].map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-4">✗ Upgrade to Commander if…</h3>
              <ul className="space-y-3 text-neutral-300 text-sm">
                {[
                  "You're already at $1K/month and ready to scale past $10K",
                  "You want white-label rights to resell the system",
                  "You need a full 60-day scaling sprint with weekly milestones",
                  "You want partnership deal frameworks and outreach templates",
                ].map((item) => <li key={item}>• {item}</li>)}
              </ul>
              <p className="mt-4 text-sm">
                <Link href="/products/golden-delivery-commander" className="text-amber-300 hover:underline">See the Commander Pack →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / PRICING */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Get Pro Access</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            9 files. 30 days. $1K/month.
          </h2>
          <p className="text-neutral-300 mb-8 text-lg">
            Everything you need to go from first sale to first thousand — funnels, tools, traffic, and templates.
          </p>

          <div className="rounded-3xl border border-amber-300/30 bg-[#111827] p-8 text-left mb-8">
            <div className="text-xs text-amber-300 uppercase tracking-widest mb-3 font-medium">Most Popular</div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-semibold text-amber-300">${product.price}</span>
              <span className="text-neutral-400 line-through text-xl">${product.originalPrice}</span>
            </div>
            <p className="text-sm text-neutral-400 mb-6">One-time payment. Instant download. Yours forever.</p>
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
              Get Pro Access — $79
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
                q: "Do I need the Starter Pack first?",
                a: "No. The Pro Pack is self-contained. If you haven't made your first sale yet, the 30-day calendar and offer templates will get you there faster — though the Starter Pack's 7-day blueprint is designed for complete beginners.",
              },
              {
                q: "Are the offer templates plug-and-play?",
                a: "Yes. Each template includes a headline, body copy, bullet points, price anchoring language, and a call-to-action. You customize the specifics for your niche — the structure and copy architecture is done.",
              },
              {
                q: "What's the AI tools stack cost?",
                a: "From $0 (free tiers only) up to $76/month if you activate every tool at paid tiers. The guide shows you exactly which tools to pay for first and which to keep free.",
              },
              {
                q: "I already have a funnel. Is the Pro Pack still useful?",
                a: "Possibly. The Funnel Master Guide has three different architectures — if yours isn't converting, comparing against the benchmarks and copy templates in this guide will show you exactly what's missing.",
              },
              {
                q: "What if $1K/month isn't enough — I want to go further?",
                a: "The Commander Pack ($149) has the 60-Day Scale Sprint, white-label rights, partnership playbook, and KPI dashboards built for the $5K–$15K/month range.",
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
          <h2 className="text-2xl font-semibold mb-4">Build the system that pays you every month.</h2>
          <a
            href={product.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
          >
            Download the Pro Pack — $79
          </a>
          <p className="mt-4 text-xs text-neutral-500">30-day guarantee · Instant download · One-time payment</p>
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
