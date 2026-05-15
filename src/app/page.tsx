import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import ValueProposition from '@/components/home/ValueProposition';
import FeatureGrid from '@/components/home/FeatureGrid';
import Section from '@/components/ui/Section';
import CTA from '@/components/ui/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ValueProposition />
      <FeatureGrid />
      <Section variant="alt">
        <CTA
          title="Ready to Deploy AI That Converts?"
          subtitle="Submit your project request. Get a structured response within 48 hours — no fluff, no filler."
          primaryLabel="Start Project"
          primaryHref="/contact/"
          secondaryLabel="Explore Services"
          secondaryHref="/services/"
        />
      </Section>
    </>
  );
}
