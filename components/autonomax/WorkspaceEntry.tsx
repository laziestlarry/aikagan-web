'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Loader2, LogIn } from 'lucide-react';

type WorkspaceEntryProps = {
  compact?: boolean;
  id?: string;
};

export default function WorkspaceEntry({ compact = false, id }: WorkspaceEntryProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function accessWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: form.get('email') }),
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Workspace access could not be created.');
      router.push('/dashboard');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Workspace access could not be created.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id={id}
      className={`rounded-3xl border border-kagan-gold/25 bg-kagan-gold/[0.04] ${
        compact ? 'p-6' : 'p-7 md:p-10'
      }`}
    >
      <div className={compact ? '' : 'mx-auto max-w-3xl text-center'}>
        <div className={`flex items-center gap-3 ${compact ? '' : 'justify-center'}`}>
          <LogIn className="h-5 w-5 text-kagan-gold" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kagan-gold">Customer workspace</p>
        </div>
        <h2 className={`mt-3 font-extrabold text-kagan-white ${compact ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>
          Start with one outcome you can verify
        </h2>
        <p className={`mt-3 leading-7 text-kagan-light ${compact ? '' : 'mx-auto max-w-2xl'}`}>
          Enter your email to create a planning workspace or continue with an existing customer record. You will define an
          outcome, record the acceptance check, and see only the delivery evidence that is actually available.
        </p>
      </div>

      <form onSubmit={accessWorkspace} className={`mt-6 ${compact ? '' : 'mx-auto max-w-xl'}`}>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">Email address</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@company.com"
            className="mt-2 w-full rounded-xl border border-kagan-border bg-black/30 px-4 py-3 text-kagan-white outline-none transition placeholder:text-kagan-muted focus:border-kagan-gold/60"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-kagan-gold px-5 py-3.5 text-sm font-extrabold text-black transition hover:bg-kagan-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {busy ? 'Opening workspace…' : 'Register or continue to workspace'}
        </button>
      </form>

      {error ? <p role="alert" className="mt-4 rounded-xl border border-red-300/25 bg-red-300/[0.06] p-3 text-sm text-red-100">{error}</p> : null}

      <div className={`mt-5 flex gap-3 text-xs leading-5 text-kagan-light ${compact ? '' : 'mx-auto max-w-xl'}`}>
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
        <p>
          Planning access does not grant a paid entitlement, configure an AI model, confirm a payment, or confirm
          fulfillment. Those states require their own verified records.
        </p>
      </div>
    </section>
  );
}
