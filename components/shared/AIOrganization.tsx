"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Crown,
  TrendingUp,
  Cpu,
  Code2,
  Bot,
  ChevronDown,
  ChevronRight,
  Activity,
  Zap,
  ArrowDown,
  Target,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
 * AIOrganization — Hierarchical Command Architecture & Live Ops Monitor
 *
 * Renders the full L5→L1 agent hierarchy with mastery profiles, live KPIs
 * from the evidence ledger, and a visual handoff flow. Designed to match
 * the AIKAGAN gold/dark design system.
 * ─────────────────────────────────────────────────────────────────────────── */

// ── Agent Layer Definitions ──────────────────────────────────────────────

interface AgentLayer {
  level: string;
  title: string;
  role: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
  status: "active" | "scoping" | "standby";
  culture: string;
  skills: string[];
  output: string;
}

const LAYERS: AgentLayer[] = [
  {
    level: "L5",
    title: "Chief Executive Officer",
    role: "Strategic Governance & Vision",
    icon: Crown,
    color: "text-purple-400",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/[0.06]",
    status: "active",
    culture:
      "Decisive, data-driven, protective of margins. Uses Blue Ocean Strategy and Porter's Five Forces to locate open market space.",
    skills: [
      "Risk Mitigation",
      "Capital Allocation",
      "Business Logic",
      "System Orchestration",
    ],
    output: "Strategic mandates, KPIs, architectural approval",
  },
  {
    level: "L4",
    title: "VP of Growth & Monetization",
    role: "Revenue Engine & Conversion",
    icon: TrendingUp,
    color: "text-kagan-gold",
    borderColor: "border-kagan-gold/40",
    bgColor: "bg-kagan-gold/[0.06]",
    status: "active",
    culture:
      "Aggressive, analytical, highly structured. Converts tech features into clear consumer benefits using AIDA framework.",
    skills: [
      "CRO",
      "Outbound Automation",
      "B2B Lead Gen",
      "Revenue Tracking",
    ],
    output: "Copy templates, marketing playbooks, pricing models",
  },
  {
    level: "L3",
    title: "Solution Architect",
    role: "System Design & Handoff Control",
    icon: Cpu,
    color: "text-blue-400",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/[0.06]",
    status: "active",
    culture:
      "Methodical, structured, focused on clean separation of concerns. Prioritizes local-first validation before cloud deployment.",
    skills: [
      "Systems Architecture",
      "DB Schema Design",
      "API Modeling",
      "Firebase / GCP",
    ],
    output: "Technical blueprints, ERDs, handoff packages",
  },
  {
    level: "L2",
    title: "Lead Developer",
    role: "Code Automation & Integrity",
    icon: Code2,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/[0.06]",
    status: "active",
    culture:
      "Pragmatic, precision-oriented. Adheres to clean code, robust error handling, minimal asset overhead.",
    skills: [
      "Python Backend",
      "Next.js",
      "Docker",
      "Automation Scripts",
    ],
    output: "Verified source code, PRs, test scripts, deployment configs",
  },
  {
    level: "L1",
    title: "Production Agents",
    role: "Execution & Autonomous Automation",
    icon: Bot,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/40",
    bgColor: "bg-cyan-500/[0.06]",
    status: "active",
    culture:
      "Lightweight, task-focused, highly efficient. Designed for continuous pipeline execution within strict constraints.",
    skills: [
      "Web Scraping",
      "Job Feed Processing",
      "Template Generation",
      "Email Triggers",
    ],
    output: "Lead lists, draft responses, automated notifications",
  },
];

const STATUS_CONFIG = {
  active: {
    label: "Active",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  scoping: {
    label: "Scoping",
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  standby: {
    label: "Standby",
    dot: "bg-kagan-muted",
    text: "text-kagan-muted",
    bg: "bg-kagan-muted/10",
  },
};

// ── Handoff Protocol Steps ───────────────────────────────────────────────

const HANDOFF_STEPS = [
  {
    from: "L5",
    to: "L4",
    label: "AIDA Validation",
    description:
      "Strategic mandates validated through Attention-Interest-Desire-Action framework",
  },
  {
    from: "L4",
    to: "L3",
    label: "Schema & API Mapping",
    description:
      "Conversion requirements translated into technical architecture specifications",
  },
  {
    from: "L3",
    to: "L2",
    label: "Functional Code & Tests",
    description:
      "Technical blueprints realized as production code with unit test coverage",
  },
  {
    from: "L2",
    to: "L1",
    label: "Pipeline Deployment",
    description:
      "Verified code deployed to autonomous agents for continuous execution",
  },
];

// ── Track A Sprint Phases ────────────────────────────────────────────────

interface SprintPhase {
  phase: number;
  title: string;
  days: string;
  status: "completed" | "in-progress" | "upcoming";
  tasks: string[];
}

function getSprintPhases(): SprintPhase[] {
  const daysSinceLaunch = Math.floor(
    (Date.now() - new Date("2026-07-08").getTime()) / (1000 * 60 * 60 * 24)
  );

  return [
    {
      phase: 1,
      title: "Endpoint Integration & Verification",
      days: "Days 1–7",
      status: daysSinceLaunch >= 7 ? "completed" : daysSinceLaunch >= 1 ? "in-progress" : "upcoming",
      tasks: [
        "Map aikagan.com + app.aikagan.com to unified Firebase hosting",
        "Audit FastAPI backend on Cloud Run for CORS compliance",
        "Centralize environment variables across all instances",
      ],
    },
    {
      phase: 2,
      title: "Productization & Conversion Setup",
      days: "Days 8–14",
      status: daysSinceLaunch >= 14 ? "completed" : daysSinceLaunch >= 8 ? "in-progress" : "upcoming",
      tasks: [
        "Launch intake portal for founder idea submissions",
        "Connect automated output engine for business plan generation",
        "Activate Paddle/LS live billing webhooks for premium tiers",
      ],
    },
    {
      phase: 3,
      title: "Go-to-Market Execution",
      days: "Days 15–30",
      status: daysSinceLaunch >= 30 ? "completed" : daysSinceLaunch >= 15 ? "in-progress" : "upcoming",
      tasks: [
        "Deploy automated response workflows for prospective clients",
        "Connect job scanning scripts for high-intent lead filtering",
        "Monitor daily conversions, optimize landing page performance",
      ],
    },
  ];
}

const PHASE_STATUS_CONFIG = {
  completed: {
    label: "Completed",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/[0.04]",
    badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  },
  "in-progress": {
    label: "In Progress",
    border: "border-kagan-gold/40",
    bg: "bg-kagan-gold/[0.04]",
    badge: "bg-kagan-gold/15 text-kagan-gold border-kagan-gold/30",
  },
  upcoming: {
    label: "Upcoming",
    border: "border-kagan-border",
    bg: "bg-kagan-card/30",
    badge: "bg-kagan-muted/15 text-kagan-muted border-kagan-muted/30",
  },
};

// ── Live Metrics Interface ───────────────────────────────────────────────

interface LiveMetrics {
  revenue: number;
  leads: number;
  intents: number;
  purchases: number;
  conversionPct: number;
}

// ── Component ────────────────────────────────────────────────────────────

export default function AIOrganization() {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(
    new Set(["L5"])
  );
  const [metrics, setMetrics] = useState<LiveMetrics>({
    revenue: 0,
    leads: 0,
    intents: 0,
    purchases: 0,
    conversionPct: 0,
  });
  const [metricsLive, setMetricsLive] = useState(false);
  const [sprintPhases] = useState<SprintPhase[]>(getSprintPhases);

  // Fetch live metrics from the income evidence ledger
  useEffect(() => {
    let cancelled = false;

    fetch("/api/income/reality?days=7", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.traffic || !data?.revenue) return;
        const convPct =
          data.traffic.checkoutIntents > 0
            ? Math.round(
                (data.traffic.purchases / data.traffic.checkoutIntents) * 1000
              ) / 10
            : 0;
        setMetrics({
          revenue: data.revenue.grossUsd,
          leads: data.traffic.leads,
          intents: data.traffic.checkoutIntents,
          purchases: data.traffic.purchases,
          conversionPct: convPct,
        });
        setMetricsLive(true);
      })
      .catch(() => {
        /* offline — use fallback zeros */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLayer = useCallback((level: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* ── Section: Live Revenue Metrics ─────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ Operational Control Room ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          Real-time mission metrics from the evidence ledger. These are ground
          truth — zero synthetic numbers.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <MetricTile
            icon={DollarSign}
            label="Revenue (7d)"
            value={`$${metrics.revenue.toFixed(2)}`}
            accent
          />
          <MetricTile
            icon={Users}
            label="Leads (7d)"
            value={String(metrics.leads)}
          />
          <MetricTile
            icon={Zap}
            label="Intents (7d)"
            value={String(metrics.intents)}
          />
          <MetricTile
            icon={Target}
            label="Purchases (7d)"
            value={String(metrics.purchases)}
          />
          <MetricTile
            icon={BarChart3}
            label="Intent→Sale"
            value={`${metrics.conversionPct.toFixed(1)}%`}
          />
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
              Offline — showing fallback
            </span>
          )}
        </div>
      </div>

      {/* ── Section: Command Hierarchy ────────────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ Command Architecture — Agent Hierarchy ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          Five-layer organization from strategic governance to autonomous
          production. Click any layer to inspect mastery profiles.
        </p>

        <div className="space-y-0">
          {LAYERS.map((layer, i) => {
            const isExpanded = expandedLayers.has(layer.level);
            const Icon = layer.icon;
            const status = STATUS_CONFIG[layer.status];

            return (
              <div key={layer.level} className="relative">
                {/* Connector line between layers */}
                {i < LAYERS.length - 1 && (
                  <div className="absolute left-8 top-[72px] bottom-0 w-px bg-gradient-to-b from-kagan-border to-transparent z-0" />
                )}

                {/* Layer card */}
                <div
                  className={`relative z-10 rounded-xl border ${layer.borderColor} ${layer.bgColor} mb-3 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-kagan-gold/[0.03]`}
                >
                  {/* Header — always visible */}
                  <button
                    onClick={() => toggleLayer(layer.level)}
                    className="w-full flex items-center gap-4 p-4 text-left cursor-pointer group"
                  >
                    {/* Level badge */}
                    <div
                      className={`flex-shrink-0 h-14 w-14 rounded-xl border-2 ${layer.borderColor} flex items-center justify-center ${layer.bgColor} transition-all group-hover:scale-105`}
                    >
                      <Icon className={`h-6 w-6 ${layer.color}`} />
                    </div>

                    {/* Title & role */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-xs font-bold font-mono ${layer.color}`}
                        >
                          {layer.level}
                        </span>
                        <span className="text-sm font-bold text-kagan-white truncate">
                          {layer.title}
                        </span>
                      </div>
                      <p className="text-xs text-kagan-muted truncate">
                        {layer.role}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${status.bg} ${status.text} px-2.5 py-1 rounded-full border border-current/20`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dot} ${layer.status === "active" ? "animate-pulse" : ""}`}
                      />
                      {status.label}
                    </div>

                    {/* Expand indicator */}
                    <div className="flex-shrink-0 text-kagan-muted group-hover:text-kagan-light transition-colors">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-kagan-border/30 animate-fade-in">
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        {/* Culture & Profile */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-kagan-gold uppercase tracking-wider">
                            Culture & Profile
                          </h4>
                          <p className="text-xs text-kagan-light leading-relaxed">
                            {layer.culture}
                          </p>
                        </div>

                        {/* Core Skills */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-kagan-gold uppercase tracking-wider">
                            Core Skillset
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {layer.skills.map((skill) => (
                              <span
                                key={skill}
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${layer.borderColor} ${layer.color}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Primary Output */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-kagan-gold uppercase tracking-wider">
                            Primary Output
                          </h4>
                          <p className="text-xs text-kagan-light leading-relaxed">
                            {layer.output}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: Session Handoff Protocol ─────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ End-to-End Session Handoff Protocol ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          Structured data flow between agent levels. Each handoff includes
          explicit verification before execution begins.
        </p>

        <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-6">
          <div className="space-y-0">
            {HANDOFF_STEPS.map((step, i) => (
              <div key={`${step.from}-${step.to}`} className="relative">
                <div className="flex items-start gap-4">
                  {/* From/To badge */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <span className="text-[10px] font-bold font-mono text-kagan-gold bg-kagan-gold/10 rounded-md px-2 py-0.5 border border-kagan-gold/30">
                      {step.from}
                    </span>
                    <ArrowDown className="h-4 w-4 text-kagan-gold/40 my-1" />
                    <span className="text-[10px] font-bold font-mono text-kagan-gold bg-kagan-gold/10 rounded-md px-2 py-0.5 border border-kagan-gold/30">
                      {step.to}
                    </span>
                  </div>

                  {/* Label & description */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-3.5 w-3.5 text-kagan-gold" />
                      <span className="text-sm font-bold text-kagan-white">
                        {step.label}
                      </span>
                    </div>
                    <p className="text-xs text-kagan-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Separator */}
                {i < HANDOFF_STEPS.length - 1 && (
                  <div className="border-b border-dashed border-kagan-border/40 mb-4 ml-12" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section: Track A Sprint Execution ─────────────────────────── */}
      <div>
        <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-2 uppercase">
          ⚜ Track A — 14–30 Day Strategic Execution ⚜
        </h2>
        <p className="text-center text-xs text-kagan-light mb-6 max-w-xl mx-auto">
          The roadmap to activated selling. Three phases merging existing
          endpoints into a unified revenue machine.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {sprintPhases.map((phase) => {
            const cfg = PHASE_STATUS_CONFIG[phase.status];
            return (
              <div
                key={phase.phase}
                className={`rounded-xl border ${cfg.border} ${cfg.bg} p-5 transition-all hover:shadow-lg hover:shadow-kagan-gold/[0.03]`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono text-kagan-muted">
                    Phase {phase.phase}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}
                  >
                    {cfg.label}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-kagan-white mb-1">
                  {phase.title}
                </h3>
                <p className="text-[10px] text-kagan-muted font-mono mb-3">
                  {phase.days}
                </p>

                <ul className="space-y-2">
                  {phase.tasks.map((task, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-kagan-light leading-relaxed"
                    >
                      <span className="flex-shrink-0 h-1 w-1 rounded-full bg-kagan-gold/60 mt-1.5" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────

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
      <Icon
        className={`h-4 w-4 mx-auto mb-2 ${accent ? "text-kagan-gold" : "text-kagan-muted"}`}
      />
      <div
        className={`text-lg font-bold font-mono mb-0.5 ${accent ? "text-kagan-gold" : "text-kagan-white"}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-kagan-muted uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
