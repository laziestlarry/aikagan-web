import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  external?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-kagan-gold text-black font-semibold hover:bg-kagan-gold-light shadow-lg shadow-kagan-gold/20',
  secondary:
    'bg-kagan-card text-kagan-white border border-kagan-border hover:border-kagan-gold/50 hover:text-kagan-gold',
  outline:
    'border border-kagan-gold/60 text-kagan-gold hover:bg-kagan-gold/10',
  ghost:
    'text-kagan-light hover:text-kagan-white hover:bg-kagan-card',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  disabled = false,
  external = false,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-kagan-gold/50 focus:ring-offset-2 focus:ring-offset-kagan-black disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    const isExternal = external || href.startsWith('http');
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
