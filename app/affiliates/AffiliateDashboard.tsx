"use client";

import { useEffect, useState } from "react";

/* ───────────────────────────────────────────────────────────────────────────
 * AffiliateDashboard — Live stats + referral link generator
 *
 * Uses the local /api/affiliate/* routes (Vercel KV + in-memory fallback)
 * so it works in dev without a FastAPI backend running.
 *
 * If the user is already registered (localStorage), it loads their stats
 * from /api/affiliate/stats/[code]?email=...
 * ─────────────────────────────────────────────────────────────────────────── */

interface AffiliateStats {
  code: string;
  name: string;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalCommission: number | null;
  pendingCommission: number | null;
  paidCommission: number | null;
  payoutLog?: Array<{ at: number; amount: number; note?: string }>;
}

interface ProgramStats {
  total_affiliates: number;
  total_paid: number;
  total_pending: number;
  total_clicks: number;
  total_conversions: number;
}

const PROGRAM_FALLBACK: ProgramStats = {
  total_affiliates: 0,
  total_paid: 0,
  total_pending: 0,
  total_clicks: 0,
  total_conversions: 0,
};

const STORAGE_KEY = "aikagan:affiliate";

interface StoredAffiliate {
  code: string;
  name: string;
  email: string;
  registeredAt: number;
}

export default function AffiliateDashboard() {
  const [stored, setStored] = useState<StoredAffiliate | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [program, setProgram] = useState<ProgramStats>(PROGRAM_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load stored affiliate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStored(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Fetch program-level stats
  useEffect(() => {
    fetch("/api/affiliate/stats/aggregate")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setProgram(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch personal stats when stored affiliate is known
  useEffect(() => {
    if (!stored) return;
    fetch(`/api/affiliate/stats/${stored.code}?email=${encodeURIComponent(stored.email)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, [stored]);

  /* Register as a new affiliate */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || registering) return;
    setRegistering(true);
    setError(null);
    try {
      const res = await fetch("/api/affiliate/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      const newStored: StoredAffiliate = {
        code: data.code,
        name: data.name,
        email: data.email,
        registeredAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStored));
      setStored(newStored);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  /* Reset (for testing) */
  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStored(null);
    setStats(null);
  };

  const copyLink = () => {
    if (!stored) return;
    const link = `${window.location.origin}/?ref=${stored.code}`;
    navigator.clipboard.writeText(link).catch(() => {});
  };

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-8">
      {!stored ? (
        /* ── Registration form ─────────────────────────────────────────── */
        <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6">
          <h2 className="text-lg font-bold text-kagan-white mb-4">Get Your Referral Link</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="aff-name" className="block text-sm text-kagan-muted mb-1">
                Your Name
              </label>
              <input
                id="aff-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold"
              />
            </div>
            <div>
              <label htmlFor="aff-email" className="block text-sm text-kagan-muted mb-1">
                Your Email
              </label>
              <input
                id="aff-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold"
              />
            </div>
            <button
              type="submit"
              disabled={registering}
              className="rounded-xl bg-kagan-gold px-6 py-2.5 text-sm font-semibold text-black hover:bg-kagan-gold-light disabled:opacity-50 transition-colors"
            >
              {registering ? "Creating…" : "Get My Link"}
            </button>
            {error && <p className="text-xs text-red-400">{error}</p>}
          </form>
        </div>
      ) : (
        /* ── Dashboard ─────────────────────────────────────────────────── */
        <>
          <div className="rounded-xl border border-kagan-gold/30 bg-kagan-gold/[0.06] p-6">
            <h2 className="text-lg font-bold text-kagan-white mb-3">Your Referral Link</h2>
            <div className="flex items-center gap-2 mb-3">
              <code className="flex-1 rounded-lg border border-kagan-border bg-kagan-black/80 px-4 py-2.5 text-sm text-kagan-gold font-mono break-all">
                {`${typeof window !== "undefined" ? window.location.origin : "https://aikagan.com"}/?ref=${stored.code}`}
              </code>
              <button
                onClick={copyLink}
                className="shrink-0 rounded-lg bg-kagan-gold px-4 py-2.5 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-kagan-muted">
              Share this link on social media, in your email signature, or on your website.
              Every sale through this link earns you commission.
            </p>
          </div>

          {/* Earnings snapshot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card label="Clicks" value={stats?.totalClicks.toLocaleString() ?? "—"} />
            <Card label="Conversions" value={stats?.totalConversions.toLocaleString() ?? "—"} />
            <Card
              label="Conv. Rate"
              value={
                stats
                  ? `${(stats.conversionRate * 100).toFixed(1)}%`
                  : "—"
              }
            />
            <Card
              label="Total Earned"
              value={
                stats?.totalCommission !== undefined && stats?.totalCommission !== null
                  ? `$${stats.totalCommission.toFixed(2)}`
                  : "—"
              }
              accent
            />
          </div>

          {/* Pending / Paid breakdown */}
          {stats?.pendingCommission !== null && (
            <div className="grid grid-cols-2 gap-4">
              <Card
                label="Pending Payout"
                value={
                  stats?.pendingCommission !== undefined && stats?.pendingCommission !== null
                    ? `$${stats.pendingCommission.toFixed(2)}`
                    : "—"
                }
                accent="amber"
              />
              <Card
                label="Paid Out"
                value={
                  stats?.paidCommission !== undefined && stats?.paidCommission !== null
                    ? `$${stats.paidCommission.toFixed(2)}`
                    : "—"
                }
              />
            </div>
          )}

          {/* Payout log */}
          {stats?.payoutLog && stats.payoutLog.length > 0 && (
            <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6">
              <h3 className="text-sm font-bold text-kagan-gold mb-3 uppercase tracking-wider">
                Payout History
              </h3>
              <ul className="space-y-2 text-sm">
                {stats.payoutLog.map((entry, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-kagan-border/30 pb-2"
                  >
                    <span className="text-kagan-muted">
                      {new Date(entry.at).toLocaleDateString()}
                      {entry.note && ` — ${entry.note}`}
                    </span>
                    <span className="text-kagan-gold font-mono">${entry.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleReset}
            className="text-xs text-kagan-muted hover:text-kagan-gold transition-colors"
          >
            Not you? Reset and register a different account
          </button>
        </>
      )}

      {/* ── Program-level stats ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6">
        <h2 className="text-lg font-bold text-kagan-white mb-4">Program Statistics</h2>
        {loading ? (
          <p className="text-sm text-kagan-muted">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card label="Affiliates" value={program.total_affiliates.toLocaleString()} />
            <Card label="Clicks" value={program.total_clicks.toLocaleString()} />
            <Card label="Conversions" value={program.total_conversions.toLocaleString()} />
            <Card
              label="Paid Out"
              value={`$${program.total_paid.toLocaleString()}`}
              accent
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-kagan-light mb-4">
          Questions about the program?{" "}
          <a href="mailto:affiliates@autonomax.ai" className="text-kagan-gold hover:underline">
            affiliates@autonomax.ai
          </a>
        </p>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean | "amber";
}) {
  const color =
    accent === "amber"
      ? "text-kagan-amber"
      : accent
      ? "text-kagan-gold"
      : "text-kagan-white";
  return (
    <div className="rounded-lg border border-kagan-border/50 bg-kagan-black/40 p-4 text-center">
      <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
      <div className="text-xs text-kagan-muted mt-1">{label}</div>
    </div>
  );
}
