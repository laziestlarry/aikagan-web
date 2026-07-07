'use client';

import { useEffect, useState } from 'react';
import { Activity, DollarSign, Clock, RefreshCw, AlertTriangle, Play, CheckCircle, XCircle } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface PayoutRecord {
  payout_id: string;
  workflow_id: string;
  amount_usd: number;
  recorded_at: string;
}

interface PassiveIncomePayload {
  generated_at: string;
  active_workflows: number;
  total_workflows: number;
  total_payout_usd: number;
  total_runs: number;
  due_workflows: number;
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                         */
/* ------------------------------------------------------------------ */

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="rounded-lg bg-kagan-gold/10 p-1.5 text-kagan-gold">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs text-kagan-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-kagan-white font-mono">{value}</div>
      {sub && <div className="text-xs text-kagan-light mt-1">{sub}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function PassiveIncomePage() {
  const [data, setData] = useState<PassiveIncomePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/revenue-ops/api/passive-income')
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Section variant="hero">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-6 w-6 animate-spin text-kagan-gold" />
          <span className="ml-3 text-kagan-light">Loading passive income data…</span>
        </div>
      </Section>
    );
  }

  if (error || !data) {
    return (
      <Section variant="hero">
        <div className="text-center py-20">
          <AlertTriangle className="h-10 w-10 text-kagan-amber mx-auto mb-4" />
          <p className="text-kagan-light">Could not load passive income data. Backend may be unavailable.</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <Badge variant="gold" className="mb-4">Automated Revenue</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Passive <span className="text-gradient">Income</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Supplier workflow schedules, payout tracking, and automated income streams.
          </p>
          <div className="mt-4 text-xs text-kagan-muted">
            Updated {new Date(data.generated_at).toLocaleString()}
          </div>
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Overview ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Total Payout" value={`$${data.total_payout_usd.toLocaleString()}`} />
            <StatCard icon={Activity} label="Active Workflows" value={String(data.active_workflows)} sub={`of ${data.total_workflows} total`} />
            <StatCard icon={Play} label="Total Runs" value={String(data.total_runs)} />
            <StatCard icon={Clock} label="Due Now" value={String(data.due_workflows)} sub="Workflows past next_run" />
          </div>
        </div>

        {/* ── Workflow status ────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Status ⚜
          </h2>
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6 text-center">
            {data.active_workflows > 0 ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <span className="text-kagan-white font-medium">
                  {data.active_workflows} passive workflows running — ${data.total_payout_usd.toLocaleString()} total earned
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <XCircle className="h-6 w-6 text-kagan-amber" />
                <span className="text-kagan-light">No active passive income workflows. Initialize workflows to get started.</span>
              </div>
            )}
            {data.due_workflows > 0 && (
              <div className="mt-4">
                <Badge variant="amber">{data.due_workflows} workflows due for payout</Badge>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
