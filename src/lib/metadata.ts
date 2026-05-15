import { Metadata } from 'next';
import { SITE } from './constants';

export function buildMetadata({
  title,
  description,
  path = '/',
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const pageTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const pageDescription = description ?? SITE.description;
  const url = `${SITE.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: SITE.name,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
    robots: { index: true, follow: true },
  };
}
