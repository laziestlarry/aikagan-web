"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface SocialSwipeCardProps {
  index: number;
  label: string;
  angle: string;
  body: string;
  cta?: string;
  expanded?: boolean;
}

export default function SocialSwipeCard({
  index,
  label,
  angle,
  body,
  cta,
  expanded = false,
}: SocialSwipeCardProps) {
  const [copied, setCopied] = useState<"body" | "all" | null>(null);

  const copy = async (text: string, which: "body" | "all") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  };

  const fullText = cta ? `${body}\n\n${cta}` : body;

  return (
    <div
      className={`rounded-xl border border-kagan-border bg-kagan-card/60 p-4 ${
        expanded ? "" : "h-full flex flex-col"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-kagan-muted">
            #{String(index).padStart(2, "0")}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-kagan-gold">
            {label}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase text-kagan-muted">
          {angle}
        </span>
      </div>
      <pre className="text-sm text-kagan-light whitespace-pre-wrap font-sans leading-relaxed mb-3 flex-1">
        {body}
      </pre>
      <div className="flex items-center gap-2">
        <button
          onClick={() => copy(body, "body")}
          className="inline-flex items-center gap-1.5 rounded-md border border-kagan-border bg-kagan-black/60 px-2.5 py-1.5 text-xs text-kagan-light hover:border-kagan-gold/40 hover:text-kagan-gold transition-colors"
        >
          {copied === "body" ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied === "body" ? "Copied" : "Copy body"}
        </button>
        {cta && (
          <button
            onClick={() => copy(fullText, "all")}
            className="inline-flex items-center gap-1.5 rounded-md border border-kagan-gold/30 bg-kagan-gold/[0.08] px-2.5 py-1.5 text-xs text-kagan-gold hover:bg-kagan-gold/20 transition-colors"
          >
            {copied === "all" ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied === "all" ? "Copied" : "Copy + CTA"}
          </button>
        )}
      </div>
    </div>
  );
}
