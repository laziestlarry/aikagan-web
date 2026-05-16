import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | AIKAGAN"
    };
  }

  return {
    title: `${product.name} | AIKAGAN`,
    description: product.description
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-16 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Link href="/" className="text-sm text-amber-300">
            ← Back to AIKAGAN
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-amber-300">
            {product.tag}
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-7xl">
            {product.name}
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-neutral-300">
            {product.description}
          </p>

          <div className="mt-10 rounded-3xl border border-amber-300/20 bg-[#111827] p-8">
            <h2 className="text-2xl font-semibold">What you receive</h2>

            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {product.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-neutral-300">
                  <span className="text-amber-300">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-2xl font-semibold">Delivery promise</h2>
            <p className="mt-4 text-neutral-300">
              After checkout, the customer is routed to the secure download
              handoff page. The pack is designed for immediate use: templates,
              SOPs, automation prompts, operating checklists, and business
              deployment guidance.
            </p>
          </div>
        </div>

        <aside className="rounded-3xl border border-amber-300/30 bg-[#0d1119] p-8 shadow-[0_0_50px_rgba(251,191,36,0.12)]">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            Instant Digital Pack
          </p>

          <p className="mt-6 text-6xl font-bold text-amber-300">
            {product.price}
          </p>

          <p className="mt-4 text-neutral-300">
            One-time purchase. Instant access. Built for execution.
          </p>

          <a
            href={product.checkoutUrl}
            className="mt-8 block rounded-2xl bg-amber-300 px-6 py-4 text-center font-semibold text-black transition hover:bg-amber-200"
          >
            Buy Now
          </a>

          <Link
            href="/legal/refund"
            className="mt-5 block text-center text-sm text-neutral-400 hover:text-white"
          >
            30-day refund policy
          </Link>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-neutral-400">
            Secure checkout URL is controlled by environment variables:
            Starter, Pro, and Commander can be connected to LemonSqueezy,
            Stripe, Shopify, Shopier, or another provider.
          </div>
        </aside>
      </section>
    </main>
  );
}
