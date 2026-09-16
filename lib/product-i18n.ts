import type { Product } from "@/lib/products";

type TurkishProductCopy = Pick<Product, "name" | "tier" | "description" | "bullets"> & {
  positioning?: string;
  fulfillmentWindow?: string;
  deliverySteps?: string[];
  badge?: string;
  guarantee?: string;
};

const turkishProducts: Record<string, TurkishProductCopy> = {
  "weekly-operating-map": {
    name: "Haftalık İş Planı",
    tier: "Ücretsiz İndirme",
    description: "Dağınık araçlar yerine pazar ve çarşamba günleri uygulayabileceğiniz tek sayfalık çalışma düzeni.",
    bullets: ["20 dakikalık pazar planı", "10 dakikalık çarşamba kontrolü", "Yazdırılabilir tek sayfalık PDF", "İnternet bağlantısı olmadan kullanılabilir"],
    badge: "Ücretsiz",
  },
  "builder-starter-checklist": {
    name: "İlk Satışa Başlangıç Listesi",
    tier: "Ücretsiz İndirme",
    description: "Fikirden ilk doğrulanmış satışa ilerlemek isteyenler için sıralı 10 adımlık kontrol listesi.",
    bullets: ["Fikirden ilk ücretli doğrulamaya 10 adım", "Ücretli reklam gerektirmez", "Nereden başlayacağınızı netleştirir", "Anında dijital teslimat"],
    badge: "Ücretsiz",
  },
  "golden-delivery-sample": {
    name: "Hazır Teslimat Örnek Paketi",
    tier: "Ücretsiz Örnek",
    description: "Ücretli paketlerde kullanılan çalışma planı, teklif şablonu ve 24 saatlik başlangıç listesinden küçük bir örnek.",
    bullets: ["7 günlük ilk satış planından örnek bölüm", "Kullanıma hazır bir teklif şablonu", "24 saatlik başlangıç kontrol listesi", "Tek sayfalık gelir yolu haritası", "Kart bilgisi gerekmez"],
    badge: "Ücretsiz",
  },
  "ai-venture-launch-blueprint": {
    name: "İş Fikri Başlangıç Raporu",
    tier: "İş Analizi",
    description: "Bir fikir, pazar alanı veya bekleyen proje için pazar fırsatı, kazanç yolu, iş modeli, uygulama planı ve riskleri bir araya getiren çalışma.",
    bullets: ["Kısa yönetici özeti ve fırsat görünümü", "Rakip ve konumlandırma incelemesi", "Gelir modeli ve iş modeli haritası", "14 ve 30 günlük uygulama planı", "Riskler ve doğrulanması gereken varsayımlar", "Otomasyona uygun iş adımları", "Uygulama desteği ayrıca kapsamlandırılır"],
    positioning: "Teslim kapsamı belirlenen bir analiz hizmetidir. Süre ve teslimatlar yazılı olarak onaylanmadan ödeme alınmaz.",
    fulfillmentWindow: "Kapsam ve teslim tarihi ödeme öncesinde yazılı olarak onaylanır.",
    deliverySteps: ["Fikrinizi, hedef müşterinizi ve mevcut durumu anlatın.", "Teslimatlar, süre ve ücret için yazılı kapsam alın.", "Yalnızca kapsamı onayladıktan sonra ilerleyin.", "Tamamlanan rapor, önerilen ilk uygulama adımıyla teslim edilir."],
    badge: "Kapsam iste",
  },
  "masterclass-starter": {
    name: "İş Kararı Başlangıç Paketi",
    tier: "Hızlı Karar Desteği",
    description: "Bir iş fikrini veya tıkanan süreci, insan kontrolünden geçmiş kısa bir karar raporuna ve yedi günlük plana dönüştürün.",
    bullets: ["Beş soruluk yönlendirmeli bilgi girişi", "Fırsat ve sorun değerlendirmesi", "Hedef müşteri ve pahalı sorunun tanımı", "Net teklif yönü", "Üç öncelikli adım ve temel riskler", "Kısa yedi günlük çalışma planı", "Bir düzeltme hakkı"],
    positioning: "Ne yapacağınıza karar veremediğinizde en uygun başlangıçtır. Yapay zekâ hazırlığa yardım eder; sorumlu kişi tamamlanan raporu kontrol eder.",
    fulfillmentWindow: "Eksiksiz bilgi alındıktan sonra hedef teslim süresi iki iş günüdür.",
    badge: "En kolay başlangıç",
    guarantee: "30 günlük memnuniyet politikası",
  },
  "masterclass-pro": {
    name: "Gelir Sistemi Pro Paketi",
    tier: "Satış Sistemi",
    description: "Teklif, ziyaretçi kazanımı, ödeme ve teslimat adımlarını tek bir 30 günlük gelir çalışma düzeninde birleştirin.",
    bullets: ["Seçim rehberli üç satış yolu taslağı", "Beş düzenlenebilir teklif şablonu", "Organik ve ücretli trafik deneme planı", "30 günlük gelir çalışma takvimi", "Tekrarlanan devirleri azaltan altı otomasyon şablonu", "Uygulama hızını artıran yapay zekâ komutları", "İndirilebilir Pro teslimat paketi"],
    positioning: "Satılacak ürünü bulunan ancak dağınık araçlar yerine tek bir satış düzenine ihtiyaç duyan işletmeler içindir.",
    badge: "En dengeli seçenek",
    guarantee: "30 günlük memnuniyet politikası",
  },
  "masterclass-commander": {
    name: "İşletme Sistemi Üst Paket",
    tier: "İşletme Düzeni",
    description: "Tekrarlanabilir büyüme için görev sahipleri, insan onayları, iş ortaklıkları, otomasyon kontrolleri ve ölçüm düzeni kurun.",
    bullets: ["Ana işletme ve gelir sistemi haritası", "Markanıza uyarlama rehberi ve kullanım sınırları", "Hedef ve denemelerle 60 günlük büyüme planı", "İş ortaklığı planı ve iletişim şablonları", "Otomasyon takvimi ve hata önleme kontrolleri", "Uyarılar içeren performans ölçüm tablosu", "İndirilebilir üst paket"],
    positioning: "Teklif ve satış yolu netleştikten sonra daha düzenli yürütme, ortaklık veya büyüme ihtiyacı olan işletmeler içindir.",
    badge: "Düzenli büyüme için",
    guarantee: "30 günlük memnuniyet politikası",
  },
  "revenue-audit-sprint": {
    name: "Gelir Yolu İncelemesi",
    tier: "Kısa İnceleme",
    description: "Mevcut teknik yapı, satış yolu ve kazanç seçenekleri için önceliklendirilmiş öneriler sunan odaklı inceleme.",
    bullets: ["Teknik yapı ve bağlantıların kontrolü", "Dönüşüm ölçümünün kontrolü", "Öncelikli kazanç fırsatları", "Yazılı öneriler ve sıralı sonraki adımlar"],
    fulfillmentWindow: "Kapsam ve teslim tarihi ödeme öncesinde yazılı olarak onaylanır.",
    badge: "Kapsam iste",
  },
  "managed-ops": {
    name: "Aylık İşletme Desteği",
    tier: "Sürekli Destek",
    description: "Çalışan bir temel kurulduktan sonra aylık kontrol, önceliklendirme ve ilerleme desteği. Erişim ve hizmet sınırları, düzenli ücret başlamadan önce onaylanır.",
    bullets: ["Aylık sonuç ve kanıt kontrolü", "Takılan işler için önceliklendirme", "Adı belli sorumlu kişiyle çalışma düzeni", "Otomatik satın alınan bir ürün değildir"],
    fulfillmentWindow: "Çalışan bir temel ve kabul ölçütleri görüldükten sonra kapsamlandırılır.",
    positioning: "Düzenli işletme desteği, mevcut durum doğrulandıktan sonra sözleşmeyle başlar. Sayfayı görmek abonelik oluşturmaz.",
    badge: "Kapsam iste",
  },
};

export function localizeProduct(product: Product, locale: "en" | "tr"): Product {
  if (locale === "en") return product;
  const translated = turkishProducts[product.slug];
  return translated ? { ...product, ...translated } : product;
}

