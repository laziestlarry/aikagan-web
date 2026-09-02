import Link from 'next/link';
import { ArrowRight, CheckCircle2, Compass, Database, Network, ShieldCheck, Sparkles, Workflow, Wrench } from 'lucide-react';
import SocialProof from '@/components/home/SocialProof';

export const metadata = {
  title: 'AIKAGAN | Intelligence to Delivered Outcomes',
  description: 'Diagnose an opportunity, shape a bounded mission, assemble the right intelligence and execution capabilities, and verify the delivered outcome.',
  alternates: { canonical: 'https://aikagan.com' },
};

const capabilities = [
  { title: 'Diagnose', body: 'Surface the real constraint, opportunity or decision before prescribing a solution.', icon: Compass },
  { title: 'Compose', body: 'Combine proven software, intelligence, workflows and specialist resources around a bounded mission.', icon: Network },
  { title: 'Execute', body: 'Turn the mission into owned tasks, gates, deliverables and measurable progress.', icon: Workflow },
  { title: 'Verify', body: 'Close on evidence: working output, acceptance criteria, operational truth and the next justified decision.', icon: ShieldCheck },
];

const engines = [
  ['TekraQual', 'Readiness, quality and improvement assessment'],
  ['Alexandria', 'Permissioned knowledge and evidence layer'],
  ['BI · MI · SI', 'Business, market and strategic intelligence'],
  ['BizOps', 'Operating-model and process blueprinting'],
  ['AutonomaX', 'Mission execution and specialist AI work cells'],
  ['Chimera · Genesis', 'Cross-process orchestration and command'],
  ['Profit OS', 'Economic truth, performance and decision support'],
  ['Larry', 'Executive briefing and low-friction coordination'],
];

export default function HomePage() {
  return <main className="min-h-screen bg-[#08080a] text-white">
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(212,175,55,0.17),transparent_34%),radial-gradient(circle_at_18%_76%,rgba(16,185,129,0.08),transparent_32%),linear-gradient(145deg,#08080a_0%,#110d06_55%,#08080a_100%)]" />
      <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Practical intelligence · bounded execution · verified delivery</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Turn a business objective into a <span className="text-amber-300">delivered outcome.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
            AIKAGAN diagnoses the opportunity, shapes a clear mission, coordinates the right software, intelligence and specialist capabilities, then drives the work through delivery and verification.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">
            Our strongest production base is software-enabled business, digital products, online services, intelligence and automation. Broader assignments can be scoped as bounded projects and fulfilled with qualified specialist or subcontractor participation where required.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/tools/revenue-leak-scan" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-amber-200">Run a free commercial-path analysis <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/genesis" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-white/30">Explore the Genesis value cycle</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">
            {['Start without a purchase','Bounded scope before execution','No invented ROI','Evidence before completion'].map((item)=><span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{item}</span>)}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-black/35 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-neutral-500">One operating doctrine</p>
          <div className="mt-6 space-y-4">
            {[
              ['01','Diagnose','Clarify the objective, evidence, constraints and real problem.'],
              ['02','Rank','Compare value, urgency, effort, risk and dependencies.'],
              ['03','Execute','Assign a bounded mission to the right capability mix.'],
              ['04','Verify','Accept evidence, measure the outcome and decide what earns the next investment.'],
            ].map(([n,t,b])=><div key={n} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-300 text-xs font-black text-black">{n}</span><div><h2 className="font-bold text-white">{t}</h2><p className="mt-1 text-sm leading-6 text-neutral-400">{b}</p></div></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-emerald-300">From advice to completion</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">A coordinated value chain, not another isolated AI tool.</h2>
        <p className="mt-5 text-lg leading-8 text-neutral-400">A problem enters as uncertainty. It leaves as a bounded decision, working delivery, evidence or a justified stop. Specialist capabilities are activated only when the mission needs them.</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map(({title,body,icon:Icon})=><div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><Icon className="h-7 w-7 text-amber-300"/><h3 className="mt-6 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p></div>)}
      </div>
    </section>

    <section className="border-y border-white/5 bg-[#0b0b0e]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-amber-300">Capability foundry</p>
            <h2 className="mt-3 text-4xl font-black">Use what already works. Compose what the mission needs.</h2>
            <p className="mt-5 leading-8 text-neutral-400">Years of working software, operating patterns and delivery assets become reusable production engines. They are not forced on every customer; they are selected, adapted and coordinated against the contracted input → process → output boundary.</p>
            <Link href="/genesis" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-300/35 px-5 py-3 font-bold text-amber-300">See the full value cycle <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {engines.map(([name,body])=><div key={name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex items-center gap-3"><Database className="h-5 w-5 text-emerald-300"/><h3 className="font-bold">{name}</h3></div><p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-3xl"><p className="text-sm font-semibold text-emerald-300">Engagement ladder</p><h2 className="mt-3 text-4xl font-black">Earn the next level of cooperation.</h2><p className="mt-5 text-lg leading-8 text-neutral-400">No customer needs to buy the whole ecosystem. Start with a useful result; deepen the relationship only when evidence, trust and economics justify it.</p></div>
      <div className="mt-12 grid gap-4 lg:grid-cols-5">
        {[
          ['1','Explore','Use a diagnostic, sample or demonstration.'],
          ['2','Define','Agree a bounded mission, deliverable and acceptance criteria.'],
          ['3','Implement','Build or improve the selected workflow, product or business solution.'],
          ['4','Operate','Coordinate recurring work, intelligence and improvement.'],
          ['5','Graduate','With permission, activate deeper knowledge, BizOps and executive intelligence.'],
        ].map(([n,t,b])=><div key={n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><span className="text-xs font-black text-amber-300">STEP {n}</span><h3 className="mt-3 text-xl font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{b}</p></div>)}
      </div>
    </section>

    <section className="border-y border-white/5 bg-[#0b0b0e]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div><p className="text-sm font-semibold text-amber-300">Choose the level of help</p><h2 className="mt-3 text-4xl font-black">Keep control of the decision. Delegate the burden you do not want.</h2><p className="mt-5 leading-8 text-neutral-400">Use the insight yourself, commission a bounded implementation, or establish an ongoing operating relationship. Scope, permissions and acceptance grow only with the engagement.</p><Link href="/services" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-300/35 px-5 py-3 font-bold text-amber-300">See implementation paths <ArrowRight className="h-4 w-4"/></Link></div>
        <div className="grid gap-4 sm:grid-cols-2">{[
          ['Explore','Diagnostics, examples and public demonstrations.'],
          ['DIY','Use guidance, templates and packaged assets yourself.'],
          ['Project','Contract a defined outcome with bounded inputs and acceptance.'],
          ['Managed','Coordinate recurring intelligence, execution and improvement.'],
        ].map(([t,b])=><div key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Sparkles className="h-5 w-5 text-amber-300"/><h3 className="mt-4 text-xl font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{b}</p></div>)}</div>
      </div>
    </section>

    <SocialProof />

    <section className="px-6 py-24"><div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.10),transparent_55%),#0d0d10] px-7 py-14 text-center sm:px-12"><Wrench className="mx-auto h-7 w-7 text-amber-300"/><p className="mt-5 text-sm font-semibold text-amber-300">Start small. Prove value. Expand deliberately.</p><h2 className="mt-4 text-4xl font-black">Bring us the objective. We will help turn it into the next executable mission.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">If you are not ready for a project, start with the commercial-path analysis. If you already know the outcome you need, describe the mission and we can scope the right production path.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/tools/revenue-leak-scan" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Run the analysis <ArrowRight className="h-4 w-4"/></Link><Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold">Describe a mission</Link></div></div></section>
  </main>;
}
