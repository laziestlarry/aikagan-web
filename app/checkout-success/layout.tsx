import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Purchase Activation | ${SITE.name}`,
  description: 'Verified purchase activation, delivery, and AutonomaX workspace handoff.',
  metadataBase: new URL(SITE.appUrl),
  alternates: { canonical: `${SITE.appUrl}/checkout-success/` },
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
