import { cn } from '@/lib/utils';
import Button from './Button';

interface CTAProps {
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export default function CTA({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
}: CTAProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-kagan-border bg-gradient-to-br from-kagan-card to-kagan-darker p-10 md:p-16 text-center',
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-kagan-white mb-4">{title}</h2>
      {subtitle && <p className="text-kagan-light text-lg mb-8 max-w-2xl mx-auto">{subtitle}</p>}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button href={primaryHref} variant="primary" size="lg">
          {primaryLabel}
        </Button>
        {secondaryLabel && secondaryHref && (
          <Button href={secondaryHref} variant="outline" size="lg">
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
