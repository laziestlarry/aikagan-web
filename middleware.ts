import { NextRequest, NextResponse } from 'next/server';

const APP_HOST = 'app.aikagan.com';
const OUTCOME_HOST = 'outcome.aikagan.com';
const CHECKOUT_HOST = 'checkout.aikagan.com';
const BOARD_HOST = 'board.aikagan.com';
const KB_HOST = 'kb.aikagan.com';
const APEX_HOST = 'aikagan.com';
const WWW_HOST = 'www.aikagan.com';
const TURKEY_HOSTS = new Set(['aikagan.com.tr', 'www.aikagan.com.tr']);
const LOCALE_COOKIE = 'aikagan_locale';


const APP_PREFIXES = ['/dashboard','/autonomax','/checkout','/checkout-success','/projects','/workbench','/outputs','/credits','/downloads','/integrations','/billing','/account','/admin','/creator-hub'];
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
  const path = normalizePath(url.pathname);
  const englishPath = path === '/tr' ? '/' : path.replace(/^\/tr\//, '/');
  url.pathname = locale === 'tr' ? (englishPath === '/' ? '/tr' : `/tr${englishPath}`) : englishPath;
  const response = NextResponse.redirect(url, 307);
  response.cookies.set(LOCALE_COOKIE, locale, { domain: '.aikagan.com', path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', secure: true });
  return response;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname, search } = request.nextUrl;
  const cleanPath = normalizePath(pathname);
  const requestedLanguage = request.nextUrl.searchParams.get('lang');

  if (TURKEY_HOSTS.has(host)) {
    return redirectTo(APEX_HOST, canonicalTurkishPath(cleanPath), search);
  }

  if (host === WWW_HOST) {
    const targetHost = startsWithAny(cleanPath, APP_PREFIXES) ? APP_HOST : APEX_HOST;
    return redirectTo(targetHost, cleanPath, search);
  }

  if (host === CHECKOUT_HOST) {
    return redirectTo(APP_HOST, cleanPath === '/' ? '/checkout' : cleanPath, search);
  }

  if (host === BOARD_HOST) {
    if (cleanPath === '/robots.txt' || cleanPath === '/sitemap.xml') return redirectTo(APEX_HOST, cleanPath);
    const boardUrl = request.nextUrl.clone();
    boardUrl.pathname = cleanPath === '/' || cleanPath === '/creator-hub' ? '/creator-hub' : `/creator-hub${cleanPath}`;
    const response = NextResponse.rewrite(boardUrl, { request: { headers: localeHeaders(request, 'en') } });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  if (host === KB_HOST) {
    if (cleanPath === '/robots.txt' || cleanPath === '/sitemap.xml') return redirectTo(APEX_HOST, cleanPath);
    const kbUrl = request.nextUrl.clone();
    kbUrl.pathname = cleanPath === '/' || cleanPath === '/knowledge' ? '/knowledge' : `/knowledge${cleanPath}`;
    const response = NextResponse.rewrite(kbUrl, { request: { headers: localeHeaders(request, 'en') } });
    response.headers.set('X-Robots-Tag', cleanPath === '/' ? 'index, follow' : 'noindex, follow');
    return response;
  }

  if (host === OUTCOME_HOST) {
    if (cleanPath === '/outcome' || cleanPath.startsWith('/outcome/')) {
      return redirectTo(OUTCOME_HOST, cleanPath.replace(/^\/outcome/, '') || '/', search);
    }
    if (cleanPath === '/robots.txt' || cleanPath === '/sitemap.xml') return redirectTo(APEX_HOST, cleanPath);
    if (cleanPath === '/api' || cleanPath.startsWith('/api/')) {
      const response = NextResponse.next({ request: { headers: localeHeaders(request, 'en') } });
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }
    if (cleanPath === '/workspace' || cleanPath === '/dashboard') return redirectTo(APP_HOST, '/dashboard', search);
    if (startsWithAny(cleanPath, ['/products','/services','/legal','/contact'])) return redirectTo(APEX_HOST, cleanPath, search);
    if (startsWithAny(cleanPath, APP_PREFIXES)) return redirectTo(APP_HOST, cleanPath, search);
    const outcomeUrl = request.nextUrl.clone();
    outcomeUrl.pathname = cleanPath === '/' ? '/outcome' : `/outcome${cleanPath}`;
    const response = NextResponse.rewrite(outcomeUrl, { request: { headers: localeHeaders(request, 'en') } });
    
    // FIX: Only noindexOutcome if it's not the main intake landing page
    response.headers.set('X-Robots-Tag', cleanPath === '/' ? 'index, follow' : 'noindex, follow');
    return response;
  }

  if (host === APEX_HOST && requestedLanguage === 'tr') return setPreferenceAndRedirect(request, 'tr');
  if (host === APEX_HOST && requestedLanguage === 'en') return setPreferenceAndRedirect(request, 'en');

  // English is the global default. Geography and browser language never select a locale.
  if (host === APEX_HOST && (cleanPath === '/tr' || cleanPath.startsWith('/tr/'))) {
    const response = NextResponse.next({ request: { headers: localeHeaders(request, 'tr') } });
    return response;
  }

  if (host === APP_HOST) {
    if (cleanPath === '/robots.txt' || cleanPath === '/sitemap.xml') return redirectTo(APEX_HOST, cleanPath);
    if (cleanPath === '/') return redirectTo(APP_HOST, '/dashboard');
    if (startsWithAny(cleanPath, LEGACY_INTERNAL_DASHBOARDS)) return redirectTo(APP_HOST, '/dashboard');
    if (startsWithAny(cleanPath, WEB_PREFIXES)) return redirectTo(APEX_HOST, cleanPath, search);
    if (cleanPath === '/outcome' || cleanPath.startsWith('/outcome/')) return redirectTo(OUTCOME_HOST, cleanPath.replace(/^\/outcome/, '') || '/', search);
    if (cleanPath === '/checkout-success' && request.cookies.get(LOCALE_COOKIE)?.value === 'tr') {
      return NextResponse.next({ request: { headers: localeHeaders(request, 'tr') } });
    }
  }

  if (host === APEX_HOST && startsWithAny(cleanPath, APP_PREFIXES)) return redirectTo(APP_HOST, cleanPath, search);

  const response = NextResponse.next({ request: { headers: localeHeaders(request, 'en') } });
  
  // FIX: Only noindex if it's explicitly an internal APP route or admin/income/intake/thank-you
  // Public pages on APEX_HOST should be indexable.
  if (host === APP_HOST || startsWithAny(cleanPath, ['/admin','/income','/intake','/thank-you'])) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)'] };
