import { MetadataRoute } from 'next';
import { products } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aikagan.com';
  const now = new Date();
  const pairedRoutes = [
    ['', '/tr'],
    ['/tools', '/tr/tools'],
    ['/tools/revenue-leak-scan', '/tr/tools/revenue-leak-scan'],
    ['/free/golden-delivery-sample', '/tr/free/golden-delivery-sample'],
    ['/start-free', '/tr/start-free'],
    ['/outcome', '/tr/outcome'],
    ['/outcome/intake', '/tr/outcome/intake'],
    ['/genesis', '/tr/genesis'],
    ['/flight', '/tr/flight'],
    ['/network', '/tr/network'],
    ['/feedback', '/tr/feedback'],
    ['/products', '/tr/products'],
    ['/services', '/tr/services'],
    ['/about', '/tr/about'],
    ['/contact', '/tr/contact'],
    ['/legal/privacy', '/tr/legal/privacy'],
    ['/legal/terms', '/tr/legal/terms'],
    ['/legal/refund', '/tr/legal/refund'],
  ] as const;
  const localizedRoutes = pairedRoutes.flatMap(([enPath,trPath],index) => {
    const languages = { en: `${base}${enPath || '/'}`, 'tr-TR': `${base}${trPath}`, 'x-default': `${base}${enPath || '/'}` };
    return [
      { url: `${base}${enPath || ''}`, lastModified: now, changeFrequency: index < 6 ? 'weekly' as const : 'monthly' as const, priority: index === 0 ? 1 : index < 6 ? .85 : .65, alternates: { languages } },
      { url: `${base}${trPath}`, lastModified: now, changeFrequency: index < 6 ? 'weekly' as const : 'monthly' as const, priority: index === 0 ? .95 : index < 6 ? .82 : .62, alternates: { languages } },
    ];
  });
  const productRoutes = products.filter(product => product.priceModel !== 'free').flatMap((product) => {
    const en = `${base}/products/${product.slug}`;
    const tr = `${base}/tr/products/${product.slug}`;
    const languages = { en, 'tr-TR': tr, 'x-default': en };
    return [{ url: en, lastModified: now, changeFrequency: 'weekly' as const, priority: .8, alternates: { languages } }, { url: tr, lastModified: now, changeFrequency: 'weekly' as const, priority: .78, alternates: { languages } }];
  });
  const englishFreeRoutes = products.filter(product => product.priceModel === 'free').map((product) => ({
    url: `${base}/free/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.72,
  })) satisfies MetadataRoute.Sitemap;

  return [
    ...localizedRoutes,
    ...productRoutes,
    ...englishFreeRoutes,
    { url: `${base}/legal/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
