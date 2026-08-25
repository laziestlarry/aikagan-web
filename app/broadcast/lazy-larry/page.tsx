import type { Metadata } from 'next';
import LazyLarryBroadcastStudio from '@/components/broadcast/LazyLarryBroadcastStudio';

export const metadata: Metadata = {
  title: 'Lazy Larry 2D Broadcast Studio | AIKAGAN',
  description: 'Browser-native 2D AIKAGAN broadcast studio for Lazy Larry live briefings and async render manifests.',
  alternates: { canonical: 'https://aikagan.com/broadcast/lazy-larry/' },
};

export default function LazyLarryBroadcastPage() {
  return <LazyLarryBroadcastStudio />;
}
