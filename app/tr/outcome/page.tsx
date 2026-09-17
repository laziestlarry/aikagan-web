import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardCheck, Gauge, ShieldCheck, Workflow } from 'lucide-react';

export const metadata: Metadata = {
  title: 'İş Hedefinizi Uygulanabilir Bir Plana Dönüştürün',
  description: 'İşinizdeki bir sorunu sınırları, sorumlusu, beklenen çıktısı ve başarı ölçüsü belli bir çalışma planına dönüştürün.',
  alternates: { canonical: 'https://aikagan.com/tr/outcome', languages: { 'tr-TR': 'https://aikagan.com/tr/outcome', en: 'https://outcome.aikagan.com/' } },
};

const steps = [
  ['1', 'Sorunu anlatın', 'Bugün neyin çalışmadığını veya neyi iyileştirmek istediğinizi günlük dille yazın.'],
  ['2', 'Sınırı ve hedefi belirleyin', 'Korunmasını istediğiniz süreçleri, mevcut durumu ve başarı ölçütlerinizi belirtin.'],
  ['3', 'Taslağı kontrol edin', 'Yapay zekânın ne hazırlayabileceğini ve hangi kararın insanda kalacağını açıkça görün.'],
  ['4', 'Önerilen yolu alın', 'Gönderimden sonra uygun başlangıç yolu ve sonraki adım aynı sayfada gösterilir.'],
] as const;

export default function TurkishOutcomePage() {
  return <main className="min-h-screen bg-[#07090d] text-white">
    <section className="border-b border-white/10 px-6 py-24"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
      <div><p className="text-sm font-bold text-sky-300">ÜCRETSİZ İŞ HEDEFİ TASLAĞI</p><h1 className="mt-4 text-5xl font-black leading-[.98] sm:text-6xl">Bir iş sorununu <span className="text-amber-300">uygulanabilir bir çalışma planına</span> dönüştürün.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">Teknik terim bilmeniz gerekmez. Sorunu, hedefi ve sınırları anlatın; kimin karar vereceği ve hangi sonucun kabul edileceği belli bir taslak alın.</p><Link href="/tr/outcome/intake" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-4 font-black text-black">Ücretsiz taslağı hazırla <ArrowRight className="h-4 w-4"/></Link><div className="mt-7 flex flex-wrap gap-4 text-sm text-neutral-400">{['Ücretsiz kullanım','Taslak düzenlenebilir','Göndermeden önce son kontrol','Kararlar sizin onayınızla alınır'].map(x=><span key={x} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300"/>{x}</span>)}</div></div>
      <aside className="rounded-3xl border border-sky-300/20 bg-white/[.03] p-7"><ShieldCheck className="h-7 w-7 text-emerald-300"/><h2 className="mt-5 text-2xl font-black">Yapay zekâ destek olur, karar sizde kalır.</h2><p className="mt-4 leading-7 text-neutral-400">Bu ücretsiz araç fikirleri düzenler ve bir sonraki adımı önerir. Ödeme yapmaz, hesabınıza girmez, içerik yayımlamaz ve sizin adınıza dış sistemlerde işlem başlatmaz.</p></aside>
    </div></section>
    <section className="mx-auto max-w-7xl px-6 py-24"><p className="text-sm font-bold text-amber-300">HEDEFİNİZİ BİRLİKTE NETLEŞTİRELİM</p><h2 className="mt-3 text-4xl font-black">Dört adımda somut bir başlangıç.</h2><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{steps.map(([n,t,b])=><article key={n} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><span className="text-sm font-black text-sky-300">{n}</span><h3 className="mt-4 text-xl font-black">{t}</h3><p className="mt-3 text-sm leading-6 text-neutral-400">{b}</p></article>)}</div></section>
    <section className="border-y border-white/10 bg-[#0b1019] px-6 py-20"><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">{[
      [Gauge,'Alacağınız sonuç','Öncelikli sorun, önerilen başlangıç yolu ve takip edilebilir görev kaydı.'],
      [Workflow,'Teslim şekli','Sonuç ekranda gösterilir. E-posta verirseniz görev kaydı destek ve devam görüşmesi için saklanır.'],
      [ClipboardCheck,'Sınırlar','Ücretsiz taslak bir kazanç garantisi veya tamamlanmış uygulama değildir; karar vermeyi kolaylaştıran başlangıç çıktısıdır.'],
    ].map(([Icon,t,b])=>{const I=Icon as typeof Gauge; return <article key={String(t)} className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><I className="h-6 w-6 text-amber-300"/><h3 className="mt-4 text-xl font-black">{String(t)}</h3><p className="mt-3 text-sm leading-6 text-neutral-400">{String(b)}</p></article>})}</div></section>
  </main>;
}

