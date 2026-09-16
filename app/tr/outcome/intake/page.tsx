import type { Metadata } from 'next';
import OutcomeIntakeTR from './OutcomeIntakeTR';

export const metadata: Metadata = {
  title: 'Ücretsiz İş Hedefi Taslağı',
  description: 'İş sorununuzu, sınırları ve kabul edeceğiniz sonucu üç kısa adımda netleştirin.',
  alternates: { canonical: 'https://aikagan.com/tr/outcome/intake', languages: { 'tr-TR': 'https://aikagan.com/tr/outcome/intake', en: 'https://outcome.aikagan.com/intake' } },
  robots: { index: false, follow: true },
};

export default function TurkishOutcomeIntakePage() { return <OutcomeIntakeTR/>; }

