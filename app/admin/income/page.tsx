"use client";

import { useEffect, useState } from "react";
import { Lock, ShieldCheck, Database, Server, Zap, Globe, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";

interface HealthPayload {
  ok: boolean;
  version: string;
  environment: string;
  uptime_seconds: number;
  checks: Record<string, { status: string; latency_ms: number; detail?: string }>;
  income_sources: { kv: boolean; paddle: boolean; capi: boolean; ga4: boolean };
  audit_endpoints: Record<string, string>;
}

export default function AdminIncomePage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/health", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setHealth(await r.json());
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <Section variant="hero">
        <div className="max-w-md mx-auto">
          <Badge variant="amber" className="mb-4">Admin</Badge>
          <h1 className="text-2xl font-extrabold text-kagan-white mb-2 flex items-center gap-2">
            <Lock className="h-5 w-5" /> Income System Debug
          </h1>
          <p className="text-sm text-kagan-light mb-4">
            Enter your <code className="font-mono text-kagan-gold">ADMIN_SECRET</code> to view the
            live health snapshot of the income generation system.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load();
            }}
            className="space-y-3"
          >
            <input
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="ADMIN_SECRET"
              className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white font-mono focus:outline-none focus:ring-1 focus:ring-kagan-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-kagan-gold px-6 py-2.5 text-sm font-semibold text-black hover:bg-kagan-gold-light disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying…" : "Continue"}
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <p className="text-[11px] text-kagan-muted">
              The secret is verified server-side via a timing-safe HMAC check; the input is
              never persisted.
            </p>
          </form>
        </div>
      </Section>
    );
  }

  if (!health) {
    return (
      <Section variant="hero">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-6 w-6 animate-spin text-kagan-gold" />
        </div>
      </Section>
    );
  }

  return (
    <Section variant="hero">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant={health.ok ? "green" : "amber"} className="mb-2">
              {health.ok ? "All systems operational" : "Degraded"}
            </Badge>
            <h1 className="text-2xl font-extrabold text-kagan-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Income System Debug
            </h1>
            <p className="text-xs text-kagan-muted mt-1 font-mono">
              version: {health.version} · env: {health.environment} · uptime: {health.uptime_seconds}s
            </p>
          </div>
          <button
            onClick={load}
            className="rounded-lg border border-kagan-border bg-kagan-card/40 px-3 py-2 text-xs text-kagan-light hover:text-kagan-gold"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(health.checks).map(([k, v]) => (
            <div
              key={k}
              className={`rounded-xl border p-4 ${
                v.status === "ok"
                  ? "border-green-500/30 bg-green-500/5"
                  : v.status === "degraded"
                  ? "border-kagan-amber/30 bg-kagan-amber/5"
                  : "border-red-500/30 bg-red-500/5"
              }`}
            >
              <div className="flex items-center gap-2">
                {v.status === "ok" ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-kagan-amber" />
                )}
                <span className="text-sm font-bold text-kagan-white font-mono">{k}</span>
                <span className="ml-auto text-xs text-kagan-muted">{v.latency_ms}ms</span>
              </div>
              {v.detail && <p className="text-xs text-kagan-light mt-1">{v.detail}</p>}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-kagan-border bg-kagan-card/30 p-4">
          <h3 className="text-xs font-bold tracking-wider text-kagan-muted uppercase mb-3">Audit endpoints</h3>
          <ul className="text-sm space-y-1">
            {Object.entries(health.audit_endpoints).map(([k, url]) => (
              <li key={k}>
                <a href={url} className="text-kagan-gold hover:underline font-mono text-xs">
                  {url}
                </a>
                <span className="text-kagan-muted"> — {k}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
