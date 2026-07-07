"use client";

import { useEffect, useState } from "react";

/* ───────────────────────────────────────────────────────────────────────────
 * CRMPipeline — Live CRM metrics from the FastAPI backend
 *
 * Shows contact count, leads, opportunities, and pipeline value.
 * Displayed as a supplementary KPI section on the mission-control page.
 * ─────────────────────────────────────────────────────────────────────────── */

interface CRMStats {
  total_contacts: number;
  total_leads: number;
  qualified_leads: number;
  total_opportunities: number;
  pipeline_value: number;
  weighted_pipeline: number;
}

const FALLBACK: CRMStats = {
  total_contacts: 0,
  total_leads: 0,
  qualified_leads: 0,
  total_opportunities: 0,
  pipeline_value: 0,
  weighted_pipeline: 0,
};

export default function CRMPipeline() {
  const [stats, setStats] = useState<CRMStats>(FALLBACK);
  const [live, setLive] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/services/crm/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setOffline(true);
          return;
        }
        setStats({
          total_contacts: data.total_contacts ?? 0,
          total_leads: data.total_leads ?? 0,
          qualified_leads: data.qualified_leads ?? 0,
          total_opportunities: data.total_opportunities ?? 0,
          pipeline_value: data.pipeline_value ?? 0,
          weighted_pipeline: data.weighted_pipeline ?? 0,
        });
        setLive(true);
        setOffline(false);
      })
      .catch(() => {
        if (!cancelled) setOffline(true);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 mb-8">
      <h3 className="text-sm font-bold tracking-[0.15em] text-kagan-gold mb-4 uppercase">
        ⚜ CRM Pipeline — Live Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard label="Contacts" value={stats.total_contacts.toLocaleString()} />
        <MetricCard label="Leads" value={stats.total_leads.toLocaleString()} />
        <MetricCard label="Qualified Leads" value={stats.qualified_leads.toLocaleString()} />
        <MetricCard label="Opportunities" value={stats.total_opportunities.toLocaleString()} />
        <MetricCard
          label="Pipeline Value"
          value={`$${stats.pipeline_value.toLocaleString()}`}
        />
        <MetricCard
          label="Weighted Pipeline"
          value={`$${stats.weighted_pipeline.toLocaleString()}`}
          accent
        />
      </div>
      <div className="mt-3 text-right">
        {live && (
          <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live
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

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-kagan-border/50 bg-kagan-black/40 p-4 text-center">
      <div
        className={`text-xl font-bold font-mono ${
          accent ? "text-kagan-gold" : "text-kagan-white"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-kagan-muted mt-1">{label}</div>
    </div>
  );
}
