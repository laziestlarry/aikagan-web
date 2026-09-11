import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle2, ClipboardCheck, Gauge, Network, ShieldCheck, Workflow } from 'lucide-react';

const loop = [
  ['01', 'Understand', 'Capture the business stage, assets, constraints, systems, goal and decision authority.'],
  ['02', 'Investigate', 'Map the selected workflow, baseline, buyer impact, dependencies and available evidence.'],
  ['03', 'Decide', 'Rank practical interventions by impact, readiness, effort, measurability and risk.'],
  ['04', 'Scope', 'Define the boundary, responsibilities, outputs, acceptance checks and approval gates.'],
  ['05', 'Build', 'Implement the smallest credible system that can operate and be tested.'],
  ['06', 'Verify', 'Run a representative case and keep the evidence beside the claimed result.'],
  ['07', 'Operate', 'Compare observed performance with the baseline and improve from real use.'],
] as const;

const paths = [
  { icon: Gauge, title: 'Opportunity & Offer', body: 'Choose a defensible problem, buyer and offer when the commercial direction is unclear.', result: 'Market direction, positioning and a prioritized revenue path.' },
  { icon: Workflow, title: 'Build & Automate', body: 'Turn a validated workflow into a reliable implementation with clear human decision points.', result: 'Architecture, automation, handoffs, procedures and acceptance gates.' },
  { icon: Network, title: 'Manage & Grow', body: 'Keep projects, priorities and performance connected to verified business outcomes.', result: 'Operating cadence, evidence reviews, metrics and controlled iteration.' },
] as const;

export default function OutcomeHome() {
  return <main className="min-h-screen bg-[#07090d] text-white">
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(56,189,248,0.20),transparent_35%),radial-gradient(circle_at_18%_75%,rgba(245,197,66,0.14),transparent_34%),linear-gradient(145deg,#07090d,#101827_58%,#07090d)]" />
      <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[.28em] text-sky-300">AIKAGAN · Outcome Operating System</p>
          <h1 className="mt-6 text-5xl font-black leading-[.96] tracking-[-.05em] sm:text-6xl lg:text-7xl">Fix the workflow that moves <span className="text-amber-300">revenue, reliability or growth.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">OutcomeOS turns a business problem into a bounded mission: diagnose the bottleneck, choose the smallest credible fix, assign AI and human responsibilities, approve consequential decisions, and verify the result from evidence.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/outcome/intake" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-4 font-black text-black hover:bg-amber-200">Build my recommendation <ArrowRight className="h-4 w-4" /></Link>
            <a href="https://app.aikagan.com/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-bold hover:border-white/40">Open workspace</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">
            {['90-second route','Human-controlled approvals','Editable draft','Evidence-graded outcomes'].map((item) => <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{item}</span>)}
          </div>
        </div>
        <aside className="rounded-[30px] border border-sky-300/20 bg-black/35 p-7 shadow-2xl shadow-sky-950/30 sm:p-9">
          <div className="flex items-center justify-between border-b border-white/10 pb-5"><span className="text-xs font-black tracking-[.22em] text-sky-300">MISSION CONTROL</span><ShieldCheck className="h-5 w-5 text-emerald-300" /></div>
          <h2 className="mt-7 text-3xl font-black">AI prepares. Your responsible human decides.</h2>
          <div className="mt-6 space-y-3">
            {[
              ['AI responsibility','Analyze inputs, rank options, prepare work and show uncertainty.'],
              ['Human responsibility','Approve, decline or revise scope, access, deployment and acceptance.'],
              ['Shared record','Keep requirements, decisions, evidence and changes visible in one mission.'],
            ].map(([title,body]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><h3 className="font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p></div>)}
          </div>
        </aside>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-xs font-black uppercase tracking-[.24em] text-amber-300">One line from A to B</p>
      <h2 className="mt-4 max-w-3xl text-4xl font-black sm:text-5xl">Seven visible stages. One approved outcome.</h2>
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loop.map(([number,title,body]) => <article key={number} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><span className="text-xs font-black tracking-[.2em] text-sky-300">{number}</span><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-neutral-400">{body}</p></article>)}
      </div>
    </section>

    <section className="border-y border-white/10 bg-[#0b1019]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-xs font-black uppercase tracking-[.24em] text-sky-300">Choose the work closest to the bottleneck</p>
        <h2 className="mt-4 text-4xl font-black sm:text-5xl">Three service paths, one operating contract.</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">{paths.map(({icon:Icon,title,body,result}) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[.03] p-7"><Icon className="h-7 w-7 text-amber-300"/><h3 className="mt-6 text-2xl font-black">{title}</h3><p className="mt-3 leading-7 text-neutral-400">{body}</p><div className="mt-6 rounded-xl bg-black/30 p-4 text-sm leading-6 text-neutral-300"><strong className="text-white">Useful output:</strong> {result}</div></article>)}</div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-2 lg:items-center">
      <div><ClipboardCheck className="h-8 w-8 text-emerald-300"/><h2 className="mt-5 text-4xl font-black">Completion needs proof.</h2><p className="mt-5 leading-8 text-neutral-400">Claims, generated artifacts, tests, integrations, live operations and customer acceptance are separate evidence levels. A page view, checkout intent or generated file is never recorded as revenue or completed fulfillment.</p></div>
      <div className="rounded-3xl border border-white/10 bg-white/[.03] p-7">
        <div className="grid grid-cols-3 gap-3 text-center sm:grid-cols-6">{['E0 Claim','E1 Made','E2 Tested','E3 Integrated','E4 Live','E5 Accepted'].map((grade,index)=><div key={grade} className={`rounded-xl border p-3 text-xs font-bold ${index===5?'border-emerald-300/40 bg-emerald-300/10 text-emerald-200':'border-white/10 text-neutral-400'}`}>{grade}</div>)}</div>
        <p className="mt-6 text-sm leading-6 text-neutral-400">The mission workspace keeps the objective, next action, entitlement, deliverables and support escalation together. Paid status requires provider-verified payment evidence.</p>
      </div>
    </section>

    <section className="border-y border-white/10 bg-[#0b1019] px-6 py-24"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[.24em] text-amber-300">Ready-made implementation assets</p><h2 className="mt-4 max-w-3xl text-4xl font-black">Choose a pack only when the mission is clear.</h2><p className="mt-5 max-w-3xl leading-7 text-neutral-400">Each button opens the named Gumroad product through AIKAGAN’s recorded checkout handoff. Gumroad processes payment and issues the purchase record used for delivery.</p><div className="mt-10 grid gap-5 lg:grid-cols-3">{[
      ['First-Sale Starter','$29','masterclass-starter','One sellable offer and a focused first-sale action sequence.'],
      ['Revenue Conversion Pro','$79','masterclass-pro','Offer, traffic, checkout and a 30-day revenue operating cadence.'],
      ['Scale & Licensing Commander','$149','masterclass-commander','Repeatable operations, partnership controls, KPIs and scale systems.'],
    ].map(([name,price,slug,body])=><article key={slug} className="rounded-3xl border border-white/10 bg-white/[.03] p-7"><p className="text-xs font-black uppercase tracking-[.2em] text-sky-300">AutonomaX pack</p><h3 className="mt-4 text-2xl font-black">{name}</h3><p className="mt-3 text-sm leading-6 text-neutral-400">{body}</p><div className="mt-6 text-3xl font-black">{price}<span className="ml-2 text-xs font-medium text-neutral-500">USD one time</span></div><a href={`/api/income/checkout?slug=${slug}&provider=gumroad`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-black text-black">Continue to Gumroad <ArrowRight className="h-4 w-4"/></a></article>)}</div><p className="mt-7 text-xs text-neutral-500">Payment does not authorize unrelated account, publishing, legal or destructive actions. Those remain separate human approval gates.</p></div></section>

    <section className="px-6 pb-24"><div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/25 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,66,.14),transparent_60%),#101015] px-7 py-14 text-center sm:px-12"><Bot className="mx-auto h-8 w-8 text-amber-300"/><h2 className="mt-5 text-4xl font-black">Describe the problem. Leave with a structured mission.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">Start with three routing choices, add one concrete objective, and review the full draft before anything is submitted.</p><Link href="/outcome/intake" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-4 font-black text-black">Start the 90-second intake <ArrowRight className="h-4 w-4"/></Link><p className="mt-5 text-xs text-neutral-500">Project contact: kagan@aikagan.com</p></div></section>
  </main>;
}
