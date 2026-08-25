import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CheckoutLink from '@/components/ui/CheckoutLink';

interface ProductCardProps {
  name: string;
  slug: string;
  category: string;
  price: string;
  originalPrice?: string;
  description: string;
  includes: readonly string[];
  badge: string;
  checkoutUrl?: string;
  featured?: boolean;
}

export default function ProductCard({ name, slug, category, price, originalPrice, description, includes, badge, checkoutUrl, featured = false }: ProductCardProps) {
  const badgeVariant = featured ? 'gold' : badge.includes('Popular') ? 'amber' : 'blue';
  const productHref = `/products/${slug}/`;
  const isPaddle = checkoutUrl === 'paddle';
  const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;

  return (
    <Card hover glow={featured} className={`flex flex-col ${featured ? 'ring-1 ring-kagan-gold/40' : ''}`}>
      <div className="flex items-start justify-between mb-3"><Badge variant="muted">{category}</Badge><Badge variant={badgeVariant}>{badge}</Badge></div>
      <Link href={productHref} className="hover:opacity-90 transition-opacity"><h3 className="text-xl font-bold text-kagan-white mb-1">{name}</h3></Link>
      <div className="flex items-baseline gap-2 mb-2"><p className="text-2xl font-bold text-kagan-gold">{price}</p>{originalPrice && <p className="text-sm text-kagan-light line-through opacity-60">${originalPrice}</p>}</div>
      <p className="mb-4 text-xs font-semibold text-emerald-300">One payment · instant digital access · 30-day money-back guarantee</p>
      <p className="text-kagan-light text-sm leading-relaxed mb-5 flex-1">{description}</p>
      <ul className="space-y-2 mb-6">{includes.map((item) => <li key={item} className="flex items-center gap-2 text-sm text-kagan-light"><span className="text-kagan-gold text-xs">✓</span>{item}</li>)}</ul>
      <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3 text-xs leading-relaxed text-emerald-100">
        <strong>Use it today:</strong> open START_HERE, choose one offer, follow the activation checklist, and use the included scripts/templates instead of building from scratch.
      </div>
      <div className="flex flex-col gap-2">
        {isPaddle ? (
          <CheckoutLink href="paddle" productSlug={slug} productName={name} price={numericPrice} className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-3 text-sm font-semibold transition cursor-pointer ${featured ? 'bg-kagan-gold text-black hover:bg-kagan-gold/90' : 'border border-kagan-gold/40 text-kagan-gold hover:bg-kagan-gold/10'}`}>
            {featured ? `Get Pro — ${price}` : `Get ${name} — ${price}`}
          </CheckoutLink>
        ) : checkoutUrl ? (
          <a href={checkoutUrl} data-product-slug={slug} className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-3 text-sm font-semibold transition ${featured ? 'bg-kagan-gold text-black hover:bg-kagan-gold/90' : 'border border-kagan-gold/40 text-kagan-gold hover:bg-kagan-gold/10'}`}>{featured ? 'Get Started' : 'Buy Now'}</a>
        ) : <Button href={productHref} variant={featured ? 'primary' : 'outline'} size="md" className="w-full">{featured ? 'Get Started' : 'Learn More'}</Button>}
        <p className="text-center text-[11px] text-kagan-light/50">Secure hosted payment · delivery after provider confirmation</p>
        <Link href={productHref} className="text-center text-xs text-kagan-light/60 hover:text-kagan-light transition-colors py-1">See exactly what you get →</Link>
      </div>
    </Card>
  );
}
