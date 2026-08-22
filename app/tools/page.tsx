import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Gauge, Gift, MessageSquareText, Users, Workflow } from 'lucide-react';

export const metadata: Metadata = {
  title:'Try Free AI Business Tools | AIKAGAN',
  description:'Choose a free AIKAGAN experience: diagnose revenue friction, inspect a delivery sample, or explore how AutonomaX turns goals into guided execution.',
  alternates:{canonical:'https://aikagan.com/tools/'},
};

const tools=[
  {title:'Revenue Leak Scan',question:'Where is my business losing momentum?',body:'Answer seven simple questions about your offer, proof, checkout, delivery, follow-up and retention.',result:'Get an immediate score and a ranked list of what to improve first.',href:'/tools/revenue-leak-scan/',icon:Gauge,time:'~2 min',account:'No account',cta:'Get my free score'},
  {title:'Golden Delivery Sample',question:'What does a practical AIKAGAN deliverable look like?',body:'Inspect a real example of the checklists, operating assets and delivery structure used in AIKAGAN products.',result:'Judge the quality and usefulness for yourself before buying anything.',href:'/free/golden-delivery-sample/',icon:Gift,time:'~3 min',account:'Free access',cta:'Open free sample'},
  {title:'AutonomaX Explorer',question:'How can AI help turn a business goal into action?',body:'Explore the execution environment and see how an objective becomes a guided mission with next actions and progress.',result:'Understand how the platform works by experiencing it instead of reading feature descriptions.',href:'https://app.aikagan.com/autonomax/',icon:Workflow,time:'Explore freely',account:'No purchase',cta:'Explore AutonomaX'},
];

export default function ToolsPage(){
  return <main className="min-h-screen bg-[#08080a] px-5 py-20 text-white"><section className="mx-auto max-w-6xl">
    <div className="max-w-4xl"><p className="text-sm font-semibold text-emerald-300">Try AIKAGAN for free</p><h1 className="mt-3 text-5xl font-extrabold md:text-7xl">Start with the problem you want to solve.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">You do not need to understand our platform first. Pick one free experience below and get a useful result. If it helps, you can decide whether you want to go further.</p></div>
    <div className="mt-12 grid gap-5 lg:grid-cols-3">{tools.map(({title,question,body,result,href,icon:Icon,time,account,cta})=><Link key={title} href={href} className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-amber-300/40"><div className="flex items-center justify-between"><Icon className="h-7 w-7 text-amber-300"/><div className="flex gap-2"><span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-neutral-400">{time}</span><span className="rounded-full border border-emerald-400/25 px-2.5 py-1 text-[11px] text-emerald-300">{account}</span></div></div><p className="mt-6 text-sm font-semibold text-emerald-300">{question}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-neutral-400">{body}</p><div className="mt-5 rounded-xl bg-black/25 p-4 text-sm leading-6 text-neutral-300"><strong className="text-white">You get:</strong> {result}</div><span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-amber-300">{cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></Link>)}</div>

    <div className="mt-12 grid gap-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-7 md:grid-cols-[1fr_auto] md:items-center"><div><div className="flex items-center gap-3"><Users className="h-5 w-5 text-emerald-300"/><h2 className="text-2xl font-bold">Found something useful? Join the network.</h2></div><p className="mt-3 max-w-3xl text-neutral-300">Try new tools early, help shape what gets built next, share useful experiences with peers, and optionally use the referral program if you want to earn on verified sales.</p></div><Link href="/network/?utm_source=free-tools&utm_medium=onsite&utm_campaign=aikagan_network" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-black text-black">Join & share <ArrowRight className="h-4 w-4"/></Link></div>

    <div className="mt-5 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="text-2xl font-bold">Tried something? Tell us what would make it better.</h2><p className="mt-3 max-w-3xl text-neutral-300">Feedback is optional and comes after the experience. Tell us what helped, what was missing, and what outcome you would actually want solved.</p></div><Link href="/feedback/?utm_source=free-tools&utm_medium=onsite&utm_campaign=feedback-loop" className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/35 px-5 py-3 text-sm font-bold text-amber-300">Share feedback <MessageSquareText className="h-4 w-4"/></Link></div>
  </section></main>;
}
