import { NextRequest, NextResponse } from 'next/server';

const APP_HOST = 'app.aikagan.com';
const WEB_HOSTS = new Set(['aikagan.com', 'www.aikagan.com']);

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

  if (host === APP_HOST) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard/', request.url));
    }

    if (startsWithAny(pathname, LEGACY_INTERNAL_DASHBOARDS)) {
      return NextResponse.redirect(new URL('/dashboard/', request.url));
    }

    if (startsWithAny(pathname, WEB_PREFIXES)) {
      return NextResponse.redirect(new URL(`${pathname}${search}`, 'https://aikagan.com'));
    }
  }

  if (WEB_HOSTS.has(host) && startsWithAny(pathname, APP_PREFIXES)) {
    return NextResponse.redirect(new URL(`${pathname}${search}`, 'https://app.aikagan.com'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
