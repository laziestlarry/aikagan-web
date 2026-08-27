import { ArrowRight, CheckCircle2, CreditCard, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import MarketCheckoutLink from '@/src/components/ui/MarketCheckoutLink';
import { formatTry, TURKIYE_CATEGORY_LABELS, turkiyeCommerceProducts, type TurkiyeCommerceCategory } from '@/lib/turkiye-commerce';

export const metadata = {
  title: 'AutonomaX Ticaret Stüdyosu | Türkiye Ürünleri',
  description: 'Türkiye için yerelleştirilmiş dijital ürün, eğitim, danışmanlık ve otomasyon hizmetlerini TL fiyatlarıyla inceleyin ve Shopier üzerinden güvenli ödeme yapın.',
  alternates: {
    canonical: 'https://aikagan.com.tr/urunler',
    languages: { 'tr-TR': 'https://aikagan.com.tr/urunler', en: 'https://aikagan.com/products' },
  },
};

const categories: TurkiyeCommerceCategory[] = ['digital', 'training', 'consulting', 'subscription', 'service'];
const featured = turkiyeCommerceProducts.filter((product) => product.featured);

function ProductCard({ product, featuredCard = false }: { product: (typeof turkiyeCommerceProducts)[number]; featuredCard?: boolean }) {
  return <article className={`group flex h-full flex-col rounded-3xl border p-6 transition hover:-translate-y-1 ${featuredCard ? 'border-amber-300/25 bg-gradient-to-b from-amber-300/[0.07] to-white/[0.025]' : 'border-white/10 bg-white/[0.03] hover:border-amber-300/30'}`}>
    <div className="flex items-center justify-between gap-3">
      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-200">{TURKIYE_CATEGORY_LABELS[product.category]}</span>
      {featuredCard ? <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-300">Öne çıkan</span> : null}
    </div>
    <h3 className="mt-5 text-xl font-black leading-tight text-white">{product.title}</h3>
    <p className="mt-3 flex-1 text-sm leading-6 text-neutral-400">{product.description}</p>
    <p className="mt-5 text-xs font-semibold text-neutral-500">{product.delivery}</p>
    <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
      <div><p className="text-2xl font-black text-amber-300">{formatTry(product.priceTry)}</p><p className="mt-1 text-[11px] text-neutral-500">Shopier'da TL ödeme</p></div>
      <MarketCheckoutLink href={product.shopierUrl} sku={product.sku} title={product.title} priceTry={product.priceTry} cta={product.cta} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-300 px-4 py-2.5 text-center text-sm font-black text-black transition hover:bg-amber-200" />
    </div>
  </article>;
}

export default function TurkishProducts() {
  return <main className="min-h-screen bg-[#08080a] text-white">
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,197,66,0.14),transparent_36%),radial-gradient(circle_at_12%_80%,rgba(16,185,129,0.08),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">AIKAGAN TÜRKİYE · AUTONOMAX TİCARET STÜDYOSU</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl">Dijital ürünleri, hizmetleri ve otomasyonu <span className="text-amber-300">tek mağazada</span> başlatın.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">Türkiye için hazırlanmış katalog: açık TL fiyatları, Shopier üzerinden güvenli ödeme ve ürün tipine göre net teslimat sözü.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#one-cikanlar" className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 text-sm font-black text-black">Öne çıkanları gör <ArrowRight className="h-4 w-4" /></a><a href="#tum-katalog" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white hover:border-white/30">Tüm kataloğa git</a></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400">{['Fiyatlar TL','Shopier güvenli ödeme','Dijital ürünlerde hızlı teslimat','Uydurma satış veya kazanç vaadi yok'].map((item) => <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{item}</span>)}</div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-7 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{[
            [CreditCard, 'TL ödeme', 'Ödeme Shopier ürün sayfasında TL olarak tamamlanır.'],
            [PackageCheck, 'Net teslimat', 'Kart üzerinde ne zaman ve nasıl teslim edileceği yazılıdır.'],
            [ShieldCheck, 'Kontrollü seçim', 'Önce öne çıkanları görün; ihtiyacınız varsa tüm kataloğa geçin.'],
          ].map(([Icon, title, body]) => { const I = Icon as typeof CreditCard; return <div key={String(title)} className="rounded-2xl border border-white/10 bg-black/25 p-5"><I className="h-5 w-5 text-amber-300" /><h2 className="mt-4 font-black">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-neutral-400">{String(body)}</p></div>; })}</div>
          <p className="mt-5 text-xs leading-5 text-neutral-500">Not: Shopier satın alma ekranı ayrı bir güvenli ödeme sayfasında açılır. AIKAGAN fiyatı değiştirmez; nihai ödeme tutarı Shopier ekranında gösterilen TL tutarıdır.</p>
        </div>
      </div>
    </section>

    <section id="one-cikanlar" className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">ÖNE ÇIKAN TEKLİFLER</p>
      <h2 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">Önce en güçlü altı seçeneğe bakın.</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-400">Dijital ürün, eğitim, danışmanlık ve abonelik seçeneklerini tek ekranda karşılaştırın. Daha fazla seçenek için aşağıdaki tam kataloğu kullanın.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{featured.map((product) => <ProductCard key={product.sku} product={product} featuredCard />)}</div>
    </section>

    <section id="tum-katalog" className="border-t border-white/5 bg-[#0b0b0e]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">TAM KATALOG</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">İhtiyacınıza göre seçin.</h2></div><div className="max-w-xl rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-4 text-sm leading-6 text-neutral-300"><Sparkles className="mr-2 inline h-4 w-4 text-emerald-300" />Dijital ürünler düşük sürtünmeli başlangıçtır. Danışmanlık ve hizmetler daha kapsamlı uygulama gerektiğinde seçilmelidir.</div></div>
        <div className="mt-14 space-y-16">{categories.map((category) => {
          const items = turkiyeCommerceProducts.filter((product) => product.category === category);
          if (!items.length) return null;
          return <section key={category}><div className="mb-6 flex items-center gap-4"><h3 className="text-2xl font-black">{TURKIYE_CATEGORY_LABELS[category]}</h3><span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-neutral-500">{items.length} teklif</span></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((product) => <ProductCard key={product.sku} product={product} />)}</div></section>;
        })}</div>
      </div>
    </section>

    <section className="px-6 py-20"><div className="mx-auto max-w-5xl rounded-[32px] border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.06] to-white/[0.02] px-7 py-12 text-center"><p className="text-sm font-black text-amber-300">Önce ücretsiz denemek ister misiniz?</p><h2 className="mt-4 text-3xl font-black sm:text-4xl">Satın almadan önce işinizde nerede değer kaybı olduğunu görün.</h2><a href="/ucretsiz-araclar/gelir-kacagi-testi" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-300/40 px-5 py-3 font-black text-amber-300">Ücretsiz Gelir Kaçağı Testi <ArrowRight className="h-4 w-4" /></a></div></section>
  </main>;
}
