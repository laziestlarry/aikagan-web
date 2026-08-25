import Link from 'next/link';
import { ArrowRight, Bot, Box, BriefcaseBusiness, Building2, CheckCircle2, FileText, Github, Languages, Rocket, Ruler, Workflow } from 'lucide-react';

export const metadata = {
  title: 'Work with Kagan — Rapid Technical, Business & AI Execution',
  description: 'Rapid project execution for CAD, 3D modeling, technical documentation, business strategy, AI workflows, research and implementation.',
  alternates: { canonical: 'https://aikagan.com/work-with-kagan/' },
};

const capabilities = [
  { icon: Ruler, title: 'CAD & Technical Drawings', body: '2D drafting, drawing cleanup, PDF/DWG conversion, plan revisions, technical documentation and coordination-ready outputs.' },
  { icon: Box, title: '3D Modeling & Visualization', body: 'Architectural and product-oriented 3D modeling, model refinement, presentation views and rapid design iteration.' },
  { icon: Building2, title: 'Architecture Support', body: 'Plans, layouts, documentation support, model coordination and presentation packages. Regulated/stamped work remains with the appropriately licensed professional.' },
  { icon: BriefcaseBusiness, title: 'Business & Strategy', body: 'Business plans, feasibility, market analysis, monetization models, operating plans, pitch materials and decision documents.' },
  { icon: Bot, title: 'AI-Assisted Delivery', body: 'Research acceleration, workflow automation, AI agents, structured generation, review loops and implementation support.' },
  { icon: Languages, title: 'Research & Language Work', body: 'Multilingual assistance, synthesis, document preparation, structured research, editing and executive communication.' },
];

const proof = [
  { name: 'AIKAGAN', body: 'Live value-first business tools, checkout routing, fulfillment, diagnostics and public commercial infrastructure.', href: 'https://aikagan.com/' },
  { name: 'AutonomaX Source', body: 'Public source estate for AI-powered operations, automation and business execution systems.', href: 'https://github.com/laziestlarry/AutonomaX_Source' },
  { name: 'AutonomaX Stack', body: 'Large public implementation stack representing integrated AI/business automation development work.', href: 'https://github.com/laziestlarry/AutonomaX_Stack' },
  { name: 'AutonomaX Agency Ops', body: 'Agency and operating-system assets for structured delivery and service workflows.', href: 'https://github.com/laziestlarry/autonomax-agency-ops' },
  { name: 'AutonomaX Final Pack', body: 'Packaged implementation assets and reusable operating resources.', href: 'https://github.com/laziestlarry/AutonomaX_Final_Pack' },
  { name: 'NomadEngine', body: 'Public project demonstrating additional software/product execution capability.', href: 'https://github.com/laziestlarry/NomadEngine_v1.5' },
];

const deliverables = [
  'First reviewable milestone as early as the same day when scope permits',
  'Editable source files plus final export formats agreed before start',
  'Clear assumptions, change log and handoff notes',
  'AI used to accelerate work, not to replace verification',
  'Small paid milestone available to reduce buyer risk',
  'Urgent work accepted when the requested quality and deadline are feasible',
];

export default function WorkWithKaganPage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,197,66,0.17),transparent_45%),linear-gradient(180deg,#120e05_0%,#08080a_70%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-sm font-bold text-emerald-300"><Rocket className="h-4 w-4" /> Available for rapid project work</div>
          <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-7xl">Technical production, business intelligence and AI-assisted execution — <span className="text-amber-300">delivered as real project outputs.</span></h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-neutral-300">I take defined problems from raw inputs to reviewable deliverables: CAD and 3D work, technical documentation, business plans and strategy, research, automation and AI-enabled operating workflows. For urgent scopes, I prioritize an early milestone so you can evaluate the work before expanding the engagement.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact?service=rapid-project" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Discuss a project <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/cash-resilience/" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold hover:border-white/30">See ready offers</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl"><p className="text-sm font-bold text-amber-300">Capabilities</p><h2 className="mt-3 text-4xl font-black">One execution partner, multiple production disciplines.</h2></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{capabilities.map(({icon: Icon,title,body}) => <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"><Icon className="h-7 w-7 text-amber-300"/><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p></div>)}</div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0e]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl"><p className="text-sm font-bold text-emerald-300">Verifiable digital proof</p><h2 className="mt-3 text-4xl font-black">Public systems you can inspect before hiring.</h2><p className="mt-4 leading-7 text-neutral-400">These links demonstrate software, automation and business-system execution. CAD/architectural samples should be attached separately to bids only when they are genuine prior work or purpose-built samples.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{proof.map((p) => <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-amber-300/40"><Github className="h-6 w-6 text-neutral-300"/><h3 className="mt-5 text-xl font-bold">{p.name}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{p.body}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-300">Inspect proof <ArrowRight className="h-4 w-4"/></span></a>)}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-start">
        <div><Workflow className="h-7 w-7 text-amber-300"/><h2 className="mt-5 text-4xl font-black">Low-risk delivery structure.</h2><p className="mt-4 leading-7 text-neutral-400">For new clients, the safest engagement is a small, concrete first milestone. Scope, native file format, review criteria and deadline are agreed before execution.</p></div>
        <div className="space-y-4">{deliverables.map((d) => <div key={d} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-300"/><p className="text-sm leading-6 text-neutral-300">{d}</p></div>)}</div>
      </section>

      <section className="px-6 pb-24"><div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/20 bg-[#0d0d10] px-7 py-14 text-center sm:px-12"><FileText className="mx-auto h-7 w-7 text-amber-300"/><h2 className="mt-4 text-4xl font-black">Send the files. Define the first milestone. Start.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">For a fast quote, provide the source files/references, required output format, deadline and the single most important acceptance criterion. I will respond with a concrete first deliverable rather than a vague capability pitch.</p><Link href="/contact?service=rapid-project" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Start a scoped project <ArrowRight className="h-4 w-4"/></Link></div></section>
    </main>
  );
}
