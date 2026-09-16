/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Workflow, 
  Play, 
  Activity, 
  Layers, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight,
  Database,
  Mail,
  Share2,
  FileText,
  AlertCircle
} from "lucide-react";
import { MakeScenario } from "@/types/commander";
import { safeDispatchWorkflowRun } from "@/lib/commander-resilience";

interface OperationalWorkflowsProps {
  onWorkflowRun: (scenarioId: string, runOutput: any) => void;
  scenarios: MakeScenario[];
  setScenarios: React.Dispatch<React.SetStateAction<MakeScenario[]>>;
}

export const OperationalWorkflows: React.FC<OperationalWorkflowsProps> = ({ 
  onWorkflowRun, 
  scenarios, 
  setScenarios 
}) => {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<number>(-1);
  const [activeScenario, setActiveScenario] = useState<MakeScenario | null>(scenarios[0]);

  const triggerScenario = async (id: string) => {
    if (runningId) return;
    setRunningId(id);
    
    // Node step-by-step animation sequences
    setCurrentNode(0);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentNode(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentNode(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentNode(3);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Complete
    setScenarios(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          runsCount: s.runsCount + 1,
          lastRun: new Date().toLocaleTimeString(),
          status: 'active'
        };
      }
      return s;
    }));

    const scenario = scenarios.find(s => s.id === id);
    if (scenario) {
      // Notify parent to add logs & update revenues safely via microtask
      safeDispatchWorkflowRun(onWorkflowRun, id, {
        name: scenario.name,
        revenueImpact: scenario.commercialValue === 'HIGH' ? 299 : scenario.commercialValue === 'MEDIUM-HIGH' ? 149 : 49
      });
    }

    setRunningId(null);
    setCurrentNode(-1);
  };

  const getCommercialValueBadge = (val: MakeScenario['commercialValue']) => {
    switch (val) {
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      case 'MEDIUM-HIGH':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20';
      case 'STRATEGIC':
        return 'bg-white/10 text-white/80 border-white/15';
      case 'FOUNDATIONAL':
        return 'bg-green-500/15 text-green-400 border-green-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="workflows-grid">
      {/* Scenario List */}
      <div className="lg:col-span-5 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl flex flex-col" id="scenarios-list-card">
        <div className="border-b border-white/10 pb-4 mb-5">
          <h2 className="text-sm font-light uppercase tracking-wide text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-500"></span>
            Make.com Scenario Inventory
          </h2>
          <p className="text-[11px] text-white/40 font-mono mt-1">Commercial automation routes deployed in AutonomaX</p>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1.5 scrollbar-thin" id="scenarios-scroller">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => setActiveScenario(scenario)}
              className={`p-4 rounded-sm border text-left cursor-pointer transition-all ${
                activeScenario?.id === scenario.id
                  ? 'bg-white/[0.04] border-cyan-500'
                  : 'bg-transparent border-white/5 hover:border-white/15'
              }`}
              id={`scenario-item-${scenario.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-white/90 text-xs">{scenario.name}</h4>
                  <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{scenario.description}</p>
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm border ${getCommercialValueBadge(scenario.commercialValue)}`}>
                  {scenario.commercialValue}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 mt-3 pt-3 text-[10px] font-mono text-white/40">
                <div className="flex gap-4">
                  <span>Runs: <b className="text-white/70">{scenario.runsCount}</b></span>
                  {scenario.lastRun && (
                    <span>Last Active: <b className="text-white/70">{scenario.lastRun}</b></span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerScenario(scenario.id);
                  }}
                  disabled={runningId !== null}
                  className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-sm font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  id={`btn-run-scenario-${scenario.id}`}
                >
                  <Play className="h-2.5 w-2.5" />
                  Trigger Run
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node flow diagram visualization */}
      <div className="lg:col-span-7 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl flex flex-col justify-between" id="diagram-card">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <h2 className="text-sm font-light uppercase tracking-wide text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500"></span>
                Active Node Router Flow
              </h2>
              <p className="text-[11px] text-white/40 font-mono mt-1">Live visualization of data packet transfers</p>
            </div>
            {activeScenario && (
              <span className="text-[10px] font-mono bg-white/5 border border-white/10 text-white/80 px-2.5 py-1 rounded-sm">
                Active: {activeScenario.name}
              </span>
            )}
          </div>

          {activeScenario ? (
            <div className="space-y-12 py-6 relative" id="diagram-flow-container">
              {/* Connector line behind nodes */}
              <div className="absolute left-[27px] top-12 bottom-12 w-px bg-white/10" />

              {/* Dynamic node animations */}
              <div className="space-y-8" id="nodes-scroller">
                {/* Node 1: Trigger webhook */}
                <div className={`flex items-center gap-4 transition-all duration-300 ${currentNode >= 0 ? 'opacity-100' : 'opacity-40'}`} id="node-1">
                  <div className={`w-14 h-14 rounded-sm border flex items-center justify-center transition-all ${
                    currentNode === 0 
                      ? 'bg-cyan-500/[0.05] border-cyan-500' 
                      : currentNode > 0
                      ? 'bg-green-500/[0.03] border-green-500/30'
                      : 'bg-[#0A0A0C] border-white/10'
                  }`}>
                    <Database className={`h-5 w-5 ${currentNode === 0 ? 'text-cyan-400 animate-pulse' : currentNode > 0 ? 'text-green-400' : 'text-white/30'}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90">1. Trigger Webhook Event</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">Captures form input or API payloads automatically.</p>
                  </div>
                </div>

                {/* Node 2: Logic Router */}
                <div className={`flex items-center gap-4 transition-all duration-300 ${currentNode >= 1 ? 'opacity-100' : 'opacity-40'}`} id="node-2">
                  <div className={`w-14 h-14 rounded-sm border flex items-center justify-center transition-all ${
                    currentNode === 1 
                      ? 'bg-cyan-500/[0.05] border-cyan-500' 
                      : currentNode > 1
                      ? 'bg-green-500/[0.03] border-green-500/30'
                      : 'bg-[#0A0A0C] border-white/10'
                  }`}>
                    <Workflow className={`h-5 w-5 ${currentNode === 1 ? 'text-cyan-400 animate-pulse' : currentNode > 1 ? 'text-green-400' : 'text-white/30'}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90">2. Logic Filter & Router</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">Filters payload structure and routes based on parameters.</p>
                  </div>
                </div>

                {/* Node 3: AI Synthesis (Gemini) */}
                <div className={`flex items-center gap-4 transition-all duration-300 ${currentNode >= 2 ? 'opacity-100' : 'opacity-40'}`} id="node-3">
                  <div className={`w-14 h-14 rounded-sm border flex items-center justify-center transition-all ${
                    currentNode === 2 
                      ? 'bg-cyan-500/[0.05] border-cyan-500' 
                      : currentNode > 2
                      ? 'bg-green-500/[0.03] border-green-500/30'
                      : 'bg-[#0A0A0C] border-white/10'
                  }`}>
                    <FileText className={`h-5 w-5 ${currentNode === 2 ? 'text-cyan-400 animate-pulse' : currentNode > 2 ? 'text-green-400' : 'text-white/30'}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90">3. AI Synthesis (Gemini Model)</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">Executes prompts to formulate positioning, blogs, or emails.</p>
                  </div>
                </div>

                {/* Node 4: Delivery / Fulfillment */}
                <div className={`flex items-center gap-4 transition-all duration-300 ${currentNode >= 3 ? 'opacity-100' : 'opacity-40'}`} id="node-4">
                  <div className={`w-14 h-14 rounded-sm border flex items-center justify-center transition-all ${
                    currentNode === 3 
                      ? 'bg-cyan-500/[0.05] border-cyan-500' 
                      : 'bg-[#0A0A0C] border-white/10'
                  }`}>
                    <Mail className={`h-5 w-5 ${currentNode === 3 ? 'text-cyan-400 animate-pulse' : 'text-white/30'}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/90">4. Fulfillment Syndication (API Outbound)</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">Sends automated email, pushes LinkedIn posts, or updates Slack CRM.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20 text-center py-20">
              <AlertCircle className="h-10 w-10 text-white/10 mb-4" />
              <h3 className="text-sm font-light uppercase tracking-wider text-white/40">No Scenario Loaded</h3>
              <p className="text-[10px] text-white/30 mt-1">Select a scenario from the left to visualize node connections.</p>
            </div>
          )}
        </div>

        {activeScenario && (
          <div className="border-t border-white/10 mt-6 pt-4 flex justify-between items-center text-[10px] text-white/40 font-mono" id="diagram-status">
            <span className="flex items-center gap-1.5 text-green-400">
              <CheckCircle className="h-4 w-4" />
              LIVE STATUS: OPERATIONAL
            </span>
            <span>EST. PROCESSING LATENCY: ~1.2S</span>
          </div>
        )}
      </div>
    </div>
  );
};
