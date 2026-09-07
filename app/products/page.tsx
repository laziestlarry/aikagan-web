import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Golden Delivery Packs",
  description: "Buy AutonomaX Masterclass digital packs through hosted Gumroad checkout, or request scope for implementation services. Free tools remain available first.",
  path: "/products",
});

export default function ProductsPage() {
  return <ProductCatalog />;
}
