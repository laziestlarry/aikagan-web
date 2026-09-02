import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import Section from "@/components/ui/Section";

export const metadata: Metadata = buildMetadata({
  title: "Referral Program Review",
  description:
    "AIKAGAN is reviewing its referral program while paid offers and fulfillment are revalidated. No commission schedule is currently being advertised.",
  path: "/affiliates/",
});

export default function AffiliatesPage() {
  return (
    <Section variant="hero">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold text-emerald-300">COMMERCIAL INTEGRITY REVIEW</p>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-kagan-white">
          Referral program is being <span className="text-gradient">revalidated.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-kagan-light">
          Previous product prices, commission rates and program statistics are not being presented as current offers while AIKAGAN revalidates pricing, checkout, fulfillment and attribution end to end.
        </p>
        <div className="mt-8 rounded-2xl border border-kagan-border bg-kagan-card/60 p-6 text-left">
          <h2 className="text-lg font-bold text-kagan-white">What is available now</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-kagan-light">
            <li>• Share useful free tools with people who could genuinely benefit.</li>
            <li>• Referral-tagged links may be used for traffic attribution and learning.</li>
            <li>• No commission, payout or earnings promise is made until a current program is explicitly published.</li>
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/network" className="rounded-lg bg-kagan-gold px-5 py-3 text-sm font-semibold text-black hover:bg-kagan-gold-light">Join & share</Link>
          <Link href="/tools" className="rounded-lg border border-kagan-gold/40 px-5 py-3 text-sm font-semibold text-kagan-gold hover:bg-kagan-gold/10">Try free tools</Link>
        </div>
      </div>
    </Section>
  );
}
