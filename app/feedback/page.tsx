'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MessageSquareText } from 'lucide-react';

export default function FeedbackPage() {
  const [status, setStatus] = useState<'idle'|'sending'|'done'|'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const params = new URLSearchParams(window.location.search);
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name,
        company: payload.company,
        interest: payload.interest,
        message: payload.message,
        desired_outcome: payload.desired_outcome,
        constraints: payload.constraints,
        slug: 'public-feedback',
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_content: params.get('utm_content'),
        ref: document.referrer || null,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || 'Could not submit feedback.');
      setStatus('error');
      return;
    }
    setStatus('done');
    e.currentTarget.reset();
  }

  return <main className="min-h-screen bg-[#08080a] px-5 py-16 text-white">
    <section className="mx-auto max-w-3xl">
      <Link href="/tools/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"><ArrowLeft className="h-4 w-4"/>Back to Free Lab</Link>
      <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-7 sm:p-10">
        <MessageSquareText className="h-7 w-7 text-amber-300"/>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Shape what gets built next</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">Tell us what created value — and what did not.</h1>
        <p className="mt-5 leading-8 text-neutral-300">Use the free tools first, then report the friction, missing capability, result, or workflow you would actually want solved. Feedback is used to prioritize the next public tools and paid implementation offers.</p>

        {status === 'done' ? <div className="mt-10 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-6"><CheckCircle2 className="h-6 w-6 text-emerald-300"/><h2 className="mt-4 text-xl font-bold">Feedback received.</h2><p className="mt-2 text-sm leading-6 text-neutral-300">Thank you. The signal is now part of the product-priority evidence trail.</p><Link href="/tools/" className="mt-5 inline-flex text-sm font-bold text-amber-300">Try another free tool →</Link></div> :
        <form onSubmit={submit} className="mt-10 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm text-neutral-300">Name<input name="name" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300/50"/></label><label className="text-sm text-neutral-300">Email *<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300/50"/></label></div>
          <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm text-neutral-300">Company / project<input name="company" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300/50"/></label><label className="text-sm text-neutral-300">What did you use?<select name="interest" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300/50"><option>Revenue Leak Scan</option><option>Golden Delivery Sample</option><option>AutonomaX Explorer</option><option>Website / offer</option><option>Other</option></select></label></div>
          <label className="block text-sm text-neutral-300">What was useful, confusing, or missing? *<textarea required name="message" rows={5} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300/50"/></label>
          <label className="block text-sm text-neutral-300">What outcome would make this genuinely valuable to you?<textarea name="desired_outcome" rows={3} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300/50"/></label>
          <label className="block text-sm text-neutral-300">What stops you from solving it today?<textarea name="constraints" rows={3} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-amber-300/50"/></label>
          {status === 'error' && <p className="text-sm text-red-300">{error}</p>}
          <button disabled={status==='sending'} className="rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-black disabled:opacity-60">{status==='sending'?'Sending…':'Send feedback'}</button>
        </form>}
      </div>
    </section>
  </main>;
}
