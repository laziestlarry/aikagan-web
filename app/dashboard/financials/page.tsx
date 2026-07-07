'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, PieChart, Shield, RefreshCw, AlertTriangle, Layers, Zap, CreditCard, BarChart3 } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface SustainabilityModel {
  active_mrr_min_usd: number;
  active_mrr_max_usd: number;
  projected_annual_min_usd: number;
  projected_annual_max_usd: number;
  active_stream_count: number;
  recurring_stream_count: number;
  recurring_revenue_pct: number;
  organic_strategy_count: number;
  paid_strategy_count: number;
  organic_strategy_pct: number;
  total_win_cases: number;
  total_receipts: number;
  avg_days_to_first_signal: number;
  monthly_burn_usd: number;
  revenue_to_burn_ratio: number;
  sustainability_score: number;
  growth_classification: string;
}

interface PlatformBreakdown {
  platform: string;
  stream_count: number;
  active_stream_count: number;
  mrr_min_usd: number;
  mrr_max_usd: number;
}

interface NicheFinancial {
  niche_id: string;
  niche_name: string;
  status: string;
  active_stream_count: number;
  mrr_min_usd: number;
  mrr_max_usd: number;
  annual_min_usd: number;
  annual_max_usd: number;
  receipt_count: number;
  win_case_count: number;
}

interface FinancialPayload {
  generated_at: string;
  summary: {
    active_mrr_min_usd: number;
    active_mrr_max_usd: number;
    projected_annual_min_usd: number;
    projected_annual_max_usd: number;
    active_stream_count: number;
    recurring_stream_count: number;
    recurring_revenue_pct: number;
    organic_strategy_count: number;
    paid_strategy_count: number;
    organic_strategy_pct: number;
    total_win_cases: number;
    total_receipts: number;
    avg_days_to_first_signal: number;
    monthly_burn_usd: number;
    revenue_to_burn_ratio: number;
    sustainability_score: number;
    growth_classification: string;
  };
  sustainability_model: SustainabilityModel;
  niche_financials: NicheFinancial[];
  platform_breakdown: PlatformBreakdown[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function classificationColor(c: string) {
  switch (c) {
    case 'mature': return 'text-green-400';
    case 'scaling': return 'text-kagan-amber';
    case 'early_growth': return 'text-blue-400';
    default: return 'text-kagan-muted';
  }
}

function classificationLabel(c: string) {
  switch (c) {
    case 'mature': return 'Mature';
    case 'scaling': return 'Scaling';
    case 'early_growth': return 'Early Growth';
    default: return 'Bootstrapped';
  }
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                         */
/* ------------------------------------------------------------------ */

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`rounded-lg p-1.5 ${color || 'bg-kagan-gold/10 text-kagan-gold'}`}>
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

export default function FinancialsPage() {
  const [data, setData] = useState<FinancialPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/revenue-ops/api/financials')
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
          <span className="ml-3 text-kagan-light">Loading financials…</span>
        </div>
      </Section>
    );
  }

  if (error || !data) {
    return (
      <Section variant="hero">
        <div className="text-center py-20">
          <AlertTriangle className="h-10 w-10 text-kagan-amber mx-auto mb-4" />
          <p className="text-kagan-light">Could not load financial data. Backend may be unavailable.</p>
        </div>
      </Section>
    );
  }

  const s = data.summary;

  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <Badge variant="gold" className="mb-4">Live Financial Metrics</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Financial <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            MRR, sustainability score, growth classification, and multi-dimensional financial breakdown.
          </p>
          <div className="mt-4 text-xs text-kagan-muted">
            Updated {new Date(data.generated_at).toLocaleString()}
          </div>
        </div>

        {/* ── MRR & Revenue ──────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Revenue Overview ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Active MRR" value={`${formatCurrency(s.active_mrr_min_usd)} – ${formatCurrency(s.active_mrr_max_usd)}`} />
            <StatCard icon={TrendingUp} label="Projected Annual" value={`${formatCurrency(s.projected_annual_min_usd)} – ${formatCurrency(s.projected_annual_max_usd)}`} />
            <StatCard icon={CreditCard} label="Monthly Burn" value={formatCurrency(s.monthly_burn_usd)} sub={`${s.revenue_to_burn_ratio}x revenue-to-burn`} />
            <StatCard icon={Layers} label="Income Streams" value={`${s.active_stream_count} active`} sub={`${s.recurring_stream_count} recurring / ${s.total_receipts} receipts`} />
          </div>
        </div>

        {/* ── Sustainability ─────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Sustainability & Health ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard icon={Shield} label="Sustainability Score" value={`${s.sustainability_score}/100`} color="bg-kagan-success/10 text-kagan-success" />
            <StatCard icon={BarChart3} label="Growth Classification" value={classificationLabel(s.growth_classification)} color={s.sustainability_score >= 80 ? 'bg-green-500/10 text-green-400' : 'bg-kagan-amber/10 text-kagan-amber'} />
            <StatCard icon={PieChart} label="Recurring Revenue" value={`${s.recurring_revenue_pct}%`} sub={`${s.recurring_stream_count}/${s.active_stream_count} streams`} />
            <StatCard icon={Zap} label="Organic Strategy" value={`${s.organic_strategy_pct}%`} sub={`${s.organic_strategy_count} organic / ${s.paid_strategy_count} paid`} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={BarChart3} label="Total Win Cases" value={String(s.total_win_cases)} />
            <StatCard icon={BarChart3} label="Total Receipts" value={String(s.total_receipts)} />
            <StatCard icon={BarChart3} label="Avg Days to First Signal" value={`${s.avg_days_to_first_signal}d`} />
          </div>
        </div>

        {/* ── Platform breakdown ──────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Platform Breakdown ⚜
          </h2>
          <div className="overflow-x-auto rounded-xl border border-kagan-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-kagan-border bg-kagan-darker text-left">
                  <th className="px-4 py-3 text-kagan-muted font-medium">Platform</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Streams</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Active</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">MRR (min)</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">MRR (max)</th>
                </tr>
              </thead>
              <tbody>
                {data.platform_breakdown.map((p) => (
                  <tr key={p.platform} className="border-b border-kagan-border/50 hover:bg-kagan-card/40 transition-colors">
                    <td className="px-4 py-3 text-kagan-white font-medium capitalize">{p.platform}</td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-light">{p.stream_count}</td>
                    <td className="px-4 py-3 text-right font-mono">{p.active_stream_count}</td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-white">{formatCurrency(p.mrr_min_usd)}</td>
                    <td className="px-4 py-3 text-right font-mono text-green-400">{formatCurrency(p.mrr_max_usd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Niche breakdown ─────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Per-Niche Financials ⚜
          </h2>
          <div className="overflow-x-auto rounded-xl border border-kagan-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-kagan-border bg-kagan-darker text-left">
                  <th className="px-4 py-3 text-kagan-muted font-medium">Niche</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Status</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Active Streams</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">MRR</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Annual</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Receipts</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Win Cases</th>
                </tr>
              </thead>
              <tbody>
                {data.niche_financials.map((n) => (
                  <tr key={n.niche_id} className="border-b border-kagan-border/50 hover:bg-kagan-card/40 transition-colors">
                    <td className="px-4 py-3 text-kagan-white font-medium">{n.niche_name}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={n.status === 'active' ? 'green' : 'muted'}>{n.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-light">{n.active_stream_count}</td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-white">
                      {formatCurrency(n.mrr_min_usd)} – {formatCurrency(n.mrr_max_usd)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green-400">
                      {formatCurrency(n.annual_min_usd)} – {formatCurrency(n.annual_max_usd)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-light">{n.receipt_count}</td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-light">{n.win_case_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </>
  );
}
