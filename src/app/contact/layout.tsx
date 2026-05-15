import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — AIKAGAN",
  description: "Start your project with AIKAGAN.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
