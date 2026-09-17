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
    description: "Pazar günü haftayı planlayın. Çarşamba günü neler yaptığınıza bakın. Hepsi tek sayfada.",
    bullets: ["20 dakikalık pazar planı", "10 dakikalık çarşamba kontrolü", "Yazdırılabilir tek sayfalık PDF", "İnternet bağlantısı olmadan kullanılabilir"],
    badge: "Ücretsiz",
  },
  "builder-starter-checklist": {
    name: "İlk Satışa Başlangıç Listesi",
    tier: "Ücretsiz İndirme",
    description: "İlk satışınıza hazırlanmak için 10 adımlık bir liste. Nereden başlayacağınızı ve sırada ne olduğunu kolayca görün.",
    bullets: ["İlk satışa hazırlanmak için 10 adım", "Ücretli reklam gerektirmez", "Nereden başlayacağınızı netleştirir", "Anında dijital teslimat"],
    badge: "Ücretsiz",
  },
  "golden-delivery-sample": {
    name: "Hazır Teslimat Örnek Paketi",
    tier: "Ücretsiz Örnek",
    description: "Ücretli paketlerde kullanılan çalışma planı, teklif şablonu ve 24 saatlik başlangıç listesinden küçük bir örnek.",
    bullets: ["7 günlük ilk satış planından örnek bölüm", "Kullanıma hazır bir teklif şablonu", "24 saatlik başlangıç kontrol listesi", "Tek sayfalık satış planı", "Kart bilgisi gerekmez"],
    badge: "Ücretsiz",
  },
  "ai-venture-launch-blueprint": {
    name: "İş Fikri Başlangıç Raporu",
    tier: "İş Analizi",
    description: "Bir iş fikriniz mi var? Kime satabileceğinizi, nasıl para kazanabileceğinizi, ilk adımları ve dikkat etmeniz gerekenleri birlikte inceleyelim.",
    bullets: ["Fikrin kısa özeti ve satış fırsatları", "Benzer işleri yapanlar ve sizin farkınız", "İşin nasıl yürüyeceği ve para kazanacağı", "14 ve 30 günlük uygulama planı", "Olası sorunlar ve araştırılması gerekenler", "Otomasyona uygun iş adımları", "İşi bizim yapmamızı isterseniz ayrıntıları ayrıca konuşuruz"],
    positioning: "Size özel bir rapor hazırlarız. Raporda neler olacağını ve ne zaman hazır olacağını önce yazılı olarak onaylarsınız. Sonra ödeme yaparsınız.",
    fulfillmentWindow: "Ödeme yapmadan önce işin ayrıntılarını ve ne zaman biteceğini yazılı olarak onaylarsınız.",
    deliverySteps: ["Fikrinizi, hedef müşterinizi ve mevcut durumu anlatın.", "Size ne verileceğini, ne zaman hazır olacağını ve ücretini yazılı olarak alın.", "Ayrıntıları onayladıktan sonra başlayın.", "Raporla birlikte ilk adımda ne yapabileceğinizi de öğrenin."],
    badge: "Ayrıntıları sor",
  },
  "masterclass-starter": {
    name: "İş Kararı Başlangıç Paketi",
    tier: "Hızlı Karar Desteği",
    description: "Fikrinizi veya zorlandığınız işi anlatın. Bir kişinin kontrol ettiği kısa bir rapor ve yedi günlük plan alın.",
    bullets: ["İhtiyacınızı anlatmak için beş kısa soru", "Fırsat ve sorun değerlendirmesi", "Kime yardımcı olabilirsiniz, hangi sorununu çözebilirsiniz?", "Ne satabileceğinize dair öneri", "Üç öncelikli adım ve temel riskler", "Kısa yedi günlük çalışma planı", "Bir düzeltme hakkı"],
    positioning: "Nereden başlayacağınızı bilmiyorsanız bu paket yardımcı olabilir. Yapay zekâ raporu hazırlamaya yardım eder. Bir kişi raporu kontrol eder.",
    fulfillmentWindow: "Gerekli bilgileri bize verdikten sonra raporu iki iş gününde hazırlamayı hedefliyoruz.",
    badge: "En kolay başlangıç",
    guarantee: "30 günlük memnuniyet politikası",
  },
  "masterclass-pro": {
    name: "Gelir Sistemi Pro Paketi",
    tier: "Satış Sistemi",
    description: "Ne satacağınızı, müşterilere nasıl ulaşacağınızı ve ürünü nasıl teslim edeceğinizi 30 günlük bir planda toplayın.",
    bullets: ["Seçmenize yardımcı olacak açıklamalarla üç satış planı", "Beş düzenlenebilir teklif şablonu", "Reklamla ve ücretsiz yollarla müşteri bulma planı", "30 günlük satış çalışma takvimi", "Tekrar eden işleri kolaylaştıran altı otomasyon şablonu", "Uygulama hızını artıran yapay zekâ komutları", "İndirilebilir Pro teslimat paketi"],
    positioning: "Satılacak ürünü bulunan ancak dağınık araçlar yerine tek bir satış düzenine ihtiyaç duyan işletmeler içindir.",
    badge: "En dengeli seçenek",
    guarantee: "30 günlük memnuniyet politikası",
  },
  "masterclass-commander": {
    name: "İşletme Sistemi Üst Paket",
    tier: "İşletme Düzeni",
    description: "İşinizi büyütürken kimin ne yapacağını, hangi işlerin otomatik yapılacağını ve sonuçları nasıl takip edeceğinizi planlayın.",
    bullets: ["Ana işletme ve gelir sistemi haritası", "Markanıza uyarlama rehberi ve kullanım sınırları", "Hedef ve denemelerle 60 günlük büyüme planı", "İş ortaklığı planı ve iletişim şablonları", "Otomasyon takvimi ve hata önleme kontrolleri", "Uyarılar içeren performans ölçüm tablosu", "İndirilebilir üst paket"],
    positioning: "Ne sattığını ve nasıl müşteri bulacağını bilen, işini büyütürken daha düzenli çalışmak isteyen işletmeler içindir.",
    badge: "Düzenli büyüme için",
    guarantee: "30 günlük memnuniyet politikası",
  },
  "revenue-audit-sprint": {
    name: "Gelir Yolu İncelemesi",
    tier: "Kısa İnceleme",
    description: "Sitenize, kullandığınız araçlara ve satış adımlarınıza bakarız. Önce neleri düzeltmeniz gerektiğini size yazarız.",
    bullets: ["Teknik yapı ve bağlantıların kontrolü", "Ziyaretçilerin kaçının satın aldığını ölçebiliyor musunuz?", "Öncelikli kazanç fırsatları", "Yazılı öneriler ve sıralı sonraki adımlar"],
    fulfillmentWindow: "Ödeme yapmadan önce işin ayrıntılarını ve ne zaman biteceğini yazılı olarak onaylarsınız.",
    badge: "Ayrıntıları sor",
  },
  "managed-ops": {
    name: "Aylık İşletme Desteği",
    tier: "Sürekli Destek",
    description: "İşleriniz yürümeye başladıktan sonra her ay birlikte kontrol ederiz. Nelerin düzeltileceğini belirleriz. Ücretli destek başlamadan önce ayrıntıları onaylarsınız.",
    bullets: ["Her ay sonuçlara birlikte bakma", "Bekleyen işlerden hangisinin önce yapılacağını seçme", "Kimin ilgilendiği belli olan işler", "Otomatik satın alınan bir ürün değildir"],
    fulfillmentWindow: "Önce işlerin nasıl yürüdüğüne bakar, sonra size nasıl yardımcı olacağımızı belirleriz.",
    positioning: "Önce işinize bakar, sonra vereceğimiz desteği sözleşmeye yazarız. Bu sayfaya bakmakla abonelik başlamaz.",
    badge: "Ayrıntıları sor",
  },
};

export function localizeProduct(product: Product, locale: "en" | "tr"): Product {
  if (locale === "en") return product;
  const translated = turkishProducts[product.slug];
  return translated ? { ...product, ...translated } : product;
}

