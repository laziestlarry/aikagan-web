import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — AutonomaX",
  description: "Start your project with AutonomaX Profit OS.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
