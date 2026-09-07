"use client";

import { FormEvent, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";

type Check = { status: "ok" | "degraded" | "error"; latency_ms: number; detail?: string };
type OpsStatus = {
  ready: boolean;
  mode: string;
  checkedAt: string;
  blockers: string[];
  growthBlockers: string[];
  advisories: string[];
  checks: Record<string, boolean>;
};
type BlueprintStatus = {
  runtime: {
    state: "ready" | "blocked";
    queueDepth: number;
    gates: Array<{ id: string; title: string; required: boolean; configured: boolean; detail: string }>;
  };
};

export default function CommanderPage() {
  const [secret, setSecret] = useState("");
  const [ops, setOps] = useState<OpsStatus | null>(null);
  const [blueprint, setBlueprint] = useState<BlueprintStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = { "x-admin-secret": secret };
      const [opsResponse, blueprintResponse] = await Promise.all([
        fetch("/api/ops/status", { cache: "no-store", headers }),
        fetch("/api/autonomax/blueprint", { cache: "no-store" }),
      ]);
      if (!opsResponse.ok) throw new Error(opsResponse.status === 401 ? "The operator credential was not accepted." : `Operations status returned HTTP ${opsResponse.status}.`);
      if (!blueprintResponse.ok) throw new Error(`AutonomaX status returned HTTP ${blueprintResponse.status}.`);
      setOps(await opsResponse.json());
      setBlueprint(await blueprintResponse.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Commander monitor could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  if (!ops || !blueprint) {
    return (
      <Section variant="hero">
        <form onSubmit={load} className="mx-auto max-w-md rounded-2xl border border-kagan-border bg-kagan-card/60 p-7">
          <Badge variant="amber" className="mb-4">Operator-only control</Badge>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-kagan-white"><ShieldCheck className="h-7 w-7 text-kagan-gold" /> Commander Monitor</h1>
          <p className="mt-3 text-sm leading-6 text-kagan-light">Review actual commerce readiness, AutonomaX gates, queued briefs, and customer-success provisioning without exposing internal data publicly.</p>
          <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-kagan-muted" htmlFor="admin-secret">Operator credential</label>
          <input id="admin-secret" type="password" required value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="ADMIN_SECRET" className="mt-2 w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-3 font-mono text-sm text-kagan-white focus:outline-none focus:ring-1 focus:ring-kagan-gold" />
          <button disabled={loading} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-kagan-gold px-5 py-3 text-sm font-bold text-black disabled:opacity-50">{loading && <RefreshCw className="h-4 w-4 animate-spin" />}{loading ? "Loading controls..." : "Open Commander Monitor"}</button>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </form>
      </Section>
    );
  }

  const missingRequired = blueprint.runtime.gates.filter((gate) => gate.required && !gate.configured);
  return (
    <Section variant="hero">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><Badge variant={ops.ready ? "green" : "amber"} className="mb-3">{ops.ready ? "Commercial release evidence complete" : "Release held by evidence gaps"}</Badge><h1 className="text-4xl font-extrabold text-kagan-white">Commander Monitor</h1><p className="mt-2 text-sm text-kagan-light">Last checked {new Date(ops.checkedAt).toLocaleString()} · commercial mode: {ops.mode}</p></div>
          <button onClick={() => load()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-kagan-border px-4 py-2.5 text-sm font-bold text-kagan-light hover:border-kagan-gold/50 hover:text-kagan-gold disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh evidence</button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="Required gates clear" value={`${blueprint.runtime.gates.filter((gate) => gate.required && gate.configured).length}/${blueprint.runtime.gates.filter((gate) => gate.required).length}`} />
          <Metric label="Queued product briefs" value={String(blueprint.runtime.queueDepth)} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Release blockers" items={ops.blockers} empty="No commercial blockers reported." />
          <Panel title="Growth activation gaps" items={ops.growthBlockers} empty="No growth-automation gaps reported." />
          <Panel title="Advisories" items={ops.advisories} empty="No advisory gaps reported." />
          <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6"><h2 className="text-lg font-bold text-kagan-white">AutonomaX capability gates</h2><div className="mt-4 space-y-3">{blueprint.runtime.gates.map((gate) => <div key={gate.id} className="flex gap-3 rounded-xl border border-kagan-border/70 p-3">{gate.configured ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-kagan-success" /> : <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-kagan-amber" />}<div><p className="text-sm font-semibold text-kagan-white">{gate.title}{gate.required ? " · required" : " · advisory"}</p><p className="mt-1 text-xs leading-5 text-kagan-light">{gate.detail}</p></div></div>)}</div></div>
        </div>

        {missingRequired.length > 0 && <div className="mt-6 rounded-2xl border border-kagan-amber/30 bg-kagan-amber/5 p-5 text-sm text-kagan-light"><Activity className="mr-2 inline h-4 w-4 text-kagan-amber" />No public launch should be represented as complete until the required gates above report ready. This monitor records configuration evidence; it does not itself publish, charge, or fulfill.</div>}
      </div>
    </Section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-5"><p className="text-3xl font-extrabold text-kagan-white">{value}</p><p className="mt-2 text-xs font-bold uppercase tracking-wider text-kagan-muted">{label}</p></div>;
}

function Panel({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6"><h2 className="text-lg font-bold text-kagan-white">{title}</h2>{items.length ? <div className="mt-4 space-y-2">{items.map((item) => <p key={item} className="rounded-lg border border-kagan-amber/20 bg-kagan-amber/5 px-3 py-2 font-mono text-xs text-kagan-light">{item}</p>)}</div> : <p className="mt-4 text-sm text-kagan-light">{empty}</p>}</div>;
}
