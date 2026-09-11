'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react';

type Draft = {
  stage: string; asset: string; priority: string; email: string; title: string;
  objective: string; boundary: string; baseline: string; target: string; owner: string;
  autonomy: string;
};

const emptyDraft: Draft = { stage:'',asset:'',priority:'',email:'',title:'',objective:'',boundary:'',baseline:'',target:'',owner:'',autonomy:'prepare' };
const routeChoices = [
  { key:'stage', question:'Where are you today?', options:[['ideas','I have ideas'],['offer','I have an offer'],['operating','I am operating']] },
  { key:'asset', question:'What is your strongest current asset?', options:[['skill','Professional skill'],['audience','Audience or network'],['product','Product or system'],['operations','Operations or data']] },
  { key:'priority', question:'What matters most right now?', options:[['revenue','Speed to revenue'],['reliability','Reliable operations'],['growth','Scalable growth']] },
] as const;

export default function OutcomeIntake() {
  const [step,setStep] = useState(0);
  const [draft,setDraft] = useState<Draft>(emptyDraft);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const canContinue = step === 0 ? Boolean(draft.stage&&draft.asset&&draft.priority) : true;
  const summary = useMemo(() => [draft.stage,draft.asset,draft.priority].filter(Boolean).join(' · '), [draft]);
  const update = (key:keyof Draft,value:string) => setDraft(current=>({...current,[key]:value}));
  const clearMission = () => setDraft(current=>({...current,title:'',objective:'',boundary:'',baseline:'',target:'',owner:'',autonomy:'prepare'}));
  const cancelDraft = () => { setDraft(emptyDraft); setStep(0); setError('Draft cancelled. No information was submitted.'); };

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const objective = [
      draft.objective,
      draft.boundary ? `Do not change: ${draft.boundary}` : '',
      draft.baseline ? `Current baseline: ${draft.baseline}` : '',
      draft.target ? `Acceptance target: ${draft.target}` : '',
      draft.owner ? `Human responsible: ${draft.owner}` : '',
      `Autonomy: ${draft.autonomy}`,
      `Profile route: ${summary}`,
    ].filter(Boolean).join('\n');
    try {
      const registration = await fetch('/api/customer/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:draft.email})});
      if (registration.status === 409) {
        setError('A workspace already exists for this email. Open it through your verified purchase receipt, or contact kagan@aikagan.com.');
        return;
      }
      if (!registration.ok) throw new Error('registration');
      const mission = await fetch('/api/customer/mission',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:draft.title,segment:draft.stage==='operating'?'sme':'founder',objective})});
      if (!mission.ok) throw new Error('mission');
      window.location.assign('https://app.aikagan.com/dashboard');
    } catch {
      setError('The mission could not be saved. Your draft remains on this page. Retry or contact kagan@aikagan.com.');
    } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-[#07090d] px-6 py-16 text-white">
    <section className="mx-auto max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-sky-300"><ArrowLeft className="h-4 w-4"/>OutcomeOS</Link>
      <div className="mt-8 flex items-end justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[.24em] text-amber-300">90-second mission intake</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">One step at a time.</h1></div><span className="text-sm text-neutral-400">Step {step+1} of 3</span></div>
      <div className="mt-7 grid grid-cols-3 gap-2" aria-label="Progress">{['Route','Mission','Review'].map((label,index)=><div key={label} className={`rounded-full px-3 py-2 text-center text-xs font-bold ${index<=step?'bg-amber-300 text-black':'bg-white/5 text-neutral-500'}`}>{label}</div>)}</div>

      {error && <div className="mt-6 rounded-xl border border-amber-300/25 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">{error}</div>}

      <form id="mission-form" onSubmit={submit}>
      {step===0 && <div className="mt-8 space-y-5">{routeChoices.map(({key,question,options})=><fieldset key={key} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><legend className="px-2 text-lg font-bold">{question}</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{options.map(([value,label])=><button type="button" key={value} onClick={()=>update(key,value)} className={`rounded-xl border px-4 py-4 text-left font-semibold transition ${draft[key]===value?'border-amber-300 bg-amber-300/10 text-amber-100':'border-white/10 bg-black/20 text-neutral-300 hover:border-white/30'}`}>{label}{draft[key]===value&&<CheckCircle2 className="ml-2 inline h-4 w-4 text-emerald-300"/>}</button>)}</div></fieldset>)}</div>}

      {step===1 && <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Email for workspace access" type="email" required value={draft.email} onChange={v=>update('email',v)}/><Field label="Mission title" required value={draft.title} onChange={v=>update('title',v)} placeholder="Repair lead-to-follow-up handoff"/></div>
        <Area label="What do you want to change or achieve?" required value={draft.objective} onChange={v=>update('objective',v)} placeholder="Describe one observable business result."/>
        <Area label="What must not be changed?" value={draft.boundary} onChange={v=>update('boundary',v)} placeholder="Protected systems, data, commitments or boundaries."/>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Current baseline" value={draft.baseline} onChange={v=>update('baseline',v)} placeholder="12 hours/week, 20% rework…"/><Field label="Target and acceptance check" required value={draft.target} onChange={v=>update('target',v)} placeholder="Test lead reaches owner within 5 minutes"/></div>
        <Field label="Human responsible for approval or decline" required value={draft.owner} onChange={v=>update('owner',v)} placeholder="Name or role"/>
        <label className="mt-5 block text-sm font-bold text-neutral-200">AI autonomy<select value={draft.autonomy} onChange={e=>update('autonomy',e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#090d14] px-4 py-3 text-white"><option value="advise">Advise only</option><option value="prepare">Prepare work for human approval</option><option value="approved">Execute only explicitly approved actions</option></select></label>
        <div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={clearMission} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold"><Trash2 className="h-4 w-4"/>Clear mission fields</button><button type="button" onClick={cancelDraft} className="inline-flex items-center gap-2 rounded-xl border border-red-300/25 px-4 py-3 text-sm font-bold text-red-200"><RotateCcw className="h-4 w-4"/>Cancel entire draft</button></div>
      </div>}

      {step===2 && <div className="mt-8 rounded-3xl border border-white/10 bg-white/[.03] p-6 sm:p-8"><div className="flex gap-3"><ShieldCheck className="mt-1 h-6 w-6 flex-none text-emerald-300"/><div><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-300">Human approval gate</p><h2 className="mt-2 text-2xl font-black">Review before submission</h2><p className="mt-3 text-neutral-400">Submitting creates a planning workspace and mission record. It does not buy anything, authorize payments, publish content or run external automation.</p></div></div><dl className="mt-7 grid gap-4 sm:grid-cols-2">{[['Route',summary],['Mission',draft.title],['Outcome',draft.objective],['Acceptance',draft.target],['Human responsible',draft.owner],['AI authority',draft.autonomy]].map(([term,value])=><div key={term} className="rounded-xl bg-black/30 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-neutral-500">{term}</dt><dd className="mt-2 whitespace-pre-wrap text-sm text-neutral-200">{value||'Not provided'}</dd></div>)}</dl><label className="mt-7 flex items-start gap-3 text-sm leading-6 text-neutral-300"><input form="mission-form" required type="checkbox" className="mt-1 h-4 w-4"/>I am the responsible human, or I am authorized to submit this mission for review.</label></div>}

      <div className="mt-8 flex items-center justify-between gap-4"><button type="button" disabled={step===0||busy} onClick={()=>setStep(value=>value-1)} className="rounded-xl border border-white/15 px-5 py-3 font-bold disabled:opacity-30">Back</button>{step<2?<button type="button" disabled={!canContinue} onClick={()=>setStep(value=>value+1)} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3 font-black text-black disabled:opacity-40">Continue <ArrowRight className="h-4 w-4"/></button>:<button form="mission-form" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3 font-black text-black disabled:opacity-50">{busy&&<Loader2 className="h-4 w-4 animate-spin"/>}Approve and create workspace</button>}</div>
      </form>
      <p className="mt-8 text-center text-xs text-neutral-500">Scope, support, privacy and mission requests: kagan@aikagan.com</p>
    </section>
  </main>;
}

function Field({label,value,onChange,type='text',required=false,placeholder=''}:{label:string;value:string;onChange:(value:string)=>void;type?:string;required?:boolean;placeholder?:string}) { return <label className="block text-sm font-bold text-neutral-200">{label}<input type={type} required={required} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300"/></label>; }
function Area({label,value,onChange,required=false,placeholder=''}:{label:string;value:string;onChange:(value:string)=>void;required?:boolean;placeholder?:string}) { return <label className="mt-5 block text-sm font-bold text-neutral-200">{label}<textarea rows={4} required={required} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300"/></label>; }
