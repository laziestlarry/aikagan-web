import Link from "next/link";
import { products } from "../../../lib/products";

export const metadata = {
  title: "AIKAGAN Golden Delivery Pro Pack",
  description: "AI conversion workflow pack with traffic, offer, funnel, and automation templates."
};

export default function Page() {
  const product = products.find((p) => p.slug === "golden-delivery-pro");

  if (!product) return <main>Product not found.</main>;

  return (
    <main className="min-h-screen bg-[#08080a] text-white px-6 py-20">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
          AIKAGAN Digital Product
        </p>

        <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight">
          {product.name}
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-neutral-300">
          {product.description}
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="text-sm text-neutral-400">{product.tier}</div>
          <div className="mt-2 text-4xl font-semibold">{product.price}</div>

          <ul className="mt-8 space-y-3 text-neutral-300">
            {product.bullets.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>

          <a
            href={product.checkoutUrl}
            className="mt-8 inline-flex rounded-full bg-amber-300 px-8 py-4 text-sm font-semibold text-black transition hover:bg-amber-200"
          >
            Get the Pro Pack
          </a>

          <p className="mt-4 text-xs text-neutral-500">
            Secure checkout link required. After purchase, customer is redirected to the download page.
          </p>
        </div>

        <Link href="/" className="mt-10 inline-block text-sm text-neutral-400 hover:text-white">
          ← Back to AIKAGAN
        </Link>
      </section>
    </main>
  );
}
