import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KEY = 'c6b9aab5d334be3b42da0d9e8ce7d97b';
const URLS = [
  'https://aikagan.com/',
  'https://aikagan.com/tools/',
  'https://aikagan.com/tools/revenue-leak-scan/',
  'https://aikagan.com/network/',
  'https://aikagan.com/feedback/',
];

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('run') !== KEY) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const results = [];
  for (const url of URLS) {
    const endpoint = new URL('https://api.indexnow.org/indexnow');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('key', KEY);
    try {
      const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' });
      results.push({ url, status: response.status, accepted: response.status === 200 || response.status === 202 });
    } catch (error) {
      results.push({ url, status: 0, accepted: false, error: error instanceof Error ? error.message : 'unknown error' });
    }
  }

  return NextResponse.json({ ok: results.every((item) => item.accepted), results }, { headers: { 'Cache-Control': 'no-store' } });
}
