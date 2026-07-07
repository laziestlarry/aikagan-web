'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface StreamProfit {
  stream_id: string;
  stream_name: string;
  platform: string;
  gross_mrr_min_usd: number;
  gross_mrr_max_usd: number;
  fees: { total_fee_rate_pct: number; total_monthly_fees_usd: number };
  delivery: { monthly_delivery_cost_usd: number };
  net_margin_min_pct: number;
  net_margin_max_pct: number;
  net_profit_min_usd: number;
  net_profit_max_usd: number;
}

interface ProfitOptimization {
  rank: number;
  action: string;
  profit_impact: string;
  effort: string;
  estimated_monthly_savings_usd: number;
  type: string;
  approval_status?: string;
}

interface ProfitPayload {
  computed_at: string;
  profit_summary: {
    total_gross_mrr_min_usd: number;
    total_gross_mrr_max_usd: number;
    total_monthly_fees_usd: number;
    total_monthly_delivery_cost_usd: number;
    total_net_profit_min_usd: number;
    total_net_profit_max_usd: number;
    blended_net_margin_min_pct: number;
    blended_net_margin_max_pct: number;
    revenue_to_profit_gap_usd: number;
    fee_drain_pct: number;
    active_stream_count: number;
  };
  per_stream_profit: StreamProfit[];
  profit_optimizations: ProfitOptimization[];
  highest_margin_stream: { name: string; margin_pct: number };
  lowest_margin_stream: { name: string; margin_pct: number };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function impactColor(impact: string) {
  switch (impact) {
    case 'HIGH': return 'text-green-400';
    case 'MEDIUM': return 'text-kagan-amber';
    default: return 'text-kagan-muted';
  }
}

function effortBadge(effort: string) {
  switch (effort) {
    case 'LOW': return <Badge variant="green">Easy</Badge>;
    case 'MEDIUM': return <Badge variant="amber">Medium</Badge>;
    default: return <Badge variant="muted">Complex</Badge>;
  }
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                         */
/* ------------------------------------------------------------------ */

function Stat({ label, value, delta }: { label: string; value: string; delta?: { val: string; up: boolean } }) {
  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5">
      <div className="text-xs text-kagan-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold text-kagan-white font-mono">{value}</div>
      {delta && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${delta.up ? 'text-green-400' : 'text-red-400'}`}>
          {delta.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {delta.val}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ProfitIntelligencePage() {
  const [data, setData] = useState<ProfitPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/revenue-ops/api/profit-intelligence')
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
          <span className="ml-3 text-kagan-light">Loading profit intelligence…</span>
        </div>
      </Section>
    );
  }

  if (error || !data) {
    return (
      <Section variant="hero">
        <div className="text-center py-20">
          <AlertTriangle className="h-10 w-10 text-kagan-amber mx-auto mb-4" />
          <p className="text-kagan-light">Could not load profit intelligence. Backend may be unavailable.</p>
        </div>
      </Section>
    );
  }

  const s = data.profit_summary;

  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <Badge variant="gold" className="mb-4">Live Margin Analysis</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Profit <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            True margin analysis across {s.active_stream_count} income streams — fees, delivery costs, and net profit.
          </p>
          <div className="mt-4 text-xs text-kagan-muted">
            Updated {new Date(data.computed_at).toLocaleString()}
          </div>
        </div>

        {/* ── Summary stats ──────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ P&L Summary ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Gross MRR" value={`$${s.total_gross_mrr_min_usd.toLocaleString()} – $${s.total_gross_mrr_max_usd.toLocaleString()}`} />
            <Stat label="Total Fees" value={`$${s.total_monthly_fees_usd.toLocaleString()}`} delta={{ val: `${s.fee_drain_pct}% drain`, up: false }} />
            <Stat label="Delivery Costs" value={`$${s.total_monthly_delivery_cost_usd.toLocaleString()}`} />
            <Stat label="Net Profit" value={`$${s.total_net_profit_min_usd.toLocaleString()} – $${s.total_net_profit_max_usd.toLocaleString()}`} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <Stat label="Net Margin" value={`${s.blended_net_margin_min_pct}% – ${s.blended_net_margin_max_pct}%`} />
            <Stat label="Revenue→Profit Gap" value={`$${s.revenue_to_profit_gap_usd.toLocaleString()}`} delta={{ val: 'Potential savings', up: true }} />
            <Stat label="Active Streams" value={String(s.active_stream_count)} />
          </div>
        </div>

        {/* ── Best / Worst margin ────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Margin Extremes ⚜
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="h-4 w-4 text-green-400" />
                <span className="text-sm font-bold text-green-400">Highest Margin</span>
              </div>
              <div className="text-lg font-bold text-kagan-white">{data.highest_margin_stream.name}</div>
              <div className="text-sm text-kagan-light">{data.highest_margin_stream.margin_pct}% net margin</div>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="h-4 w-4 text-red-400" />
                <span className="text-sm font-bold text-red-400">Lowest Margin</span>
              </div>
              <div className="text-lg font-bold text-kagan-white">{data.lowest_margin_stream.name}</div>
              <div className="text-sm text-kagan-light">{data.lowest_margin_stream.margin_pct}% net margin</div>
            </div>
          </div>
        </div>

        {/* ── Per-stream profit table ────────────────────────────────── */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Per-Stream Profitability ⚜
          </h2>
          <div className="overflow-x-auto rounded-xl border border-kagan-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-kagan-border bg-kagan-darker text-left">
                  <th className="px-4 py-3 text-kagan-muted font-medium">Stream</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium">Platform</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Gross MRR</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Fees</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Delivery</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Net Profit</th>
                  <th className="px-4 py-3 text-kagan-muted font-medium text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {data.per_stream_profit.map((sp) => (
                  <tr key={sp.stream_id} className="border-b border-kagan-border/50 hover:bg-kagan-card/40 transition-colors">
                    <td className="px-4 py-3 text-kagan-white font-medium">{sp.stream_name}</td>
                    <td className="px-4 py-3 text-kagan-light">{sp.platform}</td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-white">
                      ${sp.gross_mrr_min_usd.toLocaleString()} – ${sp.gross_mrr_max_usd.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-red-400">
                      ${sp.fees.total_monthly_fees_usd.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-kagan-amber">
                      ${sp.delivery.monthly_delivery_cost_usd.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-green-400">
                      ${sp.net_profit_min_usd.toLocaleString()} – ${sp.net_profit_max_usd.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono ${sp.net_margin_max_pct >= 50 ? 'text-green-400' : sp.net_margin_max_pct >= 25 ? 'text-kagan-amber' : 'text-red-400'}`}>
                        {sp.net_margin_min_pct}% – {sp.net_margin_max_pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Optimizations ──────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Ranked Profit Optimizations ⚜
          </h2>
          <div className="space-y-3">
            {data.profit_optimizations.map((opt) => (
              <div
                key={opt.rank}
                className="rounded-xl border border-kagan-border bg-kagan-card/40 p-5 hover:border-kagan-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-kagan-gold/15 text-xs font-bold text-kagan-gold">
                        {opt.rank}
                      </span>
                      <span className={`text-sm font-bold ${impactColor(opt.profit_impact)}`}>
                        {opt.profit_impact} IMPACT
                      </span>
                      {effortBadge(opt.effort)}
                      {opt.approval_status && (
                        <Badge variant={opt.approval_status === 'approved' ? 'green' : 'amber'}>
                          {opt.approval_status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-kagan-white">{opt.action}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-kagan-muted mb-0.5">Est. savings</div>
                    <div className="text-lg font-bold text-green-400 font-mono">
                      ${opt.estimated_monthly_savings_usd.toLocaleString()}<span className="text-xs text-kagan-muted">/mo</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-kagan-muted">
                  Type: {opt.type.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
