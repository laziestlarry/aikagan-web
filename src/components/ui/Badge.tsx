import { cn } from '@/lib/utils';

type BadgeVariant = 'gold' | 'blue' | 'green' | 'amber' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-kagan-gold/15 text-kagan-gold border-kagan-gold/30',
  blue: 'bg-kagan-accent/15 text-kagan-accent border-kagan-accent/30',
  green: 'bg-kagan-success/15 text-kagan-success border-kagan-success/30',
  amber: 'bg-kagan-amber/15 text-kagan-amber border-kagan-amber/30',
  muted: 'bg-kagan-muted/15 text-kagan-muted border-kagan-muted/30',
};

export default function Badge({ children, variant = 'gold', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
