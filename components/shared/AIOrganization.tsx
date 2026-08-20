"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowDown,
  BarChart3,
  Bot,
  ChevronDown,
  ChevronRight,
  Code2,
  Cpu,
  Crown,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

interface AgentLayer {
  level: string;
  title: string;
  role: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
  culture: string;
  skills: string[];
  output: string;
}

const LAYERS: AgentLayer[] = [
  {
    level: "L5",
    title: "Executive Governance",
    role: "Strategy, constraints, and approval policy",
    icon: Crown,
    color: "text-purple-400",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/[0.06]",
    culture: "Evidence first. Commercial claims, capital allocation, and release decisions must match observed system state.",
    skills: ["Risk Mitigation", "Capital Allocation", "Business Logic", "Governance"],
    output: "Decision criteria, KPIs, release approval",
  },
  {
    level: "L4",
    title: "Growth & Monetization",
    role: "Offer design, acquisition, and conversion",
    icon: TrendingUp,
    color: "text-kagan-gold",
    borderColor: "border-kagan-gold/40",
    bgColor: "bg-kagan-gold/[0.06]",
    culture: "Conversion work follows product truth: no synthetic proof, fake urgency, or income guarantees.",
    skills: ["CRO", "Outbound Design", "Lead Qualification", "Revenue Measurement"],
    output: "Offer tests, channel plans, pricing hypotheses",
  },
  {
    level: "L3",
    title: "Solution Architecture",
    role: "System boundaries and handoff control",
    icon: Cpu,
    color: "text-blue-400",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/[0.06]",
    culture: "Separate payment, evidence, fulfillment, and AI dependencies so one provider failure cannot invalidate the customer path.",
    skills: ["Systems Architecture", "Data Contracts", "API Modeling", "Failure Design"],
    output: "Technical contracts, schemas, provider boundaries",
  },
  {
    level: "L2",
    title: "Engineering",
    role: "Implementation, tests, and release integrity",
    icon: Code2,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/[0.06]",
    culture: "Critical commerce paths fail closed, preserve provider retries, and are promoted only after build and runtime verification.",
    skills: ["Next.js", "Webhook Safety", "CI/CD", "Observability"],
    output: "Verified source, tests, deployment controls",
  },
  {
    level: "L1",
    title: "Execution Automations",
    role: "Bounded task and notification workflows",
    icon: Bot,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/40",
    bgColor: "bg-cyan-500/[0.06]",
    culture: "Automations are capabilities, not proof of execution. They remain subordinate to permissions, provider health, and explicit evidence.",
    skills: ["Task Routing", "Template Generation", "Notifications", "Queue Processing"],
    output: "Drafts, queued jobs, notifications, evidence events",
  },
];

const HANDOFF_STEPS = [
  {
    from: "L5",
    to: "L4",
    label: "Commercial Constraint",
    description: "Translate business objectives into measurable offer, margin, compliance, and evidence requirements.",
  },
  {
    from: "L4",
    to: "L3",
    label: "Contract Mapping",
    description: "Translate customer and conversion requirements into provider, data, and fulfillment contracts.",
  },
  {
    from: "L3",
    to: "L2",
    label: "Implementation & Tests",
    description: "Implement the contracts with explicit failure behavior and release checks.",
  },
  {
    from: "L2",
    to: "L1",
    label: "Bounded Automation",
    description: "Enable only the jobs whose prerequisites, permissions, and evidence paths are verified.",
  },
];

type PhaseStatus = "in-progress" | "upcoming";
interface SprintPhase {
  phase: number;
  title: string;
  gate: string;
  status: PhaseStatus;
  tasks: string[];
}

const RELEASE_PHASES: SprintPhase[] = [
  {
    phase: 1,
    title: "Canonical Front Door",
    gate: "Infrastructure gate",
    status: "in-progress",
    tasks: [
      "Point aikagan.com and app.aikagan.com at the canonical production runtime",
      "Verify packaged checkout and scoped-service denial on the public host",
      "Configure the complete Paddle credential set on an approved host if Paddle is used",
    ],
  },
  {
    phase: 2,
    title: "Independent Purchase Proof",
    gate: "Commercial proof gate",
    status: "upcoming",
    tasks: [
      "Receive one independent customer payment through the public production path",
      "Verify provider callback → one ledger entry → entitlement → delivery",
      "Verify support/refund behavior and complete Paddle payout review when triggered",
    ],
  },
  {
    phase: 3,
    title: "Scale from Evidence",
    gate: "Growth gate",
    status: "upcoming",
    tasks: [
      "Publish only ledger-backed conversion and customer evidence",
      "Increase organic, partner, and targeted acquisition after fulfillment proof",
      "Add recurring software tiers only after retention and usage behavior are measurable",
    ],
  },
];

const PHASE_STATUS_CONFIG = {
  "in-progress": {
    label: "In Progress",
    border: "border-kagan-gold/40",
    bg: "bg-kagan-gold/[0.04]",
    badge: "bg-kagan-gold/15 text-kagan-gold border-kagan-gold/30",
  },
  upcoming: {
    label: "Blocked by prior gate",
    border: "border-kagan-border",
    bg: "bg-kagan-card/30",
    badge: "bg-kagan-muted/15 text-kagan-muted border-kagan-muted/30",
  },
};

interface LiveMetrics {
  revenue: number;
  leads: number;
  intents: number;
  purchases: number;
  conversionPct: number;
}

export default function AIOrganization() {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(["L5"]));
  const [metrics, setMetrics] = useState<LiveMetrics>({
    revenue: 0,
    leads: 0,
    intents: 0,
    purchases: 0,
    conversionPct: 0,
  });
  const [metricsLive, setMetricsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/income/reality?days=7", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data?.traffic || !data?.revenue) return;
        const conversionPct =
          data.traffic.checkoutIntents > 0
            ? Math.round((data.traffic.purchases / data.traffic.checkoutIntents) * 1000) / 10
            : 0;
        setMetrics({
          revenue: data.revenue.grossUsd,
          leads: data.traffic.leads,
          intents: data.traffic.checkoutIntents,
          purchases: data.traffic.purchases,
          conversionPct,
        });
        setMetricsLive(true);
      })
      .catch(() => {
        if (!cancelled) setMetricsLive(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLayer = useCallback((level: string) => {
    setExpandedLayers((previous) => {
      const next = new Set(previous);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }, []);

  const metricValue = (value: string) => (metricsLive ? value : "—");

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ Operational Evidence ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          Seven-day metrics are shown only when the evidence ledger responds successfully. Unavailable data is never replaced with promotional values.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <MetricTile icon={DollarSign} label="Revenue (7d)" value={metricValue(`$${metrics.revenue.toFixed(2)}`)} accent />
          <MetricTile icon={Users} label="Leads (7d)" value={metricValue(String(metrics.leads))} />
          <MetricTile icon={Zap} label="Intents (7d)" value={metricValue(String(metrics.intents))} />
          <MetricTile icon={Target} label="Purchases (7d)" value={metricValue(String(metrics.purchases))} />
          <MetricTile icon={BarChart3} label="Intent→Sale" value={metricValue(`${metrics.conversionPct.toFixed(1)}%`)} />
        </div>

        <div className="mt-3 text-right">
          {metricsLive ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live · evidence ledger
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Evidence ledger unavailable — no values claimed
            </span>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ Capability Architecture ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          Reference roles and handoff responsibilities. These cards describe system capabilities; they do not assert that autonomous workers are currently executing.
        </p>

        <div className="space-y-0">
          {LAYERS.map((layer, index) => {
            const isExpanded = expandedLayers.has(layer.level);
            const Icon = layer.icon;
            return (
              <div key={layer.level} className="relative">
                {index < LAYERS.length - 1 && (
                  <div className="absolute left-8 top-[72px] bottom-0 w-px bg-gradient-to-b from-kagan-border to-transparent z-0" />
                )}
                <div className={`relative z-10 rounded-xl border ${layer.borderColor} ${layer.bgColor} mb-3 overflow-hidden`}>
                  <button onClick={() => toggleLayer(layer.level)} className="w-full flex items-center gap-4 p-4 text-left cursor-pointer group">
                    <div className={`flex-shrink-0 h-14 w-14 rounded-xl border-2 ${layer.borderColor} flex items-center justify-center ${layer.bgColor}`}>
                      <Icon className={`h-6 w-6 ${layer.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold font-mono ${layer.color}`}>{layer.level}</span>
                        <span className="text-sm font-bold text-kagan-white truncate">{layer.title}</span>
                      </div>
                      <p className="text-xs text-kagan-muted truncate">{layer.role}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium bg-kagan-muted/10 text-kagan-muted px-2.5 py-1 rounded-full border border-kagan-muted/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-kagan-muted" />
                      Capability map
                    </div>
                    <div className="flex-shrink-0 text-kagan-muted">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-kagan-border/30">
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-kagan-gold uppercase tracking-wider">Operating principle</h4>
                          <p className="text-xs text-kagan-light leading-relaxed">{layer.culture}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-kagan-gold uppercase tracking-wider">Capability set</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {layer.skills.map((skill) => (
                              <span key={skill} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${layer.borderColor} ${layer.color}`}>{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-kagan-gold uppercase tracking-wider">Expected output</h4>
                          <p className="text-xs text-kagan-light leading-relaxed">{layer.output}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ Reference Handoff Protocol ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          Intended flow between capability layers. Execution is considered real only when a corresponding event, artifact, or deployment is evidenced.
        </p>
        <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6">
          <div className="space-y-0">
            {HANDOFF_STEPS.map((step, index) => (
              <div key={`${step.from}-${step.to}`} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <span className="text-[10px] font-bold font-mono text-kagan-gold bg-kagan-gold/10 rounded-md px-2 py-0.5 border border-kagan-gold/30">{step.from}</span>
                    <ArrowDown className="h-4 w-4 text-kagan-gold/40 my-1" />
                    <span className="text-[10px] font-bold font-mono text-kagan-gold bg-kagan-gold/10 rounded-md px-2 py-0.5 border border-kagan-gold/30">{step.to}</span>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-3.5 w-3.5 text-kagan-gold" />
                      <span className="text-sm font-bold text-kagan-white">{step.label}</span>
                    </div>
                    <p className="text-xs text-kagan-light leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < HANDOFF_STEPS.length - 1 && <div className="border-b border-dashed border-kagan-border/40 mb-4 ml-12" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ Revenue-System Release Gates ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          Progress is evidence-gated rather than date-gated. A later phase cannot be marked complete because time elapsed.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {RELEASE_PHASES.map((phase) => {
            const config = PHASE_STATUS_CONFIG[phase.status];
            return (
              <div key={phase.phase} className={`rounded-xl border ${config.border} ${config.bg} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-kagan-muted">Gate {phase.phase}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${config.badge}`}>{config.label}</span>
                </div>
                <h3 className="text-sm font-bold text-kagan-white mb-1">{phase.title}</h3>
                <p className="text-[10px] text-kagan-muted font-mono mb-3">{phase.gate}</p>
                <ul className="space-y-2">
                  {phase.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2 text-xs text-kagan-light leading-relaxed">
                      <span className="flex-shrink-0 h-1 w-1 rounded-full bg-kagan-gold/60 mt-1.5" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-4 text-center">
      <Icon className={`h-4 w-4 mx-auto mb-2 ${accent ? "text-kagan-gold" : "text-kagan-muted"}`} />
      <div className={`text-lg font-bold font-mono mb-0.5 ${accent ? "text-kagan-gold" : "text-kagan-white"}`}>{value}</div>
      <div className="text-[10px] text-kagan-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}
