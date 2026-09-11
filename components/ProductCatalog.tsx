import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { getPaidProducts, type Product } from "@/lib/products";
import { canStartPaidCheckout, isHostedGumroadOffer, isStorefrontCommerceEnabled } from "@/lib/commerce";
import CheckoutButton from "@/components/CheckoutButton";

type Props = {
  locale?: "en" | "tr";
  product?: Product;
};

const copy = {
  en: {
    eyebrow: "AIKAGAN DELIVERY LIBRARY",
    title: "Practical delivery packs, with every promise shown before payment.",
    body: "Each pack identifies its contents, price, delivery method, support boundary, and current availability. Implementation work is always scoped before payment.",
    contents: "What is included",
    delivery: "Delivery",
    support: "Support: kagan@aikagan.com · 30-day refund policy for eligible digital products.",
    commissioning: "Checkout is not open yet. This offer is being commissioned against its payment and delivery checks.",
    hosted: "Hosted Gumroad checkout is live for this digital pack. Delivery follows a verified sale.",
    view: "See the complete offer",
    open: "Buy now",
    scope: "Request scope",
    back: "All delivery packs",
  },
  tr: {
    eyebrow: "AIKAGAN TESLİMAT KÜTÜPHANESİ",
    title: "Ödemeden önce içeriği ve teslimatı net olan pratik paketler.",
    body: "Her paket içeriğini, fiyatını, teslimat yöntemini, destek kapsamını ve güncel durumunu açıkça gösterir. Uygulama işleri için ödeme öncesi kapsam yazılı olarak onaylanır.",
    contents: "Pakete dahil olanlar",
    delivery: "Teslimat",
    support: "Destek: kagan@aikagan.com · Uygun dijital ürünler için 30 günlük iade politikası.",
    commissioning: "Ödeme henüz açık değil. Bu teklif, ödeme ve teslimat kontrolleriyle devreye alınıyor.",
    hosted: "Bu dijital paket için Gumroad üzerinden doğrulanmış ödeme açık. Teslimat doğrulanmış satıştan sonra yapılır.",
    view: "Teklifin tamamını gör",
    open: "Satın al",
    scope: "Kapsam iste",
    back: "Tüm teslimat paketleri",
  },
} as const;

function ProductCard({ product, locale }: { product: Product; locale: "en" | "tr" }) {
  const text = copy[locale];
  const prefix = locale === "tr" ? "/tr" : "";
  const buyable = canStartPaidCheckout(product.slug);
  const href = `${prefix}/products/${product.slug}`;
  const isScoped = product.checkoutUrl !== "paddle";
  const checkoutHref = isHostedGumroadOffer(product.slug)
    ? `/api/income/checkout?slug=${encodeURIComponent(product.slug)}&provider=gumroad`
    : product.checkoutUrl;

  return (
    <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">{product.tier}</p>
      <h2 className="mt-4 text-2xl font-black text-white">{product.name}</h2>
      <p className="mt-3 text-sm leading-7 text-neutral-300">{product.description}</p>
      <p className="mt-6 text-3xl font-black text-white">${product.price}<span className="text-sm font-medium text-neutral-400"> USD</span></p>
      <ul className="mt-6 space-y-3 text-sm leading-6 text-neutral-300">
        {product.bullets.slice(0, 4).map((item, index) => <li key={`${product.slug}-${index}`} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-300" />{item}</li>)}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link href={href} className="inline-flex items-center gap-2 font-bold text-amber-300 hover:text-amber-200">{text.view}<ArrowRight className="h-4 w-4" /></Link>
        {!isScoped && buyable ? (
          <CheckoutButton href={checkoutHref} slug={product.slug} price={product.price} className="inline-flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-sm font-black text-black">{text.open}</CheckoutButton>
        ) : null}
      </div>
      {!buyable && product.checkoutUrl === "paddle" && <p className="mt-4 text-xs leading-5 text-neutral-500">{text.commissioning}</p>}
      {buyable && !isScoped && !isStorefrontCommerceEnabled() && <p className="mt-4 text-xs leading-5 text-emerald-200/80">{text.hosted}</p>}
    </article>
  );
}

export default function ProductCatalog({ locale = "en", product }: Props) {
  const text = copy[locale];
  const prefix = locale === "tr" ? "/tr" : "";
  const ready = isStorefrontCommerceEnabled();

  if (product) {
    const isScoped = product.checkoutUrl !== "paddle";
    const buyable = canStartPaidCheckout(product.slug);
    const checkoutHref = isHostedGumroadOffer(product.slug)
      ? `/api/income/checkout?slug=${encodeURIComponent(product.slug)}&provider=gumroad`
      : product.checkoutUrl;
    return (
      <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
        <section className="mx-auto max-w-4xl">
          <Link href={`${prefix}/products`} className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-200"><ArrowRight className="h-4 w-4 rotate-180" />{text.back}</Link>
          <p className="mt-10 text-xs font-black uppercase tracking-[0.22em] text-amber-300">{product.tier}</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] sm:text-6xl">{product.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">{product.description}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 font-bold text-amber-100">${product.price} USD</span>
            <span className="rounded-full border border-emerald-300/25 bg-emerald-300/[0.06] px-4 py-2 text-emerald-100">{product.deliveryMode === "download" ? "Secure digital delivery" : "Written scope before payment"}</span>
          </div>
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-2xl font-black">{text.contents}</h2>
            <ul className="mt-6 space-y-4 text-neutral-300">{product.bullets.map((item, index) => <li key={`${product.slug}-${index}`} className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />{item}</li>)}</ul>
            <h2 className="mt-10 text-2xl font-black">{text.delivery}</h2>
            <p className="mt-3 leading-7 text-neutral-300">{product.fulfillmentWindow ?? (product.deliveryMode === "download" ? "After a verified payment, access is issued to the purchasing customer through a secure, expiring link." : "We confirm scope, deliverables, timeline, support, and commercial terms in writing before accepting payment.")}</p>
            <p className="mt-5 text-sm leading-6 text-neutral-400">{text.support}</p>
          </div>
          <div id="checkout-error-banner" className="hidden mt-6 rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm text-red-100" />
          <div className="mt-10">
            {isScoped ? <Link href={`${prefix}/contact?product=${encodeURIComponent(product.slug)}`} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 font-black text-black">{text.scope}<ArrowRight className="h-4 w-4" /></Link>
              : buyable ? <CheckoutButton href={checkoutHref} slug={product.slug} price={product.price} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3.5 font-black text-black">{text.open}<ArrowRight className="h-4 w-4" /></CheckoutButton>
              : <p className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] px-5 py-4 text-sm leading-6 text-amber-100"><ShieldCheck className="mr-2 inline h-4 w-4" />{text.commissioning}</p>}
            {buyable && !isScoped && !ready ? <p className="mt-4 text-sm leading-6 text-emerald-200/80">{text.hosted}</p> : null}
          </div>
        </section>
      </main>
    );
  }

  return <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white"><section className="mx-auto max-w-6xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">{text.eyebrow}</p><h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.04em] sm:text-6xl">{text.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">{text.body}</p><div className="mt-12 grid gap-5 lg:grid-cols-3">{getPaidProducts().map((item) => <ProductCard key={item.slug} product={item} locale={locale} />)}</div><p className="mt-10 text-sm text-neutral-400">{text.support}</p></section></main>;
}
