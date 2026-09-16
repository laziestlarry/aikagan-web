import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://aikagan.com'),
  title: { default: 'AIKAGAN Türkiye — Ücretsiz Yapay Zekâ İş Araçları', template: '%s | AIKAGAN Türkiye' },
  description: 'İşinizde satışın nerede tıkandığını görün, teklifinizi netleştirin ve tekrar eden işleri kolaylaştırın.',
  alternates: { canonical: '/tr', languages: { 'tr-TR': 'https://aikagan.com/tr', en: 'https://aikagan.com/' } },
  openGraph: {
    locale: 'tr_TR',
    siteName: 'AIKAGAN Türkiye',
    type: 'website',
    url: 'https://aikagan.com/tr',
    title: 'AIKAGAN Türkiye — Ücretsiz Yapay Zekâ İş Araçları',
    description: 'İşinizde satışın nerede tıkandığını görün, teklifinizi netleştirin ve tekrar eden işleri kolaylaştırın.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIKAGAN Türkiye — Ücretsiz Yapay Zekâ İş Araçları',
    description: 'İşinizde satışın nerede tıkandığını görün, teklifinizi netleştirin ve tekrar eden işleri kolaylaştırın.',
  },
};

export default function TurkishLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://aikagan.com/#organization',
        name: 'AIKAGAN',
        url: 'https://aikagan.com/tr',
        email: 'kagan@aikagan.com',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://aikagan.com/tr#website',
        name: 'AIKAGAN Türkiye',
        url: 'https://aikagan.com/tr',
        inLanguage: 'tr-TR',
        publisher: { '@id': 'https://aikagan.com/#organization' },
      },
      {
        '@type': 'ItemList',
        name: 'Ücretsiz AIKAGAN İş Araçları',
        inLanguage: 'tr-TR',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Gelir Kaybı Testi', url: 'https://aikagan.com/tr/tools/revenue-leak-scan' },
          { '@type': 'ListItem', position: 2, name: 'Hazır Teslimat Örneği', url: 'https://aikagan.com/tr/free/golden-delivery-sample' },
          { '@type': 'ListItem', position: 3, name: 'Ücretsiz İş Hedefi Taslağı', url: 'https://aikagan.com/tr/outcome/intake' },
        ],
      },
    ],
  };
  return <div lang="tr"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}</div>;
}
