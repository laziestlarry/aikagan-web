'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clipboard, Gauge, RotateCcw, ShieldCheck } from 'lucide-react';

type Answers = Record<string, number>;
const STORAGE_KEY='aikagan:en:revenue-leak-scan:v1';
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
const names:Record<string,string>={offer:'offer clarity',proof:'trust & proof',checkout:'checkout',fulfillment:'fulfillment',followup:'follow-up',measurement:'measurement',retention:'retention'};
const guidance:Record<string,{why:string;diy:string;improve:string;service:string}>={
  offer:{why:'If visitors cannot quickly understand what they get and for whom it is valuable, later conversion improvements have less to work with.',diy:'Show the first screen to someone unfamiliar with the business. After 30 seconds, can they explain the outcome, target buyer and next step?',improve:'Use one primary outcome, a clear target customer, one tangible example and one dominant next action.',service:'We can simplify the offer, first-screen message and decision path into an implementation-ready offer architecture.'},
  proof:{why:'Even a strong offer can feel risky without evidence. Buyers look for proof that the promised capability actually exists before paying.',diy:'Can a visitor see a real sample, delivery artifact, case, working demonstration or verifiable method next to the buying decision?',improve:'Move proof closer to the decision point and clearly separate observed evidence, examples, assumptions and anything not guaranteed.',service:'We can structure existing evidence, fill trust gaps and place proof assets into the commercial journey.'},
  checkout:{why:'Once buying intent exists, unnecessary steps, ambiguity or payment failure can turn directly into lost revenue.',diy:'Use a private browser window on mobile and attempt the purchase like a first-time customer. Is price, payment method, error recovery and return path clear?',improve:'Reduce unnecessary fields, disclose total cost early and make failures recoverable without losing the transaction state.',service:'We can test the payment path end to end and rank provider, UX and conversion defects by commercial impact.'},
  fulfillment:{why:'A sale is not complete when money arrives; it is complete when the promised outcome is accessible, usable and traceably delivered.',diy:'Walk the full post-payment path: confirmation → access → delivery → instructions → support → re-access. Does every step work?',improve:'Explain timing and scope before payment, then make confirmation, access and support visible immediately afterward.',service:'We can connect order evidence, QA, delivery, re-access and acceptance into a traceable fulfillment flow.'},
  followup:{why:'A visitor who is not ready today still has value. Without a useful next step, earned attention disappears.',diy:'Can a non-buyer leave with a useful diagnostic, sample, consultation or other low-friction next action instead of a dead end?',improve:'Offer one useful low-pressure progression path rather than multiple generic CTAs.',service:'We can design an interest → follow-up → conversation → offer flow matched to the buyer journey without bulk outreach.'},
  measurement:{why:'If you cannot connect a verified order back to its source, traffic growth and revenue growth remain separate stories.',diy:'Pick one real order and trace it backward. Can you identify the source, landing page, CTA, checkout event and verified payment?',improve:'Track pageviews, intent, payment and verified order as different events, and keep test activity out of commercial truth.',service:'We can establish durable revenue, attribution and funnel telemetry that prioritizes verified commercial evidence.'},
  retention:{why:'If the next reason to return is undefined, every sale requires reacquiring demand from zero.',diy:'After delivery, what naturally comes next: update, maintenance, new production, performance review, expansion or referral?',improve:'Finish the first purchase with an accepted outcome and a justified next-value step.',service:'We can connect delivery acceptance, performance review, expansion and repeat purchase into the product lifecycle.'},
};

export default function RevenueLeakScan() {
  const [answers,setAnswers] = useState<Answers>({});
  const [restored,setRestored]=useState(false);
  const [shareStatus,setShareStatus]=useState('');
  useEffect(()=>{try{const raw=window.localStorage.getItem(STORAGE_KEY);if(raw)setAnswers(JSON.parse(raw));}catch{}finally{setRestored(true)}},[]);
  useEffect(()=>{if(!restored)return;try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(answers));}catch{}},[answers,restored]);
  const complete = Object.keys(answers).length === questions.length;
  const score = useMemo(() => Math.round(Object.values(answers).reduce((a,b)=>a+b,0) / (questions.length*2) * 100), [answers]);
  const weakest = useMemo(() => questions.filter(([key]) => (answers[key] ?? 3) < 2).map(([key])=>key).sort((a,b)=>(answers[a]??0)-(answers[b]??0)).slice(0,3), [answers]);
  const band = score >= 80 ? 'Conversion-ready' : score >= 55 ? 'Recoverable friction' : 'Revenue leakage likely';
  const summary=score>=80?'Your basic conversion chain looks strong. The next experiment can focus more on qualified demand, offer economics and repeat value.':score>=55?'Your answers suggest a few weak links are slowing how current attention becomes revenue. Strengthen the priorities below before simply adding more traffic.':'The immediate problem may not be a lack of traffic. Your answers suggest existing attention can be lost across trust, checkout, fulfillment or follow-up before it becomes durable revenue.';
  function reset(){setAnswers({});setShareStatus('');try{window.localStorage.removeItem(STORAGE_KEY)}catch{}}
  async function share(){const priorities=weakest.length?weakest.map((k,i)=>`${i+1}. ${names[k]}`).join(', '):'qualified demand, offer economics and retention';const text=`AIKAGAN Revenue Leak result: ${score}/100 — ${band}. Priorities: ${priorities}. https://aikagan.com/tools/revenue-leak-scan`;try{if(navigator.share){await navigator.share({title:'AIKAGAN Revenue Leak result',text,url:'https://aikagan.com/tools/revenue-leak-scan'});setShareStatus('Share ready.');return;}await navigator.clipboard.writeText(text);setShareStatus('Result copied to clipboard.');}catch{setShareStatus('Sharing cancelled.');}}

  return <div className="space-y-6">
    <div className="grid gap-4">
      {questions.map(([key,q],i)=><div key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex gap-3"><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-amber-300/30 text-xs text-amber-300">{i+1}</span><p className="font-medium text-white">{q}</p></div>
        <div className="mt-4 grid grid-cols-3 gap-2">{labels.map((label,value)=><button key={label} onClick={()=>setAnswers(a=>({...a,[key]:value}))} className={`rounded-xl border px-3 py-3 text-xs transition ${answers[key]===value?'border-amber-300 bg-amber-300/10 text-amber-200':'border-white/10 text-neutral-400 hover:border-white/30'}`}>{label}</button>)}</div>
      </div>)}
    </div>

    {Object.keys(answers).length>0&&<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-neutral-400"><span>Your answers are saved in this browser so you can leave and return to the result.</span><button onClick={reset} className="inline-flex items-center gap-2 text-neutral-300 hover:text-white"><RotateCcw className="h-4 w-4"/>Start a new scan</button></div>}

    {complete && <section className="rounded-3xl border border-amber-300/30 bg-amber-300/[0.05] p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Your free assessment result</p><h2 className="mt-2 text-3xl font-bold text-white">{score}/100 · {band}</h2></div><Gauge className="h-10 w-10 text-amber-300" /></div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-amber-300" style={{width:`${score}%`}} /></div>
      <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Executive summary</p><p className="mt-3 leading-7 text-neutral-300">{summary}</p></div>
      <h3 className="mt-7 font-semibold text-white">Highest-value fixes</h3>
      <div className="mt-3 space-y-4">{weakest.length ? weakest.map((key,i)=>{const g=guidance[key];return <div key={key} className="rounded-2xl bg-black/20 p-5"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-amber-300"/><div><div className="font-semibold text-white">Priority {i+1}: {names[key]}</div><p className="mt-2 text-sm leading-6 text-neutral-300">{g.why}</p></div></div><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">DIY check</p><p className="mt-2 text-sm leading-6 text-neutral-400">{g.diy}</p></div><div className="rounded-xl border border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-300">Improvement direction</p><p className="mt-2 text-sm leading-6 text-neutral-400">{g.improve}</p></div><div className="rounded-xl border border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-sky-300">With AIKAGAN</p><p className="mt-2 text-sm leading-6 text-neutral-400">{g.service}</p></div></div></div>}) : <div className="rounded-xl bg-black/20 p-4 text-neutral-300">Your basic conversion chain is strong. The next experiment should focus on qualified traffic, offer economics, and retention.</div>}</div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href={`/contact?source=revenue-leak-scan&score=${score}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-bold text-black">Tell us what you need <ArrowRight className="h-4 w-4"/></Link><Link href="/services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-white">See implementation support</Link></div>
      <div className="mt-3 flex flex-wrap gap-3"><button onClick={share} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:border-white/25 hover:text-white"><Clipboard className="h-4 w-4"/>Share / copy result</button><button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:border-white/25 hover:text-white"><RotateCcw className="h-4 w-4"/>New scan</button></div>
      {shareStatus&&<p className="mt-3 text-xs text-emerald-300">{shareStatus}</p>}
      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck className="h-4 w-4"/>No email required. This score is based only on your answers; it is not a forensic audit or a guarantee.</p>
    </section>}
  </div>;
}
