import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Mission Control — AIKAGAN",
  description: "Operational pipeline — every project tracked from intake to delivery.",
};

const metrics = [
  { label: "Systems Active", value: "Online" },
  { label: "Pipeline", value: "Operational" },
  { label: "Uptime", value: "99.9%" },
  { label: "Delivery Rate", value: "100%" },
];

const stages = [
  { id: "01", name: "INTAKE", status: "Active", description: "Project requirements captured and logged" },
  { id: "02", name: "ANALYSIS", status: "Active", description: "Systems mapping and opportunity identification" },
  { id: "03", name: "BUILD", status: "Active", description: "Automation pipelines and integrations assembled" },
  { id: "04", name: "DEPLOY", status: "Pending", description: "Live deployment to target infrastructure" },
  { id: "05", name: "MONITOR", status: "Pending", description: "Continuous system health and performance tracking" },
  { id: "06", name: "DELIVER", status: "Pending", description: "Final handoff, documentation, and support activation" },
];

const statusColor: Record<string, string> = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Complete: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Pending: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function MissionControlPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Mission Control"
          subtitle="Operational pipeline — every project tracked from intake to delivery."
        />

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metrics.map((m) => (
            <div key={m.label} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 text-center">
              <div className="text-[#f59e0b] font-bold text-lg">{m.value}</div>
              <div className="text-gray-500 text-xs mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="space-y-3">
          {stages.map((s) => (
            <div key={s.id} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-[#f59e0b] font-mono text-sm font-bold">{s.id}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{s.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.description}</div>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded border ${statusColor[s.status]}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
