"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Activity,
  Target,
  BarChart3,
  Eye,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Server,
  Database,
  Zap,
  Globe,
} from "lucide-react";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DailyPoint {
  day: string;
  pageviews: number;
  intents: number;
  leads: number;
  purchases: number;
  revenueCents: number;
}

interface IncomeReality {
  generatedAt: string;
  sources: { kv: boolean; paddle: boolean; capi: boolean; ga4: boolean };
  windowDays: number;
  traffic: {
    pageviews: number;
    checkoutIntents: number;
    leads: number;
    purchases: number;
    leadRatePct: number;
    intentRatePct: number;
    purchaseIntentPct: number;
    leadToPurchasePct: number;
  };
  revenue: {
    grossUsd: number;
    transactionsCount: number;
    affiliatedCount: number;
    averageOrderUsd: number;
  };
  daily: DailyPoint[];
  recentTransactions: Array<{
    orderId: string;
    provider: string;
    slug: string;
    value: number;
    capturedAt: string;
    ref: string | null;
    capiFired: boolean;
  }>;
  evidence: {
    kvRecords: { transactions: number; leads: number; intents: number };
    capi?: { configured: boolean; message: string };
  };
  projections?: {
    activeMrrMinUsd: number;
    activeMrrMaxUsd: number;
    projectedAnnualMinUsd: number;
    projectedAnnualMaxUsd: number;
    activeStreamCount: number;
    monthlyBurnUsd: number;
    sustainabilityScore: number;
    growthClassification: string;
    revenueToBurnRatio: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
function formatPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "positive" | "warning";
}) {
  const toneClass =
    tone === "positive" ? "text-green-400" : tone === "warning" ? "text-kagan-amber" : "text-kagan-gold";
  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`rounded-lg p-1.5 bg-kagan-gold/10 ${toneClass}`}>
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
/*  Sources badge row                                                  */
/* ------------------------------------------------------------------ */

function SourcesBadges({ sources, evidence }: { sources: IncomeReality["sources"]; evidence: IncomeReality["evidence"] }) {
  const items: Array<{ key: string; ok: boolean; label: string; detail: string }> = [
    {
      key: "kv",
      ok: sources.kv,
      label: "Vercel KV",
      detail: sources.kv ? "durable evidence ledger online" : "in-memory only — set KV_REST_API_URL/KV_REST_API_TOKEN",
    },
    {
      key: "paddle",
      ok: sources.paddle,
      label: "Paddle API",
      detail: sources.paddle ? "configured — webhook + transaction API live" : "PADDLE_API_KEY missing — set in Vercel",
    },
    {
      key: "capi",
      ok: sources.capi,
      label: "Meta CAPI",
      detail: sources.capi ? "META_PIXEL_ID + META_CAPI_ACCESS_TOKEN set" : (evidence.capi?.message ?? "CAPI not configured"),
    },
    {
      key: "ga4",
      ok: sources.ga4,
      label: "GA4",
      detail: sources.ga4 ? "NEXT_PUBLIC_GA_ID set — events land in GA4" : "NEXT_PUBLIC_GA_ID missing",
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <div
          key={it.key}
          className={`rounded-lg border p-3 ${
            it.ok
              ? "border-green-500/30 bg-green-500/5"
              : "border-kagan-amber/30 bg-kagan-amber/5"
          }`}
        >
          <div className="flex items-center gap-2">
            {it.ok ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-kagan-amber" />
            )}
            <span className="text-sm font-bold text-kagan-white">{it.label}</span>
          </div>
          <p className="text-xs text-kagan-light mt-1">{it.detail}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Funnel + revenue + recent                                          */
/* ------------------------------------------------------------------ */

function FunnelRow({ traffic }: { traffic: IncomeReality["traffic"] }) {
  const max = Math.max(1, traffic.pageviews);
  const stages = [
    { label: "Pageviews", value: traffic.pageviews },
    { label: "Checkout Intents", value: traffic.checkoutIntents },
    { label: "Leads", value: traffic.leads },
    { label: "Purchases", value: traffic.purchases },
  ];
  return (
    <div className="space-y-3">
      {stages.map((s, i) => {
        const w = (s.value / max) * 100;
        return (
          <div key={s.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-kagan-light">{s.label}</span>
              <span className="font-mono text-kagan-white">{formatInt(s.value)}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-kagan-darker overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-kagan-gold/70 to-kagan-amber"
                style={{ width: `${w}%` }}
              />
            </div>
            {i < stages.length - 1 && stages[i + 1].value > 0 && (
              <p className="text-[10px] text-kagan-muted mt-0.5">
                ↓ {formatPct((stages[i + 1].value / s.value) * 100)} conversion
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DailyChart({ daily }: { daily: DailyPoint[] }) {
  const maxRevenue = Math.max(1, ...daily.map((d) => d.revenueCents / 100));
  return (
    <div className="space-y-2">
      {daily.map((d) => {
        const rev = d.revenueCents / 100;
        const h = (rev / maxRevenue) * 100;
        return (
          <div key={d.day} className="flex items-center gap-3">
            <span className="w-24 text-xs text-kagan-muted font-mono">{d.day}</span>
            <div className="flex-1 flex items-center gap-2">
              <div className="h-4 rounded bg-gradient-to-r from-kagan-gold/60 to-kagan-amber" style={{ width: `${h}%`, minWidth: rev > 0 ? "4px" : 0 }} />
              <span className="text-xs text-kagan-white font-mono">{formatUsd(rev)}</span>
            </div>
            <div className="text-[10px] text-kagan-muted w-32 text-right font-mono">
              {d.purchases}p · {d.leads}l · {d.intents}i · {d.pageviews}v
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentTransactions({ txs }: { txs: IncomeReality["recentTransactions"] }) {
  if (txs.length === 0) {
    return (
      <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6 text-center">
        <p className="text-kagan-muted text-sm">
          No transactions yet. Trigger a test purchase or wait for the first real one to land here.
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-kagan-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-kagan-border bg-kagan-darker text-left">
            <th className="px-4 py-3 text-kagan-muted font-medium">When</th>
            <th className="px-4 py-3 text-kagan-muted font-medium">Provider</th>
            <th className="px-4 py-3 text-kagan-muted font-medium">Order</th>
            <th className="px-4 py-3 text-kagan-muted font-medium">Product</th>
            <th className="px-4 py-3 text-kagan-muted font-medium text-right">Value</th>
            <th className="px-4 py-3 text-kagan-muted font-medium text-right">Ref</th>
            <th className="px-4 py-3 text-kagan-muted font-medium text-right">CAPI</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((t) => (
            <tr key={t.orderId} className="border-b border-kagan-border/50 hover:bg-kagan-card/40 transition-colors">
              <td className="px-4 py-3 text-kagan-light font-mono text-xs">{new Date(t.capturedAt).toLocaleString()}</td>
              <td className="px-4 py-3"><Badge variant="green">{t.provider}</Badge></td>
              <td className="px-4 py-3 text-kagan-white font-mono text-xs">{t.orderId.slice(0, 18)}…</td>
              <td className="px-4 py-3 text-kagan-light">{t.slug}</td>
              <td className="px-4 py-3 text-right font-mono text-green-400">{formatUsd(t.value)}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-kagan-muted">{t.ref ?? "—"}</td>
              <td className="px-4 py-3 text-right">
                {t.capiFired ? (
                  <Badge variant="green">fired</Badge>
                ) : (
                  <Badge variant="amber">dropped</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function IncomeRealityPage() {
  const [data, setData] = useState<IncomeReality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowDays, setWindowDays] = useState(7);

  async function load(days: number) {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/income/reality?days=${days}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setData(await r.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(windowDays);
  }, [windowDays]);

  if (loading && !data) {
    return (
      <Section variant="hero">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-6 w-6 animate-spin text-kagan-gold" />
          <span className="ml-3 text-kagan-light">Loading income reality…</span>
        </div>
      </Section>
    );
  }
  if (error && !data) {
    return (
      <Section variant="hero">
        <div className="text-center py-20">
          <AlertTriangle className="h-10 w-10 text-kagan-amber mx-auto mb-4" />
          <p className="text-kagan-light">Could not load income reality: {error}</p>
        </div>
      </Section>
    );
  }
  if (!data) return null;

  const isColdStart = data.traffic.pageviews === 0 && data.traffic.purchases === 0;
  const capiOk = data.sources.capi;

  return (
    <Section variant="hero">
      <div className="text-center mb-10">
        <Badge variant="green" className="mb-4">Live · Zero-gap evidence</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
          Income <span className="text-gradient">Reality</span>
        </h1>
        <p className="text-lg text-kagan-light max-w-2xl mx-auto">
          Every number on this page is sourced from Vercel KV (durable evidence ledger),
          the Paddle API (when configured), Meta CAPI, and the live webhook audit log.
          No synthetic data.
        </p>
        <div className="mt-4 text-xs text-kagan-muted">
          Computed {new Date(data.generatedAt).toLocaleString()} · {data.windowDays}-day window
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-kagan-border bg-kagan-card/40 p-1 text-xs">
          {[1, 7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setWindowDays(d)}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                windowDays === d
                  ? "bg-kagan-gold text-black font-semibold"
                  : "text-kagan-light hover:text-kagan-white"
              }`}
            >
              {d}d
            </button>
          ))}
          <button
            onClick={() => load(windowDays)}
            className="ml-2 rounded-md px-3 py-1.5 text-kagan-light hover:text-kagan-gold transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {data.traffic.purchases === 0 && data.traffic.pageviews > 0 && (
        <div className="max-w-4xl mx-auto mb-10 rounded-xl border border-kagan-amber/30 bg-kagan-amber/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-kagan-amber shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-kagan-white mb-1">Traffic flowing — no purchases yet</h3>
              <p className="text-sm text-kagan-light mb-2">
                {formatInt(data.traffic.pageviews)} pageviews and {formatInt(data.traffic.checkoutIntents)} checkout intents recorded,
                but no completed purchases yet. The funnel is capturing real visitor data — first purchase
                will populate the revenue ledger automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sources of evidence ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
          ⚜ Evidence Sources ⚜
        </h2>
        <SourcesBadges sources={data.sources} evidence={data.evidence} />
        {!capiOk && (
          <p className="text-xs text-kagan-muted text-center mt-3">
            CAPI not configured — server-side Lead / Purchase events are currently dropped. Add
            META_PIXEL_ID and META_CAPI_ACCESS_TOKEN to your Vercel project to start sending.
          </p>
        )}
      </div>

      {/* ── Top KPIs ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
          ⚜ Headline Numbers ⚜
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Gross Revenue"
            value={formatUsd(data.revenue.grossUsd)}
            sub={`${data.revenue.transactionsCount} transactions`}
            tone={data.revenue.grossUsd > 0 ? "positive" : "default"}
          />
          <StatCard
            icon={Activity}
            label="Avg Order"
            value={formatUsd(data.revenue.averageOrderUsd)}
            sub={`${data.revenue.affiliatedCount} via affiliates`}
          />
          <StatCard
            icon={Eye}
            label="Pageviews"
            value={formatInt(data.traffic.pageviews)}
            sub={`${data.traffic.checkoutIntents} checkout intents`}
          />
          <StatCard
            icon={Target}
            label="Leads"
            value={formatInt(data.traffic.leads)}
            sub={`${formatPct(data.traffic.leadToPurchasePct)} lead→sale`}
          />
        </div>
      </div>

      {/* ── Projections ─────────────────────────────────────────────── */}
      {data.projections && (
        <div className="max-w-5xl mx-auto mb-10">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
            ⚜ Revenue Projections ⚜
          </h2>
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard
                icon={TrendingUp}
                label="Projected MRR Range"
                value={`${formatUsd(data.projections.activeMrrMinUsd)} – ${formatUsd(data.projections.activeMrrMaxUsd)}`}
                sub={`${data.projections.activeStreamCount} active streams`}
                tone="positive"
              />
              <StatCard
                icon={BarChart3}
                label="Projected Annual"
                value={`${formatUsd(data.projections.projectedAnnualMinUsd)} – ${formatUsd(data.projections.projectedAnnualMaxUsd)}`}
                sub={data.projections.growthClassification}
                tone="positive"
              />
              <StatCard
                icon={Activity}
                label="Monthly Burn"
                value={formatUsd(data.projections.monthlyBurnUsd)}
                sub={`${data.projections.revenueToBurnRatio}x coverage`}
                tone={data.projections.revenueToBurnRatio > 3 ? "positive" : "warning"}
              />
              <StatCard
                icon={Target}
                label="Sustainability"
                value={`${data.projections.sustainabilityScore}/100`}
                sub={data.projections.growthClassification}
                tone={data.projections.sustainabilityScore >= 70 ? "positive" : "warning"}
              />
            </div>
            <p className="text-xs text-kagan-muted text-center">
              Forward-looking projections based on revenue-ops analysis. Not realized income.
            </p>
          </div>
        </div>
      )}

      {/* ── Funnel ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
          ⚜ Funnel — {data.windowDays}-day window ⚜
        </h2>
        <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6">
          <FunnelRow traffic={data.traffic} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="rounded-lg border border-kagan-border bg-kagan-card/30 p-3 text-center">
            <p className="text-kagan-muted">Lead rate</p>
            <p className="text-lg font-mono text-kagan-white">{formatPct(data.traffic.leadRatePct)}</p>
          </div>
          <div className="rounded-lg border border-kagan-border bg-kagan-card/30 p-3 text-center">
            <p className="text-kagan-muted">Intent rate</p>
            <p className="text-lg font-mono text-kagan-white">{formatPct(data.traffic.intentRatePct)}</p>
          </div>
          <div className="rounded-lg border border-kagan-border bg-kagan-card/30 p-3 text-center">
            <p className="text-kagan-muted">Intent → sale</p>
            <p className="text-lg font-mono text-kagan-white">{formatPct(data.traffic.purchaseIntentPct)}</p>
          </div>
          <div className="rounded-lg border border-kagan-border bg-kagan-card/30 p-3 text-center">
            <p className="text-kagan-muted">Lead → sale</p>
            <p className="text-lg font-mono text-kagan-white">{formatPct(data.traffic.leadToPurchasePct)}</p>
          </div>
        </div>
      </div>

      {/* ── Daily revenue chart ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
          ⚜ Daily Revenue & Activity ⚜
        </h2>
        <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6">
          <DailyChart daily={data.daily} />
        </div>
        <p className="text-xs text-kagan-muted text-center mt-2">
          p = purchases · l = leads · i = intents · v = pageviews (UTC days)
        </p>
      </div>

      {/* ── Recent transactions ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
          ⚜ Recent Transactions ⚜
        </h2>
        <RecentTransactions txs={data.recentTransactions} />
      </div>

      {/* ── Audit footer ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl border border-kagan-border bg-kagan-card/30 p-4">
          <h3 className="text-xs font-bold tracking-wider text-kagan-muted uppercase mb-3">Audit trail</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-kagan-gold" />
              <span className="text-kagan-muted">KV:</span>
              <span className="text-kagan-white font-mono">{data.evidence.kvRecords.transactions} tx / {data.evidence.kvRecords.leads} leads / {data.evidence.kvRecords.intents} intents</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-kagan-gold" />
              <span className="text-kagan-muted">Paddle:</span>
              <span className="text-kagan-white font-mono">{data.sources.paddle ? "live" : "off"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-kagan-gold" />
              <span className="text-kagan-muted">CAPI:</span>
              <span className="text-kagan-white font-mono">{data.sources.capi ? "live" : "off"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-kagan-gold" />
              <span className="text-kagan-muted">GA4:</span>
              <span className="text-kagan-white font-mono">{data.sources.ga4 ? "live" : "off"}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-kagan-border/50">
            <p className="text-[11px] text-kagan-muted">
              Audit endpoints:{" "}
              <a href="/api/income/reality" className="text-kagan-gold hover:underline">/api/income/reality</a>
              {" · "}
              <a href="/api/income/funnel" className="text-kagan-gold hover:underline">/api/income/funnel</a>
              {" · "}
              <a href="/api/income/transactions" className="text-kagan-gold hover:underline">/api/income/transactions</a>
              {" · "}
              <a href="/api/health" className="text-kagan-gold hover:underline">/api/health</a>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
