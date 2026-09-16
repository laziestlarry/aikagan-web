/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  RotateCcw, 
  UserCheck, 
  Layers, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Terminal, 
  ShieldAlert,
  Cpu,
  Workflow,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AIAgent, MissionTask, ActivityLog } from "@/types/commander";
import { safeDispatchTaskCompleted } from "@/lib/commander-resilience";

interface CommandDashboardProps {
  onTaskCompleted: (taskOutput: any) => void;
  activeLogs: ActivityLog[];
  setActiveLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
}

const INITIAL_AGENTS: AIAgent[] = [
  {
    id: "commander",
    name: "Commander-1",
    role: "Operational Chief & Coordinator",
    level: "Executive",
    status: "idle",
    avatarColor: "bg-cyan-500 text-black",
    skills: ["Mission Dispatching", "Handoff Orchestration", "SLA Gatekeeping"],
    description: "Orchestrates multi-layer workflow sessions and validates strategic compliance."
  },
  {
    id: "navigator",
    name: "BizOp Navigator",
    role: "Strategic Analyst & Positioning Lead",
    level: "Director",
    status: "idle",
    avatarColor: "bg-white/20 text-white",
    skills: ["Market Intelligence", "Niche Deep-Diving", "Competitive Structuring"],
    description: "Transforms fragmented startup ideas into robust, high-conversion core concepts."
  },
  {
    id: "architect",
    name: "Growth Architect",
    role: "Monetization & Conversion Specialist",
    level: "Architect",
    status: "idle",
    avatarColor: "bg-white/10 text-white/80",
    skills: ["Monetization Architecture", "Value Ladder Setup", "Checkout Funnel Design"],
    description: "Designs the commercial pipelines and high-ticket upgrade pathways."
  },
  {
    id: "automation_lead",
    name: "Automation Lead",
    role: "Workflow Engineer & Integrator",
    level: "Director",
    status: "idle",
    avatarColor: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    skills: ["Make.com Scenario Design", "Webhook Syncing", "Fulfillment Pipelines"],
    description: "Deploys autonomous routers and bots for client operations and social syndication."
  },
  {
    id: "copy_writer",
    name: "Copywriting Bot (SEO)",
    role: "Content & Traffic Engine",
    level: "Specialist",
    status: "idle",
    avatarColor: "bg-green-500/20 text-green-400 border border-green-500/30",
    skills: ["SEO Optimization", "Viral LinkedIn Formulations", "Content Funnels"],
    description: "Acts as a live social booster and creator to attract warm traffic loops."
  }
];

const MISSION_TASKS: MissionTask[] = [
  {
    id: "task-1",
    day: 14,
    title: "Venture Blueprint Formulation",
    description: "Structure strategic plan milestones and execute concept alignment with market demands.",
    assignedTo: "navigator",
    status: "pending",
    outcome: "Autonomous operational structure mapped and customer profiles verified."
  },
  {
    id: "task-2",
    day: 18,
    title: "Core Monetization & Offer Tuning",
    description: "Profile e-commerce conversion offers ($49 blueprints and $299 advanced growth operating systems).",
    assignedTo: "architect",
    status: "pending",
    outcome: "Staged revenue models activated with checkout integrations planned."
  },
  {
    id: "task-3",
    day: 22,
    title: "Make.com Automation Deployments",
    description: "Configure SEO Blog Writer, Competitor Tracker, and LinkedIn Viral Poster scenario parameters.",
    assignedTo: "automation_lead",
    status: "pending",
    outcome: "Make.com workflow routers integrated to operate live inbound lead loops."
  },
  {
    id: "task-4",
    day: 26,
    title: "Traffic Syndication & Content Setup",
    description: "Activate automated LinkedIn and blog posting workflows for early operator client acquisition.",
    assignedTo: "copy_writer",
    status: "pending",
    outcome: "Autonomous SEO blogs indexed and viral syndication schedules running."
  },
  {
    id: "task-5",
    day: 30,
    title: "Activated Selling & System Stabilization",
    description: "Trigger operational handoffs and launch the completed e-commerce settlement for live ops.",
    assignedTo: "commander",
    status: "pending",
    outcome: "AutonomaX Mission Control fully synced with active billing. Live income generation online."
  }
];

export const CommandDashboard: React.FC<CommandDashboardProps> = ({ 
  onTaskCompleted, 
  activeLogs, 
  setActiveLogs 
}) => {
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<MissionTask[]>(MISSION_TASKS);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeLogs]);

  const addLog = (agentId: string, agentName: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId,
      agentName,
      message,
      type
    };
    setActiveLogs(prev => [...prev, newLog]);
  };

  const updateAgentStatus = (id: string, status: AIAgent['status'], currentTask?: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status, currentTask } : a));
  };

  const updateTaskStatus = (id: string, status: MissionTask['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  // Simulates a single task execution with multi-agent handoffs
  const runNextTaskStep = async () => {
    if (currentTaskIndex >= tasks.length || isSimulating) return;
    
    setIsSimulating(true);
    const activeTask = tasks[currentTaskIndex];
    const assignedAgent = agents.find(a => a.id === activeTask.assignedTo) || agents[0];
    
    updateTaskStatus(activeTask.id, 'active');
    
    // Step 1: Commander coordinates and assigns
    updateAgentStatus('commander', 'busy', `Dispatching Day ${activeTask.day} Mission: ${activeTask.title}`);
    addLog('commander', 'Commander-1', `[MISSION DISPATCH] Analyzing Day ${activeTask.day} task pipeline. Delegating "${activeTask.title}" to ${assignedAgent.name}.`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Hand off to Director/Architect
    updateAgentStatus('commander', 'idle');
    updateAgentStatus(assignedAgent.id, 'busy', `Executing: ${activeTask.title}`);
    addLog(assignedAgent.id, assignedAgent.name, `[HANDOFF RECEIVED] Commencing subject-matter analysis on "${activeTask.title}". System objectives locked.`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate thinking/doing
    addLog(assignedAgent.id, assignedAgent.name, `[PROCESSING] Applying mastery modules: ${assignedAgent.skills.join(", ")}. Designing delivery pipeline...`, 'warning');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Finish task & generate outcomes
    updateAgentStatus(assignedAgent.id, 'completed', `Completed: ${activeTask.title}`);
    addLog(assignedAgent.id, assignedAgent.name, `[SUCCESS] ${activeTask.title} execution complete. Outcome achieved: ${activeTask.outcome}`, 'success');
    updateTaskStatus(activeTask.id, 'completed');
    
    // Hand back to Commander for gatekeeping
    updateAgentStatus('commander', 'busy', `Validating outcome for Day ${activeTask.day} task`);
    addLog('commander', 'Commander-1', `[SLA QUALITY ASSURANCE] Checking output of ${assignedAgent.name}. Verification successful. Transitioning pipeline to stable state.`, 'success');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateAgentStatus('commander', 'idle');
    updateAgentStatus(assignedAgent.id, 'idle');
    
    // Trigger revenue/milestone impact in parent component safely via microtask
    safeDispatchTaskCompleted(onTaskCompleted, {
      day: activeTask.day,
      title: activeTask.title,
      tier: 'premium',
      revenueIncrement: activeTask.day === 30 ? 4500 : activeTask.day * 120
    });

    setCurrentTaskIndex(prev => prev + 1);
    setIsSimulating(false);
  };

  const resetPipeline = () => {
    setTasks(MISSION_TASKS);
    setCurrentTaskIndex(0);
    setAgents(INITIAL_AGENTS);
    setActiveLogs([]);
    addLog('system', 'System', 'Autonomous Command organization live. Operations initialized.', 'info');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-container">
      {/* AI command organization map */}
      <div className="lg:col-span-7 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl" id="organization-card">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-light tracking-wide text-white uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 animate-pulse"></span>
              Autonomous AI Command Hierarchy
            </h2>
            <p className="text-[11px] text-white/40 font-mono mt-1">Leveled strategic team managing active revenue pipelines</p>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-sm border border-cyan-500/20">
            5 ACTIVE UNITS
          </span>
        </div>

        {/* Level Tiers */}
        <div className="space-y-4" id="agent-tiers-container">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className={`p-4 rounded-sm border transition-all duration-300 ${
                agent.status === 'busy' 
                  ? 'bg-cyan-500/[0.05] border-cyan-500' 
                  : agent.status === 'completed'
                  ? 'bg-green-500/[0.03] border-green-500/30'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
              id={`agent-${agent.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs ${agent.avatarColor}`}>
                    {agent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white/95 text-sm">{agent.name}</h3>
                      <span className="text-[9px] uppercase font-mono tracking-widest bg-white/10 text-white/60 px-1">
                        {agent.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-cyan-500 font-mono mt-0.5 uppercase tracking-wider">{agent.role}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm border flex items-center gap-1 ${
                    agent.status === 'busy'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30'
                      : agent.status === 'completed'
                      ? 'bg-green-500/20 text-green-400 border-green-400/30'
                      : 'bg-white/10 text-white/60 border-white/15'
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${
                      agent.status === 'busy' ? 'bg-cyan-400 animate-ping' : agent.status === 'completed' ? 'bg-green-400' : 'bg-white/40'
                    }`} />
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/60 mt-3 leading-relaxed">
                {agent.description}
              </p>

              {/* Skills Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {agent.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[9px] font-mono bg-[#0A0A0C] text-white/40 border border-white/10 px-2 py-0.5 rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Active Subtask display */}
              {agent.currentTask && (
                <div className="mt-3 p-2 bg-[#0A0A0C] border border-white/10 rounded-sm text-xs text-cyan-400 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse" />
                  <span className="text-white/40">Current Loop:</span> {agent.currentTask}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Task execution and timeline */}
      <div className="lg:col-span-5 flex flex-col gap-8" id="timeline-and-logs">
        {/* Track A 14-30 Days Mission Tasks */}
        <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl" id="timeline-card">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div>
              <h2 className="text-base font-light tracking-wide text-white uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Track A: 14-30 Days Mission Tasks
              </h2>
              <p className="text-[11px] text-white/40 font-mono mt-1">Core launch tasks running stepwise to active sales</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={resetPipeline}
                title="Reset Simulation"
                className="p-2 bg-transparent hover:bg-white/5 text-white/60 border border-white/10 rounded-sm transition-all cursor-pointer"
                id="btn-reset-pipeline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={runNextTaskStep}
                disabled={isSimulating || currentTaskIndex >= tasks.length}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/5 disabled:text-white/20 disabled:border-transparent text-black font-bold text-xs rounded-sm border border-cyan-400 transition-all cursor-pointer flex items-center gap-1.5"
                id="btn-execute-step"
              >
                <Play className="h-3.5 w-3.5" />
                {isSimulating ? 'Processing...' : currentTaskIndex >= tasks.length ? 'Completed' : 'Execute Step'}
              </button>
            </div>
          </div>

          <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-white/10" id="timeline-steps">
            {tasks.map((task, idx) => {
              const agentObj = agents.find(a => a.id === task.assignedTo);
              return (
                <div key={task.id} className="relative pl-6" id={`task-item-${task.id}`}>
                  {/* Status Indicator circle on line */}
                  <span className={`absolute left-0 top-1.5 -translate-x-[4.5px] w-2 h-2 rounded-full border ${
                    task.status === 'completed'
                      ? 'bg-green-500 border-green-400'
                      : task.status === 'active'
                      ? 'bg-cyan-500 border-cyan-400 animate-ping'
                      : 'bg-[#0A0A0C] border-white/20'
                  }`} />

                  <div className={`p-4 rounded-sm border ${
                    task.status === 'active'
                      ? 'bg-cyan-500/[0.05] border-cyan-500/50'
                      : task.status === 'completed'
                      ? 'bg-white/[0.01] border-white/5 opacity-60'
                      : 'bg-transparent border-white/5'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase ${
                        task.status === 'active' ? 'text-cyan-500' : 'text-white/40'
                      }`}>
                        Day {task.day} Goal
                      </span>
                      {agentObj && (
                        <span className="text-[10px] font-mono text-white/40 flex items-center gap-1">
                          <UserCheck className="h-2.5 w-2.5 text-white/30" />
                          {agentObj.name}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-white/90 text-xs mt-1.5 uppercase tracking-wide">{task.title}</h4>
                    <p className="text-white/50 text-[11px] mt-1 leading-relaxed">
                      {task.description}
                    </p>

                    {task.status === 'completed' && task.outcome && (
                      <div className="mt-2 text-[10px] text-green-400 bg-green-500/5 border border-green-500/10 rounded-sm p-2 font-mono">
                        ✓ Outcome: {task.outcome}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Session Handoff logs */}
        <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl flex-1 flex flex-col min-h-[220px]" id="logs-card">
          <h3 className="text-sm font-light tracking-wide text-white uppercase flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <Terminal className="h-4 w-4 text-cyan-500" />
            Live Session Handoff Console
          </h3>

          <div className="flex-1 bg-[#0A0A0C] border border-white/5 rounded-sm p-3 font-mono text-xs overflow-y-auto max-h-[200px] space-y-2" id="logs-scroller">
            {activeLogs.length === 0 ? (
              <div className="text-white/30 italic flex items-center justify-center h-full py-10 text-[10px]">
                Handoff logs will appear once step-by-step executions are started.
              </div>
            ) : (
              activeLogs.map((log) => (
                <div key={log.id} className="text-[10px] leading-relaxed" id={log.id}>
                  <span className="text-white/30 mr-1.5">[{log.timestamp}]</span>
                  <span className={`font-semibold mr-1.5 ${
                    log.agentId === 'commander' 
                      ? 'text-cyan-400' 
                      : log.agentId === 'navigator' 
                      ? 'text-white/80' 
                      : log.agentId === 'architect' 
                      ? 'text-green-400' 
                      : 'text-cyan-300'
                  }`}>
                    {log.agentName}:
                  </span>
                  <span className={`${
                    log.type === 'success' 
                      ? 'text-green-400' 
                      : log.type === 'warning' 
                      ? 'text-cyan-200' 
                      : log.type === 'error' 
                      ? 'text-rose-400' 
                      : 'text-white/60'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
