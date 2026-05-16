export type Product = {
  slug: string;
  name: string;
  tier: string;
  tag: string;
  price: string;
  description: string;
  bullets: string[];
  checkoutUrl: string;
  downloadUrl: string;
};

export const products: Product[] = [
  {
    slug: "golden-delivery-starter",
    name: "Golden Delivery Starter",
    tier: "Starter",
    tag: "Start Here",
    price: "$97",
    description: "Perfect for getting started with AI automation.",
    bullets: [
      "10+ Essential AI Automations",
      "Standard Operating Procedures",
      "Plug & Play Templates",
      "Video Setup Guides",
      "Community Access",
      "Instant Download"
    ],
    checkoutUrl:
      process.env.NEXT_PUBLIC_CHECKOUT_STARTER_URL ||
      "/checkout-success?product=golden-delivery-starter",
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Starter_Pack.zip"
  },
  {
    slug: "golden-delivery-pro",
    name: "Golden Delivery Pro",
    tier: "Pro",
    tag: "Most Popular",
    price: "$297",
    description: "Advanced systems for growing businesses.",
    bullets: [
      "50+ Advanced AI Automations",
      "Complete Business Playbooks",
      "Advanced Integrations",
      "Custom Workflows",
      "Priority Support",
      "Instant Download"
    ],
    checkoutUrl:
      process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL ||
      "/checkout-success?product=golden-delivery-pro",
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Pro_Pack.zip"
  },
  {
    slug: "golden-delivery-commander",
    name: "Golden Delivery Commander",
    tier: "Commander",
    tag: "Best Value",
    price: "$997",
    description: "Complete business empire automation system.",
    bullets: [
      "100+ Complete AI Systems",
      "Full Business Automation Suite",
      "Advanced AI Agents",
      "White-Label Rights",
      "VIP Support & Onboarding",
      "Instant Download"
    ],
    checkoutUrl:
      process.env.NEXT_PUBLIC_CHECKOUT_COMMANDER_URL ||
      "/checkout-success?product=golden-delivery-commander",
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Commander_Pack.zip"
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}