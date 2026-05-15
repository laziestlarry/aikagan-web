import Link from 'next/link';
import { Zap } from 'lucide-react';
import { SITE, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-kagan-border/60 bg-kagan-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-kagan-gold" />
              <span className="text-lg font-bold tracking-tight text-kagan-white">
                AI<span className="text-kagan-gold">KAGAN</span>
              </span>
            </Link>
            <p className="text-sm text-kagan-muted leading-relaxed">{SITE.description}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-kagan-light hover:text-kagan-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Systems */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mb-4">
              Systems
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-kagan-light">AutonomaX</span>
              </li>
              <li>
                <span className="text-sm text-kagan-light">ProPulse</span>
              </li>
              <li>
                <span className="text-sm text-kagan-light">Golden Delivery</span>
              </li>
              <li>
                <span className="text-sm text-kagan-light">Kaganate Council</span>
              </li>
            </ul>
          </div>

          {/* Action */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mb-4">
              Start
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact/"
                  className="text-sm text-kagan-gold hover:text-kagan-gold-light transition-colors font-medium"
                >
                  Submit Project Request →
                </Link>
              </li>
              <li>
                <Link
                  href="/products/"
                  className="text-sm text-kagan-gold hover:text-kagan-gold-light transition-colors font-medium"
                >
                  View Offers →
                </Link>
              </li>
              <li>
                <Link
                  href="/services/"
                  className="text-sm text-kagan-gold hover:text-kagan-gold-light transition-colors font-medium"
                >
                  Explore Services →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-kagan-border/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-kagan-muted">
            © {SITE.year} {SITE.name}. All rights reserved. Built for operators.
          </p>
          <p className="text-xs text-kagan-muted">
            AutonomaX · ProPulse · Golden Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
