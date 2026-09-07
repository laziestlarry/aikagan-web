import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Chimera Genesis",
  description: "File a customer intake into Alexandria, receive a Customer Success Plan, and route a Golden Delivery pack.",
  path: "/genesis",
});

export default function GenesisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
