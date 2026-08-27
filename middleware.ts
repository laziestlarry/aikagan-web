import { NextRequest, NextResponse } from 'next/server';

const APP_HOST = 'app.aikagan.com';
const APEX_HOST = 'aikagan.com';
const WWW_HOST = 'www.aikagan.com';
const TURKISH_APEX_HOST = 'aikagan.com.tr';
const TURKISH_WWW_HOST = 'www.aikagan.com.tr';
const TURKISH_DOMAIN_AUTO_REDIRECT = process.env.TURKISH_DOMAIN_AUTO_REDIRECT === '1';
const LOCALE_COOKIE = 'aikagan_locale';
const BOT_UA = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|twitterbot|whatsapp/i;

const APP_PREFIXES = [
  '/dashboard', '/autonomax', '/checkout', '/checkout-success', '/projects', '/workbench', '/outputs', '/credits', '/downloads', '/integrations', '/billing', '/account', '/admin',
];

const WEB_PREFIXES = [
  '/products', '/services', '/about', '/contact', '/free', '/tools', '/network', '/feedback', '/start-free', '/work-with-kagan', '/cash-resilience', '/legal', '/marketing', '/affiliates', '/mission-control', '/privacy', '/terms', '/refund',
];

const LEGACY_INTERNAL_DASHBOARDS = [
  '/dashboard/financials', '/dashboard/investment-policy', '/dashboard/passive-income', '/dashboard/profit-intelligence', '/dashboard/success', '/dashboard/venture-infrastructure', '/dashboard/weekly-intelligence',
];

const TURKISH_PUBLIC_TO_INTERNAL: Record<string, string> = {
  '/': '/tr',
  '/urunler': '/tr/products',
  '/ucretsiz-araclar': '/tr/tools',
  '/ucretsiz-araclar/gelir-kacagi-testi': '/tr/tools/revenue-leak-scan',
  '/hizmetler': '/tr/services',
  '/hakkimizda': '/tr/about',
  '/iletisim': '/tr/contact',
  '/topluluk': '/tr/network',
  '/gizlilik': '/tr/legal/privacy',
  '/kullanim-kosullari': '/tr/legal/terms',
  '/iade-kosullari': '/tr/legal/refund',
};

const TURKISH_INTERNAL_TO_PUBLIC = Object.fromEntries(
  Object.entries(TURKISH_PUBLIC_TO_INTERNAL).map(([publicPath, internalPath]) => [internalPath, publicPath]),
) as Record<string, string>;

const TURKISH_LEGACY_TO_PUBLIC: Record<string, string> = {
  '/products': '/urunler', '/tools': '/ucretsiz-araclar', '/tools/revenue-leak-scan': '/ucretsiz-araclar/gelir-kacagi-testi', '/services': '/hizmetler', '/about': '/hakkimizda', '/contact': '/iletisim', '/network': '/topluluk', '/legal/privacy': '/gizlilik', '/privacy': '/gizlilik', '/legal/terms': '/kullanim-kosullari', '/terms': '/kullanim-kosullari', '/legal/refund': '/iade-kosullari', '/refund': '/iade-kosullari',
};

const TURKISH_GLOBAL_ONLY_PREFIXES = ['/free', '/feedback', '/start-free', '/work-with-kagan', '/cash-resilience', '/marketing', '/affiliates', '/mission-control'];

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function normalizePath(pathname: string) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function localeHeaders(request: NextRequest, locale: 'en' | 'tr') {
  const nextHeaders = new Headers(request.headers);
  nextHeaders.set('x-site-locale', locale);
  return nextHeaders;
}

function redirectTo(host: string, pathname: string, search = '', status: 307 | 308 = 308) {
  return NextResponse.redirect(new URL(`${pathname}${search}`, `https://${host}`), status);
}

function localePreferenceRedirect(request: NextRequest, locale: 'en' | 'tr') {
  const url = request.nextUrl.clone();
  url.searchParams.delete('lang');
  const response = NextResponse.redirect(url, 307);
  response.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: true });
  return response;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname, search } = request.nextUrl;
  const cleanPath = normalizePath(pathname);
  const requestedLanguage = request.nextUrl.searchParams.get('lang');

  if (host === TURKISH_WWW_HOST) {
    if (startsWithAny(cleanPath, APP_PREFIXES)) return redirectTo(APP_HOST, cleanPath, search);
    if (cleanPath.startsWith('/products/') || startsWithAny(cleanPath, TURKISH_GLOBAL_ONLY_PREFIXES)) return redirectTo(APEX_HOST, cleanPath, search);
    const canonicalPath = TURKISH_INTERNAL_TO_PUBLIC[cleanPath] || TURKISH_LEGACY_TO_PUBLIC[cleanPath] || cleanPath;
    return redirectTo(TURKISH_APEX_HOST, canonicalPath, search);
  }

  if (host === WWW_HOST) {
    const targetHost = startsWithAny(cleanPath, APP_PREFIXES) ? APP_HOST : APEX_HOST;
    return redirectTo(targetHost, cleanPath, search);
  }

  if (host === APEX_HOST && requestedLanguage === 'en') return localePreferenceRedirect(request, 'en');
  if (host === APEX_HOST && requestedLanguage === 'tr') return localePreferenceRedirect(request, 'tr');
  if (host === TURKISH_APEX_HOST && requestedLanguage === 'tr') return localePreferenceRedirect(request, 'tr');

  if (host === APEX_HOST && cleanPath === '/') {
    const country = request.headers.get('x-vercel-ip-country')?.toUpperCase() ?? '';
    const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
    const userAgent = request.headers.get('user-agent') ?? '';
    const preference = request.cookies.get(LOCALE_COOKIE)?.value;
    const turkeyFirstVisit = (country === 'TR' || (!country && acceptLanguage.startsWith('tr'))) && preference !== 'en' && !BOT_UA.test(userAgent);
    if (turkeyFirstVisit) {
      return TURKISH_DOMAIN_AUTO_REDIRECT
        ? redirectTo(TURKISH_APEX_HOST, '/', search, 307)
        : redirectTo(APEX_HOST, '/tr', search, 307);
    }
  }

  if (host === TURKISH_APEX_HOST) {
    if (startsWithAny(cleanPath, APP_PREFIXES)) return redirectTo(APP_HOST, cleanPath, search);
    if (cleanPath === '/robots.txt' || cleanPath === '/sitemap.xml') return NextResponse.next({ request: { headers: localeHeaders(request, 'tr') } });
    if (cleanPath.startsWith('/products/') || startsWithAny(cleanPath, TURKISH_GLOBAL_ONLY_PREFIXES)) return redirectTo(APEX_HOST, cleanPath, search);
    const canonicalRedirect = TURKISH_INTERNAL_TO_PUBLIC[cleanPath] || TURKISH_LEGACY_TO_PUBLIC[cleanPath];
    if (canonicalRedirect) return redirectTo(TURKISH_APEX_HOST, canonicalRedirect, search);
    if (pathname !== cleanPath && TURKISH_PUBLIC_TO_INTERNAL[cleanPath]) return redirectTo(TURKISH_APEX_HOST, cleanPath, search);
    const internalPath = TURKISH_PUBLIC_TO_INTERNAL[cleanPath];
    if (internalPath) {
      const url = request.nextUrl.clone();
      url.pathname = internalPath;
      return NextResponse.rewrite(url, { request: { headers: localeHeaders(request, 'tr') } });
    }
    return NextResponse.next({ request: { headers: localeHeaders(request, 'tr') } });
  }

  // Progressive Turkish fallback: keep /tr reachable on aikagan.com until .com.tr DNS is live.
  // Once TURKISH_DOMAIN_AUTO_REDIRECT=1, these internal TR URLs migrate to the canonical .com.tr surface.
  if (host === APEX_HOST && (cleanPath === '/tr' || cleanPath.startsWith('/tr/'))) {
    if (TURKISH_DOMAIN_AUTO_REDIRECT) {
      const publicPath = TURKISH_INTERNAL_TO_PUBLIC[cleanPath] || '/';
      return redirectTo(TURKISH_APEX_HOST, publicPath, search);
    }
    return NextResponse.next({ request: { headers: localeHeaders(request, 'tr') } });
  }

  if (host === APP_HOST) {
    if (cleanPath === '/robots.txt' || cleanPath === '/sitemap.xml') return redirectTo(APEX_HOST, cleanPath);
    if (cleanPath === '/') return redirectTo(APP_HOST, '/dashboard');
    if (startsWithAny(cleanPath, LEGACY_INTERNAL_DASHBOARDS)) return redirectTo(APP_HOST, '/dashboard');
    if (startsWithAny(cleanPath, WEB_PREFIXES)) return redirectTo(APEX_HOST, cleanPath, search);
  }

  if (host === APEX_HOST && startsWithAny(cleanPath, APP_PREFIXES)) return redirectTo(APP_HOST, cleanPath, search);

  const response = NextResponse.next({ request: { headers: localeHeaders(request, 'en') } });
  if (host === APP_HOST || startsWithAny(cleanPath, ['/admin', '/income', '/intake', '/thank-you'])) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)'] };
