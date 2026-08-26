import { NextRequest, NextResponse } from 'next/server';

const APP_HOST = 'app.aikagan.com';
const APEX_HOST = 'aikagan.com';
const WWW_HOST = 'www.aikagan.com';

const APP_PREFIXES = [
  '/dashboard',
  '/autonomax',
  '/checkout',
  '/checkout-success',
  '/projects',
  '/workbench',
  '/outputs',
  '/credits',
  '/downloads',
  '/integrations',
  '/billing',
  '/account',
  '/admin',
];

const WEB_PREFIXES = [
  '/products',
  '/services',
  '/about',
  '/contact',
  '/free',
  '/tools',
  '/network',
  '/feedback',
  '/start-free',
  '/work-with-kagan',
  '/cash-resilience',
  '/legal',
  '/marketing',
  '/affiliates',
  '/mission-control',
  '/privacy',
  '/terms',
  '/refund',
];

const LEGACY_INTERNAL_DASHBOARDS = [
  '/dashboard/financials',
  '/dashboard/investment-policy',
  '/dashboard/passive-income',
  '/dashboard/profit-intelligence',
  '/dashboard/success',
  '/dashboard/venture-infrastructure',
  '/dashboard/weekly-intelligence',
];

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  const { pathname, search } = request.nextUrl;

  if (host === WWW_HOST) {
    const targetHost = startsWithAny(pathname, APP_PREFIXES) ? APP_HOST : APEX_HOST;
    return NextResponse.redirect(new URL(`${pathname}${search}`, `https://${targetHost}`), 308);
  }

  if (host === APP_HOST) {
    if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
      return NextResponse.redirect(new URL(pathname, 'https://aikagan.com'), 308);
    }

    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url), 308);
    }

    if (startsWithAny(pathname, LEGACY_INTERNAL_DASHBOARDS)) {
      return NextResponse.redirect(new URL('/dashboard', request.url), 308);
    }

    if (startsWithAny(pathname, WEB_PREFIXES)) {
      return NextResponse.redirect(new URL(`${pathname}${search}`, 'https://aikagan.com'), 308);
    }
  }

  if (host === APEX_HOST && startsWithAny(pathname, APP_PREFIXES)) {
    return NextResponse.redirect(new URL(`${pathname}${search}`, 'https://app.aikagan.com'), 308);
  }

  const response = NextResponse.next();
  if (host === APP_HOST || startsWithAny(pathname, ['/admin', '/income', '/intake', '/thank-you'])) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
