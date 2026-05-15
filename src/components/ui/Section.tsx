import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'alt' | 'hero';
}

const variantClasses = {
  default: 'bg-kagan-black',
  alt: 'bg-kagan-darker',
  hero: 'bg-gradient-to-b from-kagan-black via-kagan-darker to-kagan-black',
};

export default function Section({ children, className, id, variant = 'default' }: SectionProps) {
  return (
    <section id={id} className={cn('py-20 md:py-28', variantClasses[variant], className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
