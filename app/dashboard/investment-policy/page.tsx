'use client';

import { useEffect, useState } from 'react';
import { Target, DollarSign, Shield, TrendingUp, RefreshCw, AlertTriangle, CheckCircle, XCircle, BarChart3, PiggyBank } from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface AllocationRecord {
  id: string;
  category: string;
  amount_usd: number;
  description: string;
  valuation_snapshot_score: number;
  valuation_snapshot_tier: string;
  allowed_by_policy: boolean;
  reason: string;
  allocated_at: string;
}

interface InvestmentPolicyPayload {
  generated_at: string;
  policy_active: boolean;
  cumulative_earnings_usd: number;
  cumulative_investments_usd: number;
  available_budget_usd: number;
  reserve_floor_usd: number;
  current_tier: string;
  reinvestment_rate_pct: number;
  allocation_count: number;
  recent_allocations: AllocationRecord[];
  budget_remaining_pct: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function tierColor(tier: string) {
  switch (tier) {
    case 'seed': return 'text-red-400';
    case 'growth': return 'text-kagan-amber';
    case 'scale': return 'text-blue-400';
    case 'mature': return 'text-green-400';
    default: return 'text-kagan-muted';
  }
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
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

export default function InvestmentPolicyPage() {
  const [data, setData] = useState<InvestmentPolicyPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/revenue-ops/api/investment-policy')
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
          <span className="ml-3 text-kagan-light">Loading investment policy…</span>
        </div>
      </Section>
    );
  }

  if (error || !data) {
    return (
      <Section variant="hero">
        <div className="text-center py-20">
          <AlertTriangle className="h-10 w-10 text-kagan-amber mx-auto mb-4" />
          <p className="text-kagan-light">Could not load investment policy. Backend may be unavailable.</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section variant="hero">
        <div className="text-center mb-10">
          <Badge variant="gold" className="mb-4">Capital Allocation</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Investment <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Earnings-based capital allocation rules. Zero investment unless earnings-backed.
          </p>
          <div className="mt-4 text-xs text-kagan-muted">
            Updated {new Date(data.generated_at).toLocaleString()}
          </div>
        </div>

        {/* ── Status banner ──────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className={`rounded-xl border p-6 text-center ${
            data.policy_active
              ? 'border-green-500/30 bg-green-500/5'
              : 'border-red-500/30 bg-red-500/5'
          }`}>
            {data.policy_active ? (
              <div className="flex items-center justify-center gap-3">
                <Shield className="h-8 w-8 text-green-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-green-400">Policy Active</div>
                  <div className="text-sm text-kagan-light">{data.reinvestment_rate_pct}% reinvestment rate at {data.current_tier} tier</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <XCircle className="h-8 w-8 text-red-400" />
                <div className="text-left">
                  <div className="text-lg font-bold text-red-400">Policy Inactive</div>
                  <div className="text-sm text-kagan-light">Investment allocations are blocked</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Capital Position ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={DollarSign} label="Cumulative Earnings" value={formatCurrency(data.cumulative_earnings_usd)} />
            <StatCard icon={Target} label="Invested Total" value={formatCurrency(data.cumulative_investments_usd)} />
            <StatCard icon={PiggyBank} label="Available Budget" value={formatCurrency(data.available_budget_usd)} sub={`${data.budget_remaining_pct}% remaining`} />
            <StatCard icon={Shield} label="Reserve Floor" value={formatCurrency(data.reserve_floor_usd)} />
          </div>
        </div>

        {/* ── Valuation tier ─────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Valuation Tier ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard icon={BarChart3} label="Current Tier" value={data.current_tier.charAt(0).toUpperCase() + data.current_tier.slice(1)} color={`bg-${tierColor(data.current_tier).replace('text-', '')}/10 text-${tierColor(data.current_tier).replace('text-', '')}`} />
            <StatCard icon={TrendingUp} label="Reinvestment Rate" value={`${data.reinvestment_rate_pct}%`} />
            <StatCard icon={BarChart3} label="Allocations" value={String(data.allocation_count)} />
          </div>
        </div>

        {/* ── Recent allocations ─────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-4 uppercase">
            ⚜ Recent Allocations ⚜
          </h2>
          {data.recent_allocations.length === 0 ? (
            <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6 text-center">
              <p className="text-kagan-muted text-sm">No allocations yet. Allocate capital when the policy allows.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recent_allocations.slice().reverse().map((alloc) => (
                <div
                  key={alloc.id}
                  className={`rounded-xl border p-5 ${
                    alloc.allowed_by_policy
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {alloc.allowed_by_policy
                          ? <CheckCircle className="h-4 w-4 text-green-400" />
                          : <XCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className="text-sm font-bold text-kagan-white capitalize">
                          {alloc.category.replace(/_/g, ' ')}
                        </span>
                        <Badge variant={alloc.allowed_by_policy ? 'green' : 'amber'}>
                          {alloc.allowed_by_policy ? 'Approved' : 'Blocked'}
                        </Badge>
                      </div>
                      <p className="text-sm text-kagan-light">{alloc.description}</p>
                      <p className="text-xs text-kagan-muted mt-1">{alloc.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-kagan-white font-mono">
                        {formatCurrency(alloc.amount_usd)}
                      </div>
                      <div className="text-xs text-kagan-muted">
                        Tier: <span className={tierColor(alloc.valuation_snapshot_tier)}>{alloc.valuation_snapshot_tier}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
