import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

const title = `Workspace | ${SITE.name}`;
const description =
  'AutonomaX customer execution workspace for activating projects, running governed workflows, keeping evidence, and reaching verified outcomes.';
const canonical = `${SITE.appUrl}/dashboard/`;

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(SITE.appUrl),
  alternates: { canonical },
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: SITE.name,
    locale: 'en_US',
    type: 'website',
    images: [{ url: `${SITE.url}/og.png`, width: 1200, height: 630, alt: 'AutonomaX customer workspace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${SITE.url}/og.png`],
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
