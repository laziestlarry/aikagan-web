"use client";

import { useEffect, useState } from "react";

type OpsStatus = {
  service: string;
  mode: "live" | "blocked";
  ready: boolean;
  simulated: false;
  checkedAt: string;
  products: { paid: number; slugs: string[] };
  providers: Record<string, boolean>;
  checks: Record<string, boolean>;
  warnings: Record<string, boolean>;
  blockers: string[];
  advisories: string[];
};

export default function LiveReadinessPanel() {
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

  const activeProviders = status
    ? Object.values(status.providers).filter(Boolean).length
    : 0;

  return (
    <div className="mb-16 rounded-xl border border-kagan-gold/20 bg-kagan-gold/[0.03] p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-kagan-gold">Live production gates</p>
          <h2 className="mt-2 text-2xl font-extrabold text-kagan-white">ProfitOS release evidence</h2>
          <p className="mt-2 max-w-2xl text-sm text-kagan-light">No simulated completion. Checkout, webhook, fulfillment, catalog, and deployment configuration must pass before sales are declared live.</p>
        </div>
        <button onClick={() => void refresh()} className="rounded-lg border border-kagan-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-kagan-gold hover:bg-kagan-gold/10">Refresh evidence</button>
      </div>

      {error && <div className="mt-5 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Release mode" value={status?.mode ?? "checking"} good={status?.ready} />
        <Metric label="Paid offers" value={String(status?.products.paid ?? 0)} good={(status?.products.paid ?? 0) > 0} />
        <Metric label="Active rails" value={String(activeProviders)} good={activeProviders > 0} />
        <Metric label="Decision" value={status?.ready ? "proceed" : "blocked"} good={status?.ready} />
      </div>

      {status && (
        <>
          <div className="mt-5 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(status.checks).map(([name, ok]) => (
              <Gate key={name} name={name} ok={ok} />
            ))}
          </div>

          <div className="mt-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Payment rails</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(status.providers).map(([name, ok]) => (
                <span key={name} className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${ok ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.02] text-white/35"}`}>
                  {name}: {ok ? "ready" : "off"}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <p className="mt-5 text-xs text-kagan-light">{status?.blockers.length ? `Blocking gates: ${status.blockers.join(", ")}` : status ? "All critical gates passed." : "Collecting production evidence…"}</p>
      {status?.advisories.length ? <p className="mt-2 text-xs text-amber-200/80">Advisories: {status.advisories.join(", ")}</p> : null}
      {status?.checkedAt ? <p className="mt-3 font-mono text-[10px] text-white/30">Evidence checked {new Date(status.checkedAt).toLocaleString()}</p> : null}
    </div>
  );
}

function Gate({ name, ok }: { name: string; ok: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${ok ? "border-emerald-400/30 bg-emerald-500/5" : "border-red-400/30 bg-red-500/5"}`}>
      <span className="capitalize text-kagan-light">{name.replace(/([A-Z])/g, " $1")}</span>
      <span className={ok ? "font-bold text-emerald-300" : "font-bold text-red-300"}>{ok ? "VERIFIED" : "BLOCKED"}</span>
    </div>
  );
}

function Metric({ label, value, good }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{label}</p>
      <p className={`mt-2 text-lg font-extrabold uppercase ${good ? "text-emerald-300" : "text-kagan-gold"}`}>{value}</p>
    </div>
  );
}
