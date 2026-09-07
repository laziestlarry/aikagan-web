"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

type Locale = "en" | "tr";

const BROADCASTS = {
  en: [
    { match: "/products", line: "Three Golden Delivery packs are live on hosted checkout. Start at $29.", href: "/products/masterclass-starter", cta: "Buy Starter" },
    { match: "/checkout", line: "If overlay checkout stalls, keep going on the hosted Gumroad rail.", href: "/products", cta: "Choose a pack" },
    { match: "/dashboard", line: "Workspace first. Evidence second. Then buy only the pack that matches the gap.", href: "/genesis", cta: "Open Genesis" },
    { match: "/genesis", line: "Name the customer and the 30-day outcome. I file it in Alexandria.", href: "/start-free", cta: "Start free first" },
    { match: "/autonomax", line: "Control plane is for outcomes. Paid packs are for the operating kit.", href: "/products", cta: "See packs" },
    { match: "/start-free", line: "Free value first. When the leak is obvious, Starter is the first paid move.", href: "/products/masterclass-starter", cta: "Open Starter $29" },
    { match: "/tools", line: "Scan the leak, then convert the same visitor into a first-sale kit.", href: "/tools/revenue-leak-scan", cta: "Run the scan" },
    { match: "/", line: "Lazy Larry here. Try free, then buy a Golden Delivery pack you can actually download.", href: "/start-free", cta: "Start free" },
  ],
  tr: [
    { match: "/tr/products", line: "Üç Golden Delivery paketi Gumroad üzerinden açık. $29’dan başlar.", href: "/tr/products", cta: "Paketleri gör" },
    { match: "/tr", line: "Önce ücretsiz dene. İşe yararsa Starter paketini al.", href: "/tr/tools", cta: "Ücretsiz başla" },
  ],
} as const;

function pickBroadcast(pathname: string, locale: Locale) {
  const list = locale === "tr" ? BROADCASTS.tr : BROADCASTS.en;
  return list.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`)) ?? list[list.length - 1];
}

export default function LazyLarryAmbassador({ locale = "en" }: { locale?: Locale }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const broadcast = useMemo(() => pickBroadcast(pathname, locale), [pathname, locale]);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-[min(100%-2rem,22rem)]">
      {open ? (
        <aside className="mb-3 rounded-3xl border border-kagan-gold/30 bg-[#111018]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur" aria-label="Lazy Larry assistant">
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 128 128" className="h-14 w-14 shrink-0" aria-hidden="true">
              <circle cx="64" cy="64" r="45" fill="#17120a" stroke="#d4af37" strokeWidth="2" />
              <circle cx="64" cy="50" r="17" fill="#d4af37" />
              <path d="M35 96c7-19 18-28 29-28s22 9 29 28" fill="#10b981" />
              <circle cx="58" cy="49" r="2" fill="#08080a" />
              <circle cx="70" cy="49" r="2" fill="#08080a" />
              <path d="M57 58c4 3 10 3 14 0" fill="none" stroke="#08080a" strokeLinecap="round" strokeWidth="2" />
              <path d="M96 30a43 43 0 0 1 0 68" fill="none" stroke="#d4af37" strokeDasharray="5 7" strokeLinecap="round" strokeWidth="2">
                <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="12s" repeatCount="indefinite" />
              </path>
            </svg>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">Lazy Larry · broadcast</p>
              <p className="mt-1 text-sm leading-6 text-neutral-200">{broadcast.line}</p>
              <Link href={broadcast.href} className="mt-3 inline-flex rounded-lg bg-amber-300 px-3 py-2 text-xs font-black text-black hover:bg-amber-200">
                {broadcast.cta}
              </Link>
            </div>
            <button type="button" aria-label="Dismiss Lazy Larry" onClick={() => setDismissed(true)} className="text-neutral-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-kagan-gold/40 bg-[#17120a] shadow-lg shadow-kagan-gold/20"
          aria-label="Open Lazy Larry"
        >
          <span className="text-lg" aria-hidden="true">🦙</span>
        </button>
      )}
    </div>
  );
}
