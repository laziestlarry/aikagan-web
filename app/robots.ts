import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

const TURKISH_HOSTS = new Set(['aikagan.com.tr', 'www.aikagan.com.tr']);

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get('host') || '').split(':')[0].toLowerCase();
  const isTurkish = TURKISH_HOSTS.has(host);
  const base = isTurkish ? 'https://aikagan.com.tr' : 'https://aikagan.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout-success/', '/tr/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
