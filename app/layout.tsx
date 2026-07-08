import type { Metadata } from 'next';
import Script from 'next/script';
import { Caveat, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { buildMetadata } from '@/lib/metadata';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AttributionInit from '@/components/AttributionInit';
import LiveChat from '@/components/shared/LiveChat';
import WebVitalsReporter from '@/components/shared/WebVitalsReporter';
import PageviewBeacon from '@/components/shared/PageviewBeacon';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', weight: ['600', '700'] });

export const metadata: Metadata = buildMetadata({});

// GTM container; GA4 + Meta Pixel are loaded inside GTM (configured in GTM UI).
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NZW2CP6H';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <head>
        {/* ── Google Tag Manager ── */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* ── Direct GA4 (page_view + custom events) — fires even if GTM is blocked ── */}
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              id="ga4-loader"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });`,
              }}
            />
          </>
        ) : null}
        {/* ── End GA4 ── */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* ── Meta Domain Verification ── */}
        <meta name="facebook-domain-verification" content="xz1psq5ml5n8je8ljwl7k689or7wkp" />
        {/* ── Paddle.js (client-side checkout overlay) ── */}
        <Script
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="afterInteractive"
          data-token={process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? ""}
          data-env="production"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* ── Google Tag Manager (noscript) ── */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        {/* ── End Google Tag Manager (noscript) ── */}
        {/* Captures UTM params on every page load; persists to sessionStorage */}
        <AttributionInit />
        {/* Records pageview to the income ledger (KV-backed, no PII) */}
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
