/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Layers, 
  Zap, 
  CheckCircle,
  Briefcase,
  AlertCircle
} from "lucide-react";

interface MetricsMonitorProps {
  metrics: {
    totalRevenue: number;
    tasksCompleted: number;
    scenarioRuns: number;
    conversionRate: number;
    projectedMonth1: number;
    projectedMonth2: number;
    projectedMonth3: number;
  };
}

export const MetricsMonitor: React.FC<MetricsMonitorProps> = ({ metrics }) => {
  const percentageTasksCompleted = Math.min(100, Math.round((metrics.tasksCompleted / 5) * 100));

  // Premium custom SVG line coordinates for Month 1, 2, 3 trend
  // Month 1 coordinate: x=40, y=140
  // Month 2 coordinate: x=140, y=90
  // Month 3 coordinate: x=240, y=30
  const pathData = `M 40 140 Q 140 90 240 30`;

  return (
    <div className="space-y-6" id="metrics-monitor-container">
      {/* KPI Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="kpi-grid">
        <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-5 shadow-2xl relative overflow-hidden" id="kpi-revenue">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest block">Verified Cash Flow</span>
              <h3 className="text-xl font-mono font-bold text-white mt-1.5">
                ${metrics.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <span className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 rounded-sm">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-white/40 mt-3 font-mono">
            <span className="text-cyan-400 font-semibold">+$450/DAY</span> AVG TRANSACTION
          </div>
        </div>

        <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-5 shadow-2xl relative overflow-hidden" id="kpi-conversion">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest block">Conversion Rate</span>
              <h3 className="text-xl font-mono font-bold text-white mt-1.5">
                {metrics.conversionRate}%
              </h3>
            </div>
            <span className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 rounded-sm">
              <Percent className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-white/40 mt-3 font-mono">
            <span className="text-cyan-400 font-semibold">2.1X INCREASE</span> OVER AVERAGE
          </div>
        </div>

        <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-5 shadow-2xl relative overflow-hidden" id="kpi-automations">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest block">Active Automations</span>
              <h3 className="text-xl font-mono font-bold text-white mt-1.5">
                {metrics.scenarioRuns}
              </h3>
            </div>
            <span className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 rounded-sm">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-white/40 mt-3 font-mono">
            <span className="text-cyan-400 font-semibold">{metrics.scenarioRuns * 3} PACKETS</span> ROUTED SUCCESS
          </div>
        </div>

        <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-5 shadow-2xl relative overflow-hidden" id="kpi-milestones">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest block">Timeline Progress</span>
              <h3 className="text-xl font-mono font-bold text-white mt-1.5">
                {percentageTasksCompleted}%
              </h3>
            </div>
            <span className="p-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 rounded-sm">
              <CheckCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="text-[10px] text-white/40 mt-3 font-mono">
            <span className="text-cyan-400 font-semibold">{metrics.tasksCompleted}/5 TASKS</span> COMPLETED IN TRACK A
          </div>
        </div>
      </div>

      {/* Analytics Projections and Source Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="analytics-grid">
        {/* Projections Line Chart */}
        <div className="md:col-span-8 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl" id="trend-chart-card">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-light uppercase tracking-wide text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-500"></span>
                Strategic Projections Matrix
              </h3>
              <p className="text-[11px] text-white/40 font-mono mt-1">Estimated income transition to evidenced commercial reality</p>
            </div>
            <span className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/10 px-2.5 py-1 rounded-sm uppercase">
              Stated Targets
            </span>
          </div>

          {/* SVG line chart */}
          <div className="h-48 relative flex items-center justify-center p-2" id="svg-chart-container">
            <svg viewBox="0 0 280 160" className="w-full h-full max-h-[180px]">
              {/* Grid lines */}
              <line x1="40" y1="30" x2="260" y2="30" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="85" x2="260" y2="85" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="140" x2="260" y2="140" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

              {/* Chart line */}
              <path d={pathData} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />
              <path d={`${pathData} L 240 140 L 40 140 Z`} fill="url(#areaGrad)" />

              {/* Data circles */}
              <circle cx="40" cy="140" r="4" fill="#06b6d4" stroke="#0A0A0C" strokeWidth="1.5" />
              <circle cx="140" cy="90" r="4" fill="#06b6d4" stroke="#0A0A0C" strokeWidth="1.5" />
              <circle cx="240" cy="30" r="4" fill="#10b981" stroke="#0A0A0C" strokeWidth="1.5" />

              {/* Chart labels */}
              <text x="40" y="155" fill="rgba(255, 255, 255, 0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">MONTH 1</text>
              <text x="140" y="155" fill="rgba(255, 255, 255, 0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">MONTH 2</text>
              <text x="240" y="155" fill="rgba(255, 255, 255, 0.3)" fontSize="8" textAnchor="middle" fontFamily="monospace">MONTH 3</text>

              <text x="25" y="143" fill="rgba(255, 255, 255, 0.5)" fontSize="8" textAnchor="end" fontFamily="monospace">${metrics.projectedMonth1.toLocaleString()}</text>
              <text x="125" y="93" fill="rgba(255, 255, 255, 0.5)" fontSize="8" textAnchor="end" fontFamily="monospace">${metrics.projectedMonth2.toLocaleString()}</text>
              <text x="225" y="33" fill="rgba(255, 255, 255, 0.5)" fontSize="8" textAnchor="end" fontFamily="monospace">${metrics.projectedMonth3.toLocaleString()}</text>

              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Strategic Allocation of Income */}
        <div className="md:col-span-4 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl flex flex-col justify-between" id="allocation-chart-card">
          <div>
            <h3 className="text-sm font-light uppercase tracking-wide text-white flex items-center gap-2 border-b border-white/10 pb-4 mb-5">
              <Briefcase className="h-4.5 w-4.5 text-cyan-500" />
              Sourced Revenues Split
            </h3>

            <div className="space-y-4" id="revenue-split-bars">
              <div id="split-downloads">
                <div className="flex justify-between text-xs text-white/50 mb-1.5 font-mono">
                  <span>E-Commerce OS Downloads</span>
                  <span className="font-semibold text-white/90">55%</span>
                </div>
                <div className="h-2 bg-[#0A0A0C] border border-white/10 rounded-none overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-none" style={{ width: "55%" }} />
                </div>
              </div>

              <div id="split-bespoke">
                <div className="flex justify-between text-xs text-white/50 mb-1.5 font-mono">
                  <span>Bespoke Implementation</span>
                  <span className="font-semibold text-white/90">30%</span>
                </div>
                <div className="h-2 bg-[#0A0A0C] border border-white/10 rounded-none overflow-hidden">
                  <div className="h-full bg-white/60 rounded-none" style={{ width: "30%" }} />
                </div>
              </div>

              <div id="split-retaining">
                <div className="flex justify-between text-xs text-white/50 mb-1.5 font-mono">
                  <span>Monthly retainer SLA</span>
                  <span className="font-semibold text-white/90">15%</span>
                </div>
                <div className="h-2 bg-[#0A0A0C] border border-white/10 rounded-none overflow-hidden">
                  <div className="h-full bg-white/20 rounded-none" style={{ width: "15%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#0A0A0C] border border-white/10 rounded-sm text-[10px] text-white/40 leading-relaxed font-mono" id="allocation-disclaimer">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase mb-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Evidenced Realization Note
            </span>
            As scenarios are run and Day goals completed, active cash flow updates in real-time. Operating systems are automatically delivered immediately upon e-commerce checkout.
          </div>
        </div>
      </div>
    </div>
  );
};
