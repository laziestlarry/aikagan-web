"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, FileText, Loader2, Send } from "lucide-react";

function BlueprintIntakeForm() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "ai-venture-launch-blueprint";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          slug: product,
          source: "blueprint-intake",
          interest: "ai-venture-launch-blueprint",
        }),
      });
      if (!res.ok) throw new Error("Intake failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
        <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-400/25 bg-[#111827] p-8 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
          <h1 className="mt-4 text-3xl font-bold">Blueprint intake received</h1>
          <p className="mt-3 text-neutral-300">
            AutonomaX now has the context needed to prepare your launch blueprint. Watch your email for confirmation, clarifying questions, and delivery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className="rounded-2xl bg-amber-300 px-6 py-3 font-semibold text-black hover:bg-amber-200">
              Open dashboard
            </Link>
            <Link href="/products" className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5">
              View offers
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-16 text-white">
      <section className="mx-auto max-w-3xl">
        <Link href="/products/ai-venture-launch-blueprint" className="text-sm text-amber-300">
          ← Blueprint offer
        </Link>

        <div className="mt-8 rounded-3xl border border-sky-300/20 bg-[#111827] p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-3 text-sky-300">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Post-purchase intake</p>
              <h1 className="text-3xl font-bold">AI Venture Launch Blueprint</h1>
            </div>
          </div>

          <p className="mt-5 text-neutral-300">
            Provide the core context for your idea, niche, or dormant project. Keep it practical; the goal is to produce a launch-ready business map, not a generic report.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-200">
                Name
                <input name="name" required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/60" />
              </label>
              <label className="block text-sm font-medium text-neutral-200">
                Email
                <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/60" />
              </label>
            </div>

            <label className="block text-sm font-medium text-neutral-200">
              Venture idea or project concept
              <textarea name="idea" rows={4} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/60" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-200">
                Niche / audience
                <input name="niche" required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/60" />
              </label>
              <label className="block text-sm font-medium text-neutral-200">
                Current stage
                <select name="project_stage" required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/60">
                  <option value="">Select stage</option>
                  <option value="idea">Idea only</option>
                  <option value="assets">Existing assets</option>
                  <option value="prototype">Prototype or app exists</option>
                  <option value="selling">Already selling</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-neutral-200">
              What outcome do you want in the next 30 days?
              <textarea name="desired_outcome" rows={3} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/60" />
            </label>

            <label className="block text-sm font-medium text-neutral-200">
              Constraints, budget, tools, or links
              <textarea name="constraints" rows={3} className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/60" />
            </label>

            <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            {status === "error" && (
              <p className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                Intake could not be sent. Email hello@aikagan.com with your order details.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-7 py-4 font-semibold text-black hover:bg-amber-200 disabled:opacity-60"
            >
              {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Submit intake
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function BlueprintIntakePage() {
  return (
    <Suspense>
      <BlueprintIntakeForm />
    </Suspense>
  );
}
