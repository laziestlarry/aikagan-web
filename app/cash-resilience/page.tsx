import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench, Zap } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Cash-Resilience Offers',
  description: 'Use existing AIKAGAN assets and services to solve real business bottlenecks without adding unnecessary spend.',
  path: '/cash-resilience',
});

const offers = [
  {
    title: 'Revenue Audit Sprint',
    price: '$29',
    body: 'A focused review of your stack, conversion path, and monetization options with ranked recommendations.',
    href: '/products/revenue-audit-sprint',
    mode: 'Scoped service',
  },
  {
    title: 'Starter Toolkit',
    price: '$29',
    body: 'Immediate digital delivery: launch framework, offer worksheet, objection scripts, activation checklist, and Golden Delivery starter assets.',
    href: '/products/masterclass-starter',
    mode: 'Instant download',
  },
  {
    title: 'Pro Revenue Ops Toolkit',
    price: '$79',
    body: 'Funnel architectures, traffic experiments, offer templates, automation workflows, and a 30-day operating cadence.',
    href: '/products/masterclass-pro',
    mode: 'Instant download',
  },
  {
    title: 'AI Venture Launch Blueprint',
    price: '$99',
    body: 'Structured market, monetization, business-model, roadmap, risk, and automation analysis for a real venture or dormant project.',
    href: '/products/ai-venture-launch-blueprint',
    mode: 'Scoped service',
  },
  {
    title: 'Commander Operating Architecture',
    price: '$149',
    body: 'The complete operating architecture with system map, scale sprint, partnership playbook, automation OS, and KPI dashboard.',
    href: '/products/masterclass-commander',
    mode: 'Instant download',
  },
];

export default function CashResiliencePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <section className="border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(245,197,66,0.14),transparent_38%)]">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-sm font-bold text-emerald-300"><ShieldCheck className="h-4 w-4" /> Cash-resilience mode</div>
          <h1 className="mt-7 max-w-4xl text-5xl font-black tracking-[-0.04em] sm:text-7xl">Use what already exists. <span className="text-amber-300">Solve a real bottleneck before spending more.</span></h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-neutral-300">AIKAGAN is prioritizing high-margin digital assets and tightly scoped services that already have a delivery path. No invented scarcity, no speculative ROI promise, and no requirement to buy before the problem is clear.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/start-free" className="rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black">Diagnose first for free</Link><Link href="/products" className="rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold">Browse all offers</Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <Link key={offer.title} href={offer.href} className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 hover:border-amber-300/40">
              <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{offer.mode}</span><span className="text-xl font-black text-amber-300">{offer.price}</span></div>
              <h2 className="mt-5 text-2xl font-black">{offer.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-neutral-400">{offer.body}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-amber-300">View fit and delivery <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0e]"><div className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-4xl font-black">Priority order for urgent monetization</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{[
        ['1. Scoped pain-killer service', 'Revenue Audit or Venture Blueprint when the buyer has a concrete bottleneck. Higher signal, low infrastructure cost.'],
        ['2. Existing instant-delivery assets', 'Starter, Pro, and Commander packs use existing inventory rather than creating new speculative products.'],
        ['3. Free diagnostic as acquisition', 'Use the free scan to qualify the problem, then route only relevant buyers to paid execution.'],
      ].map(([t,b]) => <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><CheckCircle2 className="h-5 w-5 text-emerald-300"/><h3 className="mt-4 font-black">{t}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{b}</p></div>)}</div></div></section>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center"><Wrench className="mx-auto h-7 w-7 text-amber-300"/><h2 className="mt-5 text-4xl font-black">Need implementation rather than another download?</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-neutral-400">Use the scoped service route. Delivery terms are confirmed before payment, so the commercial commitment stays tied to a real deliverable.</p><Link href="/contact?product=revenue-audit-sprint" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black">Request a scoped audit <Zap className="h-4 w-4"/></Link></section>
    </main>
  );
}
