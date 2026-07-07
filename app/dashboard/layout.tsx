import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Dashboard',
  description: 'Live revenue operations dashboard — profit intelligence, financials, passive income, investment policy, and weekly intelligence from the AutonomaX backend.',
  path: '/dashboard/',
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
