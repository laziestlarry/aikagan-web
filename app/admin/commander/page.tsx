"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Sparkles, 
  Workflow, 
  TrendingUp, 
  Compass, 
  Lock, 
  ExternalLink,
  Layers,
  Terminal,
  FileText
} from "lucide-react";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import { CommandDashboard } from "@/components/commander/CommandDashboard";
import { BlueprintGenerator } from "@/components/commander/BlueprintGenerator";
import { OperationalWorkflows } from "@/components/commander/OperationalWorkflows";
import { MetricsMonitor } from "@/components/commander/MetricsMonitor";
import { FulfillmentHub } from "@/components/commander/FulfillmentHub";
import { MarketIntelligence } from "@/components/commander/MarketIntelligence";
import { 
  MakeScenario, 
  ActivityLog, 
  BlueprintResponse, 
  TenantWorkspace, 
  UserRole, 
  CurrencySymbol 
} from "@/types/commander";

const INITIAL_TENANTS: TenantWorkspace[] = [
  {
    id: "tenant-autonomax-01",
    name: "AutonomaX Enterprise",
    role: "Admin",
    currency: "$",
    customDomain: "app.autonomax.io",
    whiteLabelEnabled: true,
    operatorName: "Kagan Dolek",
    operatorEmail: "lazylarries@gmail.com"
  },
  {
    id: "tenant-apex-02",
    name: "Apex Growth Partners",
    role: "Operator",
    currency: "€",
    customDomain: "apex.growthpartners.eu",
    whiteLabelEnabled: true,
    operatorName: "Alexander Vance",
    operatorEmail: "alex@apex.eu"
  },
  {
    id: "tenant-global-03",
    name: "Global Digital Ventures",
    role: "Client",
    currency: "£",
    customDomain: "client.globalventures.co.uk",
    whiteLabelEnabled: false,
    operatorName: "Eleanor Sterling",
    operatorEmail: "e.sterling@globalventures.co.uk"
  }
];

const INITIAL_SCENARIOS: MakeScenario[] = [
  {
    id: "agency_onboarding",
    name: "Agency Client Onboarding Bot",
    commercialValue: "HIGH",
    description: "Form submissions initiate automatic workspace provisioning, contract deliveries, and Slack setups.",
    status: "active",
    runsCount: 14
  },
  {
    id: "competitor_analysis",
    name: "Competitor Analysis Bot",
    commercialValue: "HIGH",
    description: "Pulls competitors' content hooks, newsletters, and social adjustments into dynamic planning sheets.",
    status: "active",
    runsCount: 28
  },
  {
    id: "email_responder",
    name: "Email Autoresponder Bot",
    commercialValue: "HIGH",
    description: "Synthesizes inbound queries and routes tailored agency offers to potential leads within 5 minutes.",
    status: "active",
    runsCount: 19
  },
  {
    id: "linkedin_poster",
    name: "LinkedIn Viral Poster Bot",
    commercialValue: "HIGH",
    description: "Syndicates core frameworks across operator accounts to generate compounding inbound streams.",
    status: "active",
    runsCount: 42
  },
  {
    id: "seo_writer",
    name: "SEO Blog Writer Bot",
    commercialValue: "HIGH",
    description: "Synthesizes detailed keyword lists and publishes optimized thought leadership articles.",
    status: "active",
    runsCount: 9
  },
  {
    id: "customer_router",
    name: "Customer Success Router",
    commercialValue: "MEDIUM-HIGH",
    description: "Categorizes user tickets and routes priority high-ticket customers directly to operational support.",
    status: "inactive",
    runsCount: 0
  },
  {
    id: "omnichannel_router",
    name: "Omnichannel Router",
    commercialValue: "STRATEGIC",
    description: "Bridges multi-channel messaging endpoints into a single command view.",
    status: "inactive",
    runsCount: 0
  },
  {
    id: "purchase_delivery",
    name: "Purchase Delivery Router",
    commercialValue: "FOUNDATIONAL",
    description: "Triggers e-commerce product downloads, access allocations, and registers customer profiles.",
    status: "active",
    runsCount: 56
  }
];

export default function CommanderPage() {
  const [activeTab, setActiveTab] = useState<'command' | 'blueprinter' | 'workflows' | 'metrics' | 'fulfillment' | 'intelligence'>('command');
  const [scenarios, setScenarios] = useState<MakeScenario[]>(INITIAL_SCENARIOS);
  const [activeLogs, setActiveLogs] = useState<ActivityLog[]>([]);
  const [activeBlueprint, setActiveBlueprint] = useState<BlueprintResponse | null>(null);
  const [tenant, setTenant] = useState<TenantWorkspace>(INITIAL_TENANTS[0]);

  const handleSelectTenant = (tenantId: string) => {
    const selected = INITIAL_TENANTS.find(t => t.id === tenantId);
    if (selected) {
      setTenant(selected);
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentId: "security_lead",
        agentName: "Security Lead",
        message: `[MULTI-TENANT SWITCH] Active Organization Workspace changed to "${selected.name}" (${selected.id}). Role permissions updated to [${selected.role}].`,
        type: "info"
      };
      setActiveLogs(prev => [...prev, newLog]);
    }
  };

  const handleChangeRole = (role: UserRole) => {
    setTenant(prev => ({ ...prev, role }));
  };

  const handleChangeCurrency = (currency: CurrencySymbol) => {
    setTenant(prev => ({ ...prev, currency }));
  };
  
  const [metrics, setMetrics] = useState({
    totalRevenue: 14240,
    tasksCompleted: 0,
    scenarioRuns: 168,
    conversionRate: 3.28,
    projectedMonth1: 2450,
    projectedMonth2: 5800,
    projectedMonth3: 12400
  });

  const handleTaskCompleted = (taskOutput: any) => {
    setMetrics(prev => ({
      ...prev,
      tasksCompleted: Math.min(5, prev.tasksCompleted + 1),
      totalRevenue: prev.totalRevenue + taskOutput.revenueIncrement,
      conversionRate: Number((prev.conversionRate + 0.15).toFixed(2))
    }));
  };

  const handleWorkflowRun = (scenarioId: string, runOutput: any) => {
    const impact = runOutput.revenueImpact || 0;
    const runName = runOutput.name || `Scenario: ${scenarioId}`;

    setMetrics(prev => ({
      ...prev,
      scenarioRuns: prev.scenarioRuns + 1,
      totalRevenue: prev.totalRevenue + impact
    }));

    const timestamp = new Date().toLocaleTimeString();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp,
      agentId: "automation_lead",
      agentName: "Automation Lead",
      message: `[ROUTER ACTION] Triggered live run for: "${runName}". Network state validated. Financial impact: +$${impact}`,
      type: "success"
    };
    setActiveLogs(prev => [...prev, newLog]);
  };

  const handleBlueprintGenerated = (data: BlueprintResponse) => {
    setActiveBlueprint(data);
    setMetrics(prev => ({
      ...prev,
      projectedMonth1: data.estimatedRevenues.month1,
      projectedMonth2: data.estimatedRevenues.month2,
      projectedMonth3: data.estimatedRevenues.month3,
      conversionRate: data.estimatedRevenues.conversionRate
    }));

    const timestamp = new Date().toLocaleTimeString();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp,
      agentId: "commander",
      agentName: "Commander-1",
      message: `[BLUEPRINT GENERATED] Successfully mapped customized venture structures. Verified conversion target: ${data.estimatedRevenues.conversionRate}%`,
      type: "success"
    };
    setActiveLogs(prev => [...prev, newLog]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E0E0E6] flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-400" id="app-root">
      <header className="h-16 border-b border-white/10 bg-[#0F0F12] px-6 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center font-bold text-black text-xs">AK</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-widest uppercase text-white">AIKAGAN</span>
              <span className="text-[9px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono px-1.5 py-0.5 rounded-sm">
                WHITE-LABEL: ACTIVE
              </span>
            </div>
            <span className="text-[10px] text-cyan-500 font-mono tracking-tight">COMMANDER v2.4 // PRODUCTION READY</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-2 bg-[#0A0A0C] border border-white/10 px-3 py-1.5 rounded-sm">
            <span className="text-[10px] uppercase text-white/40 tracking-wider">Tenant:</span>
            <select
              value={tenant.id}
              onChange={(e) => handleSelectTenant(e.target.value)}
              className="bg-transparent text-white font-bold font-mono outline-none cursor-pointer text-xs"
            >
              {INITIAL_TENANTS.map(t => (
                <option key={t.id} value={t.id} className="bg-[#0F0F12] text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#0A0A0C] border border-white/10 px-2.5 py-1.5 rounded-sm">
            <span className="text-[10px] uppercase text-white/40 tracking-wider">Role:</span>
            {(['Admin', 'Operator', 'Client'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => handleChangeRole(r)}
                className={`px-1.5 py-0.5 text-[9px] rounded-sm uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tenant.role === r ? "bg-cyan-500 text-black" : "text-white/40 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#0A0A0C] border border-white/10 px-2 py-1.5 rounded-sm">
            {(['$', '€', '£'] as CurrencySymbol[]).map(c => (
              <button
                key={c}
                onClick={() => handleChangeCurrency(c)}
                className={`w-5 h-5 flex items-center justify-center text-[10px] rounded-sm font-bold transition-all cursor-pointer ${
                  tenant.currency === c ? "bg-white/20 text-cyan-400" : "text-white/40 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-6 items-center border-l border-white/10 pl-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase text-white/40 tracking-tighter">Verified Cash</span>
              <span className="text-xs font-mono text-cyan-400 font-bold">{tenant.currency}{metrics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] uppercase text-white/40 tracking-tighter">Automations</span>
              <span className="text-xs font-mono text-green-400">{metrics.scenarioRuns} Runs</span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#0F0F12]/60 border-b border-white/5 px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('command')}
            className={`px-4 py-2 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer border rounded-sm ${
              activeTab === 'command' ? "bg-cyan-500 text-black font-bold border-cyan-400" : "text-white/60 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            // AI Command Center
          </button>

          <button
            onClick={() => setActiveTab('blueprinter')}
            className={`px-4 py-2 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer border rounded-sm ${
              activeTab === 'blueprinter' ? "bg-cyan-500 text-black font-bold border-cyan-400" : "text-white/60 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            // Venture Blueprinter
          </button>

          <button
            onClick={() => setActiveTab('workflows')}
            className={`px-4 py-2 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer border rounded-sm ${
              activeTab === 'workflows' ? "bg-cyan-500 text-black font-bold border-cyan-400" : "text-white/60 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            // Make.com Workflows
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer border rounded-sm ${
              activeTab === 'metrics' ? "bg-cyan-500 text-black font-bold border-cyan-400" : "text-white/60 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            // Outcome Cockpit
          </button>

          <button
            onClick={() => setActiveTab('fulfillment')}
            className={`px-4 py-2 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer border rounded-sm ${
              activeTab === 'fulfillment' ? "bg-cyan-500 text-black font-bold border-cyan-400" : "text-white/60 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            // Fulfillment Hub
          </button>

          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-4 py-2 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer border rounded-sm ${
              activeTab === 'intelligence' ? "bg-cyan-500 text-black font-bold border-cyan-400" : "text-white/60 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            // Venture Dominance
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        {activeTab === 'command' && (
          <CommandDashboard 
            onTaskCompleted={handleTaskCompleted}
            activeLogs={activeLogs}
            setActiveLogs={setActiveLogs}
          />
        )}

        {activeTab === 'blueprinter' && (
          <BlueprintGenerator 
            onBlueprintGenerated={handleBlueprintGenerated}
          />
        )}

        {activeTab === 'workflows' && (
          <OperationalWorkflows 
            onWorkflowRun={handleWorkflowRun}
            scenarios={scenarios}
            setScenarios={setScenarios}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsMonitor 
            metrics={metrics}
          />
        )}

        {activeTab === 'fulfillment' && (
          <FulfillmentHub 
            metrics={metrics}
            onWorkflowRun={handleWorkflowRun}
            onTaskCompleted={handleTaskCompleted}
            activeBlueprint={activeBlueprint}
            tenant={tenant}
          />
        )}

        {activeTab === 'intelligence' && (
          <MarketIntelligence 
            metrics={metrics}
            onTaskCompleted={handleTaskCompleted}
          />
        )}
      </main>

      <footer className="h-10 bg-black border-t border-white/10 flex items-center justify-between px-8">
        <div className="w-full flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-white/60 uppercase tracking-widest">Autonomax Engine: ONLINE</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-white/40 uppercase">Azure Cloud Tunnel:</span>
              <span className="text-cyan-500">ESTABLISHED</span>
            </div>
          </div>
          <div className="text-white/20">
            © 2026 AIKAGAN VENTURE ECOSYSTEM // SECURE SHELL SESSION v4.11.0
          </div>
        </div>
      </footer>
    </div>
  );
}
