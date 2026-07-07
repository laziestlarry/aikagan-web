'use client';

import { useEffect, useState } from 'react';
import { Brain, TrendingUp, BarChart3, Target, RefreshCw, AlertTriangle, Lightbulb, Users, Activity, CheckCircle, ArrowUp, DollarSign } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface SegmentPerformance {
  [segment: string]: {
    completion_rate_pct: number;
    intents: number;
    receipts: number;
    conversion_rate_pct: number;
  };
}

interface HighestROIAction {
  action_id: string;
  intent_score: number;
  revenue_weight: number;
  reason: string;
}

interface NextWeekRecommendation {
  top_recommendation: string;
  recommendations: Array<{ rank: number; action: string }>;
}

interface WeeklyIntelligencePayload {
  computed_at: string;
  week_start: string;
  week_end: string;
  highest_roi_action: HighestROIAction;
  segment_performance: SegmentPerformance;
  intent_receipt_timeline: {
    total_intents: number;
    total_receipts: number;
    total_revenue_usd: number;
    conversion_rate_pct: number;
    gap_to_weekly_target_usd: number;
    by_segment: Record<string, { intents: number; receipts: number }>;
  };
  action_completion_rates: Record<string, { completed: number; total: number; rate: number }>;
  next_week_recommendation: NextWeekRecommendation;
  data_sources: {
    schedule_log_entries: number;
    webhook_events: number;
    agent_runs: number;
    loop_runs: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

export default function WeeklyIntelligencePage() {
  const [data, setData] = useState<WeeklyIntelligencePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/revenue-ops/api/intelligence/weekly')
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
          <span className="ml-3 text-kagan-light">Loading weekly intelligence…</span>
        </div>
      </Section>
    );
  }

  if (error || !data) {
    return (
      <Section variant="hero">
        <div className="text-center py-20">
          <AlertTriangle className="h-10 w-10 text-kagan-amber mx-auto mb-4" />
          <p className="text-kagan-light">Could not load weekly intelligence. Backend may be unavailable.</p>
        </div>
      </Section>
    );
  }

  const tl = data.intent_receipt_timeline;
  const roi = data.highest_roi_action;
  const rec = data.next_week_recommendation;

  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <Badge variant="gold" className="mb-4">Adaptive Intelligence</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Weekly <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            {formatDate(data.week_start)} – {formatDate(data.week_end)}
          </p>
          <div className="mt-4 text-xs text-kagan-muted">
            Computed {new Date(data.computed_at).toLocaleString()}
          </div>
        </div>

        {/* ── Week snapshot ──────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Week-to-Date ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Revenue" value={`$${tl.total_revenue_usd.toLocaleString()}`} />
            <StatCard icon={Target} label="Intents" value={String(tl.total_intents)} sub={`→ ${tl.total_receipts} receipts`} />
            <StatCard icon={TrendingUp} label="Conversion" value={`${tl.conversion_rate_pct}%`} />
            <StatCard icon={BarChart3} label="Gap to Target" value={`$${tl.gap_to_weekly_target_usd.toLocaleString()}`} />
          </div>
        </div>

        {/* ── Highest ROI Action ─────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Highest-ROI Action ⚜
          </h2>
          <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-green-500/15 p-2">
                <ArrowUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-kagan-white font-mono">{roi.action_id}</div>
                <div className="text-sm text-kagan-light">Intent score: {roi.intent_score} · Revenue weight: {(roi.revenue_weight * 100).toFixed(0)}%</div>
              </div>
            </div>
            <p className="text-sm text-kagan-light">{roi.reason}</p>
          </div>
        </div>

        {/* ── Segment Performance ────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Segment Performance ⚜
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.segment_performance).map(([seg, perf]) => (
              <div key={seg} className="rounded-xl border border-kagan-border bg-kagan-card/40 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-kagan-gold" />
                  <span className="text-sm font-bold text-kagan-white capitalize">{seg.replace(/_/g, ' ')}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-kagan-muted">Completion</span>
                    <span className={`font-mono font-bold ${perf.completion_rate_pct >= 70 ? 'text-green-400' : perf.completion_rate_pct >= 40 ? 'text-kagan-amber' : 'text-red-400'}`}>
                      {perf.completion_rate_pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kagan-muted">Intents</span>
                    <span className="font-mono text-kagan-white">{perf.intents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kagan-muted">Receipts</span>
                    <span className="font-mono text-kagan-white">{perf.receipts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kagan-muted">Conversion</span>
                    <span className={`font-mono ${perf.conversion_rate_pct >= 5 ? 'text-green-400' : 'text-kagan-amber'}`}>
                      {perf.conversion_rate_pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Action Completion Rates ────────────────────────────────── */}
        {data.action_completion_rates && Object.keys(data.action_completion_rates).length > 0 && (
          <div className="max-w-5xl mx-auto mb-12">
            <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
              ⚜ Action Completion ⚜
            </h2>
            <div className="overflow-x-auto rounded-xl border border-kagan-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-kagan-border bg-kagan-darker text-left">
                    <th className="px-4 py-3 text-kagan-muted font-medium">Action</th>
                    <th className="px-4 py-3 text-kagan-muted font-medium text-right">Completed</th>
                    <th className="px-4 py-3 text-kagan-muted font-medium text-right">Total</th>
                    <th className="px-4 py-3 text-kagan-muted font-medium text-right">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.action_completion_rates).map(([actionId, action]) => (
                    <tr key={actionId} className="border-b border-kagan-border/50 hover:bg-kagan-card/40 transition-colors">
                      <td className="px-4 py-3 text-kagan-white font-mono text-xs">{actionId}</td>
                      <td className="px-4 py-3 text-right font-mono text-kagan-white">{action.completed}</td>
                      <td className="px-4 py-3 text-right font-mono text-kagan-light">{action.total}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-mono ${action.rate >= 0.8 ? 'text-green-400' : action.rate >= 0.5 ? 'text-kagan-amber' : 'text-red-400'}`}>
                          {(action.rate * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Next Week Recommendation ──────────────────────────────── */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Next Week: Do This First ⚜
          </h2>
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6 mb-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-kagan-gold shrink-0 mt-0.5" />
              <div>
                <div className="text-base font-bold text-kagan-white mb-1">Top Recommendation</div>
                <p className="text-sm text-kagan-light">{rec.top_recommendation}</p>
              </div>
            </div>
          </div>
          {rec.recommendations && rec.recommendations.length > 1 && (
            <div className="space-y-2">
              {rec.recommendations.filter((r) => r.rank > 1).map((r) => (
                <div key={r.rank} className="flex items-start gap-3 rounded-lg border border-kagan-border bg-kagan-card/30 px-4 py-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-kagan-gold/15 text-xs font-bold text-kagan-gold shrink-0">
                    {r.rank}
                  </span>
                  <span className="text-sm text-kagan-light">{r.action}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Data Sources ───────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="rounded-xl border border-kagan-border bg-kagan-card/30 p-4">
            <h3 className="text-xs font-bold tracking-wider text-kagan-muted uppercase mb-3">Data Sources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div><span className="text-kagan-muted">Schedule log:</span> <span className="text-kagan-white font-mono">{data.data_sources.schedule_log_entries}</span></div>
              <div><span className="text-kagan-muted">Webhook events:</span> <span className="text-kagan-white font-mono">{data.data_sources.webhook_events}</span></div>
              <div><span className="text-kagan-muted">Agent runs:</span> <span className="text-kagan-white font-mono">{data.data_sources.agent_runs}</span></div>
              <div><span className="text-kagan-muted">Loop runs:</span> <span className="text-kagan-white font-mono">{data.data_sources.loop_runs}</span></div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
