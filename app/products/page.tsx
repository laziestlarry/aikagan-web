import type { Metadata } from "next";
import CommercialComingSoon from "@/components/CommercialComingSoon";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Verified Delivery Coming Soon",
  description: "AIKAGAN paid checkout is temporarily paused while every product, license, payment, and delivery path is verified end to end. Free tools remain available.",
  path: "/products",
});

export default function ProductsPage() {
  return <CommercialComingSoon />;
}
