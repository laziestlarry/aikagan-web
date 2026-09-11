'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function NetworkJoinForm(){
  const [state,setState]=useState<'idle'|'sending'|'done'|'error'>('idle');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setState('sending');
    const f=new FormData(e.currentTarget);
    const role=String(f.get('role')||'other');
    const participation=String(f.get('participation')||'first-user-tester');
    const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      email:f.get('email'),name:f.get('name'),company:f.get('company'),interest:`${role}:${participation}`,message:f.get('message'),slug:'aikagan-network',source:'aikagan-network',ref:'founding-tester-circle',utm_source:'network_page',utm_medium:'onsite',utm_campaign:'founding_tester_circle_2026',utm_content:role
    })});
    if(r.ok){setState('done');e.currentTarget.reset()}else setState('error');
  }
  if(state==='done') return <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-6"><CheckCircle2 className="h-6 w-6 text-emerald-300"/><h3 className="mt-3 text-xl font-bold text-white">You are in the network.</h3><p className="mt-2 text-sm leading-6 text-neutral-300">Your role and participation lane were captured so we can prioritize relevant product tests, technical feedback, training use cases, collaboration, or verified-sale referral opportunities.</p></div>;
  return <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <div className="grid gap-4 sm:grid-cols-2"><input name="name" placeholder="Name" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/><input required type="email" name="email" placeholder="Email *" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/></div>
    <input name="company" placeholder="Company / project / channel (optional)" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/>
    <div className="grid gap-4 sm:grid-cols-2">
      <select name="role" defaultValue="developer" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"><option value="developer">Developer</option><option value="coder">Coder / technical builder</option><option value="trainer">Trainer / educator</option><option value="qa-tester">QA / product tester</option><option value="creator">Creator / YouTuber</option><option value="founder">Founder</option><option value="operator">Operator</option><option value="marketer">Marketer</option><option value="other">Other</option></select>
      <select name="participation" defaultValue="first-user-tester" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"><option value="first-user-tester">Founding first-user tester</option><option value="developer-contributor">Developer contributor</option><option value="trainer-educator">Trainer / education use case</option><option value="feedback-only">Feedback and bug reports</option><option value="partner">Collaboration / integration partner</option><option value="affiliate-partner">Affiliate partner — verified sales only</option></select>
    </div>
    <textarea name="message" rows={3} placeholder="What would you test, build, teach, or improve?" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/>
    {state==='error'&&<p className="text-sm text-red-300">Could not join right now. Please try again.</p>}
    <button disabled={state==='sending'} className="rounded-xl bg-amber-300 px-5 py-3 text-sm font-black text-black disabled:opacity-60">{state==='sending'?'Joining…':'Join the founding tester network'}</button>
    <p className="text-xs leading-5 text-neutral-500">Joining and testing are free. Early access, feedback priority and optional contributor recognition may be offered. Cash compensation is not promised unless separately agreed. Affiliate commission applies only to verified attributed sales under the published program terms.</p>
  </form>;
}
