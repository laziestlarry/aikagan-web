import { ShoppingCart, Brain, Rocket, Zap, Target, LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const iconMap: Record<string, LucideIcon> = {
  Brain,
  ShoppingCart,
  Rocket,
  Zap,
  Target,
};

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  features: readonly string[];
  icon: string;
  cta: string;
  href?: string;
}

export default function ServiceCard({
  title,
  subtitle,
  description,
  features,
  icon,
  cta,
  href = '/contact/',
}: ServiceCardProps) {
  const IconComponent = iconMap[icon] || Zap;

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-kagan-gold/10 border border-kagan-gold/20">
          <IconComponent className="h-6 w-6 text-kagan-gold" />
        </div>
        <Badge variant="gold">{subtitle}</Badge>
      </div>
      <h3 className="text-xl font-bold text-kagan-white mb-2">{title}</h3>
      <p className="text-kagan-light text-sm leading-relaxed mb-5 flex-1">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-kagan-light">
            <span className="h-1.5 w-1.5 rounded-full bg-kagan-gold flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Button href={href} variant="outline" size="sm" className="w-full">
        {cta}
      </Button>
    </Card>
  );
}
