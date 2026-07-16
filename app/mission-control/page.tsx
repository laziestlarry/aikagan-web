"use client";

import { useEffect, useState } from "react";

type OpsStatus = {
  service: string;
  mode: "live" | "blocked";
  ready: boolean;
  simulated: false;
  checkedAt: string;
  products: { paid: number; slugs: string[] };
  checks: Record<string, boolean>;
  blockers: string[];
};

export default function MissionControlPage() {
  const [status, setStatus] = useState<OpsStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const response = await fetch("/api/ops/status", { cache: "no-store" });
      const payload = (await response.json()) as OpsStatus;
      setStatus(payload);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status request failed");
    }
  }

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#09070a] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-amber-300/20 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">AIKAGAN · AutonomaX</p>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-tight">ProfitOS Mission Control</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">Production truth only. A gate is green only when its required live configuration exists.</p>
          </div>
          <button onClick={() => void refresh()} className="rounded border border-amber-300/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300">Refresh evidence</button>
        </div>

        {error && <div className="mb-6 border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Operating mode" value={status?.mode ?? "checking"} good={status?.ready} />
          <Metric label="Paid products" value={String(status?.products.paid ?? 0)} good={(status?.products.paid ?? 0) > 0} />
          <Metric label="Simulation" value={status?.simulated === false ? "disabled" : "unknown"} good={status?.simulated === false} />
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {status && Object.entries(status.checks).map(([name, ok]) => (
            <div key={name} className={`border p-5 ${ok ? "border-emerald-400/30 bg-emerald-500/5" : "border-red-400/30 bg-red-500/5"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold capitalize">{name.replace(/([A-Z])/g, " $1")}</span>
                <span className={`text-xs font-black uppercase tracking-widest ${ok ? "text-emerald-300" : "text-red-300"}`}>{ok ? "verified" : "blocked"}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-amber-300">Release decision</h2>
          <p className="mt-3 text-lg font-bold">{status?.ready ? "LIVE SALES PATH MAY PROCEED" : "DO NOT CLAIM PRODUCTION READINESS"}</p>
          <p className="mt-2 text-sm text-white/60">{status?.blockers.length ? `Blocking gates: ${status.blockers.join(", ")}` : "All critical gates passed."}</p>
          {status?.checkedAt && <p className="mt-4 font-mono text-xs text-white/35">Evidence checked: {new Date(status.checkedAt).toLocaleString()}</p>}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className={`mt-3 text-2xl font-black uppercase ${good ? "text-emerald-300" : "text-amber-300"}`}>{value}</p>
    </div>
  );
}
