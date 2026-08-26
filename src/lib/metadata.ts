import { Metadata } from 'next';
import { SITE } from './constants';

export function canonicalPath(path = '/') {
  const [pathname] = path.split(/[?#]/, 1);
  if (!pathname || pathname === '/') return '/';
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeadingSlash.replace(/\/+$/, '');
}

export function canonicalUrl(path = '/') {
  const normalizedPath = canonicalPath(path);
  return normalizedPath === '/' ? SITE.url : `${SITE.url}${normalizedPath}`;
}

export function fitMetaDescription(description: string, maxLength = 160) {
  const compact = description.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  const shortened = compact.slice(0, maxLength - 1);
  const wordBoundary = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, wordBoundary > 100 ? wordBoundary : maxLength - 1).replace(/[,:;.!?-]+$/, '')}.`;
}

export function buildMetadata({
  title,
  description,
  path = '/',
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const pageTitle = title ?? `${SITE.name} — ${SITE.tagline}`;
  const socialTitle = title ? `${title} | ${SITE.name}` : pageTitle;
  const pageDescription = fitMetaDescription(description ?? SITE.description);
  const url = canonicalUrl(path);

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: pageDescription,
      url,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: `AutonomaX Profit OS — AI Revenue Ops`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: pageDescription,
      images: ['/og.png'],
    },
    robots: { index: true, follow: true },
  };
}
