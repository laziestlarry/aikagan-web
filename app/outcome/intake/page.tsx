import type { Metadata } from 'next';
import OutcomeIntake from './OutcomeIntake';

export const metadata: Metadata = {
  title: 'Build your OutcomeOS mission',
  description: 'A short, editable intake that turns a business problem into a structured mission and customer workspace.',
  alternates: { canonical: 'https://outcome.aikagan.com/intake' },
  robots: { index: false, follow: true },
};

export default function OutcomeIntakePage() {
  return <OutcomeIntake />;
}
