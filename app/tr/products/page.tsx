import type { Metadata } from "next";
import CommercialComingSoon from "@/components/CommercialComingSoon";

export const metadata: Metadata = {
  title: "Doğrulanmış Teslimat Yakında | AIKAGAN Türkiye",
  description: "AIKAGAN ücretli ürünleri; içerik, lisans, ödeme ve teslimat doğrulaması tamamlanana kadar geçici olarak satışa kapalıdır. Ücretsiz araçlar kullanıma açıktır.",
  alternates: {
    canonical: "https://aikagan.com/tr/products",
    languages: { "tr-TR": "https://aikagan.com/tr/products", en: "https://aikagan.com/products" },
  },
};

export default function TurkishProducts() {
  return <CommercialComingSoon locale="tr" />;
}
