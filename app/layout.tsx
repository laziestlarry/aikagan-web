import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AttributionInit from "@/components/AttributionInit";
import PageviewBeacon from "@/components/PageviewBeacon";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
const VERCEL_ANALYTICS_ENABLED = Boolean(process.env.VERCEL);

export const metadata: Metadata = {
  metadataBase: new URL("https://aikagan.com"),
  title: { default: "AutonomaX Profit OS — AI Revenue Operations", template: "%s | AutonomaX Profit OS" },
  description: "Turn scattered offers, checkout, delivery, and performance data into one practical revenue-operations system for founders, operators, and small teams.",
  openGraph: {
    title: "AutonomaX Profit OS — Instant-Download Digital Toolkits — Checkout, Delivery & Growth",
    description: "Turn scattered offers, checkout, delivery, and performance data into one practical revenue-operations system for founders, operators, and small teams.",
    url: "https://aikagan.com",
    siteName: "AutonomaX Profit OS",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AutonomaX Profit OS — AI Revenue Ops" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutonomaX Profit OS — Instant-Download Digital Toolkits — Checkout, Delivery & Growth",
    description: "Turn scattered offers, checkout, delivery, and performance data into one practical revenue-operations system for founders, operators, and small teams.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await headers()).get("x-site-locale") === "tr" ? "tr" : "en";
  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable}`}>
      <head>
        {GTM_ID ? <Script id="google-tag-manager" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');` }} /> : null}
        {GA_MEASUREMENT_ID ? <><Script id="ga4-loader" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} /><Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });` }} /></> : null}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="facebook-domain-verification" content="xz1psq5ml5n8je8ljwl7k689or7wkp" />
      </head>
      <body className="min-h-screen flex flex-col">
        {GTM_ID ? <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} /> : null}
        <AttributionInit />
        <PageviewBeacon />
        <Navbar locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
        <WebVitalsReporter />
        {VERCEL_ANALYTICS_ENABLED ? <Analytics /> : null}
      </body>
    </html>
  );
}
