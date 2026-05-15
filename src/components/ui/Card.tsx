import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-kagan-border bg-kagan-card p-6 md:p-8',
        hover && 'transition-all duration-300 hover:border-kagan-gold/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-kagan-gold/5',
        glow && 'animate-pulse-glow',
        className
      )}
    >
      {children}
    </div>
  );
}
