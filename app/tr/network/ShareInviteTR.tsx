'use client';

import { useState } from 'react';
import { Clipboard, Mail, Share2 } from 'lucide-react';

const SHARE_URL='https://aikagan.com/tr/tools/revenue-leak-scan?utm_source=invite&utm_medium=referral&utm_campaign=aikagan_network';

export default function ShareInviteTR(){
  const [status,setStatus]=useState('');
  async function copy(){try{await navigator.clipboard.writeText(SHARE_URL);setStatus('Bağlantı panoya kopyalandı.');}catch{setStatus('Bağlantı kopyalanamadı.');}}
  async function share(){try{if(navigator.share){await navigator.share({title:'AIKAGAN ücretsiz değerlendirme',text:'İşinizde gelirin nerede kaçtığını iki dakikada kontrol etmek isterseniz bu ücretsiz değerlendirmeyi deneyin.',url:SHARE_URL});setStatus('Paylaşım hazır.');}else await copy();}catch{setStatus('Paylaşım iptal edildi.');}}
  const subject=encodeURIComponent('Bunu faydalı bulabileceğinizi düşündüm');
  const body=encodeURIComponent(`Merhaba,\n\nAIKAGAN'ın ücretsiz Gelir Kaçağı değerlendirmesini gördüm. Teklif, güven, ödeme, teslimat, takip, ölçüm ve tekrar satış zincirini hızlıca kontrol ediyor. Size de faydalı olabileceğini düşündüm:\n\n${SHARE_URL}\n\nSevgiler,`);
  return <div className="mt-9 grid gap-3 sm:grid-cols-3">
    <button onClick={share} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-6 py-3 font-black text-black"><Share2 className="h-4 w-4"/>Paylaş</button>
    <button onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-bold"><Clipboard className="h-4 w-4"/>Bağlantıyı kopyala</button>
    <a href={`mailto:?subject=${subject}&body=${body}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-bold"><Mail className="h-4 w-4"/>E-posta ile davet et</a>
    {status&&<p className="sm:col-span-3 text-sm text-emerald-300">{status}</p>}
  </div>;
}
