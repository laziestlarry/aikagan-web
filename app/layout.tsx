import type { Metadata } from 'next';
import Script from 'next/script';
import { Caveat, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { buildMetadata } from '@/lib/metadata';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AttributionInit from '@/components/AttributionInit';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', weight: ['600', '700'] });

export const metadata: Metadata = buildMetadata({});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable}`}>
      <head>
        {/* ── Google Tag Manager ── */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NZW2CP6H');`,
          }}
        />
        {/* ── End Google Tag Manager ── */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* ── Meta Domain Verification ── */}
        <meta name="facebook-domain-verification" content="xz1psq5ml5n8je8ljwl7k689or7wkp" />
        {/* LemonSqueezy JS removed — Stripe Checkout replaced LS overlay */}
        {/* ── Analytics: GA4 + Meta Pixel managed via GTM-NZW2CP6H ── */}
      </head>
      <body className="min-h-screen flex flex-col">
        {/* ── Google Tag Manager (noscript) ── */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NZW2CP6H" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        {/* ── End Google Tag Manager (noscript) ── */}
        {/* Captures UTM params on every page load; persists to sessionStorage */}
        <AttributionInit />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
