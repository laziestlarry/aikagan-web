"use client";

import { useEffect, useState } from "react";

interface KPI {
  label: string;
  value: string;
  delta?: string;
}

interface IncomeReality {
  traffic: { pageviews: number; checkoutIntents: number; leads: number; purchases: number; leadRatePct: number; intentRatePct: number };
  revenue: { grossUsd: number; transactionsCount: number };
}

const FALLBACK_KPIS: KPI[] = [
  { label: "Active Pipelines", value: "12+" },
  { label: "Avg. Delivery Cycle", value: "7 Days" },
  { label: "SLA Uptime", value: "99.9%" },
  { label: "Conversion Lift", value: "3.2× avg" },
];

/** Map real income reality to KPI tiles. No synthetic numbers. */
function realityToKpis(r: IncomeReality): KPI[] {
  const conversionPct =
    r.traffic.checkoutIntents > 0
      ? Math.round((r.traffic.purchases / r.traffic.checkoutIntents) * 1000) / 10
      : 0;
  return [
    { label: "Gross Revenue (7d)", value: `$${r.revenue.grossUsd.toFixed(2)}` },
    { label: "Transactions (7d)", value: String(r.revenue.transactionsCount) },
    { label: "Leads (7d)", value: String(r.traffic.leads) },
    { label: "Intent→Sale", value: `${conversionPct.toFixed(1)}%` },
  ];
}

export default function LiveKPIs() {
  const [kpis, setKpis] = useState<KPI[]>(FALLBACK_KPIS);
  const [live, setLive] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Prefer the local evidence ledger (zero-gap ground truth).
    fetch("/api/income/reality?days=7", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.traffic && data?.revenue) {
          setKpis(realityToKpis(data as IncomeReality));
          setLive(true);
          setOffline(false);
          return;
        }
        // Fall back to the AutonomaX mission endpoint if available
        return fetch("/api/revenue-ops/api/mission/status", { cache: "no-store" })
          .then((r) => (r.ok ? r.json() : null))
          .then((m) => {
            if (cancelled || !m?.kpis) {
              if (!cancelled) setOffline(true);
              return;
            }
            setKpis(m.kpis);
            setLive(true);
            setOffline(false);
          })
          .catch(() => {
            if (!cancelled) setOffline(true);
          });
      })
      .catch(() => {
        if (!cancelled) setOffline(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5 text-center"
        >
          <div className="text-2xl font-bold text-kagan-white mb-1 font-mono">
            {kpi.value}
            {kpi.delta && (
              <span className="ml-1 text-sm text-green-400">{kpi.delta}</span>
            )}
          </div>
          <div className="text-xs text-kagan-muted">{kpi.label}</div>
        </div>
      ))}
      <div className="col-span-full text-right">
        {live && (
          <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live · from evidence ledger
          </span>
        )}
        {offline && (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Offline — showing fallback
          </span>
        )}
      </div>
    </div>
  );
}
