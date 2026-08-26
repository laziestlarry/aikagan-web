import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { SITE } from '@/lib/constants';
import Section from '@/components/ui/Section';
import ProcessStages from '@/components/shared/ProcessStages';
import CTA from '@/components/ui/CTA';
import Badge from '@/components/ui/Badge';
import LiveReadinessPanel from '@/components/shared/LiveReadinessPanel';

export const metadata: Metadata = buildMetadata({
  title: 'System Status & Customer Journey',
  description:
    'Public AIKAGAN trust surface: what customers can do, how fulfillment is verified, and where to enter the AutonomaX application.',
  path: '/mission-control/',
});

const JOURNEY = [
  { n: '1', label: 'Discover', body: 'Understand the outcome, scope, price, and evidence standard before buying.', href: '/products', linkLabel: 'Explore offers' },
  { n: '2', label: 'Experience', body: 'Use a free sample or product explanation to validate fit before committing.', href: '/free/golden-delivery-sample', linkLabel: 'Try a sample' },
  { n: '3', label: 'Buy', body: 'Complete checkout through the named payment provider for the selected offer.', href: '/products', linkLabel: 'Choose a product' },
  { n: '4', label: 'Activate', body: 'Move into the AutonomaX application for the post-purchase execution experience.', href: `${SITE.appUrl}/dashboard`, linkLabel: 'Open the app', external: true },
  { n: '5', label: 'Execute', body: 'Run the governed workflow and create the actual customer deliverable.', href: `${SITE.appUrl}/autonomax`, linkLabel: 'Open AutonomaX', external: true },
  { n: '6', label: 'Verify', body: 'Keep fulfillment, production state, and commercial evidence distinct and inspectable.', href: '/contact', linkLabel: 'Get support' },
] as const;

const PUBLIC_PROOFS = [
  'Offer and fulfillment terms are stated before checkout.',
  'App access is separated from the marketing storefront.',
  'Generated work is not treated as evidence of payment or fulfillment.',
  'Internal CRM, revenue, investment, and administrative metrics are not part of the public customer journey.',
];

export default function MissionControlPage() {
  return (
    <>
      <Section variant="hero">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Badge variant="green" className="mb-4">Public Trust Surface</Badge>
            <h1 className="text-4xl font-extrabold text-kagan-white md:text-6xl">
              From promise to <span className="text-gradient">verified delivery</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-kagan-light">
              This page explains the customer value chain and system readiness without exposing AIKAGAN's private sales,
              financial, CRM, or administrative dashboards.
            </p>
          </div>

          <div className="mb-14 grid gap-3 md:grid-cols-6">
            {JOURNEY.map((step, index) => {
              const body = (
                <>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-kagan-gold/40 text-xs font-bold text-kagan-gold">{step.n}</span>
                    <span className="text-sm font-bold uppercase tracking-wider text-kagan-white">{step.label}</span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-kagan-light">{step.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-kagan-gold">
                    {step.linkLabel} <ArrowRight className="h-3 w-3" />
                  </span>
                  {index < JOURNEY.length - 1 && (
                    <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-kagan-gold/35 md:block">→</span>
                  )}
                </>
              );

              return 'external' in step && step.external ? (
                <a key={step.n} href={step.href} className="relative flex min-h-48 flex-col rounded-xl border border-kagan-gold/20 bg-kagan-gold/[0.04] p-4 transition hover:border-kagan-gold/55">
                  {body}
                </a>
              ) : (
                <Link key={step.n} href={step.href} className="relative flex min-h-48 flex-col rounded-xl border border-kagan-gold/20 bg-kagan-gold/[0.04] p-4 transition hover:border-kagan-gold/55">
                  {body}
                </Link>
              );
            })}
          </div>

          <div className="mb-14">
            <LiveReadinessPanel />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-kagan-gold" />
                <h2 className="text-xl font-bold text-kagan-white">What public transparency means</h2>
              </div>
              <div className="space-y-3">
                {PUBLIC_PROOFS.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-kagan-light">
                    <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-kagan-gold" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-kagan-border bg-kagan-card/60 p-6">
              <h2 className="text-xl font-bold text-kagan-white">How work is shipped</h2>
              <p className="mt-2 mb-5 text-sm leading-6 text-kagan-light">
                Each stage has its own evidence requirement. A queued brief, generated file, checkout event, and completed fulfillment are separate states.
              </p>
              <ProcessStages />
            </div>
          </div>
        </div>
      </Section>

      <Section variant="alt">
        <CTA
          title="Choose the right next step"
          subtitle="New visitors evaluate the offer on AIKAGAN. Customers and operators move into the AutonomaX application to execute."
          primaryLabel="Explore Products"
          primaryHref="/products/"
          secondaryLabel="Open AutonomaX App"
          secondaryHref={`${SITE.appUrl}/dashboard`}
        />
      </Section>
    </>
  );
}
