'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Database,
  Loader2,
  Send,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

interface Director {
  id: string;
  title: string;
  mandate: string;
  owns: string[];
}

interface PipelineStage {
  id: string;
  title: string;
  output: string;
  event: string;
}

interface Gate {
  id: string;
  title: string;
  required: boolean;
  configured: boolean;
  state: 'ready' | 'blocked';
  detail: string;
}

interface BlueprintResponse {
  ok: boolean;
  generatedAt: string;
  blueprint: {
    version: string;
    northStar: string;
    criticalPath: readonly string[];
    directors: Director[];
    executors: readonly string[];
    pipeline: PipelineStage[];
  };
  runtime: {
    state: 'ready' | 'blocked';
    requiredReady: number;
    requiredTotal: number;
    queueDepth: number;
    gates: Gate[];
  };
}

const EMPTY_FORM = {
  category: '',
  audience: '',
  keywords: '',
  successCriteria: '',
};

export default function AutonomaXBlueprintConsole() {
  const [data, setData] = useState<BlueprintResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/autonomax/blueprint', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Blueprint status failed (${response.status})`);
      setData((await response.json()) as BlueprintResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load blueprint status.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResult('');
    setError('');

    try {
      const response = await fetch('/api/autonomax/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: form.category,
          audience: form.audience,
          keywords: form.keywords
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          successCriteria: form.successCriteria,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        brief?: { id: string };
        nextAction?: string;
      };
      if (!response.ok) throw new Error(payload.error || 'Brief intake failed.');
      setResult(`Queued brief ${payload.brief?.id ?? ''}. ${payload.nextAction ?? ''}`.trim());
      setForm(EMPTY_FORM);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Brief intake failed.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-3xl border border-kagan-gold/20 bg-kagan-card/30">
        <Loader2 className="h-7 w-7 animate-spin text-kagan-gold" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-red-400/30 bg-red-400/[0.05] p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-300" />
        <p className="mt-4 text-sm text-red-100">{error || 'Blueprint status is unavailable.'}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-5 rounded-lg border border-red-300/30 px-4 py-2 text-sm font-semibold text-red-100"
        >
          Retry
        </button>
      </div>
    );
  }

  const ready = data.runtime.state === 'ready';

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatusTile
          icon={ready ? CheckCircle2 : AlertTriangle}
          label="Required gates"
          value={`${data.runtime.requiredReady}/${data.runtime.requiredTotal}`}
          state={ready ? 'ready' : 'blocked'}
        />
        <StatusTile icon={Database} label="Brief queue" value={String(data.runtime.queueDepth)} />
        <StatusTile icon={Bot} label="Director agents" value={String(data.blueprint.directors.length)} />
        <StatusTile icon={Workflow} label="Pipeline stages" value={String(data.blueprint.pipeline.length)} />
      </section>

      <section className="rounded-3xl border border-kagan-gold/25 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_42%),rgba(13,13,16,0.9)] p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-kagan-gold">
              Blueprint {data.blueprint.version}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-kagan-white">Governed autonomous commerce control plane</h2>
            <p className="mt-4 leading-7 text-kagan-light">{data.blueprint.northStar}</p>
          </div>
          <span
            className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${
              ready
                ? 'border-emerald-300/35 bg-emerald-300/10 text-emerald-200'
                : 'border-amber-300/35 bg-amber-300/10 text-amber-200'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${ready ? 'bg-emerald-300' : 'bg-amber-300'}`} />
            {ready ? 'Execution ready' : 'Blocked gates visible'}
          </span>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {data.blueprint.criticalPath.map((item, index) => (
            <div key={item} className="flex items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-kagan-light">
                {item}
              </span>
              {index < data.blueprint.criticalPath.length - 1 ? (
                <ArrowRight className="h-3.5 w-3.5 text-kagan-gold/60" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-kagan-gold">Runtime truth</p>
            <h2 className="mt-2 text-2xl font-bold text-kagan-white">Capability gates</h2>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="rounded-lg border border-kagan-gold/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-kagan-gold disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Refresh'}
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.runtime.gates.map((gate) => (
            <article key={gate.id} className="rounded-2xl border border-kagan-border bg-kagan-card/40 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-kagan-white">{gate.title}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-kagan-muted">
                    {gate.required ? 'Required' : 'Advisory'}
                  </p>
                </div>
                {gate.configured ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-300" />
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-kagan-light">{gate.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-kagan-border bg-kagan-card/30 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-kagan-gold">Agent organization</p>
          <h2 className="mt-2 text-2xl font-bold text-kagan-white">Director mandates</h2>
          <div className="mt-6 space-y-4">
            {data.blueprint.directors.map((director) => (
              <article key={director.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-kagan-gold" />
                  <div>
                    <h3 className="font-bold text-kagan-white">{director.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-kagan-light">{director.mandate}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {director.owns.map((item) => (
                        <span key={item} className="rounded-full border border-kagan-gold/20 px-2.5 py-1 text-[10px] uppercase tracking-wider text-kagan-gold/80">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <form onSubmit={submitBrief} className="rounded-3xl border border-kagan-gold/25 bg-kagan-gold/[0.04] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Send className="h-5 w-5 text-kagan-gold" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-kagan-gold">Catalog Brain intake</p>
          </div>
          <h2 className="mt-3 text-2xl font-bold text-kagan-white">Queue a ProductBrief</h2>
          <p className="mt-3 text-sm leading-6 text-kagan-light">
            This stores a real brief in the durable queue. It does not claim that generation or publishing occurred.
          </p>

          <div className="mt-6 space-y-4">
            <Field label="Category" value={form.category} onChange={(value) => setForm({ ...form, category: value })} placeholder="e.g. AI revenue operations audit" required />
            <Field label="Audience" value={form.audience} onChange={(value) => setForm({ ...form, audience: value })} placeholder="Founder with a stalled app and broken checkout" required />
            <Field label="Keywords" value={form.keywords} onChange={(value) => setForm({ ...form, keywords: value })} placeholder="checkout repair, delivery automation, launch audit" />
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">Success criteria</span>
              <textarea
                value={form.successCriteria}
                onChange={(event) => setForm({ ...form, successCriteria: event.target.value })}
                rows={4}
                maxLength={500}
                placeholder="Define measurable completion evidence."
                className="mt-2 w-full rounded-xl border border-kagan-border bg-black/30 px-4 py-3 text-sm text-kagan-white outline-none transition focus:border-kagan-gold/60"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-kagan-gold px-5 py-3.5 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-kagan-gold-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Queuing brief…' : 'Queue ProductBrief'}
          </button>

          {result ? <p className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-300/[0.06] p-3 text-sm leading-6 text-emerald-100">{result}</p> : null}
          {error ? <p className="mt-4 rounded-xl border border-red-300/25 bg-red-300/[0.06] p-3 text-sm leading-6 text-red-100">{error}</p> : null}
        </form>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-kagan-gold">Product to revenue</p>
        <h2 className="mt-2 text-2xl font-bold text-kagan-white">Governed pipeline</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.blueprint.pipeline.map((stage, index) => (
            <article key={stage.id} className="rounded-2xl border border-kagan-border bg-kagan-card/30 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-kagan-gold">{String(index + 1).padStart(2, '0')}</span>
                <Activity className="h-4 w-4 text-kagan-muted" />
              </div>
              <h3 className="mt-4 font-bold text-kagan-white">{stage.title}</h3>
              <p className="mt-2 text-sm leading-6 text-kagan-light">{stage.output}</p>
              <code className="mt-4 block break-all rounded-lg bg-black/35 px-3 py-2 text-[10px] text-emerald-300">{stage.event}</code>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusTile({
  icon: Icon,
  label,
  value,
  state,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  state?: 'ready' | 'blocked';
}) {
  return (
    <div className="rounded-2xl border border-kagan-border bg-kagan-card/40 p-5">
      <div className="flex items-center justify-between">
        <Icon className={`h-5 w-5 ${state === 'ready' ? 'text-emerald-300' : state === 'blocked' ? 'text-amber-300' : 'text-kagan-gold'}`} />
        {state ? <span className="text-[10px] font-bold uppercase tracking-wider text-kagan-muted">{state}</span> : null}
      </div>
      <p className="mt-5 text-3xl font-extrabold text-kagan-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-kagan-light">{label}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-kagan-light">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={240}
        className="mt-2 w-full rounded-xl border border-kagan-border bg-black/30 px-4 py-3 text-sm text-kagan-white outline-none transition focus:border-kagan-gold/60"
      />
    </label>
  );
}
