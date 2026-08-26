'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, ArrowUpRight } from 'lucide-react';
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
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ücretsiz Araçlar', href: '/ucretsiz-araclar' },
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: 'Hazır Paketler', href: '/urunler' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
] as const;

const APP_NAV = [
  { label: 'Workspace', href: '/dashboard' },
  { label: 'AutonomaX', href: '/autonomax' },
  { label: 'Support', href: `${SITE.url}/contact`, external: true },
] as const;

const EN_TO_TR: Record<string, string> = {
  '/': '/',
  '/tools': '/ucretsiz-araclar',
  '/tools/revenue-leak-scan': '/ucretsiz-araclar/gelir-kacagi-testi',
  '/services': '/hizmetler',
  '/products': '/urunler',
  '/about': '/hakkimizda',
  '/contact': '/iletisim',
  '/network': '/topluluk',
  '/legal/privacy': '/gizlilik',
  '/legal/terms': '/kullanim-kosullari',
  '/legal/refund': '/iade-kosullari',
};
const TR_TO_EN = Object.fromEntries(Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en])) as Record<string, string>;

function isApplicationPath(pathname: string): boolean {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/autonomax') || pathname.startsWith('/checkout') || pathname.startsWith('/projects') || pathname.startsWith('/workbench') || pathname.startsWith('/outputs') || pathname.startsWith('/credits') || pathname.startsWith('/downloads') || pathname.startsWith('/integrations') || pathname.startsWith('/billing') || pathname.startsWith('/account');
}

function cleanPath(pathname: string) {
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

export default function Navbar({ locale = 'en' }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = cleanPath(pathname);
  const isAppRoute = isApplicationPath(pathname);
  const isTurkish = locale === 'tr' && !isAppRoute;
  const links = isAppRoute ? APP_NAV : isTurkish ? TURKISH_NAV : PUBLIC_NAV;
  const normalizeHref = (href: string) => href.startsWith('http') ? href : isAppRoute ? `${SITE.appUrl}${href}` : isTurkish ? href : `${SITE.url}${href}`;
  const languageHref = isTurkish
    ? `https://aikagan.com${TR_TO_EN[currentPath] || '/'}`
    : `https://aikagan.com.tr${EN_TO_TR[currentPath] || '/'}`;

  return <nav className="sticky top-0 z-50 border-b border-kagan-border/60 bg-kagan-black/90 backdrop-blur-lg">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex h-16 items-center justify-between">
      <Link href={isAppRoute ? `${SITE.appUrl}/dashboard` : isTurkish ? 'https://aikagan.com.tr' : SITE.url} className="flex items-center gap-2 group"><Zap className="h-6 w-6 text-kagan-gold"/><span className="text-lg font-bold tracking-tight text-kagan-white">Autonoma<span className="text-kagan-gold">X</span></span><span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-kagan-muted">{isAppRoute?'App':isTurkish?'AIKAGAN TÜRKİYE':'by AIKAGAN'}</span></Link>
      <div className="hidden md:flex items-center gap-1">{links.map((link)=>{const href=normalizeHref(link.href);const clean=cleanPath(link.href);const active=clean&&(currentPath===clean||(clean!=='/'&&currentPath.startsWith(clean)));return <Link key={link.label} href={href} className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors',active?'text-kagan-gold bg-kagan-gold/10':'text-kagan-light hover:text-kagan-white hover:bg-kagan-card')}>{link.label}</Link>})}</div>
      <div className="hidden md:flex items-center gap-3">{!isAppRoute&&<Link href={languageHref} className="text-xs font-bold text-kagan-muted hover:text-kagan-white">{isTurkish?'EN':'TR'}</Link>}{isAppRoute?<Link href={`${SITE.url}/tools`} className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/40 px-4 py-2 text-sm font-semibold text-kagan-gold hover:bg-kagan-gold/10">Try Free <ArrowUpRight className="h-4 w-4"/></Link>:<Link href={isTurkish?'/ucretsiz-araclar/gelir-kacagi-testi':`${SITE.url}/tools/revenue-leak-scan`} className="inline-flex items-center gap-2 rounded-lg bg-kagan-gold px-4 py-2 text-sm font-semibold text-black hover:bg-kagan-gold-light">{isTurkish?'Ücretsiz Başla':'Start Free Scan'} <ArrowUpRight className="h-4 w-4"/></Link>}</div>
      <button onClick={()=>setOpen(!open)} className="md:hidden p-2 text-kagan-light hover:text-kagan-white" aria-label={isTurkish?'Menüyü aç veya kapat':'Toggle menu'}>{open?<X className="h-6 w-6"/>:<Menu className="h-6 w-6"/>}</button>
    </div></div>
    {open&&<div className="md:hidden border-t border-kagan-border/60 bg-kagan-black/95"><div className="px-4 py-4 space-y-1">{links.map((link)=><Link key={link.label} href={normalizeHref(link.href)} onClick={()=>setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-kagan-light hover:text-kagan-white hover:bg-kagan-card">{link.label}</Link>)}{!isAppRoute&&<Link href={languageHref} onClick={()=>setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-bold text-kagan-muted hover:text-kagan-white">{isTurkish?'English':'Türkçe'}</Link>}<Link href={isAppRoute?`${SITE.url}/tools`:isTurkish?'/ucretsiz-araclar/gelir-kacagi-testi':`${SITE.url}/tools/revenue-leak-scan`} onClick={()=>setOpen(false)} className="block mt-2 text-center rounded-lg bg-kagan-gold px-4 py-3 text-sm font-semibold text-black">{isAppRoute?'Try Free':isTurkish?'Ücretsiz Başla':'Start Free Scan'}</Link></div></div>}
  </nav>;
}
