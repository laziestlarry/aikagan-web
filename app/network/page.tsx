import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, GraduationCap, Gift, Handshake, Share2, TestTube2, Users } from 'lucide-react';
import ShareNetwork from './ShareNetwork';
import NetworkJoinForm from './NetworkJoinForm';

export const metadata: Metadata = {
  title:'Join the AIKAGAN Network',
  description:'Join AIKAGAN founding testers, developers, coders, trainers, creators and operators. Try practical AI tools, report evidence, improve the product and earn only on verified referrals.',
  alternates:{canonical:'https://aikagan.com/network'},
  openGraph:{title:'AIKAGAN Founding Tester Network — Use it. Break it. Improve it.',description:'Developers, coders, trainers, creators and operators can test practical AI business tools and shape what ships next.',url:'https://aikagan.com/network',type:'website',images:['https://aikagan.com/og.png']},
  twitter:{card:'summary_large_image',title:'AIKAGAN Founding Tester Network',description:'Try practical AI business tools, report evidence, improve the product and invite people who genuinely benefit.',images:['https://aikagan.com/og.png']},
};

export default function NetworkPage(){
  return <main className="min-h-screen bg-[#08080a] px-5 py-20 text-white"><section className="mx-auto max-w-6xl">
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
      <div><p className="text-sm font-semibold text-emerald-300">AIKAGAN Network · Founding Tester Circle</p><h1 className="mt-4 text-5xl font-black leading-[.95] md:text-7xl">Use it. Break it. Improve it. <span className="text-amber-300">Help prove what works.</span></h1><p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">We are inviting developers, coders, trainers, QA-minded builders, creators, founders and operators to become early users. Start with free experiences, test a real workflow, report bugs or friction, and help turn evidence into a stronger customer journey.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-black text-black">Try free tools <ArrowRight className="h-4 w-4"/></Link><a href="https://github.com/laziestlarry/aikagan-web/issues/38" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 px-5 py-3 font-bold text-emerald-300">Technical test thread</a><Link href="/affiliates" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-bold text-white">Verified-sale referral program</Link></div></div>
      <NetworkJoinForm/>
    </div>

    <section className="mt-14"><p className="text-xs font-bold uppercase tracking-[.22em] text-amber-300">Who we need first</p><div className="mt-5 grid gap-5 md:grid-cols-3">{[
      {icon:Code2,title:'Coders & developers',body:'Test integrations, checkout handoffs, edge cases, error states and developer-facing workflows. Reproduce issues and propose bounded fixes.'},
      {icon:GraduationCap,title:'Trainers & educators',body:'Test whether a first-time user can understand the workflow, teach it, complete it, and identify where instructions or outcomes are unclear.'},
      {icon:TestTube2,title:'QA-minded first users',body:'Run real user journeys from free diagnosis through product choice. Report what blocks trust, comprehension, conversion, access or re-use.'},
    ].map(({icon:Icon,title,body})=><div key={title} className="rounded-3xl border border-amber-300/15 bg-amber-300/[0.035] p-6"><Icon className="h-6 w-6 text-amber-300"/><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p></div>)}</div></section>

    <div className="mt-14 grid gap-5 md:grid-cols-3">{[{icon:Gift,title:'Get useful things first',body:'Use free diagnostics, samples and AutonomaX experiences before deciding whether you need anything paid.'},{icon:Users,title:'Get a prioritized feedback lane',body:'Founding testers can submit concrete bugs, friction and use cases through the public builder thread. Useful evidence informs the next release.'},{icon:Handshake,title:'Benefit only where evidence supports it',body:'Contributor recognition is optional and permission-based. Commercial partners can use the affiliate program; commission is recorded only after a verified attributed sale.'}].map(({icon:Icon,title,body})=><div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><Icon className="h-6 w-6 text-amber-300"/><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p></div>)}</div>

    <section className="mt-14 rounded-[32px] border border-amber-300/25 bg-amber-300/[0.04] p-7 sm:p-9"><div className="flex items-start gap-4"><Share2 className="mt-1 h-6 w-6 flex-none text-amber-300"/><div><h2 className="text-2xl font-bold">Know one builder or trainer who would genuinely help?</h2><p className="mt-2 max-w-3xl text-neutral-300">Send the testing invitation or free tools—not a sales pitch. The shared link is campaign-tagged so member referrals can be evaluated as real visits, feedback and qualified opportunities.</p></div></div><div className="mt-6"><ShareNetwork/></div></section>

    <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 text-center"><h2 className="text-xl font-bold">Public technical evidence belongs in the builder thread</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-neutral-300">Use it for reproducible bugs, integration ideas, checkout or fulfillment friction, training observations and concrete customer use cases. Do not post credentials, private customer data or payment details.</p><a href="https://github.com/laziestlarry/aikagan-web/issues/38" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold text-emerald-300">Open builder test thread <ArrowRight className="h-4 w-4"/></a></section>

    <section className="mt-14 text-center"><p className="text-sm text-neutral-500">Founding-test loop: try → observe → report → fix → verify → share only what genuinely helps.</p></section>
  </section></main>;
}
