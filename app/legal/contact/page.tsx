export const metadata = {
  title: "Contact & Support | AIKAGAN",
  description: "Get help with your AIKAGAN order, product questions, or business inquiries.",
};

import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-amber-300 mb-4">Support</p>
        <h1 className="text-4xl font-bold mb-4">Contact &amp; Support</h1>
        <p className="text-neutral-400 mb-12 text-lg">
          We respond within 2 business days. For urgent delivery issues, email us directly.
        </p>

        {/* Quick-start CTA */}
        <div className="rounded-2xl border border-amber-300/20 bg-[#0d0b07] p-8 mb-8">
          <h2 className="text-xl font-semibold mb-2">Not sure which pack to start with?</h2>
          <p className="text-neutral-400 mb-5">
            Start with Starter at $29 — it&apos;s the lowest-risk entry with a clear 7-day execution map.
            Or grab Pro if you already have an offer and need the full funnel + automation stack.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products/masterclass-starter"
              className="inline-block bg-amber-300 text-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-200 transition">
              Starter — $29 →
            </Link>
            <Link href="/products/masterclass-pro"
              className="inline-block border border-amber-300/40 text-amber-300 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-amber-300/10 transition">
              Pro — $79 →
            </Link>
          </div>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#0d0b07] p-6">
            <h3 className="font-semibold text-amber-300 mb-2">Order &amp; Delivery Support</h3>
            <p className="text-neutral-400 text-sm mb-3">
              Didn&apos;t receive your download? Wrong files? Email us with your order ID.
            </p>
            <a href="mailto:support@aikagan.com"
              className="text-amber-300 underline text-sm hover:text-amber-200">
              support@aikagan.com
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0b07] p-6">
            <h3 className="font-semibold text-amber-300 mb-2">Refund Requests</h3>
            <p className="text-neutral-400 text-sm mb-3">
              Not satisfied? Email within 30 days of purchase with your order ID.
              We review and respond within 2 business days.
            </p>
            <a href="/legal/refund/"
              className="text-amber-300 underline text-sm hover:text-amber-200">
              View refund policy →
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0b07] p-6">
            <h3 className="font-semibold text-amber-300 mb-2">Business &amp; Partnership</h3>
            <p className="text-neutral-400 text-sm mb-3">
              Interested in the Commander white-label, custom advisory, or a partnership arrangement.
            </p>
            <a href="mailto:support@aikagan.com"
              className="text-amber-300 underline text-sm hover:text-amber-200">
              support@aikagan.com
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0b07] p-6">
            <h3 className="font-semibold text-amber-300 mb-2">Response Time</h3>
            <p className="text-neutral-400 text-sm">
              We respond within <strong className="text-white">2 business days</strong> (Mon–Fri).
              Delivery issues are prioritised and typically resolved same-day.
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-600 text-center">
          support@aikagan.com · aikagan.com
        </p>
      </section>
    </main>
  );
}
