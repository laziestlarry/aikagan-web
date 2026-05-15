'use client';

import { cn } from '@/lib/utils';
import { MISSION_STAGES } from '@/lib/constants';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface ProcessStagesProps {
  className?: string;
}

export default function ProcessStages({ className }: ProcessStagesProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {MISSION_STAGES.map((stage, i) => (
        <div key={stage.stage} className="relative">
          {/* Connector line */}
          {i < MISSION_STAGES.length - 1 && (
            <div className="absolute left-6 top-14 bottom-0 w-px bg-kagan-border" />
          )}

          <div className="flex gap-5 pb-8 group">
            {/* Stage number */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={cn(
                  'h-12 w-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300',
                  'border-kagan-gold/50 bg-kagan-gold/10 text-kagan-gold',
                  'group-hover:border-kagan-gold group-hover:bg-kagan-gold/20 group-hover:shadow-lg group-hover:shadow-kagan-gold/10'
                )}
              >
                <span className="text-sm font-bold font-mono">{stage.stage}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-kagan-white group-hover:text-kagan-gold transition-colors">
                  {stage.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-kagan-success bg-kagan-success/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Active
                </div>
              </div>
              <p className="text-kagan-light text-sm leading-relaxed max-w-xl">
                {stage.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
