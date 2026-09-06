import { CheckCircle2 } from "lucide-react";

const steps = [
  "Name one result that can be checked.",
  "Run the workflow in your chosen tools.",
  "Record the proof or escalate the blocker.",
];

export default function LazyLarryGuide() {
  return (
    <aside className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.04] p-6 md:p-8" aria-labelledby="lazy-larry-guide-title">
      <div className="grid items-center gap-6 md:grid-cols-[140px_1fr]">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-kagan-gold/30 bg-kagan-black/30" aria-hidden="true">
          <svg viewBox="0 0 128 128" className="h-28 w-28">
            <circle cx="64" cy="64" r="45" fill="#17120a" stroke="#d4af37" strokeWidth="2" opacity="0.95" />
            <circle cx="64" cy="50" r="17" fill="#d4af37" />
            <path d="M35 96c7-19 18-28 29-28s22 9 29 28" fill="#10b981" opacity="0.9" />
            <circle cx="58" cy="49" r="2" fill="#08080a" />
            <circle cx="70" cy="49" r="2" fill="#08080a" />
            <path d="M57 58c4 3 10 3 14 0" fill="none" stroke="#08080a" strokeLinecap="round" strokeWidth="2" />
            <path d="M96 30a43 43 0 0 1 0 68" fill="none" stroke="#d4af37" strokeDasharray="5 7" strokeLinecap="round" strokeWidth="2">
              <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 64 64" to="360 64 64" dur="12s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Lazy Larry's 2D field guide</p>
          <h2 id="lazy-larry-guide-title" className="mt-2 text-2xl font-bold text-kagan-white">Keep the first win simple and provable.</h2>
          <p className="mt-3 text-sm leading-6 text-kagan-light">This guided manual helps you move from an outcome to acceptance evidence. It does not run external tools for you or represent work as complete before the proof exists.</p>
          <ol className="mt-5 grid gap-2 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-2 rounded-xl border border-kagan-border/80 bg-kagan-black/20 p-3 text-xs leading-5 text-kagan-light">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
                <span><strong className="text-kagan-white">{index + 1}.</strong> {step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  );
}
