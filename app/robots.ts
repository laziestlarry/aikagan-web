import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://aikagan.com';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/checkout-success/'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
