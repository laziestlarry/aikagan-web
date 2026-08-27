'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, ArrowUpRight, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE } from '@/lib/constants';

type Locale = 'en' | 'tr';

const PUBLIC_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Try Free', href: '/tools' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
] as const;

const TURKISH_NAV = [
  { label: 'Ana Sayfa', href: '/tr' },
  { label: 'Ücretsiz Araçlar', href: '/tr/tools' },
  { label: 'Hizmetler', href: '/tr/services' },
  { label: 'Ürünler', href: '/tr/products' },
  { label: 'Hakkımızda', href: '/tr/about' },
] as const;

const APP_NAV = [
  { label: 'Workspace', href: '/dashboard' },
  { label: 'AutonomaX', href: '/autonomax' },
  { label: 'Support', href: `${SITE.url}/contact`, external: true },
] as const;

const EN_TO_TR: Record<string, string> = {
  '/': '/tr', '/tools': '/tr/tools', '/tools/revenue-leak-scan': '/tr/tools/revenue-leak-scan', '/services': '/tr/services', '/products': '/tr/products', '/about': '/tr/about', '/contact': '/tr/contact', '/network': '/tr/network', '/legal/privacy': '/tr/legal/privacy', '/legal/terms': '/tr/legal/terms', '/legal/refund': '/tr/legal/refund',
};
const TR_TO_EN = Object.fromEntries(Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en])) as Record<string, string>;

function isApplicationPath(pathname: string): boolean {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/autonomax') || pathname.startsWith('/checkout') || pathname.startsWith('/projects') || pathname.startsWith('/workbench') || pathname.startsWith('/outputs') || pathname.startsWith('/credits') || pathname.startsWith('/downloads') || pathname.startsWith('/integrations') || pathname.startsWith('/billing') || pathname.startsWith('/account');
}
function cleanPath(pathname: string) { return pathname === '/' ? '/' : pathname.replace(/\/+$/, ''); }

export default function Navbar({ locale = 'en' }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = cleanPath(pathname);
  const isAppRoute = isApplicationPath(pathname);
  const isTurkish = locale === 'tr' && !isAppRoute;
  const links = isAppRoute ? APP_NAV : isTurkish ? TURKISH_NAV : PUBLIC_NAV;
  const normalizeHref = (href: string) => href.startsWith('http') ? href : isAppRoute ? `${SITE.appUrl}${href}` : `${SITE.url}${href}`;
  const languageHref = isTurkish ? `https://aikagan.com${TR_TO_EN[currentPath] || '/'}?lang=en` : `https://aikagan.com${EN_TO_TR[currentPath] || '/tr'}?lang=tr`;

  return <nav className="sticky top-0 z-50 border-b border-kagan-border/60 bg-kagan-black/90 backdrop-blur-lg">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex h-16 items-center justify-between">
      <Link href={isAppRoute ? `${SITE.appUrl}/dashboard` : isTurkish ? `${SITE.url}/tr` : SITE.url} className="flex items-center gap-2 group"><Zap className="h-6 w-6 text-kagan-gold"/><span className="text-lg font-bold tracking-tight text-kagan-white">Autonoma<span className="text-kagan-gold">X</span></span><span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-kagan-muted">{isAppRoute?'App':isTurkish?'AIKAGAN TÜRKİYE':'by AIKAGAN'}</span></Link>
      <div className="hidden md:flex items-center gap-1">{links.map((link)=>{const href=normalizeHref(link.href);const clean=cleanPath(link.href);const active=clean&&(currentPath===clean||(clean!=='/'&&currentPath.startsWith(clean)));return <Link key={link.label} href={href} className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors',active?'text-kagan-gold bg-kagan-gold/10':'text-kagan-light hover:text-kagan-white hover:bg-kagan-card')}>{link.label}</Link>})}</div>
      <div className="hidden md:flex items-center gap-3">{!isAppRoute&&<Link href={languageHref} aria-label={isTurkish?'İngilizceye geç':'Türkçeye geç'} className="inline-flex items-center gap-1.5 rounded-xl border border-kagan-gold/35 bg-kagan-gold/5 px-3.5 py-2 text-xs font-bold text-kagan-gold transition hover:border-kagan-gold/60 hover:bg-kagan-gold/10 hover:text-kagan-white"><Globe2 className="h-3.5 w-3.5" />{isTurkish?'EN · Global':'TR · Türkiye'}</Link>}{isAppRoute?<Link href={`${SITE.url}/tools`} className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/40 px-4 py-2 text-sm font-semibold text-kagan-gold hover:bg-kagan-gold/10">Try Free <ArrowUpRight className="h-4 w-4"/></Link>:<Link href={isTurkish?`${SITE.url}/tr/tools/revenue-leak-scan`:`${SITE.url}/tools/revenue-leak-scan`} className="inline-flex items-center gap-2 rounded-lg bg-kagan-gold px-4 py-2 text-sm font-semibold text-black hover:bg-kagan-gold-light">{isTurkish?'Ücretsiz Başla':'Start Free Scan'} <ArrowUpRight className="h-4 w-4"/></Link>}</div>
      <button onClick={()=>setOpen(!open)} className="md:hidden p-2 text-kagan-light hover:text-kagan-white" aria-label={isTurkish?'Menüyü aç veya kapat':'Toggle menu'}>{open?<X className="h-6 w-6"/>:<Menu className="h-6 w-6"/>}</button>
    </div></div>
    {open&&<div className="md:hidden border-t border-kagan-border/60 bg-kagan-black/95"><div className="px-4 py-4 space-y-1">{links.map((link)=><Link key={link.label} href={normalizeHref(link.href)} onClick={()=>setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-kagan-light hover:text-kagan-white hover:bg-kagan-card">{link.label}</Link>)}{!isAppRoute&&<Link href={languageHref} onClick={()=>setOpen(false)} className="flex items-center gap-2 rounded-xl border border-kagan-gold/25 bg-kagan-gold/5 px-3 py-2.5 text-sm font-bold text-kagan-gold"><Globe2 className="h-4 w-4" />{isTurkish?'English · Global':'Türkçe · Türkiye'}</Link>}<Link href={isAppRoute?`${SITE.url}/tools`:isTurkish?`${SITE.url}/tr/tools/revenue-leak-scan`:`${SITE.url}/tools/revenue-leak-scan`} onClick={()=>setOpen(false)} className="block mt-2 text-center rounded-lg bg-kagan-gold px-4 py-3 text-sm font-semibold text-black">{isAppRoute?'Try Free':isTurkish?'Ücretsiz Başla':'Start Free Scan'}</Link></div></div>}
  </nav>;
}
