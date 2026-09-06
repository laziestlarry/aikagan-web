import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCatalog from "@/components/ProductCatalog";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products
    .filter((product) => product.priceModel === "one_time")
    .map((product) => ({ slug: product.slug }));
}

export const metadata: Metadata = {
  title: "AIKAGAN Teslimat Paketi | AIKAGAN Türkiye",
  description: "AIKAGAN teslimat paketi içeriği, fiyatı, destek kapsamı ve kullanılabilirlik durumu.",
  robots: { index: false, follow: true },
};

export default async function TurkishProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.priceModel !== "one_time") notFound();
  return <ProductCatalog locale="tr" product={product} />;
}
