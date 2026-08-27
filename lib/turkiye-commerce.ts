export type TurkiyeCommerceCategory = "digital" | "training" | "consulting" | "subscription" | "service";

export interface TurkiyeCommerceProduct {
  sku: string;
  title: string;
  description: string;
  priceTry: number;
  shopierUrl: string;
  category: TurkiyeCommerceCategory;
  cta: string;
  delivery: string;
  featured?: boolean;
}

export const TURKIYE_CATEGORY_LABELS: Record<TurkiyeCommerceCategory, string> = {
  digital: "Dijital Ürünler",
  training: "Eğitim",
  consulting: "Danışmanlık",
  subscription: "Abonelik",
  service: "Hizmetler",
};

export const turkiyeCommerceProducts: TurkiyeCommerceProduct[] = [
  { sku: "HYBRID-STACK-01", title: "Hibrit Pasif Gelir Yığını", description: "Hibrit profesyoneller için otomatik gelir kurma planı.", priceTry: 399, shopierUrl: "https://www.shopier.com/42801165", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat", featured: true },
  { sku: "NOTION-PASSIVE-01", title: "Notion Pasif Gelir Paneli", description: "Otomatik gelir akışları için gelir takip ve içerik planlayıcı.", priceTry: 249, shopierUrl: "https://www.shopier.com/42801167", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat", featured: true },
  { sku: "IW-CONSULT-01", title: "IntelliWealth Danışmanlık", description: "Gelir ve operasyonlar için yapay zekâ dönüşümü.", priceTry: 29899, shopierUrl: "https://www.shopier.com/42801157", category: "consulting", cta: "Detay ve Ödeme", delivery: "24–48 saat içinde keşif görüşmesi", featured: true },
  { sku: "IW-TRAIN-01", title: "IntelliWealth Yönetici Eğitimi", description: "Playbook'lar ve skor kartlarıyla yönetici eğitimi.", priceTry: 3899, shopierUrl: "https://www.shopier.com/42801159", category: "training", cta: "Satın Al", delivery: "24 saat içinde eğitim daveti", featured: true },
  { sku: "CMD-API-01", title: "Commander API Operasyonları", description: "AI ajanları ve gelir akışları için orkestrasyon katmanı.", priceTry: 7899, shopierUrl: "https://www.shopier.com/42801160", category: "consulting", cta: "Detay ve Ödeme", delivery: "24–48 saat içinde keşif görüşmesi", featured: true },
  { sku: "AX-SAAS-01", title: "AutonomaX SaaS Platformu", description: "Gelir operasyonu, listeleme ve analitik için otomasyon platformu.", priceTry: 999, shopierUrl: "https://www.shopier.com/42801161", category: "subscription", cta: "Abone Ol", delivery: "Erişim hemen aktif", featured: true },
  { sku: "ZEN-ART-01", title: "Zen Sanat Baskı Paketi", description: "Minimalist, sakin ve modern kompozisyonlardan oluşan dijital baskı seti.", priceTry: 199, shopierUrl: "https://www.shopier.com/42801151", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "CREATOR-START-01", title: "Creator Başlangıç Kiti", description: "Şablonlar, listeleme metinleri ve büyüme playbook'larıyla lansman kiti.", priceTry: 499, shopierUrl: "https://www.shopier.com/42801152", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "FIVERR-LAUNCH-01", title: "Fiverr Gig Lansman Kiti", description: "Gig şablonları, SEO etiketleri ve teslimat akışları.", priceTry: 299, shopierUrl: "https://www.shopier.com/42801153", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "SHOPIFY-LAUNCH-01", title: "Shopify Lansman Kiti", description: "Mağaza kurulumu şablonları ve listeleme planları.", priceTry: 799, shopierUrl: "https://www.shopier.com/42801155", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "AUTO-SOP-01", title: "Otomasyon SOP Kasası", description: "Otomatik satış, teslimat ve müşteri operasyonları için hazır SOP'lar.", priceTry: 699, shopierUrl: "https://www.shopier.com/42801166", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "REDDIT-LAUNCH-01", title: "Reddit Lansman Planı", description: "Reddit ve niş forumlar için topluluk odaklı lansman planı.", priceTry: 349, shopierUrl: "https://www.shopier.com/42801168", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "DISCORD-OPS-01", title: "Discord Topluluk Ops Kiti", description: "Sunucu düzeni, onboarding akışları ve moderasyon SOP'ları.", priceTry: 399, shopierUrl: "https://www.shopier.com/42801169", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "GUMROAD-ACCEL-01", title: "Gumroad Ürün Hızlandırıcı", description: "Gumroad'da fiyatlama, ödeme akışları ve upsell kiti.", priceTry: 349, shopierUrl: "https://www.shopier.com/42801170", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "BLOG-SEO-01", title: "Blog SEO Sprint Paketi", description: "SEO brief'leri, lead magnet ve içerik takvimiyle blog lansmanı.", priceTry: 499, shopierUrl: "https://www.shopier.com/42801172", category: "digital", cta: "Satın Al", delivery: "Anında dijital teslimat" },
  { sku: "PROFIT-OS-CONSULT-01", title: "Profit OS Danışmanlık", description: "Gelir operasyon metodolojisinin uygulanması.", priceTry: 14899, shopierUrl: "https://www.shopier.com/42801163", category: "consulting", cta: "Detay ve Ödeme", delivery: "24–48 saat içinde keşif görüşmesi" },
  { sku: "BOP-SAAS-01", title: "Bopper Gelir Platformu", description: "Gelir otomasyonu akışları ve şablonları.", priceTry: 299, shopierUrl: "https://www.shopier.com/42801162", category: "subscription", cta: "Abone Ol", delivery: "Erişim hemen aktif" },
  { sku: "YT-AUTO-01", title: "YouTube Otomasyon Stüdyosu", description: "Strateji, senaryo, thumbnail ve yayın akışları.", priceTry: 5899, shopierUrl: "https://www.shopier.com/42801156", category: "service", cta: "Projeyi Başlat", delivery: "48 saat içinde kickoff" },
];

export function formatTry(amount: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(amount);
}
