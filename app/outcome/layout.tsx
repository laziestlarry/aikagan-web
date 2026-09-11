import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://outcome.aikagan.com'),
  title: { default: 'OutcomeOS — From bottleneck to verified result', template: '%s | OutcomeOS' },
  description: 'AI-guided business design and execution with human approvals, evidence gates, and a clear path from diagnosis to verified delivery.',
  alternates: { canonical: 'https://outcome.aikagan.com' },
  openGraph: {
    title: 'OutcomeOS — Fix the workflow that moves the business',
    description: 'Find the costly bottleneck, approve a bounded mission, build the smallest credible fix, and verify the result.',
    url: 'https://outcome.aikagan.com',
    type: 'website',
    images: [{ url: 'https://aikagan.com/og.png', width: 1200, height: 630, alt: 'OutcomeOS by AIKAGAN' }],
  },
};

export default function OutcomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
