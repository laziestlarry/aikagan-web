"use client";

import { useEffect, useState } from "react";

interface KPI {
  label: string;
  value: string;
  delta?: string;
}

const FALLBACK_KPIS: KPI[] = [
  { label: "Active Pipelines", value: "12+" },
  { label: "Avg. Delivery Cycle", value: "7 Days" },
  { label: "SLA Uptime", value: "99.9%" },
  { label: "Conversion Lift", value: "3.2× avg" },
];

export default function LiveKPIs() {
  const [kpis, setKpis] = useState<KPI[]>(FALLBACK_KPIS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    fetch("/api/revenue-ops/api/mission/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.kpis) return;
        setKpis(data.kpis);
        setLive(true);
      })
      .catch(() => {});
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
      {live && (
        <div className="col-span-full text-right">
          <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
        </div>
      )}
    </div>
  );
}
