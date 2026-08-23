import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gift, Gauge, Linkedin, Share2, Sparkles, Workflow, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Start Free — AIKAGAN Value-First Business Tools',
  description: 'AIKAGAN now starts with useful free business diagnostics, samples and AI workflows. Get value first, then choose implementation only when it is worth doing.',
  alternates: { canonical: 'https://aikagan.com/start-free/' },
  openGraph: {
    title: 'AIKAGAN now starts free: useful results before purchase',
    description: 'Free diagnostics, practical samples and guided AI workflows. Find the problem first. Pay only when you want help implementing a worthwhile improvement.',
    url: 'https://aikagan.com/start-free/',
    type: 'website',
  },
};

const offers = [
  { icon: Gauge, title: 'Free Revenue Leak Scan', body: 'Answer seven practical questions and get an immediate view of weak points across offer, checkout, delivery, follow-up and retention.', href: '/tools/revenue-leak-scan/', cta: 'Run the free scan' },
  { icon: Gift, title: 'Free Golden Delivery Sample', body: 'Inspect a real sample of the practical assets, checklists and delivery structure before deciding whether any paid pack is useful to you.', href: '/free/golden-delivery-sample/', cta: 'Open the free sample' },
  { icon: Workflow, title: 'Explore AutonomaX', body: 'See how a business objective becomes a guided execution mission with concrete next actions and measurable progress.', href: 'https://app.aikagan.com/autonomax/', cta: 'Explore AutonomaX' },
];

const shareText = encodeURIComponent('AIKAGAN now starts with free value: practical business diagnostics and guided AI workflows before any purchase.');
const shareUrl = encodeURIComponent('https://aikagan.com/start-free/');

export default function StartFreePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.18),transparent_42%),linear-gradient(180deg,#100d07_0%,#08080a_70%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-sm font-bold text-emerald-300"><Sparkles className="h-4 w-4" /> New AIKAGAN model — value first</div>
          <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-7xl">Start with something useful. <span className="text-amber-300">Pay only when execution is worth it.</span></h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-neutral-300">AIKAGAN is moving to a product-led, value-first model. Free diagnostics, samples and guided AI experiences come first. Paid services begin only when you want a useful result implemented, automated or managed.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/tools/revenue-leak-scan/" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Start free <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/tools/" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold hover:border-white/30">Browse free tools</Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-neutral-300 hover:border-white/25 hover:text-white"><Linkedin className="h-4 w-4" /> Share on LinkedIn</a>
            <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-neutral-300 hover:border-white/25 hover:text-white"><Share2 className="h-4 w-4" /> Share on X</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-neutral-300 hover:border-white/25 hover:text-white"><Share2 className="h-4 w-4" /> Share on Facebook</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl"><p className="text-sm font-bold text-emerald-300">What is available now</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">Three ways to experience the value for free.</h2><p className="mt-5 text-lg leading-8 text-neutral-400">No mailing list is required to understand the offer. Use the experience, keep the result and decide for yourself whether anything deserves further implementation.</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">{offers.map(({ icon: Icon, title, body, href, cta }) => (<Link key={title} href={href} className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-amber-300/40"><Icon className="h-7 w-7 text-amber-300" /><h3 className="mt-6 text-2xl font-bold">{title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-neutral-400">{body}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-amber-300">{cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>))}</div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0e]"><div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 lg:grid-cols-2 lg:items-center"><div><Wrench className="h-7 w-7 text-amber-300" /><h2 className="mt-5 text-4xl font-black">The paid boundary moves after demonstrated value.</h2><p className="mt-5 leading-8 text-neutral-400">If a free result exposes an improvement worth making, you can implement it yourself or ask AIKAGAN / AutonomaX to configure, deploy and operate it. The service is the execution—not access to a sales pitch.</p></div><div className="space-y-4">{[['Free','Diagnostics, examples, public tools and practical guidance.'],['Implement','A defined correction or workflow is completed for you.'],['Automate','The useful workflow is integrated into real operations.'],['Manage','Ongoing optimization and execution are operated as a service.']].map(([title, body]) => (<div key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-300" /><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-neutral-400">{body}</p></div></div>))}</div></div></section>

      <section className="px-6 py-24"><div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/20 bg-[#0d0d10] px-7 py-14 text-center sm:px-12"><p className="text-sm font-bold text-amber-300">The simplest first step</p><h2 className="mt-4 text-4xl font-black">Find the problem first. Then decide whether it deserves action.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">Run the free Revenue Leak Scan. It gives you a concrete result immediately and points to the commercial area that looks weakest.</p><Link href="/tools/revenue-leak-scan/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Get my free score <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  );
}
