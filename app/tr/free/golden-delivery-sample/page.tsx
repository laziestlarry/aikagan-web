import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Ücretsiz Teslimat Örneği',
  description: 'AIKAGAN teslimat standardının küçük bir Türkçe örneğini e-posta vermeden inceleyin.',
  alternates: {
    canonical: 'https://aikagan.com/tr/free/golden-delivery-sample',
    languages: {
      'tr-TR': 'https://aikagan.com/tr/free/golden-delivery-sample',
      en: 'https://aikagan.com/free/golden-delivery-sample',
    },
  },
};

const checks = [
  'İstenen sonuç ve kapsam tek cümlede netleştirilir.',
  'Teslim edilecek dosyalar ve kullanılacak bağlantılar açıkça listelenir.',
  'Çalışan bölüm, varsayım ve doğrulanmamış bölüm birbirinden ayrılır.',
  'Müşterinin ilk kullanımı için kısa bir başlangıç adımı verilir.',
  'Teslimat öncesi bağlantı, içerik ve erişim kontrolü yapılır.',
  'Sorun olduğunda destek ve düzeltme yolu görünür bırakılır.',
];

export default function TurkishDeliverySample() {
  return (
    <main className="min-h-screen bg-[#08080a] px-5 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-emerald-300">ÜCRETSİZ · E-POSTA GEREKMEZ</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
          Hazır bir teslimatın nasıl görünmesi gerektiğini önce inceleyin.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
          Bu küçük örnek, bir AIKAGAN teslimatında neyi netleştirmeye çalıştığımızı gösterir. Amaç büyük sözler vermek değil; müşterinin aldığı şeyi anlayıp kullanabilmesini sağlamaktır.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-center gap-3"><FileCheck2 className="h-6 w-6 text-amber-300"/><h2 className="text-2xl font-black">Teslimat kontrol örneği</h2></div>
            <div className="mt-6 space-y-3">
              {checks.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-300" />
                  <p className="text-sm leading-6 text-neutral-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.04] p-7">
            <ShieldCheck className="h-7 w-7 text-amber-300" />
            <h2 className="mt-5 text-2xl font-black">Bu örnek neyi kanıtlar?</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-300">
              Yalnızca teslimat yaklaşımını görmenizi sağlar. Satın alma, kazanç veya belirli bir iş sonucu garantisi değildir. Ücretli bir teklifte kapsam, fiyat ve teslim süresi ayrıca belirtilir.
            </p>
            <div className="mt-7 space-y-3">
              <Link href="/tr/tools/revenue-leak-scan" className="flex items-center justify-between rounded-xl bg-amber-300 px-5 py-3 font-black text-black">
                Ücretsiz Gelir Kaçağı Testi <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tr/products" className="flex items-center justify-between rounded-xl border border-white/15 px-5 py-3 font-bold text-white">
                Hazır çözümleri gör <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/tr/services" className="flex items-center justify-between rounded-xl border border-white/15 px-5 py-3 font-bold text-white">
                Uygulama desteğini gör <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
