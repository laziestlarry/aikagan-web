import Link from "next/link";
import { products } from "../../lib/products";

export const metadata = {
  title: "Download Your AIKAGAN Pack",
  description: "AIKAGAN customer download page for Golden Delivery product packs."
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white px-6 py-20">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
          AIKAGAN Customer Delivery
        </p>

        <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight">
          Your download pack is ready.
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-neutral-300">
          Download the pack connected to your purchase. Save the file locally after downloading.
          For support, contact lazylarries@gmail.com.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.slug}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-amber-300">{product.tier}</p>
              <h2 className="mt-3 text-2xl font-semibold">{product.name}</h2>
              <p className="mt-4 text-sm text-neutral-300">{product.description}</p>

              <a
                href={product.downloadUrl}
                download
                className="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-200"
              >
                Download Pack
              </a>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-6">
          <h2 className="text-xl font-semibold">Important</h2>
          <p className="mt-3 text-neutral-300">
            This first version uses direct file delivery. Verified order-based download protection
            can be added next with checkout webhooks and expiring download tokens.
          </p>
        </div>

        <Link href="/" className="mt-10 inline-block text-sm text-neutral-400 hover:text-white">
          ← Back to AIKAGAN
        </Link>
      </section>
    </main>
  );
}
