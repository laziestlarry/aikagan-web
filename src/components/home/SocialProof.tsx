"use client";

import { CheckCircle2, Database, ShieldCheck } from "lucide-react";

const EVIDENCE = [
  {
    icon: ShieldCheck,
    title: "Verified checkout routing",
    body: "Paid calls to action are routed through the first payment rail that passes the live production configuration gate.",
  },
  {
    icon: Database,
    title: "Durable order evidence",
    body: "Successful provider webhooks issue expiring access and write the order into the shared revenue ledger and fulfillment queue.",
  },
  {
    icon: CheckCircle2,
    title: "Defined delivery promise",
    body: "Each product page states exactly what is delivered, how access is issued, and which refund and support terms apply.",
  },
];

export default function SocialProof() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-300/70">
          Operational evidence
        </p>
        <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
          Trust the verified delivery path, not invented numbers
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-sm leading-7 text-neutral-400">
          Customer counts, ratings, and revenue outcomes are published only after they exist in the live ledger. Until then, the storefront shows the controls that protect checkout and fulfillment.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {EVIDENCE.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all hover:border-amber-300/30"
            >
              <Icon className="mb-5 h-6 w-6 text-amber-300" />
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-400">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-neutral-500">
          <span>Expiring download tokens</span>
          <span>·</span>
          <span>Webhook signature validation</span>
          <span>·</span>
          <span>Durable KV fulfillment queue</span>
          <span>·</span>
          <span>Published refund terms</span>
        </div>
      </div>
    </section>
  );
}
