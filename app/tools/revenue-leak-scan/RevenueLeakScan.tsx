'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gauge, ShieldCheck } from 'lucide-react';

type Answers = Record<string, number>;
const questions = [
  ['offer','Can a new visitor understand your offer and outcome in under 30 seconds?'],
  ['proof','Do you show credible proof, examples, or a working demonstration before asking for payment?'],
  ['checkout','Can a buyer reach a working checkout in two clicks or fewer?'],
  ['fulfillment','Does a verified payment automatically activate delivery or service access?'],
  ['followup','Do interested visitors have a useful next step if they are not ready to buy today?'],
  ['measurement','Can you attribute a verified purchase to the channel or campaign that created it?'],
  ['retention','After delivery, is there a clear reason for the customer to return, expand, or refer someone?'],
] as const;

const labels = ['No / unknown','Partly','Yes, reliably'];

const fixes: Record<string,{title:string;body:string;href:string;cta:string}> = {
  offer:{title:'Clarify the offer buyers see',body:'Turn a broad AI proposition into one outcome, one buyer and one measurable next step.',href:'/services',cta:'Fix my offer'},
  proof:{title:'Build proof before asking for payment',body:'Use a working sample, before/after evidence and a scoped delivery example to reduce buyer risk.',href:'/free/golden-delivery-sample',cta:'See the delivery standard'},
  checkout:{title:'Repair the intent-to-payment path',body:'Reduce checkout friction, provider ambiguity and unnecessary steps between decision and verified payment.',href:'/products',cta:'Review purchase options'},
  fulfillment:{title:'Make delivery operational',body:'Connect verified payment to activation, delivery evidence and a clear customer handoff.',href:'/services',cta:'Implement fulfillment'},
  followup:{title:'Give interested buyers a useful next step',body:'Route non-buyers into a relevant free result or implementation conversation instead of a dead end.',href:'/services',cta:'Choose implementation help'},
  measurement:{title:'Make growth measurable',body:'Connect acquisition source, checkout intent and verified purchase so spend follows evidence rather than clicks.',href:'/services',cta:'Set up revenue measurement'},
  retention:{title:'Create the second transaction',body:'Add a defined expansion, managed-service or referral path after the first delivered outcome.',href:'/services',cta:'Design the growth loop'},
};

export default function RevenueLeakScan() {
  const [answers,setAnswers] = useState<Answers>({});
  const complete = Object.keys(answers).length === questions.length;
  const score = useMemo(() => Math.round(Object.values(answers).reduce((a,b)=>a+b,0) / (questions.length*2) * 100), [answers]);
  const weakest = useMemo(() => questions.filter(([key]) => (answers[key] ?? 3) < 2).map(([key,q])=>({key,q,score:answers[key] ?? 0})).sort((a,b)=>a.score-b.score).slice(0,3), [answers]);
  const band = score >= 80 ? 'Conversion-ready' : score >= 55 ? 'Recoverable friction' : 'Revenue leakage likely';
  const primary = weakest[0] ? fixes[weakest[0].key] : {title:'Your conversion chain is ready for qualified demand',body:'Do not buy broad traffic. Put the offer in front of buyers already trying to improve revenue, automation, customer service or operating efficiency.',href:'/services',cta:'Choose a growth outcome'};

  return <div className="space-y-6">
    <div className="grid gap-4">
      {questions.map(([key,q],i)=><div key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex gap-3"><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-amber-300/30 text-xs text-amber-300">{i+1}</span><p className="font-medium text-white">{q}</p></div>
        <div className="mt-4 grid grid-cols-3 gap-2">{labels.map((label,value)=><button key={label} onClick={()=>setAnswers(a=>({...a,[key]:value}))} className={`rounded-xl border px-3 py-3 text-xs transition ${answers[key]===value?'border-amber-300 bg-amber-300/10 text-amber-200':'border-white/10 text-neutral-400 hover:border-white/30'}`}>{label}</button>)}</div>
      </div>)}
    </div>

    {complete && <section className="rounded-3xl border border-amber-300/30 bg-amber-300/[0.05] p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Your free result</p><h2 className="mt-2 text-3xl font-bold text-white">{score}/100 · {band}</h2></div><Gauge className="h-10 w-10 text-amber-300" /></div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-amber-300" style={{width:`${score}%`}} /></div>
      <h3 className="mt-7 font-semibold text-white">Highest-value fixes</h3>
      <div className="mt-3 space-y-3">{weakest.length ? weakest.map((item,i)=><div key={item.key} className="flex gap-3 rounded-xl bg-black/20 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-amber-300"/><div><div className="font-medium text-white">Priority {i+1}: {fixes[item.key].title}</div><p className="mt-1 text-sm text-neutral-400">{fixes[item.key].body}</p></div></div>) : <div className="rounded-xl bg-black/20 p-4 text-neutral-300">Your basic conversion chain is strong. The next experiment should focus on qualified traffic, offer economics, and retention.</div>}</div>

      <div className="mt-7 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Recommended next move</p>
        <h3 className="mt-2 text-xl font-bold text-white">{primary.title}</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-300">{primary.body}</p>
        <Link href={primary.href} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-bold text-black">{primary.cta} <ArrowRight className="h-4 w-4"/></Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2"><Link href="/free/golden-delivery-sample" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-white">Inspect a free delivery sample</Link><Link href="https://app.aikagan.com/autonomax" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-white">Explore AutonomaX <ArrowRight className="h-4 w-4"/></Link></div>
      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck className="h-4 w-4"/>No email required. No invented ROI. Recommendations are based only on your answers.</p>
    </section>}
  </div>;
}
