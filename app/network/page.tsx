import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gift, Handshake, Share2, Users } from 'lucide-react';
import ShareNetwork from './ShareNetwork';
import NetworkJoinForm from './NetworkJoinForm';

export const metadata: Metadata = {
  title:'Join the AIKAGAN Network | Try, Share & Shape What Gets Built',
  description:'Join a free network around practical AI business tools. Try useful software, shape what gets built next, share what helps, and optionally earn on verified referrals.',
  alternates:{canonical:'https://aikagan.com/network/'},
  openGraph:{title:'Join the AIKAGAN Network — Use it. Improve it. Share it.',description:'Try practical AI business tools for free, help shape what gets built next, and invite someone who could genuinely benefit.',url:'https://aikagan.com/network/',type:'website',images:['https://aikagan.com/og.png']},
  twitter:{card:'summary_large_image',title:'Join the AIKAGAN Network — Use it. Improve it. Share it.',description:'Try practical AI business tools for free, help shape what gets built next, and invite someone who could genuinely benefit.',images:['https://aikagan.com/og.png']},
};

export default function NetworkPage(){
  return <main className="min-h-screen bg-[#08080a] px-5 py-20 text-white"><section className="mx-auto max-w-6xl">
    <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
      <div><p className="text-sm font-semibold text-emerald-300">AIKAGAN Network · free to join</p><h1 className="mt-4 text-5xl font-black leading-[.95] md:text-7xl">Use it. Improve it. <span className="text-amber-300">Invite someone who could benefit.</span></h1><p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">This network is for builders, operators, founders, creators and small teams who want practical AI tools without needing to buy first. Try the free experiences, tell us what would make them better, and share the useful ones with people who have the same problem.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/tools/" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-black text-black">Try free tools <ArrowRight className="h-4 w-4"/></Link><a href="https://github.com/laziestlarry/aikagan-web/issues/38" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 px-5 py-3 font-bold text-emerald-300">Builder discussion</a><Link href="/affiliates/" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-bold text-white">Referral program</Link></div></div>
      <NetworkJoinForm/>
    </div>

    <div className="mt-14 grid gap-5 md:grid-cols-3">{[{icon:Gift,title:'Get useful things first',body:'Use free diagnostics, samples and AutonomaX experiences before deciding whether you need anything paid.'},{icon:Users,title:'Shape the roadmap',body:'Your usage and feedback reveal which problems deserve the next free tool, workflow or implementation service.'},{icon:Handshake,title:'Grow with the network',body:'Share relevant tools with peers. If you want a commercial role, the affiliate program attributes verified sales to your referral code.'}].map(({icon:Icon,title,body})=><div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><Icon className="h-6 w-6 text-amber-300"/><h2 className="mt-5 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p></div>)}</div>

    <section className="mt-14 rounded-[32px] border border-amber-300/25 bg-amber-300/[0.04] p-7 sm:p-9"><div className="flex items-start gap-4"><Share2 className="mt-1 h-6 w-6 flex-none text-amber-300"/><div><h2 className="text-2xl font-bold">Know one person who would genuinely benefit?</h2><p className="mt-2 max-w-3xl text-neutral-300">Send them the free tools—not a sales pitch. The shared link is campaign-tagged so we can learn whether member referrals create useful visits and feedback.</p></div></div><div className="mt-6"><ShareNetwork/></div></section>

    <section className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 text-center"><h2 className="text-xl font-bold">Prefer a public technical conversation?</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-neutral-300">The GitHub builder thread is open for bug reports, integration ideas, workflow requests, and concrete use cases.</p><a href="https://github.com/laziestlarry/aikagan-web/issues/38" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold text-emerald-300">Open builder thread <ArrowRight className="h-4 w-4"/></a></section>

    <section className="mt-14 text-center"><p className="text-sm text-neutral-500">The network grows on usefulness: try → share → feedback → better tools → stronger outcomes.</p></section>
  </section></main>;
}
