'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, DollarSign, Activity, Target, BarChart3, Brain, RefreshCw, ChevronRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface DashboardPayload {
  generated_at: string;
  top_opportunities: unknown[];
  alerts: Array<{ severity: string; message: string }>;
  status_report: { mrr_snapshot?: { mrr_min?: number; mrr_max?: number; monthly_burn?: number } };
  live_operations: { active_income_streams?: number; total_receipts?: number };
  operating_model: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Dashboard cards config                                            */
/* ------------------------------------------------------------------ */

const DASHBOARD_CARDS = [
  {
    title: 'Income Reality',
    description: 'Zero-gap evidence feed: pageviews → intents → leads → purchases, with sources of truth.',
    href: '/income',
    icon: DollarSign,
    badge: 'Live · Evidence',
    badgeVariant: 'green' as const,
  },
  {
    title: 'Profit Intelligence',
    description: 'Per-stream margin analysis, fee optimization, and ranked profit actions.',
    href: '/dashboard/profit-intelligence',
    icon: TrendingUp,
    badge: 'Live',
    badgeVariant: 'green' as const,
  },
  {
    title: 'Financials',
    description: 'MRR, sustainability score, growth classification, platform breakdown.',
    href: '/dashboard/financials',
    icon: BarChart3,
    badge: 'Live',
    badgeVariant: 'green' as const,
  },
  {
    title: 'Passive Income',
    description: 'Workflow schedules, payout tracking, due runs.',
    href: '/dashboard/passive-income',
    icon: Activity,
    badge: 'Live',
    badgeVariant: 'green' as const,
  },
  {
    title: 'Investment Policy',
    description: 'Valuation tiers, capital allocation, budget tracking.',
    href: '/dashboard/investment-policy',
    icon: Target,
    badge: 'Live',
    badgeVariant: 'green' as const,
  },
  {
    title: 'Weekly Intelligence',
    description: 'Highest-ROI actions, segment performance, next-week recommendations.',
    href: '/dashboard/weekly-intelligence',
    icon: Brain,
    badge: 'Live',
    badgeVariant: 'green' as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Stat widget                                                        */
/* ------------------------------------------------------------------ */

function StatWidget({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5">
      <div className="text-xs text-kagan-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold text-kagan-white font-mono">{value}</div>
      {sub && <div className="text-xs text-kagan-light mt-1">{sub}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/revenue-ops/api/dashboard')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPayload(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const mrr = payload?.status_report?.mrr_snapshot;
  const ops = payload?.live_operations || {};

  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <Badge variant="gold" className="mb-4">Revenue Operations</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Operations <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Live metrics and intelligence from the AutonomaX revenue-ops backend.
            Every page fetches real-time data through the proxy bridge.
          </p>
        </div>

        {/* ── Status bar ─────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4 text-sm">
            {loading ? (
              <span className="flex items-center gap-2 text-kagan-muted">
                <RefreshCw className="h-4 w-4 animate-spin" /> Loading backend…
              </span>
            ) : error ? (
              <Badge variant="amber">Backend unreachable — showing static layout</Badge>
            ) : (
              <Badge variant="green">
                Live · {new Date(payload!.generated_at).toLocaleString()}
              </Badge>
            )}
          </div>
        </div>

        {/* ── Quick stats ────────────────────────────────────────────── */}
        {payload && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
              ⚜ Snapshot ⚜
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatWidget
                label="MRR (min)"
                value={mrr ? `$${mrr.mrr_min?.toLocaleString() ?? '…'}` : '…'}
                sub="Monthly recurring"
              />
              <StatWidget
                label="MRR (max)"
                value={mrr ? `$${mrr.mrr_max?.toLocaleString() ?? '…'}` : '…'}
                sub="Monthly recurring"
              />
              <StatWidget
                label="Monthly Burn"
                value={mrr ? `$${mrr.monthly_burn?.toLocaleString() ?? '…'}` : '…'}
                sub="Operating costs"
              />
              <StatWidget
                label="Active Streams"
                value={String(ops.active_income_streams ?? '…')}
                sub={`${ops.total_receipts ?? '…'} total receipts`}
              />
            </div>
          </div>
        )}

        {/* ── Alerts ─────────────────────────────────────────────────── */}
        {payload && payload.alerts && payload.alerts.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
              ⚜ Alerts ⚜
            </h2>
            <div className="space-y-2">
              {payload.alerts.slice(0, 5).map((a, i) => (
                <div
                  key={i}
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    a.severity === 'critical' || a.severity === 'high'
                      ? 'border-red-500/30 bg-red-500/10 text-red-300'
                      : a.severity === 'medium'
                      ? 'border-kagan-amber/30 bg-kagan-amber/10 text-kagan-amber'
                      : 'border-kagan-border bg-kagan-card/40 text-kagan-light'
                  }`}
                >
                  <span className="font-semibold uppercase text-xs mr-2">{a.severity}</span>
                  {a.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Dashboard cards grid ───────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-6 uppercase">
            ⚜ Intelligence Dashboards ⚜
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DASHBOARD_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex flex-col rounded-xl border border-kagan-border bg-kagan-card/60 p-6 hover:border-kagan-gold/40 hover:bg-kagan-gold/[0.04] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-lg bg-kagan-gold/10 p-2.5 text-kagan-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={card.badgeVariant}>{card.badge}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-kagan-white mb-1.5">{card.title}</h3>
                  <p className="text-sm text-kagan-light leading-relaxed flex-1">{card.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-kagan-gold/70 group-hover:text-kagan-gold transition-colors">
                    Open dashboard <ChevronRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
