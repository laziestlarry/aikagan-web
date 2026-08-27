import { MetadataRoute } from 'next';
import { products } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aikagan.com';
  const now = new Date();
  const productRoutes = products.map((product) => ({
    url: `${base}/${product.priceModel === 'free' ? 'free' : 'products'}/${product.slug}`,
    lastModified: now,
    changeFrequency: product.priceModel === 'free' ? 'weekly' : 'daily',
    priority: product.priceModel === 'free' ? 0.75 : 0.9,
  })) satisfies MetadataRoute.Sitemap;

  const turkishRoutes = [
    '/tr',
    '/tr/tools',
    '/tr/tools/revenue-leak-scan',
    '/tr/products',
    '/tr/services',
    '/tr/network',
    '/tr/about',
    '/tr/contact',
    '/tr/legal/privacy',
    '/tr/legal/terms',
    '/tr/legal/refund',
  ].map((path, index) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: index < 3 ? 'weekly' as const : 'monthly' as const,
    priority: index === 0 ? 0.95 : index < 5 ? 0.8 : 0.55,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${base}/tools/revenue-leak-scan`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/network`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/feedback`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/start-free`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...productRoutes,
    ...turkishRoutes,
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/legal/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/refund`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
