'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Download, LifeBuoy, Loader2, LockKeyhole, Rocket, ShieldCheck, Sparkles, XCircle } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import WorkspaceEntry from '@/components/autonomax/WorkspaceEntry';
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
  const activeMission = customer?.missions.find((m) => ['active','planned','blocked'].includes(m.status));

  async function createMission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setMissionBusy(true); setNotice('');
    const form = new FormData(formElement);
    try {
      const res = await fetch('/api/customer/mission', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: form.get('title'), segment: form.get('segment'), objective: form.get('objective') }),
      });
      if (res.ok) { setNotice('Mission activated. Your next action is ready.'); formElement.reset(); await load(); }
      else setNotice('Mission could not be created. Please retry or contact support.');
    } catch {
      setNotice('Mission could not be created. Please retry or contact support.');
    } finally {
      setMissionBusy(false);
    }
  }

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSupportBusy(true); setNotice('');
    const form = new FormData(formElement);
    try {
      const res = await fetch('/api/customer/support', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subject: form.get('subject'), message: form.get('message') }),
      });
      if (res.ok) { setNotice('Support request recorded.'); formElement.reset(); await load(); }
      else setNotice('Support request could not be recorded. Email kagan@aikagan.com if the issue continues.');
    } catch {
      setNotice('Support request could not be recorded. Email kagan@aikagan.com if the issue continues.');
    } finally {
      setSupportBusy(false);
    }
  }

  async function cancelMission(missionId: string) {
    if (!window.confirm('Cancel this mission? Its audit record will be preserved and further execution will stop.')) return;
    setMissionBusy(true); setNotice('');
    try {
      const res = await fetch(`/api/customer/mission?missionId=${encodeURIComponent(missionId)}`, { method: 'DELETE' });
      if (res.ok) { setNotice('Mission cancelled. Its audit record was preserved.'); await load(); }
      else setNotice('Mission could not be cancelled. Please retry or contact kagan@aikagan.com.');
    } catch {
      setNotice('Mission could not be cancelled. Please retry or contact kagan@aikagan.com.');
    } finally { setMissionBusy(false); }
  }

  if (loading) return <Section variant="hero"><div className="mx-auto flex max-w-4xl items-center justify-center gap-3 py-24 text-kagan-light"><Loader2 className="h-5 w-5 animate-spin text-kagan-gold" /> Loading workspace…</div></Section>;

  if (!customer) {
    return (
      <Section variant="hero">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <Badge variant="gold" className="mb-4">Customer workspace</Badge>
            <LockKeyhole className="mx-auto mb-5 h-10 w-10 text-kagan-gold" />
            <h1 className="text-4xl font-extrabold text-kagan-white md:text-6xl">Start your first verified outcome</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-kagan-light">Create a planning workspace to define an outcome and acceptance check. Verified purchases can add entitlements and delivery links, but planning access alone does not imply a payment or fulfillment.</p>
          </div>
          <WorkspaceEntry compact />
          <div className="mt-6 text-center">
            <Link href="/autonomax" className="text-sm font-bold text-kagan-gold hover:underline">Explore how the outcome journey works</Link>
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
            <div><Badge variant="green" className="mb-3">{activeEntitlements.length ? 'Verified purchase entitlement' : 'Planning workspace session'}</Badge><h1 className="text-4xl font-extrabold text-kagan-white md:text-5xl">Outcome workspace</h1><p className="mt-3 text-kagan-light">{customer.email} · {activeEntitlements.length} active entitlement{activeEntitlements.length === 1 ? '' : 's'}</p></div>
            <a href={`${SITE.url}/products`} className="inline-flex items-center gap-2 text-sm font-bold text-kagan-gold">Expand capabilities <ArrowRight className="h-4 w-4" /></a>
          </div>

          {notice && <div className="mb-6 rounded-xl border border-kagan-gold/30 bg-kagan-gold/10 px-4 py-3 text-sm text-kagan-light">{notice}</div>}

          <div className="grid gap-5 md:grid-cols-4">
            <Stat icon={ShieldCheck} label="Entitlements" value={String(activeEntitlements.length)} />
            <Stat icon={Rocket} label="Missions" value={String(customer.missions.length)} />
            <Stat icon={Download} label="Deliverables" value={String(customer.deliverables.length)} />
            <Stat icon={LifeBuoy} label="Open support" value={String(customer.supportTickets.filter((t) => t.status === 'open').length)} />
          </div>

          {activeMission && <div className="mt-6 rounded-2xl border border-kagan-gold/30 bg-kagan-gold/[0.05] p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-kagan-gold">Current mission</p><h2 className="mt-2 text-2xl font-bold text-kagan-white">{activeMission.title}</h2></div><span className="rounded-full border border-kagan-gold/30 px-3 py-1 text-xs text-kagan-gold">{activeMission.progress}%</span></div><p className="mt-3 whitespace-pre-wrap text-kagan-light">{activeMission.objective}</p><div className="mt-5 rounded-xl bg-black/20 p-4"><p className="text-xs uppercase tracking-wider text-kagan-muted">Next best action</p><p className="mt-2 font-medium text-kagan-white">{activeMission.nextAction}</p></div><button type="button" disabled={missionBusy} onClick={()=>cancelMission(activeMission.id)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-300/25 px-4 py-2 text-sm font-bold text-red-200 disabled:opacity-50"><XCircle className="h-4 w-4"/>Cancel mission</button></div>}
        </div>
      </Section>

      <Section variant="alt">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-kagan-gold/25 bg-kagan-gold/[0.04] p-6 lg:col-span-2">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-kagan-gold" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-kagan-gold">First-result activation</p>
                <h2 className="mt-2 text-xl font-bold text-kagan-white">Make progress visible before calling the work complete</h2>
              </div>
            </div>
            <ol className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ActivationStep complete label="Workspace access" detail="Your planning record is available." />
              <ActivationStep complete={Boolean(activeMission)} label="Outcome defined" detail={activeMission ? "A mission and next action are recorded." : "Create one mission with a measurable objective."} />
              <ActivationStep complete={customer.deliverables.length > 0} label="Delivery evidence" detail={customer.deliverables.length ? "A delivery item is recorded below." : "No delivery item has been recorded yet."} />
              <ActivationStep complete={false} label="Acceptance check" detail="Confirm the result with your test or evidence, then ask support to record any blocker." />
            </ol>
            <p className="mt-5 text-sm leading-6 text-kagan-light">Use the workflow engine, automation vendor, or AI provider that fits your stack. This workspace records the outcome and evidence; it does not claim that any model, vendor connection, payment, or fulfillment is configured unless a verified record says so.</p>
          </section>

          <form onSubmit={createMission} className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6">
            <div className="mb-5 flex items-center gap-3"><Sparkles className="h-5 w-5 text-kagan-gold" /><h2 className="text-xl font-bold text-kagan-white">Define your first outcome</h2></div>
            <p className="mb-5 text-sm leading-6 text-kagan-light">Use an observable result and acceptance check—not a generic request. This creates a planning mission; it does not start an external automation.</p>
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">Mission name<input name="title" placeholder="e.g. Verify a lead-to-follow-up workflow" className="mt-2 mb-3 w-full rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" /></label>
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">Operating context<select name="segment" defaultValue="founder" className="mt-2 mb-3 w-full rounded-xl border border-kagan-border bg-kagan-black px-4 py-3 text-kagan-white">{segments.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}</select></label>
            <label className="block text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">Outcome and acceptance check<textarea name="objective" required rows={5} placeholder="e.g. A test lead reaches our follow-up queue, and the team can verify the timestamp and owner." className="mt-2 w-full rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" /></label>
            <button disabled={missionBusy} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-kagan-gold px-5 py-3 font-bold text-black disabled:opacity-50">{missionBusy && <Loader2 className="h-4 w-4 animate-spin" />} Activate mission</button>
          </form>

          <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6">
            <h2 className="text-xl font-bold text-kagan-white">Entitlements & delivery</h2>
            <div className="mt-5 space-y-3">{activeEntitlements.length ? activeEntitlements.map((e) => <div key={e.transactionId} className="flex items-center gap-3 rounded-xl border border-kagan-border p-4"><CheckCircle2 className="h-5 w-5 text-kagan-success" /><div><div className="font-semibold text-kagan-white">{e.slug.replace(/-/g, ' ')}</div><div className="text-xs text-kagan-muted">Activated {new Date(e.grantedAt).toLocaleDateString()}</div></div></div>) : <p className="text-sm text-kagan-light">No active entitlement found.</p>}</div>
            <div className="mt-6 space-y-3">{customer.deliverables.map((d) => <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl bg-black/20 p-4"><div><div className="font-medium text-kagan-white">{d.title}</div><div className="text-xs text-kagan-muted">{d.status}</div></div>{d.href && <a href={d.href} className="text-sm font-bold text-kagan-gold">Open</a>}</div>)}</div>
          </div>

          <form onSubmit={createTicket} className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6 lg:col-span-2">
            <div className="mb-3 flex items-center gap-3"><LifeBuoy className="h-5 w-5 text-kagan-gold" /><h2 className="text-xl font-bold text-kagan-white">Support and recovery escalation</h2></div>
            <p className="mb-5 text-sm leading-6 text-kagan-light">If a vendor setup, proof checkpoint, order, or delivery record is blocked, record the expected result and evidence. The support request is recorded for follow-up; submitting it does not mean the issue has been resolved.</p>
            <div className="grid gap-3 md:grid-cols-2"><label className="text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">Escalation subject<input name="subject" required placeholder="e.g. Acceptance evidence is missing" className="mt-2 w-full rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" /></label><label className="text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">Blocker and expected result<textarea name="message" required rows={4} placeholder="State the blocker, expected result, test/evidence, and relevant order or project context." className="mt-2 w-full rounded-xl border border-kagan-border bg-black/20 px-4 py-3 text-kagan-white" /></label></div>
            <button disabled={supportBusy} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-kagan-gold/40 px-5 py-3 font-bold text-kagan-gold disabled:opacity-50">{supportBusy && <Loader2 className="h-4 w-4 animate-spin" />} Record support escalation</button>
          </form>
        </div>
      </Section>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Rocket; label: string; value: string }) {
  return <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-5"><Icon className="mb-4 h-5 w-5 text-kagan-gold" /><div className="text-3xl font-extrabold text-kagan-white">{value}</div><div className="mt-1 text-xs uppercase tracking-wider text-kagan-muted">{label}</div></div>;
}

function ActivationStep({ complete, label, detail }: { complete: boolean; label: string; detail: string }) {
  return <li className="rounded-xl border border-kagan-border bg-black/20 p-4">
    <div className="flex items-start gap-2">
      <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-none ${complete ? 'text-emerald-300' : 'text-kagan-muted'}`} />
      <div><p className="text-sm font-bold text-kagan-white">{label}</p><p className="mt-1 text-xs leading-5 text-kagan-light">{detail}</p></div>
    </div>
  </li>;
}
