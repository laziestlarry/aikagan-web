'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gauge, ShieldCheck, Sparkles } from 'lucide-react';

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

export default function RevenueLeakScan() {
  const [answers,setAnswers] = useState<Answers>({});
  const complete = Object.keys(answers).length === questions.length;
  const score = useMemo(() => Math.round(Object.values(answers).reduce((a,b)=>a+b,0) / (questions.length*2) * 100), [answers]);
  const weakest = useMemo(() => questions.filter(([key]) => (answers[key] ?? 3) < 2).map(([key,q])=>({key,q,score:answers[key] ?? 0})).sort((a,b)=>a.score-b.score).slice(0,3), [answers]);
  const band = score >= 80 ? 'Conversion-ready' : score >= 55 ? 'Recoverable friction' : 'Revenue leakage likely';

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
      <div className="mt-3 space-y-3">{weakest.length ? weakest.map((item,i)=><div key={item.key} className="flex gap-3 rounded-xl bg-black/20 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-amber-300"/><div><div className="font-medium text-white">Priority {i+1}: {item.key}</div><p className="mt-1 text-sm text-neutral-400">Fix this before adding more traffic. A weak {item.key} layer compounds acquisition cost and hides demand.</p></div></div>) : <div className="rounded-xl bg-black/20 p-4 text-neutral-300">Your basic conversion chain is strong. The next experiment should focus on qualified traffic, offer economics, and retention.</div>}</div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href="/autonomax/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-bold text-black">Explore AutonomaX <ArrowRight className="h-4 w-4"/></Link><Link href="/products/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-white">See implementation options</Link></div>
      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck className="h-4 w-4"/>No email required. No invented ROI. This score is based only on your answers.</p>
    </section>}
  </div>;
}
