'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clipboard, Gauge, RotateCcw, ShieldCheck } from 'lucide-react';

const STORAGE_KEY='aikagan:tr:revenue-leak-scan:v1';
const questions = [
  ['offer','Yeni bir ziyaretçi, ne sattığınızı ve sonucunu 30 saniyede anlayabiliyor mu?'],
  ['proof','Ödeme istemeden önce güvenilir bir örnek veya çalışan bir gösterim sunuyor musunuz?'],
  ['checkout','Müşteri iki tıklamada çalışan ödeme sayfasına ulaşabiliyor mu?'],
  ['fulfillment','Doğrulanmış ödeme teslimatı veya erişimi otomatik başlatıyor mu?'],
  ['followup','Bugün almaya hazır olmayan ziyaretçinin faydalı bir sonraki adımı var mı?'],
  ['measurement','Bir satışın hangi kanal veya kampanyadan geldiğini görebiliyor musunuz?'],
  ['retention','Teslimattan sonra müşterinin geri gelmesi veya sizi önermesi için açık bir neden var mı?'],
] as const;
const labels=['Hayır / bilmiyorum','Kısmen','Evet, düzenli olarak'];
const names:Record<string,string>={offer:'teklif',proof:'güven ve kanıt',checkout:'ödeme',fulfillment:'teslimat',followup:'takip',measurement:'ölçüm',retention:'tekrar satış'};
const guidance:Record<string,{why:string;diy:string;improve:string;service:string}>={
  offer:{why:'Ziyaretçi ne satın aldığını ve hangi sonucu bekleyebileceğini hızlıca anlayamazsa, diğer bütün iyileştirmelerin etkisi zayıflar.',diy:'Ana sayfanızı işletmenizi hiç bilmeyen birine gösterin. 30 saniye sonra “Kime, ne sonuç sağlıyor ve sonraki adım ne?” sorularını cevaplayabiliyor mu?',improve:'Tek bir ana sonuç, açık hedef müşteri, somut teslimat örneği ve tek bir sonraki adım kullanın.',service:'Teklifinizi, ilk ekran mesajını ve karar yolunu birlikte sadeleştirip uygulanabilir bir teklif mimarisine dönüştürebiliriz.'},
  proof:{why:'İyi bir teklif bile kanıt olmadan riskli görünür. Ziyaretçi satın almadan önce “Bunu gerçekten yapabiliyorlar mı?” sorusuna cevap arar.',diy:'Teklifinizin yanında gerçek örnek, teslimat görüntüsü, vaka, doğrulanabilir sonuç veya çalışma yöntemi görülebiliyor mu?',improve:'Kanıtı ayrı bir sayfaya saklamak yerine karar noktasının yanına taşıyın; neyin gözlem, örnek ve garanti dışı olduğunu açıkça ayırın.',service:'Mevcut kanıtlarınızı düzenleyip güven boşluklarını, örnek teslimatları ve vaka anlatımını satış akışına yerleştirebiliriz.'},
  checkout:{why:'Satın alma niyeti oluşmuşken karmaşık, belirsiz veya çalışmayan ödeme adımları doğrudan kayba dönüşebilir.',diy:'Telefonunuzda gizli sekmeden müşteri gibi deneyin: toplam fiyat, ödeme yöntemi, hata durumu ve geri dönüş yolu açık mı?',improve:'Gereksiz adımları azaltın, toplam maliyeti erken gösterin ve hata halinde müşterinin işlemi kaybetmeden devam etmesini sağlayın.',service:'Ödeme akışını uçtan uca test edip sürtünmeleri, sağlayıcı hatalarını ve dönüşüm kayıplarını öncelik sırasına koyabiliriz.'},
  fulfillment:{why:'Satış, ödeme alınca değil; söz verilen sonuç müşteriye erişilebilir ve doğrulanabilir biçimde ulaştığında tamamlanır.',diy:'Ödeme sonrası yolu baştan sona test edin: onay → erişim → teslimat → kullanım bilgisi → destek → yeniden erişim.',improve:'Teslimat süresini ve kapsamını satıştan önce açıklayın; ödeme sonrası teyit, erişim ve destek yolunu görünür tutun.',service:'Siparişten QA ve teslimata kadar otomatik, izlenebilir bir fulfillment akışı kurabilir ve kabul kriterlerini bağlayabiliriz.'},
  followup:{why:'Bugün satın almayan ziyaretçi değersiz değildir; doğru bir sonraki adım yoksa kazanılmış ilgi sessizce kaybolur.',diy:'Satın almaya hazır olmayan biri siteden ayrılmadan önce ücretsiz araç, örnek, danışma veya takip edilebilir bir sonraki adım bulabiliyor mu?',improve:'Tek bir düşük sürtünmeli ilerleme seçeneği verin ve satış baskısı yerine faydalı bir sonraki sonucu sunun.',service:'İlgi → takip → görüşme → teklif akışını, gereksiz mesaj trafiği yaratmadan işletmenize göre tasarlayabiliriz.'},
  measurement:{why:'Hangi kanalın gerçek müşteriyi yarattığını bilmiyorsanız trafik artışı ile gelir artışını birbirinden ayıramazsınız.',diy:'Bir gerçek siparişi geriye doğru izleyin. Hangi kaynak, sayfa, CTA ve ödeme olayının bu müşteriyi oluşturduğunu gösterebiliyor musunuz?',improve:'Sayfa görüntüleme, niyet, ödeme ve doğrulanmış siparişi ayrı olaylar olarak tutun; test verisini ticari veriden ayırın.',service:'Durable gelir defteri, attribution ve funnel telemetrisini gerçek ticari kanıtı öne çıkaracak şekilde kurabiliriz.'},
  retention:{why:'İlk teslimattan sonra müşterinin neden geri döneceği belli değilse her satış için yeniden sıfırdan müşteri edinmek zorunda kalırsınız.',diy:'Teslimattan sonra müşteriye doğal olarak sunulan sonraki değer nedir: güncelleme, bakım, yeni üretim, performans incelemesi veya tavsiye?',improve:'İlk ürünü tek seferlik dosya yerine ölçülebilir bir sonuç ve mantıklı bir sonraki aşama ile tamamlayın.',service:'Teslimat sonrası kabul, performans incelemesi, genişleme ve tekrar satın alma yolunu ürününüze bağlayabiliriz.'},
};

type Answers=Record<string,number>;

export default function RevenueLeakScanTR(){
  const [answers,setAnswers]=useState<Answers>({});
  const [restored,setRestored]=useState(false);
  const [shareStatus,setShareStatus]=useState('');

  useEffect(()=>{try{const raw=window.localStorage.getItem(STORAGE_KEY);if(raw)setAnswers(JSON.parse(raw));}catch{}finally{setRestored(true)}},[]);
  useEffect(()=>{if(!restored)return;try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(answers));}catch{}},[answers,restored]);

  const complete=Object.keys(answers).length===questions.length;
  const score=useMemo(()=>Math.round(Object.values(answers).reduce((a,b)=>a+b,0)/(questions.length*2)*100),[answers]);
  const weakest=useMemo(()=>questions.filter(([k])=>(answers[k]??3)<2).map(([k])=>k).sort((a,b)=>(answers[a]??0)-(answers[b]??0)).slice(0,3),[answers]);
  const band=score>=80?'Temel satış yolu güçlü':score>=55?'Düzeltilebilir sürtünme var':'Gelir kaçağı ihtimali yüksek';
  const summary=score>=80?'Temel dönüşüm zinciriniz güçlü görünüyor. Şimdi nitelikli trafik, teklif ekonomisi ve tekrar satış üzerinde deney yapmak daha anlamlı olabilir.':score>=55?'Yanıtlarınıza göre birkaç zayıf halka mevcut trafiğin satışa dönüşmesini yavaşlatıyor. Yeni trafik eklemeden önce aşağıdaki öncelikleri güçlendirmek daha verimli olabilir.':'Yanıtlarınıza göre sorun yalnızca daha fazla ziyaretçi getirmek olmayabilir. Önceliğiniz mevcut ilginin güven, ödeme, teslimat ve takip zincirinde kaybolduğu noktaları azaltmak olmalı.';

  function reset(){setAnswers({});setShareStatus('');try{window.localStorage.removeItem(STORAGE_KEY)}catch{}}
  async function share(){
    const priorities=weakest.length?weakest.map((k,i)=>`${i+1}. ${names[k]}`).join(', '):'nitelikli trafik, teklif ekonomisi ve tekrar satış';
    const text=`AIKAGAN Gelir Kaçağı sonucu: ${score}/100 — ${band}. Öncelikler: ${priorities}. https://aikagan.com/tr/tools/revenue-leak-scan`;
    try{
      if(navigator.share){await navigator.share({title:'AIKAGAN Gelir Kaçağı sonucu',text,url:'https://aikagan.com/tr/tools/revenue-leak-scan'});setShareStatus('Paylaşım hazır.');return;}
      await navigator.clipboard.writeText(text);setShareStatus('Sonuç panoya kopyalandı.');
    }catch{setShareStatus('Paylaşım iptal edildi.');}
  }

  return <div className="space-y-6">
    <div className="grid gap-4">{questions.map(([key,q],i)=><div key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex gap-3"><span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-amber-300/30 text-xs text-amber-300">{i+1}</span><p className="font-medium">{q}</p></div><div className="mt-4 grid grid-cols-3 gap-2">{labels.map((label,value)=><button key={label} onClick={()=>setAnswers(a=>({...a,[key]:value}))} className={`rounded-xl border px-2 py-3 text-xs ${answers[key]===value?'border-amber-300 bg-amber-300/10 text-amber-200':'border-white/10 text-neutral-400 hover:border-white/30'}`}>{label}</button>)}</div></div>)}</div>

    {Object.keys(answers).length>0&&<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-neutral-400"><span>Yanıtlar bu tarayıcıda otomatik kaydedilir; sayfadan ayrılıp geri dönebilirsiniz.</span><button onClick={reset} className="inline-flex items-center gap-2 text-neutral-300 hover:text-white"><RotateCcw className="h-4 w-4"/>Yeni test başlat</button></div>}

    {complete&&<section className="rounded-3xl border border-amber-300/30 bg-amber-300/[0.05] p-6 md:p-8">
      <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Ücretsiz değerlendirme sonucunuz</p><h2 className="mt-2 text-3xl font-bold">{score}/100 · {band}</h2></div><Gauge className="h-10 w-10 text-amber-300"/></div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-amber-300" style={{width:`${score}%`}}/></div>

      <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Yönetici özeti</p><p className="mt-3 leading-7 text-neutral-300">{summary}</p></div>

      <h3 className="mt-7 font-semibold">Önce düzeltilecek noktalar</h3>
      <div className="mt-3 space-y-4">{weakest.length?weakest.map((key,i)=>{const g=guidance[key];return <div key={key} className="rounded-2xl bg-black/20 p-5"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-amber-300"/><div><div className="font-semibold text-white">{i+1}. öncelik: {names[key]}</div><p className="mt-2 text-sm leading-6 text-neutral-300">{g.why}</p></div></div><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Kendiniz kontrol edin</p><p className="mt-2 text-sm leading-6 text-neutral-400">{g.diy}</p></div><div className="rounded-xl border border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-300">İyileştirme yönü</p><p className="mt-2 text-sm leading-6 text-neutral-400">{g.improve}</p></div><div className="rounded-xl border border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-sky-300">AIKAGAN ile</p><p className="mt-2 text-sm leading-6 text-neutral-400">{g.service}</p></div></div></div>}):<div className="rounded-xl bg-black/20 p-4 text-neutral-300">Temel yolunuz güçlü görünüyor. Sıradaki deneme nitelikli trafik, teklif ekonomisi ve tekrar satış üzerine olmalı.</div>}</div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href={`/tr/contact?source=revenue-leak-scan&score=${score}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-bold text-black">İhtiyacınızı dinleyelim <ArrowRight className="h-4 w-4"/></Link><Link href="/tr/services" className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 font-semibold">Size özel çalışmayı inceleyin</Link></div>
      <div className="mt-3 flex flex-wrap gap-3"><button onClick={share} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:border-white/25 hover:text-white"><Clipboard className="h-4 w-4"/>Sonucumu paylaş / kopyala</button><button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:border-white/25 hover:text-white"><RotateCcw className="h-4 w-4"/>Yeni test</button></div>
      {shareStatus&&<p className="mt-3 text-xs text-emerald-300">{shareStatus}</p>}
      <p className="mt-4 flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck className="h-4 w-4"/>E-posta gerekmez. Bu puan yalnızca verdiğiniz yanıtlara dayanır; ayrıntılı inceleme veya garanti değildir.</p>
    </section>}
  </div>;
}
