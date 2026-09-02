import Link from 'next/link';
import { ArrowRight, BrainCircuit, CheckCircle2, Database, GitBranch, Network, ShieldCheck, Sparkles, Target, Workflow } from 'lucide-react';

export const metadata = {
  title: 'Genesis Value Cycle | AIKAGAN Beta',
  description: 'A working model for turning business objectives into bounded missions, coordinated capabilities, verified deliveries and sustained improvement.',
};

const stages = [
  ['01','Detect & Diagnose','Objective, evidence, constraints, stakeholders and the actual problem are surfaced before solutioning.','TekraQual · diagnostics · research'],
  ['02','Decide & Contract','Options are ranked by value, urgency, effort and risk. The selected mission receives scope, ownership and acceptance criteria.','Commercial consultant · counsel · mission contract'],
  ['03','Understand','Permissioned customer knowledge, operating evidence and external context are organized for the mission.','Alexandria · BI · MI · SI'],
  ['04','Design','The target operating path is decomposed into processes, roles, dependencies, controls and deliverables.','BizOps · blueprints · process design'],
  ['05','Compose','Existing software, AI models, human specialists and subcontractors are selected only for the work they are qualified to perform.','AutonomaX · expert cells · partner network'],
  ['06','Execute','Tasks move through explicit owners, handoffs, gates and exception paths instead of disappearing into an AI black box.','API Commander · AutonomaX · Chimera'],
  ['07','Verify & Accept','Working output is tested against the contract. Test, seed and simulated evidence never substitutes for external acceptance.','TekraQual · QA · customer acceptance'],
  ['08','Measure & Improve','Economic and operating truth determines whether to stop, repair, repeat, scale or graduate the relationship.','Profit OS · BGM · Genesis'],
  ['09','Brief & Coordinate','The complexity is compressed into decisions, exceptions and next actions for the executive user.','Larry · executive briefing'],
];

export default function GenesisPage() {
  return <main className="min-h-screen bg-[#08080a] text-white">
    <section className="border-b border-white/5 bg-[radial-gradient(circle_at_72%_20%,rgba(212,175,55,0.15),transparent_35%),#08080a]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-300">Genesis beta · value-cycle demonstrator</p>
        <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-[-0.04em] sm:text-6xl">One objective. A composed value chain. <span className="text-amber-300">Evidence at every gate.</span></h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-neutral-300">Genesis is the operating model behind AIKAGAN's longer customer journey: diagnose what matters, contract a bounded mission, coordinate the right intelligence and production capabilities, deliver, verify, learn and only then expand.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black">Describe a mission <ArrowRight className="h-4 w-4"/></Link><Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold">Back to beta home</Link></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          ['Input','A business objective, problem, opportunity, evidence or required outcome.',Target],
          ['Process','Bounded orchestration of intelligence, software, people, controls and delivery.',Network],
          ['Output','A verified artifact, implemented process, accepted outcome or evidence-backed decision.',CheckCircle2],
        ].map(([t,b,I]:any)=><div key={t} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><I className="h-7 w-7 text-amber-300"/><h2 className="mt-5 text-2xl font-bold">{t}</h2><p className="mt-3 text-sm leading-7 text-neutral-400">{b}</p></div>)}
      </div>
    </section>

    <section className="border-y border-white/5 bg-[#0b0b0e]"><div className="mx-auto max-w-7xl px-6 py-24"><p className="text-sm font-semibold text-emerald-300">Production gates</p><h2 className="mt-3 max-w-4xl text-4xl font-black">The superposed value chain becomes real only when each stage earns the next.</h2><div className="mt-12 space-y-4">{stages.map(([n,title,body,engines])=><div key={n} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:grid-cols-[70px_0.7fr_1.3fr_0.8fr] md:items-center"><span className="text-sm font-black text-amber-300">{n}</span><h3 className="text-lg font-bold">{title}</h3><p className="text-sm leading-6 text-neutral-400">{body}</p><p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">{engines}</p></div>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-6 py-24"><div className="grid gap-10 lg:grid-cols-2"><div><BrainCircuit className="h-8 w-8 text-amber-300"/><h2 className="mt-5 text-4xl font-black">Co-expertise instead of pretending to know everything.</h2><p className="mt-5 leading-8 text-neutral-400">AIKAGAN can own diagnosis, orchestration, software intelligence and the capabilities it can substantiate. When a mission requires domain, legal, technical, cultural or market expertise outside that boundary, the correct resource can be contracted into a limited input → process → output responsibility. The customer retains the expertise and decisions that belong to the customer.</p></div><div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"><h3 className="text-xl font-bold">Mission Contract</h3><p className="mt-3 text-sm leading-7 text-neutral-400">The atomic unit of cooperation records:</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{['Objective & baseline','Scope & exclusions','Inputs & permissions','Owner & specialists','Deliverables','Acceptance criteria','Economics & payment','Risks & dependencies','Evidence & completion','Next graduation gate'].map(x=><div key={x} className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-neutral-300"><CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-300"/>{x}</div>)}</div></div></div></section>

    <section className="border-y border-white/5 bg-[#0b0b0e]"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-24 md:grid-cols-2 lg:grid-cols-4">{[
      ['Knowledge','Alexandria stores permissioned evidence and reusable non-confidential learning.',Database],
      ['Execution','AutonomaX composes mission-specific work cells instead of one generic agent.',Workflow],
      ['Orchestration','Chimera / Genesis coordinates dependencies, handoffs, gates and exceptions.',GitBranch],
      ['Truth','Profit OS and Larry surface economics, exceptions, decisions and the next justified action.',ShieldCheck],
    ].map(([t,b,I]:any)=><div key={t}><I className="h-7 w-7 text-amber-300"/><h3 className="mt-5 text-xl font-bold">{t}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{b}</p></div>)}</div></section>

    <section className="mx-auto max-w-5xl px-6 py-24 text-center"><Sparkles className="mx-auto h-8 w-8 text-amber-300"/><p className="mt-5 text-sm font-semibold text-amber-300">The graduation rule</p><h2 className="mt-4 text-4xl font-black">More trust earns more capability. More evidence earns more autonomy.</h2><p className="mx-auto mt-5 max-w-3xl leading-8 text-neutral-400">Public evidence → customer-supplied knowledge → connected operating data → delegated actions → bounded autonomous actions. No layer is activated simply because the technology exists.</p><div className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/tools/revenue-leak-scan" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold">Start with a diagnostic</Link><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black">Scope a mission <ArrowRight className="h-4 w-4"/></Link></div></section>
  </main>;
}
