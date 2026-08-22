'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function NetworkJoinForm(){
  const [state,setState]=useState<'idle'|'sending'|'done'|'error'>('idle');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setState('sending');
    const f=new FormData(e.currentTarget);
    const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      email:f.get('email'),name:f.get('name'),company:f.get('company'),interest:f.get('interest'),message:f.get('message'),slug:'aikagan-network',utm_source:'network_page',utm_medium:'onsite',utm_campaign:'aikagan_network'
    })});
    if(r.ok){setState('done');e.currentTarget.reset()}else setState('error');
  }
  if(state==='done') return <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-6"><CheckCircle2 className="h-6 w-6 text-emerald-300"/><h3 className="mt-3 text-xl font-bold text-white">You are in the network.</h3><p className="mt-2 text-sm leading-6 text-neutral-300">We will use your stated interest to prioritize invitations to relevant free tools, experiments, and collaboration opportunities.</p></div>;
  return <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <div className="grid gap-4 sm:grid-cols-2"><input name="name" placeholder="Name" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/><input required type="email" name="email" placeholder="Email *" className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/></div>
    <input name="company" placeholder="Company / project (optional)" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/>
    <select name="interest" defaultValue="early-user" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"><option value="early-user">I want to try new free tools</option><option value="contributor">I want to suggest problems / give feedback</option><option value="partner">I want to collaborate or partner</option><option value="affiliate">I want to refer people and earn on verified sales</option></select>
    <textarea name="message" rows={3} placeholder="What would make AIKAGAN useful to you?" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"/>
    {state==='error'&&<p className="text-sm text-red-300">Could not join right now. Please try again.</p>}
    <button disabled={state==='sending'} className="rounded-xl bg-amber-300 px-5 py-3 text-sm font-black text-black disabled:opacity-60">{state==='sending'?'Joining…':'Join the network'}</button>
    <p className="text-xs leading-5 text-neutral-500">Joining is free. It does not subscribe you to a paid product.</p>
  </form>;
}
