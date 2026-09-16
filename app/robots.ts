import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://aikagan.com';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/dashboard/', '/checkout-success/'] },
      { userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot'], allow: ['/', '/tr/', '/llms.txt', '/llms-full.txt'], disallow: ['/api/', '/admin/', '/dashboard/', '/checkout-success/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
