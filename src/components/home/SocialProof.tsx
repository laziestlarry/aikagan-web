"use client";

import { CheckCircle2, Gift, ShieldCheck } from "lucide-react";

const EVIDENCE = [
  {
    icon: Gift,
    title: "Try before you decide",
    body: "The first experiences are free so you can judge usefulness before choosing a product or service.",
  },
  {
    icon: ShieldCheck,
    title: "Clear commercial boundary",
    body: "Free use, paid checkout, delivery, and customer access are separate states. Reaching a page is never treated as proof of payment.",
  },
  {
    icon: CheckCircle2,
    title: "Know what happens next",
    body: "If you choose a paid option, the product page states what is delivered, how access works, and where support is available.",
  },
];

export default function SocialProof() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-sm font-semibold text-emerald-300">Designed to reduce the risk of trying something new</p>
        <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">Understand the value first. Make the buying decision second.</h2>
        <p className="mx-auto mb-12 max-w-2xl text-sm leading-7 text-neutral-400">AIKAGAN does not require you to believe a long feature list. Start with a free experience, inspect the result, and only continue if it solves a real problem for you.</p>

        <div className="grid gap-6 md:grid-cols-3">
          {EVIDENCE.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all hover:border-amber-300/30">
              <Icon className="mb-5 h-6 w-6 text-amber-300" />
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
