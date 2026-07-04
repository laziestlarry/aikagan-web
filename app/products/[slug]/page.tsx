import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import CheckoutLink from "@/components/ui/CheckoutLink";
import ExitIntentModal from "@/components/ui/ExitIntentModal";

export function generateStaticParams() {
  return products
    .filter((product) => product.priceModel === "one_time")
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.priceModel !== "one_time") {
    return {
      title: "Product Not Found | AutonomaX"
    };
  }

  return {
    title: `${product.name} | AutonomaX`,
    description: product.description
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product || product.priceModel !== "one_time") {
    notFound();
  }

  const isPaddle = product.checkoutUrl === "paddle";

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-16 text-white">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Link href="/" className="text-sm text-amber-300">
            ← Back to AutonomaX
          </Link>

          {/* Product visual */}
          {product.image && (
            <div className="mt-8 mb-6 rounded-2xl overflow-hidden border border-white/10 max-w-md">
              <Image
                src={product.image}
                alt={`${product.name} Pack`}
                width={480}
                height={300}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-amber-300">
            {product.tier}
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
            <h2 className="text-2xl font-semibold">What happens after purchase</h2>
            <ol className="mt-5 space-y-3 text-neutral-300">
              {[
                "Checkout completes via Paddle — you're redirected back to aikagan.com where your download link appears instantly.",
                "Open the ZIP and read START_HERE.pdf first — it maps every file in the pack.",
                "Follow the included execution checklist and use the scripts and templates directly.",
                "Need help? Email support@aikagan.com within 30 days.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-amber-300 font-bold flex-shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* License rights table */}
          <div className="mt-8 rounded-3xl border border-amber-300/10 bg-black/40 p-8">
            <h2 className="text-2xl font-semibold">License rights</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-8 text-neutral-400 font-medium">Pack</th>
                    <th className="text-left py-2 pr-8 text-neutral-400 font-medium">Personal / Client</th>
                    <th className="text-left py-2 text-neutral-400 font-medium">Resell / White-label</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-8 text-green-400 font-medium">Starter</td>
                    <td className="py-2 pr-8">✓</td>
                    <td className="py-2 text-neutral-500">✗</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-8 text-amber-300 font-medium">Pro</td>
                    <td className="py-2 pr-8">✓</td>
                    <td className="py-2 text-neutral-500">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-8 text-purple-400 font-medium">Commander</td>
                    <td className="py-2 pr-8">✓</td>
                    <td className="py-2 text-green-400">✓ (white-label)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-neutral-500">
              Results depend on effort and implementation — this is an execution toolkit, not a guaranteed income program.
              Full terms at <a href="/legal/terms/" className="text-amber-300 underline">aikagan.com/legal/terms</a>.
            </p>
          </div>
        </div>

        <aside className="rounded-3xl border border-amber-300/30 bg-[#0d1119] p-8 shadow-[0_0_50px_rgba(251,191,36,0.12)]">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            Instant Digital Pack
          </p>

          <p className="mt-6 text-6xl font-bold text-amber-300">
            ${product.price}
          </p>

          <p className="mt-4 text-neutral-300">
            One-time purchase. Instant access. Built for execution.
          </p>

          <CheckoutLink
            href={product.checkoutUrl}
            productSlug={product.slug}
            productName={product.name}
            price={product.price}
            className="mt-8 block rounded-2xl bg-amber-300 px-6 py-4 text-center font-semibold text-black transition hover:bg-amber-200"
          >
            Buy Now — ${product.price}
          </CheckoutLink>

          <Link
            href="/legal/refund"
            className="mt-5 block text-center text-sm text-neutral-400 hover:text-white"
          >
            {product.guarantee} · View refund policy
          </Link>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-neutral-400 space-y-1">
            <p>✓ Instant download after checkout</p>
            <p>✓ One-time payment, no subscription</p>
            <p>✓ Secure checkout via Paddle</p>
            <p>✓ Results depend on implementation</p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-xs text-neutral-500 mb-3 uppercase tracking-widest">Also available</p>
            <div className="space-y-2">
              {product.slug !== "masterclass-starter" && (
                <Link href="/products/masterclass-starter"
                  className="block text-sm text-green-400 hover:text-green-300 transition">
                  → Starter — $29
                </Link>
              )}
              {product.slug !== "masterclass-pro" && (
                <Link href="/products/masterclass-pro"
                  className="block text-sm text-amber-300 hover:text-amber-200 transition">
                  → Pro — $79
                </Link>
              )}
              {product.slug !== "masterclass-commander" && (
                <Link href="/products/masterclass-commander"
                  className="block text-sm text-purple-400 hover:text-purple-300 transition">
                  → Commander — $149 (white-label)
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-xs text-neutral-500">
              Questions?{" "}
              <a href="mailto:support@aikagan.com"
                className="text-amber-300 underline hover:text-amber-200">
                support@aikagan.com
              </a>{" "}
              — we respond within 2 business days.
            </p>
          </div>
        </aside>
      </section>

      <ExitIntentModal
        productName={product.name}
        checkoutUrl={product.checkoutUrl ?? undefined}
        productSlug={product.slug}
        price={product.price}
        fallbackHref="/free/golden-delivery-sample"
      />
    </main>
  );
}
