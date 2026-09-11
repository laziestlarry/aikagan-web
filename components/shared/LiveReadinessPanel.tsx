"use client";

import { useEffect, useState } from "react";

type PublicHealth = {
  ok: boolean;
  storefront_mode: "open" | "commissioning";
  version: string;
  environment: string;
  primary_checkout_provider?: string | null;
  startable_paid_offers?: number;
  checkout_startable?: boolean;
  commercial_evidence?: "configuration_only" | "external_verified";
};

export default function LiveReadinessPanel() {
  const [status, setStatus] = useState<PublicHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const payload = (await response.json()) as PublicHealth;
      if (response.status !== 200 && response.status !== 503) throw new Error(`HTTP ${response.status}`);
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

  const checkoutReady = Boolean(status?.checkout_startable && (status?.startable_paid_offers ?? 0) > 0);
  const externalProof = status?.commercial_evidence === "external_verified";

  return (
    <div className="mb-16 rounded-xl border border-kagan-gold/20 bg-kagan-gold/[0.03] p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-kagan-gold">Public service status</p>
          <h2 className="mt-2 text-2xl font-extrabold text-kagan-white">ProfitOS release evidence</h2>
          <p className="mt-2 max-w-2xl text-sm text-kagan-light">This panel separates customer-usable checkout configuration from commercial proof. A working rail is not counted as revenue, delivery, or customer acceptance.</p>
        </div>
        <button onClick={() => void refresh()} className="rounded-lg border border-kagan-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-kagan-gold hover:bg-kagan-gold/10">Refresh evidence</button>
      </div>

      {error && <div className="mt-5 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Metric label="Service health" value={status?.ok ? "available" : "degraded"} good={status?.ok} />
        <Metric label="Paid offers" value={status ? String(status.startable_paid_offers ?? 0) : "checking"} good={checkoutReady} />
        <Metric label="Checkout rail" value={checkoutReady ? (status?.primary_checkout_provider ?? "available") : "not startable"} good={checkoutReady} />
        <Metric label="External proof" value={externalProof ? "verified" : "pending"} good={externalProof} />
      </div>

      <p className="mt-5 text-xs text-kagan-light">{status ? checkoutReady ? "Hosted checkout can be started for the mapped paid offers. Provider-confirmed payment, delivery and customer acceptance remain separate evidence gates." : "No paid offer currently has a customer-startable checkout path." : "Checking public service status…"}</p>
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
