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
  return <div lang="tr">{children}</div>;
}
