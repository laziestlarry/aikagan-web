"use client";

import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Closed my first $500 deal on Day 5. The DM scripts are insane.",
    name: "Marcus",
    role: "Indie Hacker, devmarcus_builds",
  },
  {
    quote: "Bought Starter, upgraded to Commander the same day. ROI in week one.",
    name: "Sophia",
    role: "Founder, soph.automates",
  },
  {
    quote: "The Automation Setup was worth every dollar. They aligned our checkout, webhooks, and delivery in 48 hours. Hands-off transformation.",
    name: "Alex Chen",
    role: "CTO, SaaSGrid",
  },
];

export default function SocialProof() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">
          What operators say
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
          Real results from real builders
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left hover:border-amber-300/30 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                ))}
              </div>

              <p className="text-neutral-200 text-sm leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-neutral-500">
          <span>256-bit Encrypted Checkout</span>
          <span>·</span>
          <span>Instant Digital Delivery</span>
          <span>·</span>
          <span>30-Day Money-Back Guarantee</span>
          <span>·</span>
          <span>Paddle Merchant of Record</span>
        </div>
      </div>
    </section>
  );
}
