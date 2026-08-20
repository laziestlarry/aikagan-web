'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE } from '@/lib/constants';

const PUBLIC_NAV = NAV_LINKS.filter((link) =>
  ['/', '/products/', '/services/', '/about/', '/contact/'].includes(link.href)
);

const APP_NAV = [
  { label: 'Workspace', href: '/dashboard/' },
  { label: 'AutonomaX', href: '/autonomax/' },
  { label: 'Support', href: `${SITE.url}/contact/`, external: true },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAppRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/autonomax');
  const links = isAppRoute ? APP_NAV : PUBLIC_NAV;

  const normalizeHref = (href: string) => {
    if (href.startsWith('http')) return href;
    return isAppRoute ? `${SITE.appUrl}${href}` : `${SITE.url}${href}`;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-kagan-border/60 bg-kagan-black/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={isAppRoute ? `${SITE.appUrl}/dashboard/` : SITE.url} className="flex items-center gap-2 group">
            <Zap className="h-6 w-6 text-kagan-gold group-hover:text-kagan-gold-light transition-colors" />
            <span className="text-lg font-bold tracking-tight text-kagan-white">
              Autonoma<span className="text-kagan-gold">X</span>
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-kagan-muted">
              {isAppRoute ? 'App' : 'by AIKAGAN'}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const href = normalizeHref(link.href);
              const cleanPath = link.href.startsWith('http') ? '' : link.href.replace(/\/$/, '') || '/';
              const isActive = cleanPath && (pathname === cleanPath || (cleanPath !== '/' && pathname.startsWith(cleanPath)));
              return (
                <Link
                  key={link.label}
                  href={href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-kagan-gold bg-kagan-gold/10'
                      : 'text-kagan-light hover:text-kagan-white hover:bg-kagan-card'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAppRoute ? (
              <Link
                href={`${SITE.url}/products/`}
                className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/40 px-4 py-2 text-sm font-semibold text-kagan-gold hover:bg-kagan-gold/10 transition-colors"
              >
                Plans <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`${SITE.appUrl}/dashboard/`}
                className="inline-flex items-center gap-2 rounded-lg bg-kagan-gold px-4 py-2 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
              >
                Open App <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-kagan-light hover:text-kagan-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-kagan-border/60 bg-kagan-black/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={normalizeHref(link.href)}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-kagan-light hover:text-kagan-white hover:bg-kagan-card transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={isAppRoute ? `${SITE.url}/products/` : `${SITE.appUrl}/dashboard/`}
              onClick={() => setOpen(false)}
              className="block mt-2 text-center rounded-lg bg-kagan-gold px-4 py-3 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
            >
              {isAppRoute ? 'View Plans' : 'Open AutonomaX App'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
