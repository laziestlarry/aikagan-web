import type { Metadata } from "next";
import CommercialComingSoon from "@/components/CommercialComingSoon";
import { products } from "@/lib/products";

export function generateStaticParams() {
  return products.filter((product) => product.priceModel === "one_time").map((product) => ({ slug: product.slug }));
}

export const metadata: Metadata = {
  title: "Verified Delivery Coming Soon | AutonomaX",
  description: "Paid checkout is temporarily paused while AIKAGAN verifies product contents, licensing, payment, and delivery end to end.",
  robots: { index: false, follow: true },
};

export default function ProductPage() {
  return <CommercialComingSoon />;
}
