import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { products } from '@/lib/products';

const TURKISH_HOSTS = new Set(['aikagan.com.tr', 'www.aikagan.com.tr']);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = ((await headers()).get('host') || '').split(':')[0].toLowerCase();
  const now = new Date();

  if (TURKISH_HOSTS.has(host)) {
    const base = 'https://aikagan.com.tr';
    return [
      { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
      { url: `${base}/ucretsiz-araclar`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
      { url: `${base}/ucretsiz-araclar/gelir-kacagi-testi`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${base}/urunler`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${base}/hizmetler`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${base}/topluluk`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${base}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${base}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
      { url: `${base}/gizlilik`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${base}/kullanim-kosullari`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${base}/iade-kosullari`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    ];
  }

  const base = 'https://aikagan.com';
  const productRoutes = products.map((product) => ({
    url: `${base}/${product.priceModel === 'free' ? 'free' : 'products'}/${product.slug}`,
    lastModified: now,
    changeFrequency: product.priceModel === 'free' ? 'weekly' : 'daily',
    priority: product.priceModel === 'free' ? 0.75 : 0.9,
  })) satisfies MetadataRoute.Sitemap;

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${base}/tools/revenue-leak-scan`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/network`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/feedback`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/start-free`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/mission-control`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${base}/affiliates`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/marketing`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/cash-resilience`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${base}/work-with-kagan`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    ...productRoutes,
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/legal/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/refund`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
