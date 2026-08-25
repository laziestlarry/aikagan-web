import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiveChat from "@/components/LiveChat";
import AttributionInit from "@/components/AttributionInit";
import PageviewBeacon from "@/components/PageviewBeacon";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://aikagan.com"),
  title: { default: "AutonomaX Profit OS — AI Revenue Operations", template: "%s | AutonomaX Profit OS" },
  description: "AutonomaX Profit OS turns scattered digital products, checkouts, delivery steps, and KPI dashboards into one measurable revenue operations funnel. Built for founders, operators, and small teams.",
  openGraph: {
    title: "AutonomaX Profit OS — Instant-Download Digital Toolkits — Checkout, Delivery & Growth",
    description: "AutonomaX Profit OS turns scattered digital products, checkouts, delivery steps, and KPI dashboards into one measurable revenue operations funnel. Built for founders, operators, and small teams.",
    url: "https://aikagan.com",
    siteName: "AutonomaX Profit OS",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "AutonomaX Profit OS — AI Revenue Ops" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutonomaX Profit OS — Instant-Download Digital Toolkits — Checkout, Delivery & Growth",
    description: "AutonomaX Profit OS turns scattered digital products, checkouts, delivery steps, and KPI dashboards into one measurable revenue operations funnel. Built for founders, operators, and small teams.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <head>
        {GTM_ID ? <Script id="google-tag-manager" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');` }} /> : null}
        {GA_MEASUREMENT_ID ? <><Script id="ga4-loader" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} /><Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });` }} /></> : null}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="facebook-domain-verification" content="xz1psq5ml5n8je8ljwl7k689or7wkp" />
        <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" strategy="afterInteractive" />
        <Script id="paddle-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          (function initPaddle(){
            var token = ${JSON.stringify(PADDLE_CLIENT_TOKEN)};
            var env = token.startsWith('test_') ? 'sandbox' : 'production';
            if (!token) return;
            var initialized = false;
            function apply() {
              if (initialized || !window.Paddle) return;
              try {
                if (env === 'sandbox' && window.Paddle.Environment && typeof window.Paddle.Environment.set === 'function') window.Paddle.Environment.set('sandbox');
                if (typeof window.Paddle.Initialize === 'function') {
                  window.Paddle.Initialize({
                    token: token,
                    eventCallback: function(data) {
                      try {
                        window.dispatchEvent(new CustomEvent('aikagan:paddle', { detail: data }));
                        if (data && data.name === 'checkout.completed') window.dispatchEvent(new CustomEvent('checkout.completed', { detail: data }));
                        if (data && data.name === 'checkout.error') window.dispatchEvent(new CustomEvent('checkout.error', { detail: data }));
                      } catch (eventErr) { console.error('[paddle-event] bridge failed', eventErr); }
                    }
                  });
                  initialized = true;
                }
              } catch (err) { console.error('[paddle-init] failed', err); }
            }
            apply();
            var t = setInterval(function () { apply(); if (initialized) clearInterval(t); }, 200);
            setTimeout(function () { clearInterval(t); }, 10000);
          })();
        ` }} />
      </head>
      <body className="min-h-screen flex flex-col">
        {GTM_ID ? <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} /> : null}
        <AttributionInit />
        <PageviewBeacon />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <LiveChat />
        <WebVitalsReporter />
        <Analytics />
      </body>
    </html>
  );
}
