'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Download, LifeBuoy, Loader2, LockKeyhole, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import { SITE } from '@/lib/constants';

type Entitlement = { slug: string; transactionId: string; grantedAt: string; status: 'active' | 'revoked' };
type Mission = { id: string; title: string; segment: string; objective: string; status: string; progress: number; nextAction: string };
type Deliverable = { id: string; title: string; kind: string; href?: string; status: string; createdAt: string };
type Ticket = { id: string; subject: string; status: string; createdAt: string };
type Customer = { customerId: string; email: string; entitlements: Entitlement[]; missions: Mission[]; deliverables: Deliverable[]; supportTickets: Ticket[] };

const segments = ['founder', 'ecommerce', 'creator', 'agency', 'sme', 'enterprise', 'developer'];

export default function CustomerWorkspace() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [missionBusy, setMissionBusy] = useState(false);
  const [supportBusy, setSupportBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customer/me', { cache: 'no-store' });
      if (!res.ok) { setCustomer(null); return; }
      const data = await res.json();
      setCustomer(data.customer ?? null);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const activeEntitlements = useMemo(() => customer?.entitlements.filter((e) => e.status === 'active') ?? [], [customer]);
  const activeMission = customer?.missions.find((m) => m.status === 'active') ?? customer?.missions[0];

  async function createMission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMissionBusy(true); setNotice('');
    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/customer/mission', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: form.get('title'), segment: form.get('segment'), objective: form.get('objective') }),
    });
    setMissionBusy(false);
    if (res.ok) { setNotice('Mission activated. Your next action is ready.'); event.currentTarget.reset(); await load(); }
    else setNotice('Mission could not be created. Please retry or contact support.');
  }

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupportBusy(true); setNotice('');
    const form = new FormData(event.currentTarget);
    const res = await fetch('/api/customer/support', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subject: form.get('subject'), message: form.get('message') }),
    });
    setSupportBusy(false);
    if (res.ok) { setNotice('Support request recorded.'); event.currentTarget.reset(); await load(); }
    else setNotice('Support request could not be recorded. Email hello@aikagan.com if the issue continues.');
  }

  if (loading) return <Section variant="hero"><div className="mx-auto flex max-w-4xl items-center justify-center gap-3 py-24 text-kagan-light"><Loader2 className="h-5 w-5 animate-spin text-kagan-gold" /> Loading workspace…</div></Section>;

  if (!customer) {
    return (
      <Section variant="hero">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="gold" className="mb-4">Secure customer workspace</Badge>
          <LockKeyhole className="mx-auto mb-5 h-10 w-10 text-kagan-gold" />
          <h1 className="text-4xl font-extrabold text-kagan-white md:text-6xl">Activate through a verified purchase</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-kagan-light">Customer data, entitlements and delivery assets only appear after a verified checkout establishes your signed AIKAGAN session. You can still explore AutonomaX before buying.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/autonomax" className="rounded-xl border border-kagan-gold/40 px-6 py-3 font-semibold text-kagan-gold">Explore AutonomaX</Link>
            <a href={`${SITE.url}/products`} className="rounded-xl bg-kagan-gold px-6 py-3 font-semibold text-black">Choose a plan</a>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section variant="hero">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div><Badge variant="green" className="mb-3">Verified customer session</Badge><h1 className="text-4xl font-extrabold text-kagan-white md:text-5xl">Outcome workspace</h1><p className="mt-3 text-kagan-light">{customer.email} · {activeEntitlements.length} active entitlement{activeEntitlements.length === 1 ? '' : 's'}</p></div>
            <a href={`${SITE.url}/products`} className="inline-flex items-center gap-2 text-sm font-bold text-kagan-gold">Expand capabilities <ArrowRight className="h-4 w-4" /></a>
          </div>

          {notice && <div className="mb-6 rounded-xl border border-kagan-gold/30 bg-kagan-gold/10 px-4 py-3 text-sm text-kagan-light">{notice}</div>}

          <div className="grid gap-5 md:grid-cols-4">
            <Stat icon={ShieldCheck} label="Entitlements" value={String(activeEntitlements.length)} />
            <Stat icon={Rocket} label="Missions" value={String(customer.missions.length)} />
            <Stat icon={Download} label="Deliverables" value={String(customer.deliverables.length)} />
            <Stat icon={LifeBuoy} label="Open support" value={String(customer.supportTickets.filter((t) => t.status === 'open').length)} />
          </div>

          {activeMission && <div className="mt-6 rounded-2xl border border-kagan-gold/30 bg-kagan-gold/[0.05] p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-kagan-gold">Current mission</p><h2 className="mt-2 text-2xl font-bold text-kagan-white">{activeMission.title}</h2></div><span className="rounded-full border border-kagan-gold/30 px-3 py-1 text-xs text-kagan-gold">{activeMission.progress}%</span></div><p className="mt-3 text-kagan-light">{activeMission.objective}</p><div className="mt-5 rounded-xl bg-black/20 p-4"><p className="text-xs uppercase tracking-wider text-kagan-muted">Next best action</p><p className="mt-2 font-medium text-kagan-white">{activeMission.nextAction}</p></div></div>}
        </div>
      </Section>

      <Section variant="alt">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <form onSubmit={createMission} className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6">
            <div className="mb-5 flex items-center gap-3"><Sparkles className="h-5 w-5 text-kagan-gold" /><h2 className="text-xl font-bold text-kagan-white">Start an outcome mission</h2></div>
            <input name="title" placeholder="Mission title (optional)" className="mb-3 w-full rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" />
            <select name="segment" defaultValue="founder" className="mb-3 w-full rounded-xl border border-kagan-border bg-kagan-black px-4 py-3 text-kagan-white">{segments.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</select>
            <textarea name="objective" required rows={5} placeholder="What measurable outcome do you want to achieve?" className="w-full rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" />
            <button disabled={missionBusy} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-kagan-gold px-5 py-3 font-bold text-black disabled:opacity-50">{missionBusy && <Loader2 className="h-4 w-4 animate-spin" />} Activate mission</button>
          </form>

          <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6">
            <h2 className="text-xl font-bold text-kagan-white">Entitlements & delivery</h2>
            <div className="mt-5 space-y-3">{activeEntitlements.length ? activeEntitlements.map((e) => <div key={e.transactionId} className="flex items-center gap-3 rounded-xl border border-kagan-border p-4"><CheckCircle2 className="h-5 w-5 text-kagan-success" /><div><div className="font-semibold text-kagan-white">{e.slug.replace(/-/g, ' ')}</div><div className="text-xs text-kagan-muted">Activated {new Date(e.grantedAt).toLocaleDateString()}</div></div></div>) : <p className="text-sm text-kagan-light">No active entitlement found.</p>}</div>
            <div className="mt-6 space-y-3">{customer.deliverables.map((d) => <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl bg-black/20 p-4"><div><div className="font-medium text-kagan-white">{d.title}</div><div className="text-xs text-kagan-muted">{d.status}</div></div>{d.href && <a href={d.href} className="text-sm font-bold text-kagan-gold">Open</a>}</div>)}</div>
          </div>

          <form onSubmit={createTicket} className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3"><LifeBuoy className="h-5 w-5 text-kagan-gold" /><h2 className="text-xl font-bold text-kagan-white">Mid-end support & recovery</h2></div>
            <div className="grid gap-3 md:grid-cols-2"><input name="subject" required placeholder="What needs attention?" className="rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" /><textarea name="message" required rows={4} placeholder="Describe the blocker, expected result, and any order/project context." className="rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" /></div>
            <button disabled={supportBusy} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-kagan-gold/40 px-5 py-3 font-bold text-kagan-gold disabled:opacity-50">{supportBusy && <Loader2 className="h-4 w-4 animate-spin" />} Create support request</button>
          </form>
        </div>
      </Section>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Rocket; label: string; value: string }) {
  return <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-5"><Icon className="mb-4 h-5 w-5 text-kagan-gold" /><div className="text-3xl font-extrabold text-kagan-white">{value}</div><div className="mt-1 text-xs uppercase tracking-wider text-kagan-muted">{label}</div></div>;
}
