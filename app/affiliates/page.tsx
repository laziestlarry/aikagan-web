import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import Section from "@/components/ui/Section";
import AffiliateDashboard from "./AffiliateDashboard";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Program",
  description:
    "Join the AutonomaX affiliate program — earn 20–30% commission by promoting our digital toolkits (PDF templates, scripts, checklists) to your audience.",
  path: "/affiliates/",
});

export default function AffiliatesPage() {
  return (
    <Section variant="hero">
      <div className="mx-auto max-w-4xl">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Affiliate <span className="text-gradient">Program</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Earn 20–30% commission on every sale you refer. Promote downloadable
            digital toolkits — no inventory, no support tickets, no limits.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#join"
              className="inline-flex items-center gap-2 rounded-lg bg-kagan-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
            >
              Get Your Referral Link
            </a>
            <a
              href="/marketing/"
              className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/40 px-5 py-2.5 text-sm font-semibold text-kagan-gold hover:bg-kagan-gold/10 transition-colors"
            >
              Social Swipes & Templates →
            </a>
          </div>
        </div>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              step: "1",
              title: "Sign up free",
              body: "30 seconds. No approval queue. Get your unique 8-char referral code instantly.",
            },
            {
              step: "2",
              title: "Share your link",
              body: "Post on social, email, or your site. Use our pre-built swipes or write your own. Every click and sale is tracked automatically.",
            },
            {
              step: "3",
              title: "Get paid monthly",
              body: "Commissions released 30 days after each sale (refund window). Payouts via Payoneer, Wise, or bank transfer.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-xl border border-kagan-gold/20 bg-kagan-gold/[0.04] p-6 text-center"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-kagan-gold/40 text-lg font-bold text-kagan-gold mb-4">
                {s.step}
              </span>
              <h3 className="text-lg font-bold text-kagan-white mb-2">{s.title}</h3>
              <p className="text-sm text-kagan-light leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* ── Commissions table ─────────────────────────────────────────── */}
        <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 mb-12">
          <h2 className="text-lg font-bold text-kagan-white mb-4">Commission Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-kagan-border text-kagan-muted text-left">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Your Commission</th>
                </tr>
              </thead>
              <tbody className="text-kagan-light">
                {[
                  { product: "Starter Pack", price: "$29", rate: "30%", earn: "$8.70" },
                  { product: "Pro Pack", price: "$79", rate: "25%", earn: "$19.75" },
                  { product: "Commander Pack", price: "$149", rate: "25%", earn: "$37.25" },
                ].map((row) => (
                  <tr key={row.product} className="border-b border-kagan-border/40">
                    <td className="py-3">{row.product}</td>
                    <td className="py-3">{row.price}</td>
                    <td className="py-3">
                      <span className="text-kagan-gold font-semibold">{row.rate}</span>
                      <span className="text-kagan-muted text-xs ml-2">(~{row.earn}/sale)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-kagan-muted mt-3">
            Plus access to 3 free lead magnets for your audience. The 7-day first-sale blueprint alone has a 14% conversion rate to paid.
          </p>
        </div>

        {/* ── Client dashboard ──────────────────────────────────────────── */}
        <div id="join">
          <AffiliateDashboard />
        </div>
      </div>
    </Section>
  );
}
