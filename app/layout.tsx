import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIKAGAN | The Kaganate",
  description:
    "AIKAGAN is a premium AI infrastructure, productization, checkout, and Golden Delivery system for digital business execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
