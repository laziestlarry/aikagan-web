import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Workflow } from 'lucide-react';
import AutonomaXBlueprintConsole from '@/components/shared/AutonomaXBlueprintConsole';
import WorkspaceEntry from '@/components/autonomax/WorkspaceEntry';
import LazyLarryGuide from '@/components/autonomax/LazyLarryGuide';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/constants';

const autonomaxMetadata = buildMetadata({
  title: 'AutonomaX Control Plane',
  description:
    'Live blueprint, readiness gates, governed ProductBrief intake, agent mandates, and product-to-revenue pipeline for AutonomaX.',
  path: '/autonomax',
});

export const metadata: Metadata = {
  ...autonomaxMetadata,
  metadataBase: new URL(SITE.appUrl),
  alternates: { canonical: `${SITE.appUrl}/autonomax` },
  robots: { index: false, follow: false },
  openGraph: { ...autonomaxMetadata.openGraph, url: `${SITE.appUrl}/autonomax` },
};

export default function AutonomaXPage() {
  return (
    <>
      <Section variant="hero">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <Badge variant="green" className="mb-4">Blueprint v1 · Live Upgrade</Badge>
          <h1 className="text-4xl font-extrabold text-kagan-white md:text-6xl">
            Autonoma<span className="text-gradient">X outcome workspace</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-kagan-light">
            Install an outcome-ready business system you own: reusable workflows, operating procedures, controls, and
            acceptance evidence—without tying your business to another AI platform.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="#workspace-access"
              className="inline-flex items-center gap-2 rounded-xl border border-kagan-gold/35 px-5 py-3 text-sm font-bold text-kagan-gold transition hover:bg-kagan-gold/10"
            >
              Create or access workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-kagan-gold px-5 py-3 text-sm font-extrabold text-black transition hover:bg-kagan-gold-light"
            >
              Open customer workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/genesis"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/35 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-300/10"
            >
              Chimera Genesis intake <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <AutonomaXBlueprintConsole />
        </div>
      </Section>

      <Section variant="alt">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl"><Badge variant="gold" className="mb-4">Verified Gumroad rail</Badge><h2 className="text-3xl font-extrabold text-kagan-white md:text-4xl">Add the ready-made assets that match your mission.</h2><p className="mt-4 leading-7 text-kagan-light">AIKAGAN records the checkout handoff, then Gumroad processes payment. A verified provider sale activates the corresponding entitlement and delivery workflow.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{[
            ['Starter','$29','masterclass-starter'],['Pro','$79','masterclass-pro'],['Commander','$149','masterclass-commander'],
          ].map(([name,price,slug])=><article key={slug} className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6"><p className="text-xs font-black uppercase tracking-[.2em] text-kagan-muted">AutonomaX {name}</p><p className="mt-4 text-3xl font-extrabold text-kagan-white">{price}</p><a href={`/api/income/checkout?slug=${slug}&provider=gumroad`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-kagan-gold px-5 py-3 text-sm font-extrabold text-black">Continue to Gumroad <ArrowRight className="h-4 w-4"/></a></article>)}</div>
        </div>
      </Section>

      <Section variant="alt">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {[
            ['01', 'Name the outcome', 'Choose one operational result and the evidence that will show it is complete.'],
            ['02', 'Use your stack', 'Deploy the provided workflow and procedure with the tools and vendors you already use.'],
            ['03', 'Review the proof', 'Keep the test, acceptance check, delivery record, and recovery path visible.'],
          ].map(([number, title, body]) => (
            <article key={number} className="rounded-2xl border border-kagan-border bg-kagan-card/50 p-6">
              <p className="text-xs font-black tracking-[0.2em] text-kagan-gold">{number}</p>
              <Workflow className="mt-5 h-5 w-5 text-emerald-300" />
              <h2 className="mt-4 text-xl font-bold text-kagan-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-kagan-light">{body}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-6xl">
          <WorkspaceEntry id="workspace-access" />
        </div>
        <div className="mx-auto mt-6 max-w-6xl">
          <LazyLarryGuide />
        </div>
      </Section>

      <Section variant="hero">
        <div className="mx-auto max-w-4xl rounded-3xl border border-kagan-gold/20 bg-kagan-gold/[0.04] p-7 md:p-10">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 flex-none text-kagan-gold" />
            <div>
              <h2 className="text-2xl font-bold text-kagan-white">Operational contract and escalation</h2>
              <p className="mt-3 leading-7 text-kagan-light">
                A workspace records planning, mission inputs, entitlements, deliverable links, and support requests. It does
                not by itself configure AI models, run your vendors, process a payment, or fulfill an order. A queued brief
                is evidence of intake—not generation, publication, payment, or fulfillment. Each downstream state needs its
                own verified event and release gate.
              </p>
              <p className="mt-4 flex gap-2 text-sm leading-6 text-kagan-light">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
                If the result is blocked or its acceptance evidence is missing, use the workspace support route to record
                the blocker, expected result, and recovery context for triage.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
