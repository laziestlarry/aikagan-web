import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface ProductCardProps {
  name: string;
  category: string;
  price: string;
  description: string;
  includes: readonly string[];
  badge: string;
  featured?: boolean;
}

export default function ProductCard({
  name,
  category,
  price,
  description,
  includes,
  badge,
  featured = false,
}: ProductCardProps) {
  const badgeVariant = featured ? 'gold' : badge.includes('Popular') ? 'amber' : 'blue';

  return (
    <Card hover glow={featured} className={`flex flex-col ${featured ? 'ring-1 ring-kagan-gold/40' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <Badge variant="muted">{category}</Badge>
        <Badge variant={badgeVariant}>{badge}</Badge>
      </div>
      <h3 className="text-xl font-bold text-kagan-white mb-1">{name}</h3>
      <p className="text-2xl font-bold text-kagan-gold mb-4">{price}</p>
      <p className="text-kagan-light text-sm leading-relaxed mb-5 flex-1">{description}</p>
      <ul className="space-y-2 mb-6">
        {includes.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-kagan-light">
            <span className="text-kagan-gold text-xs">✓</span>
            {item}
          </li>
        ))}
      </ul>
      <Button
        href="/contact/"
        variant={featured ? 'primary' : 'outline'}
        size="md"
        className="w-full"
      >
        {featured ? 'Get Started' : 'Learn More'}
      </Button>
    </Card>
  );
}
