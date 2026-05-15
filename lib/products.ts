export type Product = {
  slug: string;
  name: string;
  tier: string;
  price: string;
  description: string;
  bullets: string[];
  checkoutUrl: string;
  downloadUrl: string;
};

export const products: Product[] = [
  {
    slug: "golden-delivery-starter",
    name: "AIKAGAN Golden Delivery Starter Pack",
    tier: "Starter",
    price: "$29",
    description:
      "A practical first-sale execution pack for installing a simple AI-powered product, checkout, and customer delivery workflow.",
    bullets: [
      "First-sale plan",
      "Starter access guide",
      "Quick execution checklist",
      "Customer system access instructions",
      "Revenue workflow starting point"
    ],
    checkoutUrl: "https://YOUR-CHECKOUT-LINK-STARTER",
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Starter_Pack.zip"
  },
  {
    slug: "golden-delivery-pro",
    name: "AIKAGAN Golden Delivery Pro Pack",
    tier: "Pro",
    price: "$79",
    description:
      "A conversion workflow pack with offer templates, traffic playbook, funnel structure, and automation workflow templates.",
    bullets: [
      "Traffic playbook",
      "Offer templates",
      "Workflow templates",
      "Funnel structure",
      "Customer continuation path"
    ],
    checkoutUrl: "https://YOUR-CHECKOUT-LINK-PRO",
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Pro_Pack.zip"
  },
  {
    slug: "golden-delivery-commander",
    name: "AIKAGAN Golden Delivery Commander Pack",
    tier: "Commander",
    price: "$149",
    description:
      "A commander-level implementation pack for mapping, operating, and scaling the Golden Delivery revenue system after first proof.",
    bullets: [
      "Master system map",
      "Scaling strategy",
      "Revenue path structure",
      "Advanced workflows",
      "Automation logic"
    ],
    checkoutUrl: "https://YOUR-CHECKOUT-LINK-COMMANDER",
    downloadUrl: "/downloads/AutonomaX_Golden_Delivery_Commander_Pack.zip"
  }
];
