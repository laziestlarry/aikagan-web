import { MetadataRoute } from 'next';
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aikagan.com';
  const now = new Date();
  const productRoutes = products.map((product) => ({
    url: `${base}/${product.priceModel === "free" ? "free" : "products"}/${product.slug}/`,
    lastModified: now,
    changeFrequency: product.priceModel === "free" ? "weekly" : "daily",
    priority: product.priceModel === "free" ? 0.75 : 0.9,
  })) satisfies MetadataRoute.Sitemap;

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/products/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/services/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${base}/mission-control/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${base}/affiliates/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/marketing/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/dashboard/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.75,
    },
    ...productRoutes,
    {
      url: `${base}/about/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/contact/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/legal/contact/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${base}/legal/refund/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${base}/legal/privacy/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${base}/legal/terms/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
