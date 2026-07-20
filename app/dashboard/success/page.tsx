"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity, BarChart3, BookOpen, Box, CheckCircle, DollarSign,
  Eye, Globe, RefreshCw, Server, ShoppingCart, Sparkles,
  Target, TrendingUp, Users, Zap,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

function fmtUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}
function fmtInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function StatCard({ icon: Icon, label, value, sub, tone = "default" }: { icon: React.ElementType; label: string; value: string; sub?: string; tone?: string }) {
  const tc = tone === "positive" ? "text-green-400" : tone === "warning" ? "text-kagan-amber" : "text-kagan-gold";
  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className={`rounded-lg p-1.5 bg-kagan-gold/10 ${tc}`}><Icon className="h-4 w-4" /></div>
        <span className="text-xs text-kagan-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-kagan-white font-mono">{value}</div>
      {sub && <div className="text-xs text-kagan-light mt-1">{sub}</div>}
    </div>
  );
}

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold mb-4 uppercase flex items-center gap-2">
      <Icon className="h-4 w-4" /> {label}
    </h2>
  );
}

function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs"><span className="text-kagan-light">{label}</span><span className="font-mono text-kagan-white">{fmtInt(value)}</span></div>
      <div className="h-2 w-full rounded-full bg-kagan-darker overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-kagan-gold/70 to-kagan-amber" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function SuccessDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/ops/success-dashboard", { cache: "no-store" });
      if (r.ok) setData(await r.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading && !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-kagan-muted">
        <RefreshCw className="h-6 w-6 animate-spin mr-2 text-kagan-gold" />
        Loading success dashboard...
      </div>
    );
  }

  const d = data || {};
  const org = d.organization || {};
  const brand = d.branding || {};
  const sales = d.sales || {};
  const mkt = d.marketing || {};
  const mil = d.milestones || {};
  const traj = d.trajectory || {};
  const proj = d.projections || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
      <div className="text-center">
        <Badge variant="green" className="mb-3">Live · Consolidated</Badge>
        <h1 className="text-4xl font-extrabold text-kagan-white mb-2">Org <span className="text-gradient">Success</span></h1>
        <p className="text-kagan-light text-sm max-w-2xl mx-auto">
          Consolidated view of organization status, branding direction, sales operations, and marketing strategy.
        </p>
        <button onClick={load} className="mt-4 inline-flex items-center gap-1.5 text-xs text-kagan-gold hover:text-kagan-gold-light">
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {/* ── 1. Organization Status ── */}
      <section>
        <SectionHeader icon={Server} label="Organization Status" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard icon={CheckCircle} label="System Health" value={`${org.healthGatesPassing || 0}/${org.healthGatesTotal || 11}`} sub={`${org.environment} · v${(org.version || "").slice(0, 8)}`} tone="positive" />
          <StatCard icon={Zap} label="CAPI" value={org.capiLive ? "Live" : "Off"} sub="Server-side Pixel" tone={org.capiLive ? "positive" : "warning"} />
          <StatCard icon={Server} label="KV Storage" value={org.kvType || "none"} sub={org.kvConnected ? "connected" : "disconnected"} tone={org.kvConnected ? "positive" : "warning"} />
          <StatCard icon={Globe} label="Providers Active" value={fmtInt(org.activeProviders?.length || 0)} sub={org.activeProviders?.join(", ") || ""} tone="positive" />
        </div>
        <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div><span className="text-kagan-muted">Uptime:</span> <span className="text-kagan-white font-mono">{org.uptimeDays || 0}d</span></div>
            <div><span className="text-kagan-muted">Last Deploy:</span> <span className="text-kagan-white font-mono">{new Date(org.lastDeploy || "").toLocaleString()}</span></div>
            <div><span className="text-kagan-muted">Agent Runs:</span> <span className="text-kagan-white font-mono">Daily marketing + hourly CS</span></div>
            <div><span className="text-kagan-muted">Content Backlog:</span> <span className="text-kagan-white font-mono">{brand.contentBacklog || 0} files</span></div>
          </div>
        </div>
      </section>

      {/* ── 2. Branding Direction ── */}
      <section>
        <SectionHeader icon={Sparkles} label="Branding Direction" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard icon={BookOpen} label="Brand" value={brand.name || "AutonomaX"} sub={brand.tagline || ""} tone="positive" />
          <StatCard icon={Target} label="Sustainability" value={`${brand.sustainabilityScore || 0}/100`} sub={brand.growthClassification || ""} tone={(brand.sustainabilityScore || 0) >= 70 ? "positive" : "warning"} />
          <StatCard icon={BarChart3} label="Revenue Streams" value={fmtInt(brand.streamsActive || 0)} sub="active streams" tone="positive" />
          <StatCard icon={TrendingUp} label="Opportunities" value={fmtInt(brand.opportunityCount || 0)} sub="top ranked" tone="positive" />
        </div>
        {brand.topOpportunities?.length > 0 && (
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-4">
            <h3 className="text-xs font-bold text-kagan-muted uppercase mb-3">Top Brand Opportunities</h3>
            <div className="space-y-2">
              {brand.topOpportunities.map((opp: any, i: number) => (
                <div key={i} className="flex justify-between text-sm border-b border-kagan-border/30 pb-2">
                  <span className="text-kagan-light">{opp.name}</span>
                  <span className="font-mono text-kagan-gold">Score: {opp.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 3. Sales Operations ── */}
      <section>
        <SectionHeader icon={DollarSign} label="Sales Operations" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard icon={Eye} label="Pageviews (30d)" value={fmtInt(sales.funnel?.pageviews || 0)} sub={`${sales.funnel?.checkoutIntents || 0} intents`} tone="positive" />
          <StatCard icon={ShoppingCart} label="Revenue" value={fmtUsd(sales.revenue?.grossUsd || 0)} sub={`${sales.revenue?.transactionsCount || 0} orders`} tone={sales.revenue?.grossUsd > 0 ? "positive" : "default"} />
          <StatCard icon={TrendingUp} label="Projected MRR" value={`${fmtUsd(sales.projectedMrrMin)}–${fmtUsd(sales.projectedMrrMax)}`} sub={`${fmtUsd(sales.projectedAnnualMin)}–${fmtUsd(sales.projectedAnnualMax)} annual`} tone="positive" />
          <StatCard icon={Activity} label="Burn Rate" value={fmtUsd(sales.monthlyBurn || 0)} sub={`${sales.ltvToCacRatio}x LTV:CAC ratio`} tone={sales.ltvToCacRatio >= 3 ? "positive" : "warning"} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-4">
            <h3 className="text-xs font-bold text-kagan-muted uppercase mb-3">Conversion Funnel</h3>
            <div className="space-y-3">
              <ProgressBar value={sales.funnel?.pageviews || 0} max={Math.max(1, sales.funnel?.pageviews || 1)} label="Pageviews" />
              <ProgressBar value={sales.funnel?.checkoutIntents || 0} max={Math.max(1, sales.funnel?.pageviews || 1)} label="Checkout Intents" />
              <ProgressBar value={sales.funnel?.leads || 0} max={Math.max(1, sales.funnel?.pageviews || 1)} label="Leads" />
              <ProgressBar value={sales.funnel?.purchases || 0} max={Math.max(1, sales.funnel?.pageviews || 1)} label="Purchases" />
            </div>
          </div>
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-4">
            <h3 className="text-xs font-bold text-kagan-muted uppercase mb-3">Trajectory & Projections</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-kagan-light">Direction</span><span className={`font-mono ${traj.direction === "growing" ? "text-green-400" : traj.direction === "declining" ? "text-kagan-amber" : "text-kagan-white"}`}>{traj.direction}</span></div>
              <div className="flex justify-between"><span className="text-kagan-light">Pageview Change</span><span className="font-mono text-kagan-white">{traj.pageviewChangePct?.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-kagan-light">Next Milestone</span><span className="font-mono text-kagan-gold">{mil.nextMilestone || "1st purchase"}</span></div>
              <div className="flex justify-between"><span className="text-kagan-light">Monthly Traffic Value</span><span className="font-mono text-green-400">{fmtUsd(sales.projectedValue || 0)}</span></div>
              <div className="flex justify-between"><span className="text-kagan-light">Growth Classification</span><span className="font-mono text-kagan-white">{proj.growthClassification || brand.growthClassification || "—"}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Marketing Strategy ── */}
      <section>
        <SectionHeader icon={BarChart3} label="Marketing Strategy" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard icon={Globe} label="Campaign Channels" value="14" sub="X, LinkedIn, Reddit, FB, IG, +9 more" tone="positive" />
          <StatCard icon={Users} label="Subreddit Targets" value={fmtInt(mkt.subredditTargets || 10)} sub="pain-point monitored" tone="positive" />
          <StatCard icon={BookOpen} label="Content Files" value={fmtInt(mkt.contentBacklogFiles || 0)} sub="ready in backlog" tone="positive" />
          <StatCard icon={Target} label="Wave Schedule" value={`Wave ${mkt.waveSchedule?.current || 1}`} sub={mkt.waveSchedule?.wave1?.focus || ""} tone="positive" />
        </div>
        <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-4">
          <h3 className="text-xs font-bold text-kagan-muted uppercase mb-3">Campaign: Chimera Genesis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-kagan-muted text-xs">Wave 1 (Days 1-2)</p>
              <p className="text-kagan-light">Awareness + founder story</p>
            </div>
            <div>
              <p className="text-kagan-muted text-xs">Wave 2 (Days 3-4)</p>
              <p className="text-kagan-light">Problem/solution pain-points</p>
            </div>
            <div>
              <p className="text-kagan-muted text-xs">Wave 3 (Days 5-7)</p>
              <p className="text-kagan-light">Social proof + testimonials</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Agent Activity ── */}
      {d.agentActivity?.length > 0 && (
        <section>
          <SectionHeader icon={Zap} label="Agent Activity Feed" />
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-4">
            <div className="space-y-2">
              {d.agentActivity.map((a: any, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm border-b border-kagan-border/30 pb-2 last:border-0">
                  <div className={`mt-0.5 h-2 w-2 rounded-full ${a.status === "success" ? "bg-green-400" : "bg-kagan-amber"}`} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-kagan-white font-semibold">{a.agentName}</span>
                      <span className="text-kagan-muted text-xs">{a.durationMs ? `${(a.durationMs / 1000).toFixed(0)}s` : ""}</span>
                    </div>
                    <p className="text-kagan-light text-xs">{a.summary || a.runMode}</p>
                    <p className="text-kagan-muted text-[10px]">{a.startedAt ? new Date(a.startedAt).toLocaleString() : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <div className="text-center text-xs text-kagan-muted pt-6 border-t border-kagan-border/50">
        <p className="mb-1">Success Dashboard · AutonomaX Profit OS</p>
        <p className="opacity-70">Data sourced from KV ledger, revenue-ops backend, and live system state.</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/income" className="text-kagan-gold hover:underline">Income Reality</Link>
          <Link href="/mission-control" className="text-kagan-gold hover:underline">Mission Control</Link>
          <Link href="/dashboard" className="text-kagan-gold hover:underline">Dashboard Hub</Link>
          <Link href="/api/ops/success-dashboard" className="text-kagan-gold hover:underline">API</Link>
        </div>
      </div>
    </div>
  );
}
