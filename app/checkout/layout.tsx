import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Secure Checkout | ${SITE.name}`,
  description: 'Secure AIKAGAN checkout handoff for verified AutonomaX products.',
  metadataBase: new URL(SITE.appUrl),
  alternates: { canonical: `${SITE.appUrl}/checkout/` },
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
