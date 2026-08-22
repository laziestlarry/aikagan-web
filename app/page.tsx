import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gauge, Gift, ShieldCheck, Sparkles, Wrench, Workflow } from 'lucide-react';
import SocialProof from '@/components/home/SocialProof';

export const metadata = {
  title: 'AIKAGAN — Free AI Business Tools & Practical Automation',
  description: 'Try free AI business tools that help you find revenue leaks, improve workflows, and understand what to automate next. No purchase required.',
  alternates: { canonical: 'https://aikagan.com/' },
  openGraph: {
    title: 'Try useful AI business tools for free | AIKAGAN',
    description: 'Get a useful result first. Find a business problem, explore a practical AI workflow, and only pay if you want help implementing it.',
    url: 'https://aikagan.com/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Try useful AI business tools for free | AIKAGAN',
    description: 'Find business friction, explore a practical AI workflow, and get value before deciding whether you need implementation help.',
    images: ['https://aikagan.com/og.png'],
  },
};

const freeExperiences = [
  {
    title: 'Find where revenue is leaking',
    body: 'Answer 7 simple questions and get an immediate score across your offer, checkout, delivery, follow-up and retention path.',
    result: 'You leave with a ranked list of what to fix first.',
    href: '/tools/revenue-leak-scan/',
    cta: 'Get my free score',
    icon: Gauge,
  },
  {
    title: 'See a ready-made business delivery example',
    body: 'Open a free sample of the practical checklists, operating assets and delivery structure behind AIKAGAN products.',
    result: 'You can judge the usefulness before paying for anything.',
    href: '/free/golden-delivery-sample/',
    cta: 'Open free sample',
    icon: Gift,
  },
  {
    title: 'Explore how AutonomaX works',
    body: 'See how a business objective can be turned into a guided execution mission with next actions and measurable progress.',
    result: 'You understand the product by using the experience, not reading a pitch.',
    href: 'https://app.aikagan.com/autonomax/',
    cta: 'Explore AutonomaX',
    icon: Workflow,
  },
];

export default function HomePage() {
  return <main className="min-h-screen bg-[#08080a] text-white">
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(212,175,55,0.16),transparent_34%),radial-gradient(circle_at_20%_72%,rgba(16,185,129,0.09),transparent_34%),linear-gradient(145deg,#08080a_0%,#110d06_55%,#08080a_100%)]" />
      <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
        <div>
          <p className="text-sm font-semibold text-emerald-300">AI tools for people building and running real businesses</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Try something useful <span className="text-amber-300">before you buy anything.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
            AIKAGAN gives you free tools to spot business friction, improve conversion and explore practical automation. If a problem is worth solving, AutonomaX can help turn the diagnosis into execution.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/tools/revenue-leak-scan/" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-amber-200">
              Start free Revenue Leak Scan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/tools/" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-white/30">
              See all free experiences
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">
            {['No purchase required','Immediate result','No invented ROI','Use it before deciding'].map((item)=><span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{item}</span>)}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-black/35 p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-neutral-500">A first visit takes about 2 minutes</p>
          <div className="mt-6 space-y-4">
            {[
              ['1','Choose a free experience','Pick the business problem that sounds closest to yours.'],
              ['2','Get a result','Receive a score, example, or practical workflow you can inspect immediately.'],
              ['3','Decide what to do','Keep the free result, try another tool, or ask for implementation only if it is useful.'],
            ].map(([n,t,b])=><div key={n} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-300 font-black text-black">{n}</span><div><h2 className="font-bold text-white">{t}</h2><p className="mt-1 text-sm leading-6 text-neutral-400">{b}</p></div></div>)}
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
            <p className="text-sm font-semibold text-emerald-300">Good starting point</p>
            <p className="mt-2 text-sm leading-6 text-neutral-300">If you are unsure where to begin, run the Revenue Leak Scan. It is free, needs no account, and tells you where your commercial path looks weakest.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-emerald-300">Choose what you want to improve</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">Three free ways to experience the value.</h2>
        <p className="mt-5 text-lg leading-8 text-neutral-400">You do not need to understand AIKAGAN, AutonomaX, agents, or automation architecture first. Start with the outcome you want.</p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {freeExperiences.map(({title,body,result,href,cta,icon:Icon})=><Link key={title} href={href} className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-amber-300/40"><Icon className="h-7 w-7 text-amber-300"/><h3 className="mt-6 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p><div className="mt-5 rounded-xl bg-black/25 p-4 text-sm text-neutral-300"><strong className="text-white">What you get:</strong> {result}</div><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-amber-300">{cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></Link>)}
      </div>
    </section>

    <section className="border-y border-white/5 bg-[#0b0b0e]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-amber-300">What happens if the free result helps?</p>
          <h2 className="mt-3 text-4xl font-black">You choose how far to go.</h2>
          <p className="mt-5 leading-8 text-neutral-400">Keep the free result and do it yourself, use a ready-made product, or ask AIKAGAN to help implement and operate the solution. There is no requirement to upgrade.</p>
          <Link href="/services/" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-300/35 px-5 py-3 font-bold text-amber-300">See implementation help <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Free','Use diagnostics, samples and public tools at no cost.'],
            ['DIY','Use ready-made workflows, templates or product packs yourself.'],
            ['Implemented','Get help configuring a defined workflow or commercial fix.'],
            ['Managed','Have ongoing AI and revenue operations supported and improved.'],
          ].map(([t,b])=><div key={t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Sparkles className="h-5 w-5 text-amber-300"/><h3 className="mt-4 text-xl font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{b}</p></div>)}
        </div>
      </div>
    </section>

    <SocialProof />

    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.10),transparent_55%),#0d0d10] px-7 py-14 text-center sm:px-12">
        <ShieldCheck className="mx-auto h-7 w-7 text-amber-300" />
        <p className="mt-5 text-sm font-semibold text-amber-300">You can start without knowing exactly what you need.</p>
        <h2 className="mt-4 text-4xl font-black">Find the problem first. Then decide whether it deserves a tool, a workflow, or no purchase at all.</h2>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">The Revenue Leak Scan is the simplest place to begin. It gives you an immediate result and points to the next useful step.</p>
        <Link href="/tools/revenue-leak-scan/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Start free scan <ArrowRight className="h-4 w-4"/></Link>
      </div>
    </section>
  </main>;
}
