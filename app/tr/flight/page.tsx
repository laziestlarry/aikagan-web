import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FileCheck2,
  Gauge,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';

export const metadata = {
  title: 'Flight 002 — Teşhis Et, Uygula, Doğrula',
  description:
    'AIKAGAN Flight 002, gerçek iş sorunlarını öncelikli uygulama görevlerine çevirir ve sonucu kanıt kapılarıyla doğrular. Ücretsiz araçlar ve uygulama talepleri açık; kendi kendine ücretli ödeme, teslimat zinciri doğrulanana kadar kapalıdır.',
  alternates: { canonical: 'https://aikagan.com/tr/flight' },
};

const flow = [
  {
    step: '01',
    title: 'Teşhis et',
    body: 'Gerçek bir iş sıkıntısından başla: gelir kaçağı, düşük dönüşüm, teslimat yükü, dağınık operasyon veya doğrulanması gereken yeni bir fırsat.',
    icon: Radar,
  },
  {
    step: '02',
    title: 'Önceliklendir',
    body: 'Beklenen değer, aciliyet, kanıt, efor, risk ve otomasyon potansiyeline göre gürültüyü tek bir öncelikli göreve indir.',
    icon: Compass,
  },
  {
    step: '03',
    title: 'Uygula',
    body: 'Seçilen görevi net adımlara, sorumlulara, araçlara, onaylara, teslim kriterlerine ve ölçülebilir çıktılara dönüştür.',
    icon: Workflow,
  },
  {
    step: '04',
    title: 'Doğrula',
    body: 'Üretilen işi tamamlanmış işten ayır. Ödeme, yayın, teslimat ve sonuç iddiaları ancak destekleyen kanıt varsa geçerli kabul edilir.',
    icon: FileCheck2,
  },
] as const;

const modules = [
  ['İstihbarat', 'Pazar, gelir, trend, müşteri ve fırsat sinyalleri tek karar yüzeyinde buluşur.'],
  ['Görev Planı', 'Seçilen sorun; hedef, kısıt, teslimat, bağımlılık ve kabul kriterleriyle sınırlandırılır.'],
  ['Commander', 'Otomasyon ve insan işi; açık araçlar, onaylar, devirler ve kurtarma yollarıyla koordine edilir.'],
  ['Yönetişim', 'Kanıt kapıları, simüle edilmiş hazırlığın veya eski varsayımların üretim gerçeği gibi sunulmasını engeller.'],
] as const;

const lanes = [
  {
    eyebrow: 'GELİR ONARIMI',
    title: 'Ticari darboğazı bul',
    body: 'Ücretsiz Gelir Kaçağı Taramasını çalıştır; teklif, ödeme, teslimat, takip ve elde tutma yolundaki sürtünmeleri sırala.',
    href: '/tr/tools/revenue-leak-scan',
    cta: 'Ücretsiz taramayı başlat',
    icon: Gauge,
  },
  {
    eyebrow: 'GİRİŞİM / TEKLİF',
    title: 'Fikri uygulanabilir göreve çevir',
    body: 'Fikrini, atıl varlığını, teklifini veya operasyon sorununu getir. Herhangi bir uygulama taahhüdünden önce en değerli sonraki görevi birlikte kapsamlandıralım.',
    href: '/tr/contact',
    cta: 'Görev kapsamı iste',
    icon: Sparkles,
  },
  {
    eyebrow: 'OTOMASYON / OPERASYON',
    title: 'AutonomaX uygulama katmanını keşfet',
    body: 'Hedeflerin, birbirinden kopuk yapay zekâ çıktıları yerine sonraki adımları ve ölçülebilir ilerlemesi olan yönetilen görevlere nasıl dönüştürüldüğünü gör.',
    href: 'https://app.aikagan.com/autonomax',
    cta: 'AutonomaX’i aç',
    icon: Workflow,
  },
] as const;

const releaseState = [
  ['Ücretsiz teşhis araçları', 'AÇIK'],
  ['Ücretsiz teslimat örneği', 'AÇIK'],
  ['Uygulama talepleri', 'AÇIK'],
  ['AutonomaX keşfi', 'AÇIK'],
  ['Kendi kendine ücretli ödeme', 'KAPALI'],
] as const;

export default function TurkishFlightPage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(212,175,55,0.18),transparent_34%),radial-gradient(circle_at_14%_74%,rgba(16,185,129,0.10),transparent_32%),linear-gradient(145deg,#08080a_0%,#120e07_52%,#08080a_100%)]" />
        <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-300">
              <span className="h-2 w-2 rounded-full bg-emerald-300" /> Flight 002 · genel operasyon açık
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Sorunu teşhis et. <span className="text-amber-300">Görevi uygula.</span> Sonucu doğrula.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
              AIKAGAN artık tek bir işletme kuralı etrafında yeniden kuruluyor: üretilmiş iş, tamamlanmış iş değildir. Flight 002; istihbarat, önceliklendirme, uygulama ve kanıtı tek pratik akışta birleştirir.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/tr/tools/revenue-leak-scan" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black transition hover:bg-amber-200">
                Ücretsiz teşhisle başla <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tr/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-white/30">
                Bir görev getir
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">
              {['Uydurma ROI yok', 'Simüle hazırlık yok', 'Gelirden önce kanıt'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> {item}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-black/35 p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-500">Yayın kapısı</p><h2 className="mt-2 text-2xl font-black">Gerçekte ne açık?</h2></div>
              <ShieldCheck className="h-8 w-8 text-emerald-300" />
            </div>
            <div className="mt-6 space-y-3">
              {releaseState.map(([label, state]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                  <span className="text-sm text-neutral-300">{label}</span>
                  <span className={state === 'AÇIK' ? 'text-xs font-black text-emerald-300' : 'text-xs font-black text-amber-300'}>{state}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-neutral-400">Kendi kendine ücretli ödeme; teklif → ödeme → fulfillment → teslimat → kanıt zinciri baştan sona doğrulanana kadar kapalı kalır. Bu bir pazarlama sözü değil, yayın şartıdır.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl"><p className="text-sm font-semibold text-emerald-300">YENİ ÇALIŞMA AKIŞI</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">Sinyalden operasyon gerçeğine dört kapı.</h2><p className="mt-5 text-lg leading-8 text-neutral-400">Kurtarılan eski sistemler, üretime hazır olduklarının kanıtı olarak değil; tekrar kullanılabilir yetenek modülleri olarak değerlendiriliyor.</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {flow.map(({ step, title, body, icon: Icon }) => (
            <article key={step} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.2em] text-neutral-500">{step}</span><Icon className="h-6 w-6 text-amber-300" /></div><h3 className="mt-7 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-neutral-400">{body}</p></article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-[#0b0b0e]">
        <div className="mx-auto max-w-7xl px-6 py-24"><div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div><p className="text-sm font-semibold text-amber-300">ARŞİVDEN NEYİ TUTTUK?</p><h2 className="mt-3 text-4xl font-black">Faydalı mimariyi aldık, yükü değil.</h2><p className="mt-5 leading-8 text-neutral-400">Flight 002; Commander, Studio, BizOp, Khanate, büyüme ve YouTube sistemlerindeki en güçlü ortak desenleri topluyor; eski kimlik bilgilerini, doğrulanamayan üretim iddialarını ve tekrar eden uygulama kabuklarını dışarıda bırakıyor.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{modules.map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><h3 className="text-xl font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-400">{body}</p></div>)}</div>
        </div></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl"><p className="text-sm font-semibold text-emerald-300">BİNİŞ KAPILARI</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">Mimariden değil, istediğin sonuçtan başla.</h2></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {lanes.map(({ eyebrow, title, body, href, cta, icon: Icon }) => (
            <Link key={title} href={href} className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-amber-300/40"><Icon className="h-7 w-7 text-amber-300" /><p className="mt-6 text-xs font-black tracking-[0.22em] text-neutral-500">{eyebrow}</p><h3 className="mt-3 text-2xl font-black">{title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-neutral-400">{body}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-amber-300">{cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.11),transparent_55%),#0d0d10] px-7 py-14 text-center sm:px-12"><FileCheck2 className="mx-auto h-8 w-8 text-amber-300" /><p className="mt-5 text-sm font-semibold text-amber-300">SON ÇAĞRI</p><h2 className="mt-4 text-4xl font-black">Bir gerçek darboğaz getir. Flight 002 oradan başlasın.</h2><p className="mx-auto mt-5 max-w-2xl leading-7 text-neutral-400">Önce platform satın almana veya iç mimariyi anlamana gerek yok. Gerçek bir sorunu teşhis et, görevi seç ve ancak kanıt desteklediğinde ilerle.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/tr/tools/revenue-leak-scan" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black hover:bg-amber-200">Ücretsiz taramayı başlat <ArrowRight className="h-4 w-4" /></Link><Link href="/tr/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-white/30">Uygulama iste</Link></div></div>
      </section>
    </main>
  );
}
