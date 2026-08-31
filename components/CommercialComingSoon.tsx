import Link from "next/link";
import { ArrowRight, ShieldCheck, Wrench } from "lucide-react";

type Props = { locale?: "en" | "tr" };

const copy = {
  en: {
    eyebrow: "AIKAGAN · VERIFIED DELIVERY",
    title: "Paid delivery is coming back only when it is complete.",
    body: "We are rebuilding every paid offer so the published contents, license, checkout, and delivered files match exactly. Paid checkout is temporarily paused while that verification is completed.",
    status: "No payment is accepted on this page",
    free: "Free tools remain available",
    primary: "Run the free Revenue Leak Scan",
    secondary: "See all free tools",
    note: "The next paid release will open only after a complete purchase-to-delivery test passes.",
    support: "Support: hello@aikagan.com",
  },
  tr: {
    eyebrow: "AIKAGAN · DOĞRULANMIŞ TESLİMAT",
    title: "Ücretli teslimatlar yalnızca tamamen hazır olduğunda geri açılacak.",
    body: "Yayınlanan içerik, lisans, ödeme ve teslim edilen dosyaların birebir uyuşması için tüm ücretli teklifleri yeniden hazırlıyoruz. Bu doğrulama tamamlanana kadar ödeme geçici olarak durduruldu.",
    status: "Bu sayfada ödeme alınmıyor",
    free: "Ücretsiz araçlar kullanıma açık",
    primary: "Ücretsiz Gelir Kaçağı Testini Başlat",
    secondary: "Tüm ücretsiz araçları gör",
    note: "Ücretli teklifler, satın almadan teslimata kadar tüm testler başarıyla tamamlandıktan sonra açılacak.",
    support: "Destek: hello@aikagan.com",
  },
} as const;

export default function CommercialComingSoon({ locale = "en" }: Props) {
  const text = copy[locale];
  const prefix = locale === "tr" ? "/tr" : "";

  return (
    <main className="relative min-h-[80vh] overflow-hidden bg-[#08080a] px-6 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(245,197,66,0.14),transparent_34%),radial-gradient(circle_at_12%_78%,rgba(16,185,129,0.08),transparent_32%)]" />
      <section className="relative mx-auto max-w-4xl">
        <div className="rounded-[32px] border border-amber-300/20 bg-[#0d1119]/90 p-8 shadow-[0_0_80px_rgba(245,197,66,0.08)] sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-300/10">
            <Wrench className="h-7 w-7 text-amber-300" />
          </div>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-amber-300">{text.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-[-0.03em] sm:text-6xl">{text.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">{text.body}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.06] px-4 py-2 text-amber-100"><ShieldCheck className="h-4 w-4 text-amber-300" /> {text.status}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/[0.06] px-4 py-2 text-emerald-100"><ShieldCheck className="h-4 w-4 text-emerald-300" /> {text.free}</span>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={`${prefix}/tools/revenue-leak-scan`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-300 px-6 py-3 font-black text-black transition hover:bg-amber-200">{text.primary} <ArrowRight className="h-4 w-4" /></Link>
            <Link href={`${prefix}/tools`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-bold text-white transition hover:border-white/30">{text.secondary}</Link>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-sm leading-6 text-neutral-400">
            <p>{text.note}</p>
            <p className="mt-2 text-neutral-500">{text.support}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
