import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Product Feedback',
  description: 'Share what worked, what was confusing, and which business outcome AIKAGAN should solve next after you try a free tool or practical workflow.',
  path: '/feedback',
});

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
