import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

export const metadata: Metadata = buildMetadata({
  title: '404',
  description: 'Page not found.',
  path: '/404/',
});

export default function NotFound() {
  return (
    <Section variant="hero" className="min-h-[60vh] flex items-center">
      <div className="text-center w-full">
        <p className="text-8xl font-extrabold text-kagan-gold/20 mb-4 font-mono">404</p>
        <h1 className="text-3xl font-bold text-kagan-white mb-3">Page Not Found</h1>
        <p className="text-kagan-light mb-8 max-w-md mx-auto">
          This route doesn&apos;t exist in The Kaganate. Return to base and try again.
        </p>
        <Button href="/" variant="primary" size="lg">
          Return Home
        </Button>
      </div>
    </Section>
  );
}
