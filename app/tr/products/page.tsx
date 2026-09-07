import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";

export const metadata: Metadata = {
  title: "AIKAGAN Teslimat Paketleri | AIKAGAN Türkiye",
  description: "AIKAGAN teslimat paketlerinin içeriğini, fiyatını, desteğini ve doğrulanmış kullanılabilirlik durumunu ödeme öncesinde inceleyin.",
  alternates: {
    canonical: "https://aikagan.com/tr/products",
    languages: { "tr-TR": "https://aikagan.com/tr/products", en: "https://aikagan.com/products" },
  },
};

export default function TurkishProducts() {
  return <ProductCatalog locale="tr" />;
}
