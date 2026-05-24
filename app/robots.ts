import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout-success/'],
      },
    ],
    sitemap: 'https://aikagan.com/sitemap.xml',
    host: 'https://aikagan.com',
  };
}
