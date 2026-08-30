import { NextRequest, NextResponse } from 'next/server';

const APP_HOST = 'app.aikagan.com';
const APEX_HOST = 'aikagan.com';
const WWW_HOST = 'www.aikagan.com';
const TURKEY_HOSTS = new Set(['aikagan.com.tr', 'www.aikagan.com.tr']);
const LOCALE_COOKIE = 'aikagan_locale';
const BOT_UA = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|twitterbot|whatsapp/i;

const APP_PREFIXES = ['/dashboard','/autonomax','/checkout','/checkout-success','/projects','/workbench','/outputs','/credits','/downloads','/integrations','/billing','/account','/admin'];
const WEB_PREFIXES = ['/products','/services','/about','/contact','/free','/tools','/network','/feedback','/start-free','/work-with-kagan','/cash-resilience','/legal','/marketing','/affiliates','/mission-control','/privacy','/terms','/refund','/tr'];
const LEGACY_INTERNAL_DASHBOARDS = ['/dashboard/financials','/dashboard/investment-policy','/dashboard/passive-income','/dashboard/profit-intelligence','/dashboard/success','/dashboard/venture-infrastructure','/dashboard/weekly-intelligence'];
const LEGACY_TURKISH_PATHS: Record<string, string> = {
  '/': '/tr',
  '/ucretsiz-araclar': '/tr/tools',
  '/ucretsiz-araclar/gelir-kacagi-testi': '/tr/tools/revenue-leak-scan',
  '/urunler': '/tr/products',
  '/hizmetler': '/tr/services',
  '/topluluk': '/tr/network',
  '/hakkimizda': '/tr/about',
  '/iletisim': '/tr/contact',
  '/gizlilik': '/tr/legal/privacy',
  '/kullanim-kosullari': '/tr/legal/terms',
  '/iade-kosullari': '/tr/legal/refund',
};

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
function canonicalTurkishPath(pathname: string) {
  if (pathname === '/tr' || pathname.startsWith('/tr/')) return pathname;
  return LEGACY_TURKISH_PATHS[pathname] ?? `/tr${pathname}`;
}
function setPreferenceAndRedirect(request: NextRequest, locale: 'en' | 'tr') {
  const url = request.nextUrl.clone();
  url.searchParams.delete('lang');
  url.pathname = locale === 'tr' ? '/tr' : '/';
  const response = NextResponse.redirect(url, 307);
  response.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: true });
  return response;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname, search } = request.nextUrl;
  const cleanPath = normalizePath(pathname);
  const requestedLanguage = request.nextUrl.searchParams.get('lang');

  // aikagan.com/tr is the only Turkish canonical. Keep the country domain as
  // a defensive entry point, never as a second indexable website.
  if (TURKEY_HOSTS.has(host)) {
    return redirectTo(APEX_HOST, canonicalTurkishPath(cleanPath), search);
  }

  if (host === WWW_HOST) {
    const targetHost = startsWithAny(cleanPath, APP_PREFIXES) ? APP_HOST : APEX_HOST;
    return redirectTo(targetHost, cleanPath, search);
  }

  if (host === APEX_HOST && requestedLanguage === 'tr') return setPreferenceAndRedirect(request, 'tr');
  if (host === APEX_HOST && requestedLanguage === 'en') return setPreferenceAndRedirect(request, 'en');

  if (host === APEX_HOST && cleanPath === '/') {
    const country = request.headers.get('x-vercel-ip-country')?.toUpperCase() ?? '';
    const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() ?? '';
    const userAgent = request.headers.get('user-agent') ?? '';
    const preference = request.cookies.get(LOCALE_COOKIE)?.value;
    const turkeyFirstVisit = (country === 'TR' || (!country && acceptLanguage.startsWith('tr'))) && preference !== 'en' && !BOT_UA.test(userAgent);
    if (turkeyFirstVisit) return redirectTo(APEX_HOST, '/tr', search, 307);
  }

  if (host === APEX_HOST && (cleanPath === '/tr' || cleanPath.startsWith('/tr/'))) {
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
  if (host === APP_HOST || startsWithAny(cleanPath, ['/admin','/income','/intake','/thank-you'])) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)'] };
