import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contact AIKAGAN about an AutonomaX project, implementation service, product order, delivery question, partnership, or support request.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
