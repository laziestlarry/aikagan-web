'use client';

import { useState } from 'react';
import { Check, Copy, Linkedin, Share2 } from 'lucide-react';

const DESTINATION = 'https://aikagan.com/tools/?utm_source=member_share&utm_medium=referral&utm_campaign=aikagan_network';
const TEXT = 'I found a useful free AI business toolkit: diagnose revenue friction, inspect a practical delivery sample, and explore AutonomaX before buying anything.';

export default function ShareNetwork(){
  const [copied,setCopied]=useState(false);
  const enc=(s:string)=>encodeURIComponent(s);
  const links={
    linkedin:`https://www.linkedin.com/sharing/share-offsite/?url=${enc(DESTINATION)}`,
    x:`https://twitter.com/intent/tweet?text=${enc(TEXT)}&url=${enc(DESTINATION)}`,
    whatsapp:`https://wa.me/?text=${enc(`${TEXT} ${DESTINATION}`)}`,
  };
  async function copy(){await navigator.clipboard.writeText(DESTINATION);setCopied(true);setTimeout(()=>setCopied(false),1800)}
  async function nativeShare(){if(navigator.share){await navigator.share({title:'AIKAGAN free tools',text:TEXT,url:DESTINATION});}else{copy();}}
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
    <button onClick={nativeShare} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-black text-black"><Share2 className="h-4 w-4"/>Share</button>
    <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-white/30"><Linkedin className="h-4 w-4"/>LinkedIn</a>
    <a href={links.x} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-white/30">X / Twitter</a>
    <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-white/30">WhatsApp</a>
    <button onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-white/30">{copied?<Check className="h-4 w-4 text-emerald-300"/>:<Copy className="h-4 w-4"/>}{copied?'Copied':'Copy link'}</button>
  </div>;
}
