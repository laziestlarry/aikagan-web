import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://aikagan.com';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/dashboard/', '/creator-hub/', '/checkout-success/'] },
      { userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot'], allow: ['/', '/tr/', '/knowledge/', '/llms.txt', '/llms-full.txt'], disallow: ['/api/', '/admin/', '/dashboard/', '/creator-hub/', '/checkout-success/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
