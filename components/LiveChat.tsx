"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="mb-3 w-80 rounded-2xl border border-kagan-border bg-kagan-card p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-kagan-white">Need help choosing?</p>
              <p className="mt-1 text-sm leading-6 text-kagan-light">Start with the free Revenue Leak Scan, or contact AIKAGAN for implementation support.</p>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="text-kagan-muted hover:text-kagan-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/tools/revenue-leak-scan/" className="rounded-lg bg-kagan-gold px-4 py-2 text-center text-sm font-bold text-black">Run free scan</Link>
            <Link href="/contact/" className="rounded-lg border border-kagan-border px-4 py-2 text-center text-sm text-kagan-light">Contact support</Link>
          </div>
        </div>
      ) : null}
      <button onClick={() => setOpen((v) => !v)} className="flex h-14 w-14 items-center justify-center rounded-full bg-kagan-gold text-black shadow-lg shadow-kagan-gold/30 transition hover:scale-105" aria-label="Open chat">
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
