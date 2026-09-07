"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Library, Sparkles } from "lucide-react";

export default function ChimeraGenesisPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [briefId, setBriefId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const audience = String(form.get("audience") || "");
    const category = String(form.get("category") || "ABS Blueprint");
    const successCriteria = String(form.get("successCriteria") || "");
    const idea = String(form.get("idea") || "");

    try {
      const [briefRes, leadRes] = await Promise.all([
        fetch("/api/autonomax/briefs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            audience,
            keywords: ["chimera-genesis", "golden-delivery", "bgm", "alexandria"],
            refs: ["https://aikagan.com/genesis"],
            successCriteria: `${successCriteria} Context: ${idea}`.slice(0, 500),
          }),
        }),
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            slug: "ai-venture-launch-blueprint",
            source: "chimera-genesis",
            note: idea,
          }),
        }),
      ]);
      const briefJson = await briefRes.json().catch(() => null);
      if (!briefRes.ok && !leadRes.ok) throw new Error("intake failed");
      setBriefId(typeof briefJson?.brief?.id === "string" ? briefJson.brief.id : null);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">ProfitOS · Chimera Genesis</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-[-0.04em] sm:text-6xl">
          File the customer. Generate the blueprint. Route a Golden Delivery.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
          Alexandria stores acknowledged intakes. AutonomaX issues a Customer Success Plan. Paid Golden Delivery packs
          remain the downloadable operating kit. Scoped BizOp work stays intake-only until terms are written.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["01 Intake", "Name audience + 30-day outcome"],
            ["02 Alexandria", "Brief queued with success plan"],
            ["03 Delivery", "Free scan or $29 Starter pack"],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">{title}</p>
              <p className="mt-2 text-sm text-neutral-300">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-4xl rounded-3xl border border-amber-300/20 bg-[#111018] p-8">
        {status === "success" ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
            <h2 className="mt-4 text-3xl font-black">Intake acknowledged</h2>
            <p className="mt-3 text-neutral-300">
              {briefId ? `Alexandria file ${briefId}. ` : ""}A Customer Success Plan is ready for operator review. AI draft generation still needs a configured model key.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/products/masterclass-starter" className="rounded-xl bg-amber-300 px-6 py-3 font-black text-black">Buy Starter $29</Link>
              <Link href="/dashboard" className="rounded-xl border border-white/15 px-6 py-3 font-bold">Open workspace</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <Library className="h-6 w-6 text-amber-300" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Alexandria intake</p>
                <h2 className="text-2xl font-black">BGM-enhanced ABS Blueprint request</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Email
                <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300/50" />
              </label>
              <label className="text-sm font-medium">Offer category
                <select name="category" className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300/50">
                  <option>ABS Blueprint</option>
                  <option>Golden Delivery</option>
                  <option>BizOp generation</option>
                  <option>Supplier RoI loop</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium">Audience / buyer
              <input name="audience" required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300/50" />
            </label>
            <label className="block text-sm font-medium">Idea, niche, or dormant project
              <textarea name="idea" rows={4} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300/50" />
            </label>
            <label className="block text-sm font-medium">30-day success criteria
              <textarea name="successCriteria" rows={3} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-300/50" />
            </label>
            {status === "error" ? <p className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">Could not file this intake. Email hello@aikagan.com.</p> : null}
            <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3 font-black text-black disabled:opacity-60">
              <Sparkles className="h-4 w-4" /> {status === "sending" ? "Filing…" : "File in Alexandria"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
