import { TRUST_SIGNALS } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';

export default function TrustBar() {
  return (
    <div className="border-y border-kagan-border/60 bg-kagan-darker/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal} className="flex items-center gap-2 text-sm text-kagan-light">
              <CheckCircle2 className="h-4 w-4 text-kagan-gold flex-shrink-0" />
              <span className="whitespace-nowrap">{signal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
