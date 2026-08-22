import Link from 'next/link';
import { Zap, ExternalLink } from 'lucide-react';
import { SITE, SOCIAL } from '@/lib/constants';

const PUBLIC_LINKS = [
  { label: 'Home', href: `${SITE.url}/` },
  { label: 'Free Tools', href: `${SITE.url}/tools/` },
  { label: 'Services', href: `${SITE.url}/services/` },
  { label: 'Products', href: `${SITE.url}/products/` },
  { label: 'About', href: `${SITE.url}/about/` },
  { label: 'Contact', href: `${SITE.url}/contact/` },
] as const;

export default function Footer() {
  return <footer className="border-t border-kagan-border/60 bg-kagan-black"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"><div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    <div><a href={SITE.url} className="flex items-center gap-2 mb-3"><Zap className="h-5 w-5 text-kagan-gold"/><span className="text-lg font-bold tracking-tight text-kagan-white">Autonoma<span className="text-kagan-gold">X</span></span></a><p className="text-sm text-kagan-muted leading-relaxed">Useful tools first. Implementation when the problem is worth solving.</p></div>
    <div><h4 className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mb-4">Explore</h4><ul className="space-y-2">{PUBLIC_LINKS.map((link)=><li key={link.href}><a href={link.href} className="text-sm text-kagan-light hover:text-kagan-gold transition-colors">{link.label}</a></li>)}</ul></div>
    <div><h4 className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mb-4">Use</h4><ul className="space-y-2"><li><a href={`${SITE.url}/tools/revenue-leak-scan/`} className="text-sm font-medium text-emerald-300 hover:text-emerald-200">Free Revenue Leak Scan →</a></li><li><a href={`${SITE.appUrl}/autonomax/`} className="inline-flex items-center gap-1 text-sm text-kagan-light hover:text-kagan-gold">AutonomaX Explorer <ExternalLink className="h-3 w-3"/></a></li><li><a href={`${SITE.appUrl}/dashboard/`} className="inline-flex items-center gap-1 text-sm text-kagan-light hover:text-kagan-gold">Customer Workspace <ExternalLink className="h-3 w-3"/></a></li></ul></div>
    <div><h4 className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mb-4">When you need more</h4><ul className="space-y-2"><li><a href={`${SITE.url}/services/`} className="text-sm text-kagan-gold hover:text-kagan-gold-light font-medium">Implementation services →</a></li><li><a href={`${SITE.url}/products/`} className="text-sm text-kagan-light hover:text-kagan-gold">DIY products →</a></li></ul><h4 className="text-xs font-semibold uppercase tracking-wider text-kagan-muted mt-8 mb-4">Follow</h4><ul className="space-y-2"><li><a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-kagan-light hover:text-kagan-gold">Facebook →</a></li><li><a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-kagan-light hover:text-kagan-gold">Instagram →</a></li></ul></div>
  </div><div className="mt-10 pt-6 border-t border-kagan-border/60 flex flex-col sm:flex-row justify-between items-center gap-4"><div className="text-xs text-kagan-muted space-y-1 text-center sm:text-left"><p>© {SITE.year} {SITE.name}. Built for useful outcomes.</p><p className="opacity-80">Paid offers use verified provider checkout. Support: <a href="mailto:hello@aikagan.com" className="text-kagan-gold hover:underline">hello@aikagan.com</a>.</p></div><div className="flex items-center gap-4"><Link href={`${SITE.url}/legal/privacy/`} className="text-xs text-kagan-muted hover:text-kagan-light">Privacy</Link><Link href={`${SITE.url}/legal/terms/`} className="text-xs text-kagan-muted hover:text-kagan-light">Terms</Link><Link href={`${SITE.url}/legal/refund/`} className="text-xs text-kagan-muted hover:text-kagan-light">Refund</Link></div></div></div></footer>;
}
