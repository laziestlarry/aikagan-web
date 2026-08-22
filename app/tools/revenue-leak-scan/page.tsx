import type { Metadata } from 'next';
import RevenueLeakScan from './RevenueLeakScan';

export const metadata: Metadata = {
  title: 'Free Revenue Leak Scan | AIKAGAN',
  description: 'A free seven-question diagnostic for offer, proof, checkout, fulfillment, attribution and retention friction. No email required.',
  alternates: { canonical: 'https://aikagan.com/tools/revenue-leak-scan/' },
  openGraph: { title: 'Free Revenue Leak Scan | AIKAGAN', description: 'Find the weakest point in your path from visitor to verified customer.', url: 'https://aikagan.com/tools/revenue-leak-scan/', type: 'website' },
};

export default function Page(){return <main className="min-h-screen bg-[#08080a] px-5 py-20 text-white"><section className="mx-auto max-w-4xl"><div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Free · no signup · 2 minutes</p><h1 className="mt-4 text-4xl font-extrabold md:text-6xl">Where is your business <span className="text-amber-300">leaking revenue?</span></h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-300">Score the seven links between attention and repeat business. Get an immediate priority list before buying more software, traffic, or automation.</p></div><RevenueLeakScan/><section className="mt-12 grid gap-4 md:grid-cols-3">{[['Offer','Can buyers understand the outcome?'],['Commerce','Can intent become verified payment and delivery?'],['Growth','Can you learn what created the customer and compound it?']].map(([t,b])=><div key={t} className="rounded-2xl border border-white/10 p-5"><h2 className="font-bold text-white">{t}</h2><p className="mt-2 text-sm text-neutral-400">{b}</p></div>)}</section></section></main>}
