import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gauge, Gift, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import SocialProof from '@/components/home/SocialProof';

const outcomes = [
  { title: 'Find the leak', body: 'Use a free diagnostic to identify the weakest point between attention, checkout, fulfillment and repeat business.', href: '/tools/revenue-leak-scan/', cta: 'Run free scan', icon: Gauge },
  { title: 'Use a working tool', body: 'Explore practical AIKAGAN utilities, samples and AutonomaX experiences before you pay for implementation.', href: '/tools/', cta: 'Open Free Lab', icon: Gift },
  { title: 'Implement the fix', body: 'When a problem is worth solving, move into a guided workflow, implementation pack or managed service.', href: '/services/', cta: 'See implementation', icon: Wrench },
];

const principles = [
  'Useful before purchase',
  'Verified checkout and fulfillment',
  'No fabricated ROI or simulated success',
  'Paid when implementation creates more value than DIY',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(212,175,55,0.18),transparent_32%),radial-gradient(circle_at_20%_70%,rgba(16,185,129,0.10),transparent_35%),linear-gradient(145deg,#08080a_0%,#120d04_55%,#08080a_100%)]" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
              <span className="h-px w-10 bg-amber-300/50" /> AIKAGAN · Build value before selling it
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Find what is blocking growth. <span className="text-amber-300">Fix what matters.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
              Free diagnostics and practical AI tools first. Implementation, automation and managed execution only when the problem is valuable enough to solve properly.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/tools/revenue-leak-scan/" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black transition hover:bg-amber-200">
                Run the free Revenue Leak Scan <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tools/" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.04] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-400/10">
                Explore free tools
              </Link>
            </div>
            <div className="mt-9 grid max-w-3xl gap-3 sm:grid-cols-2">
              {principles.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-neutral-300"><CheckCircle2 className="h-4 w-4 flex-none text-emerald-300" />{item}</div>)}
            </div>
          </div>

          <div className="rounded-[32px] border border-amber-300/30 bg-black/35 p-7 shadow-[0_0_80px_rgba(212,175,55,0.12)] sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">The value chain</p>
            <div className="mt-6 space-y-4">
              {[
                ['1','Diagnose','Get a useful result with no signup or payment.'],
                ['2','Decide','Understand whether the problem is worth fixing.'],
                ['3','Implement','Use AutonomaX, a workflow, or managed support.'],
                ['4','Verify','Keep payment, delivery and outcome evidence separate.'],
                ['5','Compound','Return for deeper tools, automation and collaboration.'],
              ].map(([n,t,b]) => <div key={n} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"><span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-amber-300/30 text-xs font-bold text-amber-300">{n}</span><div><h2 className="font-bold text-white">{t}</h2><p className="mt-1 text-sm leading-6 text-neutral-400">{b}</p></div></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Start with an outcome</p>
          <h2 className="mt-4 text-4xl font-black sm:text-5xl">Use something useful now.</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-400">The public site is now optimized to create value before asking for a purchase. Paid products remain available for people who want the diagnosis turned into execution.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {outcomes.map(({title,body,href,cta,icon:Icon}) => <Link key={title} href={href} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-amber-300/40"><Icon className="h-6 w-6 text-amber-300"/><h3 className="mt-6 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-amber-300">{cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></Link>)}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0e]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">What AIKAGAN sells</p>
            <h2 className="mt-4 text-4xl font-black">Completion, not information scarcity.</h2>
            <p className="mt-5 leading-8 text-neutral-400">Diagnostics, basic tools and useful learning can stay free. Revenue comes from implementation, integrations, managed operations, higher capacity, collaboration and accountability for the work.</p>
            <Link href="/services/" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-300/35 px-5 py-3 font-bold text-amber-300">See service outcomes <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Free','Diagnostics, mini-apps, templates and public experiments.'],
              ['DIY','Low-cost reusable assets and execution credits.'],
              ['Activation','Implementation of a defined workflow or commercial fix.'],
              ['Managed','Ongoing AI/revenue operations with support and optimization.'],
            ].map(([t,b]) => <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Sparkles className="h-5 w-5 text-amber-300"/><h3 className="mt-4 text-xl font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{b}</p></div>)}
          </div>
        </div>
      </section>

      <SocialProof />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-emerald-400/20 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.10),transparent_55%),#0d0d10] px-7 py-14 text-center sm:px-12">
          <ShieldCheck className="mx-auto h-7 w-7 text-emerald-300" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">No purchase required</p>
          <h2 className="mt-4 text-4xl font-black">Start by discovering whether there is anything worth buying.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">If the scan shows a weak conversion chain, fix the highest-leverage problem first. If the chain is already strong, do not buy another tool—focus on qualified traffic and offer economics.</p>
          <Link href="/tools/revenue-leak-scan/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black hover:bg-emerald-200">Run free scan <ArrowRight className="h-4 w-4"/></Link>
        </div>
      </section>
    </main>
  );
}
