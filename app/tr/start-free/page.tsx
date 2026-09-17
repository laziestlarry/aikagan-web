import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileCheck2, Gauge, Workflow } from 'lucide-react';

export const metadata:Metadata={title:'Ücretsiz Başlayın',description:'Kart veya üyelik gerektirmeden gelir kaybı testi, teslimat örneği ve iş hedefi taslağını deneyin.',alternates:{canonical:'https://aikagan.com/tr/start-free',languages:{'tr-TR':'https://aikagan.com/tr/start-free',en:'https://aikagan.com/start-free'}}};
const offers=[
  {icon:Gauge,title:'Gelir Kaybı Testi',body:'Yedi soruyu yanıtlayın. Satışlarınızı artırmak için önce neyi düzeltmeniz gerektiğini görün.',result:'Puanınız ve önce yapmanız gerekenler',href:'/tr/tools/revenue-leak-scan',cta:'Ücretsiz testi başlat'},
  {icon:FileCheck2,title:'Teslimat Örneği',body:'Bir paket aldığınızda size neler verileceğini bir örnekle görün.',result:'Türkçe örnek ve kontrol listesi',href:'/tr/free/golden-delivery-sample',cta:'Örneği aç'},
  {icon:Workflow,title:'İş Hedefi Taslağı',body:'Ne yapmak istediğinizi yazın. Yapılacak işleri ve kimin ilgileneceğini belirleyin.',result:'Değiştirebileceğiniz bir plan ve ilk adım önerisi',href:'/tr/outcome/intake',cta:'Taslak hazırla'},
];
export default function StartFreeTR(){return <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white"><section className="mx-auto max-w-6xl"><p className="text-sm font-bold text-emerald-300">ÜCRETSİZ BAŞLANGIÇ</p><h1 className="mt-3 max-w-4xl text-5xl font-black sm:text-6xl">Önce ücretsiz deneyin.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">Kart bilgisi vermeden deneyin. İşinize yararsa hazır paketlere bakabilir veya bizden yardım isteyebilirsiniz.</p><div className="mt-12 grid gap-5 lg:grid-cols-3">{offers.map(({icon:Icon,title,body,result,href,cta})=><article key={title} className="flex flex-col rounded-3xl border border-white/10 bg-white/[.03] p-7"><Icon className="h-7 w-7 text-amber-300"/><h2 className="mt-5 text-2xl font-black">{title}</h2><p className="mt-3 flex-1 text-sm leading-7 text-neutral-400">{body}</p><div className="mt-5 rounded-xl bg-black/25 p-4 text-sm text-neutral-300"><strong className="text-white">Ne alacaksınız?</strong> {result}</div><Link href={href} className="mt-6 inline-flex items-center gap-2 font-black text-amber-300">{cta}<ArrowRight className="h-4 w-4"/></Link></article>)}</div></section></main>}

