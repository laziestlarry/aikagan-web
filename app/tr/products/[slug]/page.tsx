import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCatalog from "@/components/ProductCatalog";
import { getProduct, products } from "@/lib/products";
import { localizeProduct } from "@/lib/product-i18n";

export function generateStaticParams() {
  return products
    .filter((product) => product.priceModel === "one_time")
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const source = getProduct(slug);
  if (!source || source.priceModel !== "one_time") return {};
  const product = localizeProduct(source, "tr");
  return {
    title: `${product.name} — İçerik, Fiyat ve Teslimat`,
    description: product.description,
    alternates: {
      canonical: `https://aikagan.com/tr/products/${product.slug}`,
      languages: { "tr-TR": `https://aikagan.com/tr/products/${product.slug}`, en: `https://aikagan.com/products/${product.slug}` },
    },
    openGraph: { title: product.name, description: product.description, url: `https://aikagan.com/tr/products/${product.slug}`, locale: "tr_TR", type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function TurkishProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || product.priceModel !== "one_time") notFound();
  return <ProductCatalog locale="tr" product={product} />;
}
