"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Lock,
  Copy,
  ExternalLink,
  Zap,
  Database,
  Server,
  Globe,
  Activity,
  TrendingUp,
} from "lucide-react";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";

interface SetupResponse {
  ok: boolean;
  summary: {
    total: number;
    required: number;
    missing_required: number;
    ready: boolean;
  };
  required_now: Array<{ key: string; how: string; notes?: string; generate?: string }>;
  all: Array<{ key: string; required: boolean; status: "set" | "missing" }>;
  next_step: string;
}

interface HealthResponse {
  ok: boolean;
  income_sources: { kv: boolean; paddle: boolean; capi: boolean; ga4: boolean };
  checks: Record<string, { status: string; detail?: string }>;
}

export default function GoLivePage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [setup, setSetup] = useState<SetupResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<unknown>(null);
  const [clearing, setClearing] = useState(false);
  const [clearResult, setClearResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function loadAll(s: string) {
    setError(null);
    try {
      const r1 = await fetch("/api/health", { cache: "no-store" });
      if (r1.ok) {
        const h = await r1.json();
        setHealth(h);
      }
      const r2 = await fetch("/api/income/setup", { cache: "no-store" });
      if (r2.ok) setSetup(await r2.json());
      setAuthed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
    }
  }

  async function seed(days = 7, scale = 1) {
    setSeeding(true);
    setError(null);
    try {
      const r = await fetch("/api/income/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ days, scale, adminSecret: secret }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${r.status}`);
      }
      setSeedResult(await r.json());
      // Reload
      loadAll(secret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  async function clear() {
    setClearing(true);
    setError(null);
    try {
      const r = await fetch("/api/income/clear-test-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ adminSecret: secret }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${r.status}`);
      }
      setClearResult(await r.json());
      loadAll(secret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Clear failed");
    } finally {
      setClearing(false);
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  if (!authed) {
    return (
      <Section variant="hero">
        <div className="max-w-md mx-auto">
          <Badge variant="amber" className="mb-4">Admin</Badge>
          <h1 className="text-2xl font-extrabold text-kagan-white mb-2 flex items-center gap-2">
            <Lock className="h-5 w-5" /> Go-Live Console
          </h1>
          <p className="text-sm text-kagan-light mb-4">
            Enter your <code className="font-mono text-kagan-gold">ADMIN_SECRET</code> to access the
            go-live console, seed the income dashboard, and run the full end-to-end smoke test.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadAll(secret);
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
              className="w-full rounded-xl bg-kagan-gold px-6 py-2.5 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
            >
              Continue
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <p className="text-[11px] text-kagan-muted">
              If ADMIN_SECRET is not yet set, run <code className="font-mono">bash scripts/deploy-live.sh</code> first.
            </p>
          </form>
        </div>
      </Section>
    );
  }

  if (!setup || !health) {
    return (
      <Section variant="hero">
        <div className="text-kagan-muted">Loading…</div>
      </Section>
    );
  }

  const required = setup.all.filter((e) => e.required);
  const setReq = required.filter((e) => e.status === "set").length;
  const allSet = setReq === required.length;

  return (
    <Section variant="hero">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant={allSet ? "green" : "amber"} className="mb-2">
              {allSet ? "All required env vars set" : `${required.length - setReq} required env vars missing`}
            </Badge>
            <h1 className="text-3xl font-extrabold text-kagan-white flex items-center gap-2">
              <Zap className="h-6 w-6" /> Go-Live Console
            </h1>
            <p className="text-sm text-kagan-light mt-1">
              Walk through the env vars, seed the dashboard, smoke-test the funnel.
            </p>
          </div>
          <button
            onClick={() => loadAll(secret)}
            className="rounded-lg border border-kagan-border bg-kagan-card/40 px-3 py-2 text-xs text-kagan-light hover:text-kagan-gold"
          >
            Refresh
          </button>
        </div>

        {/* Required env vars */}
        <div className="mb-6">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
            ⚜ Required env vars ({setReq} / {required.length} set) ⚜
          </h2>
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 divide-y divide-kagan-border/50">
            {required.map((e) => {
              const detail = setup.required_now.find((x) => x.key === e.key);
              return (
                <div key={e.key} className="flex items-center gap-3 p-4">
                  {e.status === "set" ? (
                    <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-kagan-amber shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-kagan-white">{e.key}</div>
                    <div className="text-xs text-kagan-muted">
                      {detail?.notes ?? detail?.how ?? ""}
                    </div>
                  </div>
                  <Badge variant={e.status === "set" ? "green" : "amber"}>
                    {e.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional env vars */}
        {setup.all.filter((e) => !e.required).length > 0 && (
          <details className="mb-6 rounded-xl border border-kagan-border bg-kagan-card/30">
            <summary className="cursor-pointer p-4 text-sm text-kagan-light hover:text-kagan-gold">
              Optional env vars ({setup.all.filter((e) => !e.required).length}) — click to expand
            </summary>
            <div className="px-4 pb-4 divide-y divide-kagan-border/30">
              {setup.all.filter((e) => !e.required).map((e) => (
                <div key={e.key} className="flex items-center gap-3 py-2">
                  {e.status === "set" ? (
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-kagan-border shrink-0" />
                  )}
                  <span className="font-mono text-xs text-kagan-light flex-1">{e.key}</span>
                  <span className="text-xs text-kagan-muted">{e.status}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Income sources */}
        <div className="mb-6">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
            ⚜ Income sources ⚜
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(health.income_sources).map(([k, v]) => (
              <div
                key={k}
                className={`rounded-lg border p-3 ${
                  v ? "border-green-500/30 bg-green-500/5" : "border-kagan-amber/30 bg-kagan-amber/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  {k === "kv" && <Database className="h-4 w-4 text-kagan-gold" />}
                  {k === "paddle" && <Server className="h-4 w-4 text-kagan-gold" />}
                  {k === "capi" && <Activity className="h-4 w-4 text-kagan-gold" />}
                  {k === "ga4" && <Globe className="h-4 w-4 text-kagan-gold" />}
                  <span className="text-sm font-bold text-kagan-white uppercase">{k}</span>
                </div>
                <p className="text-xs text-kagan-light mt-1">{v ? "live" : "off"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Self-test controls */}
        <div className="mb-6">
          <h2 className="text-xs font-bold tracking-[0.25em] text-kagan-gold text-center mb-3 uppercase">
            ⚜ Self-test ⚜
          </h2>
          <div className="rounded-xl border border-kagan-border bg-kagan-card/40 p-5">
            <p className="text-sm text-kagan-light mb-4">
              Seed the income ledger with a realistic 7-day self-test dataset so the dashboard
              has data to render. All seeded records are tagged{" "}
              <code className="font-mono text-kagan-amber">source=self_test</code> in their UTM
              so you can identify and clear them later.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => seed(7, 1)}
                disabled={seeding}
                className="rounded-xl bg-kagan-gold px-4 py-2 text-sm font-semibold text-black hover:bg-kagan-gold-light disabled:opacity-50 transition-colors"
              >
                {seeding ? "Seeding…" : "Seed 7 days"}
              </button>
              <button
                onClick={() => seed(30, 1)}
                disabled={seeding}
                className="rounded-xl border border-kagan-border bg-kagan-card/60 px-4 py-2 text-sm font-semibold text-kagan-white hover:border-kagan-gold/40 disabled:opacity-50 transition-colors"
              >
                Seed 30 days
              </button>
              <button
                onClick={clear}
                disabled={clearing}
                className="ml-auto rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
              >
                {clearing ? "Clearing…" : "Clear test data"}
              </button>
            </div>
            {seedResult && (
              <pre className="mt-4 text-xs text-kagan-light bg-kagan-black/40 rounded-lg p-3 overflow-x-auto">
                {JSON.stringify(seedResult, null, 2)}
              </pre>
            )}
            {clearResult && (
              <pre className="mt-4 text-xs text-kagan-light bg-kagan-black/40 rounded-lg p-3 overflow-x-auto">
                {JSON.stringify(clearResult, null, 2)}
              </pre>
            )}
            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-xl border border-kagan-border bg-kagan-card/30 p-4">
          <h3 className="text-xs font-bold tracking-wider text-kagan-muted uppercase mb-3">Quick links</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {[
              { href: "/income", label: "Income Dashboard" },
              { href: "/api/income/reality", label: "Reality feed" },
              { href: "/api/income/funnel", label: "Funnel" },
              { href: "/api/income/transactions", label: "Transactions" },
              { href: "/api/health", label: "Health" },
              { href: "/api/income/setup", label: "Setup audit" },
              { href: "/admin/income", label: "Admin health" },
              { href: "/api/services/affiliates", label: "Affiliates (real)" },
              { href: "/mission-control", label: "Mission Control" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex items-center gap-1 rounded-lg border border-kagan-border/50 bg-kagan-black/30 px-3 py-2 hover:border-kagan-gold/40 hover:text-kagan-gold"
              >
                <ExternalLink className="h-3 w-3" />
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
