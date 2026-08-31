import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FileCheck2,
  Gauge,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

export const metadata = {
  title: 'Flight 002 — Diagnose, Execute, Verify',
  description:
    'AIKAGAN Flight 002 turns business friction into a ranked execution mission with explicit evidence gates. Free diagnostics and implementation requests are live while self-serve paid checkout remains gated until delivery is verified.',
  alternates: { canonical: 'https://aikagan.com/flight' },
  openGraph: {
    title: 'AIKAGAN Flight 002 — Diagnose, Execute, Verify',
    description:
      'A truth-first operating path from business friction to governed execution and verified delivery.',
    url: 'https://aikagan.com/flight',
    type: 'website',
  },
};

const flow = [
  {
    step: '01',
    title: 'Diagnose',
    body: 'Start from observable business friction: revenue leakage, weak conversion, delivery burden, fragmented operations, or an opportunity that needs validation.',
    icon: Radar,
  },
  {
    step: '02',
    title: 'Rank',
    body: 'Reduce noise to one prioritized mission using expected value, urgency, evidence, effort, risk, and automation potential.',
    icon: Compass,
  },
  {
    step: '03',
    title: 'Execute',
    body: 'Turn the selected mission into scoped actions, owners, tools, approvals, handoffs, acceptance criteria, and measurable outputs.',
    icon: Workflow,
  },
  {
    step: '04',
    title: 'Verify',
    body: 'Separate generated work from operational truth. Payment, deployment, delivery, and outcome claims only pass when supporting evidence exists.',
    icon: FileCheck2,
  },
] as const;

const modules = [
  ['Intelligence', 'Market, revenue, trend, customer, and opportunity signals feed one decision surface.'],
  ['Mission Blueprint', 'A selected problem becomes a bounded objective with constraints, deliverables, dependencies, and acceptance criteria.'],
  ['Commander', 'Automation and human work are coordinated through explicit tools, approvals, handoffs, and recovery paths.'],
  ['Governance', 'Evidence gates prevent simulated readiness, stale assumptions, or generated claims from being mistaken for production reality.'],
] as const;

const lanes = [
  {
    eyebrow: 'REVENUE REPAIR',
    title: 'Find the commercial bottleneck',
    body: 'Run the free Revenue Leak Scan and get a ranked view of friction across offer, checkout, delivery, follow-up, and retention.',
    href: '/tools/revenue-leak-scan',
    cta: 'Start free scan',
    icon: Gauge,
  },
  {
    eyebrow: 'VENTURE / OFFER',
    title: 'Turn an idea into a scoped mission',
    body: 'Bring the idea, dormant asset, offer, or operating problem. We scope the highest-value next mission before any implementation commitment.',
    href: '/contact',
    cta: 'Request mission scope',
    icon: Sparkles,
  },
  {
    eyebrow: 'AUTOMATION / OPS',
    title: 'Explore the AutonomaX execution layer',
    body: 'See how objectives can be organized as governed missions with next actions and measurable progress instead of another pile of disconnected AI outputs.',
    href: 'https://app.aikagan.com/autonomax',
    cta: 'Open AutonomaX',
    icon: Workflow,
  },
] as const;

const releaseState = [
  ['Free diagnostics', 'LIVE'],
  ['Free delivery sample', 'LIVE'],
  ['Implementation requests', 'LIVE'],
  ['AutonomaX exploration', 'LIVE'],
  ['Self-serve paid checkout', 'GATED'],
] as const;

export default function FlightPage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(212,175,55,0.18),transparent_34%),radial-gradient(circle_at_14%_74%,rgba(16,185,129,0.10),transparent_32%),linear-gradient(145deg,#08080a_0%,#120e07_52%,#08080a_100%)]" />
        <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-300">
              <span className="h-2 w-2 rounded-full bg-emerald-300" /> Flight 002 · public operations live
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Diagnose the friction. <span className="text-amber-300">Execute the mission.</span> Verify the result.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
              AIKAGAN is being rebuilt around one operating rule: generated work is not the same as completed work. Flight 002 connects intelligence, prioritization, execution, and evidence into one practical path.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/tools/revenue-leak-scan" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-amber-200">
                Start with a free diagnosis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-white/30">
                Bring a mission
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">
              {['No invented ROI', 'No simulated readiness', 'Evidence before monetization'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-black/35 p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-500">Release gate</p>
                <h2 className="mt-2 text-2xl font-black">What is actually live?</h2>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-300" />
            </div>
            <div className="mt-6 space-y-3">
              {releaseState.map(([label, state]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                  <span className="text-sm text-neutral-300">{label}</span>
                  <span className={state === 'LIVE' ? 'text-xs font-black text-emerald-300' : 'text-xs font-black text-amber-300'}>{state}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-neutral-400">
              Paid self-serve checkout stays gated until the offer → payment → fulfillment → delivery → evidence chain is verified end to end. That is a release condition, not a marketing promise.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-emerald-300">THE NEW OPERATING PATH</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Four gates from signal to operational truth.</h2>
          <p className="mt-5 text-lg leading-8 text-neutral-400">The recovered blueprints are useful when treated as modular capability—not as evidence that old systems are production-ready.</p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {flow.map(({ step, title, body, icon: Icon }) => (
            <article key={step} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.2em] text-neutral-500">{step}</span><Icon className="h-6 w-6 text-amber-300" /></div>
              <h3 className="mt-7 text-2xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0e]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-amber-300">WHAT WE KEPT FROM THE ARCHIVE</p>
              <h2 className="mt-3 text-4xl font-black">The useful architecture, without the baggage.</h2>
              <p className="mt-5 leading-8 text-neutral-400">Flight 002 absorbs the strongest recurring patterns from the recovered Commander, Studio, BizOp, Khanate, growth, and YouTube systems while rejecting stale credentials, unverifiable production claims, and duplicate application shells.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {modules.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-xl font-black text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-emerald-300">BOARDING LANES</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Start from the outcome, not the architecture.</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {lanes.map(({ eyebrow, title, body, href, cta, icon: Icon }) => (
            <Link key={title} href={href} className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-amber-300/40">
              <Icon className="h-7 w-7 text-amber-300" />
              <p className="mt-6 text-xs font-black tracking-[0.22em] text-neutral-500">{eyebrow}</p>
              <h3 className="mt-3 text-2xl font-black">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-neutral-400">{body}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-amber-300">{cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.11),transparent_55%),#0d0d10] px-7 py-14 text-center sm:px-12">
          <FileCheck2 className="mx-auto h-8 w-8 text-amber-300" />
          <p className="mt-5 text-sm font-semibold text-amber-300">LAST CALL</p>
          <h2 className="mt-4 text-4xl font-black">Bring one real bottleneck. Flight 002 will start there.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">No need to buy a platform or understand the internal stack first. Diagnose something real, choose the mission, and advance only when the evidence supports it.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tools/revenue-leak-scan" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Start free scan <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-white/30">Request implementation</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
