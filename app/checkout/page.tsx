import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { GUMROAD_PRODUCTS } from "@/lib/gumroad-products";
import { getProduct } from "@/lib/products";

export const metadata = {
  title: "Secure Gumroad checkout | AIKAGAN",
  description: "Choose an AutonomaX outcome pack and continue to its verified Gumroad checkout.",
};

const slugs = ["masterclass-starter", "masterclass-pro", "masterclass-commander"] as const;

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">AIKAGAN × Gumroad</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          Choose the smallest outcome that removes your current bottleneck.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
          Every button opens the matching hosted Gumroad product. Payment details stay with Gumroad; AIKAGAN receives only the verified sale data needed for delivery and support.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {slugs.map((slug) => {
            const product = getProduct(slug)!;
            const hosted = GUMROAD_PRODUCTS[slug];
            return (
              <article key={slug} className="flex flex-col rounded-3xl border border-white/10 bg-white/[.04] p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">{product.tier}</p>
                <h2 className="mt-3 text-2xl font-black">{product.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-neutral-400">{product.description}</p>
                <p className="mt-7 text-4xl font-black">{`$${product.price}`}</p>
                <Link
                  href={`/api/income/checkout?slug=${slug}&provider=gumroad`}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3 font-black text-black"
                  data-hosted-checkout={hosted.permalink}
                >
                  Continue securely <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
        <div className="mt-8 grid gap-3 text-sm text-neutral-300 sm:grid-cols-2">
          <p className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-emerald-300" /> No card data touches AIKAGAN servers.</p>
          <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Delivery begins only after verified payment evidence.</p>
        </div>
      </section>
    </main>
  );
}
