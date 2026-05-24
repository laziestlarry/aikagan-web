import { notFound } from "next/navigation";
import { getProduct, getProductsByTier } from "@/lib/products";
import LeadMagnetForm from "@/components/ui/LeadMagnetForm";
import MetaPixelEvent from "@/components/MetaPixelEvent";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProductsByTier("lead_magnet").map((p) => ({ slug: p.slug }));
}

export default async function FreeProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.ladderTier !== "lead_magnet") notFound();

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-24 text-white">
      {/* Track free resource views for audience building */}
      <MetaPixelEvent event="ViewContent" params={{ content_ids: [product.slug], content_name: product.name, content_category: "lead_magnet", content_type: "product" }} />
      <section className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Free resource</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{product.name}</h1>
        <p className="mt-5 text-lg text-neutral-300">{product.description}</p>

        {product.bullets?.length > 0 && (
          <ul className="mt-6 space-y-2">
            {product.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-neutral-300">
                <span className="mt-0.5 text-amber-300">✓</span> {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 rounded-3xl border border-white/10 bg-[#111827] p-8">
          <h2 className="text-xl font-semibold">
            Enter your email for instant free access
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            No spam. Unsubscribe any time.
          </p>
          <LeadMagnetForm
            slug={product.slug}
            leadMagnetLabel="Send me the free pack"
            className="mt-6"
          />
        </div>

        {product.nextSlug && (
          <p className="mt-8 text-center text-sm text-neutral-500">
            Already have a copy?{" "}
            <Link href={`/products/${product.nextSlug}`} className="text-amber-300 underline">
              See the full Golden Delivery pack
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
