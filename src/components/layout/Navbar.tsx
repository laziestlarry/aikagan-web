'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-kagan-border/60 bg-kagan-black/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Zap className="h-6 w-6 text-kagan-gold group-hover:text-kagan-gold-light transition-colors" />
            <span className="text-lg font-bold tracking-tight text-kagan-white">
              AI<span className="text-kagan-gold">KAGAN</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
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

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 rounded-lg bg-kagan-gold px-4 py-2 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
            >
              Start Project
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-kagan-light hover:text-kagan-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-kagan-border/60 bg-kagan-black/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'text-kagan-gold bg-kagan-gold/10'
                      : 'text-kagan-light hover:text-kagan-white hover:bg-kagan-card'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact/"
              onClick={() => setOpen(false)}
              className="block mt-3 text-center rounded-lg bg-kagan-gold px-4 py-3 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
            >
              Start Project
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
