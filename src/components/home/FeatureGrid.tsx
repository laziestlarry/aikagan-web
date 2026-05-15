import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import ServiceCard from '@/components/shared/ServiceCard';
import { SERVICES } from '@/lib/constants';

const featuredServices = SERVICES.slice(0, 3);

export default function FeatureGrid() {
  return (
    <Section>
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-kagan-white mb-4">
          Core Systems
        </h2>
        <p className="text-kagan-light text-lg max-w-2xl mx-auto">
          Three integrated engines that power AI-driven commerce operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {featuredServices.map((svc) => (
          <ServiceCard key={svc.id} {...svc} />
        ))}
      </div>

      <div className="text-center">
        <Button href="/services/" variant="outline" size="md">
          View All Services →
        </Button>
      </div>
    </Section>
  );
}
