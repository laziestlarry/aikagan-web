import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";

export const metadata: Metadata = {
  title: "AIKAGAN Teslimat Paketleri | AIKAGAN Türkiye",
  description: "AIKAGAN paketlerinin içinde neler var? Fiyatı ne kadar? Dosyaları nasıl alırsınız? Satın almadan önce tüm ayrıntılara bakın.",
  alternates: {
    canonical: "https://aikagan.com/tr/products",
    languages: { "tr-TR": "https://aikagan.com/tr/products", en: "https://aikagan.com/products" },
  },
};

export default function TurkishProducts() {
  return <ProductCatalog locale="tr" />;
}
