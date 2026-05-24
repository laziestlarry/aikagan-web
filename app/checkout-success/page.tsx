"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { products } from "@/lib/products";

const G = {
  gold:     "#D4AF37",
  goldDim:  "rgba(212,175,55,0.30)",
  goldFaint:"rgba(212,175,55,0.07)",
  bg:       "#09070a",
  bgCard:   "#0d0b07",
  text:     "#c5b47a",
  muted:    "#7a6830",
};

const UPSELL: Record<string, string> = {
  "golden-delivery-starter":   "golden-delivery-pro",
  "golden-delivery-pro":       "golden-delivery-commander",
  "golden-delivery-commander": "",
};

const DAY1_CHECKLIST: Record<string, string[]> = {
  "golden-delivery-starter": [
    "Open START_HERE.pdf — read it fully (15 min)",
    "Complete the Offer Creation Worksheet — fill every section",
    "Pick 5 people from your existing network to DM today",
    "Customise Objection Crusher Script #1 with your offer name",
    "Send your first outreach message before midnight",
  ],
  "golden-delivery-pro": [
    "Open START_HERE.pdf — set up your revenue tracking sheet",
    "Choose ONE funnel architecture from the Funnel Master Guide",
    "Pick your first traffic channel from the Traffic Playbook",
    "Load Day 1 tasks from the 30-Day Revenue Calendar",
    "Build your first offer using the Offer Template (start $47–$97)",
  ],
  "golden-delivery-commander": [
    "Open START_HERE.pdf — orient to the 5-layer empire map",
    "Read the White-Label License — understand your rights fully",
    "Schedule your 60-Day Sprint kickoff using the week-by-week plan",
    "Identify your first Partnership target from the Playbook",
    "Set up the Automation OS baseline — begin cron schedule config",
  ],
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("product") ?? "golden-delivery-starter";
  const purchased = products.find((p) => p.slug === slug) ?? products[0];
  const upsellSlug = UPSELL[purchased.slug];
  const upsellProduct = upsellSlug ? products.find((p) => p.slug === upsellSlug) : null;
  const checklist = DAY1_CHECKLIST[purchased.slug] ?? DAY1_CHECKLIST["golden-delivery-starter"];

  const tierColor: Record<string, string> = {
    "golden-delivery-starter":   "#34d399",
    "golden-delivery-pro":       G.gold,
    "golden-delivery-commander": "#a78bfa",
  };
  const accentColor = tierColor[purchased.slug] ?? G.gold;

  return (
    <main style={{ background: G.bg, minHeight: "100vh", color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* ── SUCCESS HEADER ── */}
      <section style={{ padding: "60px 24px 40px", maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.28)",
          borderRadius: "30px", padding: "6px 20px", marginBottom: "24px",
        }}>
          <span style={{ color: "#34d399", fontSize: "14px" }}>✓</span>
          <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", color: "#34d399" }}>
            ORDER CONFIRMED
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, letterSpacing: "-0.01em", color: G.gold, lineHeight: 1.1, marginBottom: "16px" }}>
          Welcome to The Kaganate.
        </h1>
        <p style={{ fontSize: "16px", color: G.text, maxWidth: "520px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          Your <strong style={{ color: "#fff" }}>{purchased.tier}</strong> is ready for instant download.
          Check your inbox — a download link is on its way.
        </p>

        <a
          href={purchased.downloadUrl}
          download
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: accentColor,
            color: purchased.slug === "golden-delivery-pro" ? "#09070a" : "#fff",
            fontWeight: 800, fontSize: "14px", letterSpacing: "0.08em",
            padding: "16px 36px", borderRadius: "8px",
            textTransform: "uppercase", textDecoration: "none", cursor: "pointer",
          }}
        >
          ↓ DOWNLOAD {purchased.name.toUpperCase()} PACK NOW
        </a>
        <p style={{ marginTop: "10px", fontSize: "10px", color: G.muted, letterSpacing: "0.1em" }}>
          ZIP file · Instant · Lifetime re-download access
        </p>
      </section>

      {/* ── WHAT TO DO NEXT 60 MINUTES ── */}
      <section style={{ padding: "0 24px 48px", maxWidth: "780px", margin: "0 auto" }}>
        <div style={{
          background: G.bgCard,
          border: `1px solid ${G.goldDim}`,
          borderRadius: "10px",
          padding: "32px",
        }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", color: G.gold, marginBottom: "16px" }}>
            ⚜ YOUR FIRST 60 MINUTES — DO THIS NOW
          </p>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "24px" }}>
            Start here. In this order.
          </h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {checklist.map((step, i) => (
              <li key={step} style={{
                display: "flex", gap: "14px", alignItems: "flex-start",
                padding: "12px 16px",
                background: "rgba(212,175,55,0.04)",
                border: `1px solid ${G.goldDim}`,
                borderRadius: "6px",
              }}>
                <span style={{
                  flexShrink: 0, width: "24px", height: "24px",
                  background: "rgba(212,175,55,0.12)",
                  border: `1px solid ${G.goldDim}`,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 900, color: G.gold,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: "13px", color: G.text, lineHeight: 1.55 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── UPSELL (non-Commander buyers) ── */}
      {upsellProduct && (
        <section style={{ padding: "0 24px 56px", maxWidth: "780px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg,rgba(212,175,55,0.08) 0%,rgba(139,92,246,0.05) 100%)",
            border: `1px solid ${G.goldDim}`,
            borderRadius: "10px",
            padding: "36px 32px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: "180px", height: "180px",
              background: "radial-gradient(circle,rgba(212,175,55,0.10) 0%,transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(212,175,55,0.12)", border: `1px solid ${G.goldDim}`,
              borderRadius: "20px", padding: "4px 14px", marginBottom: "18px",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", color: G.gold }}>
                ⚡ ONE-TIME UPGRADE — {purchased.name.toUpperCase()} BUYERS ONLY
              </span>
            </div>

            <h2 style={{ fontSize: "clamp(18px,3vw,26px)", fontWeight: 900, color: "#fff", marginBottom: "10px", lineHeight: 1.2 }}>
              You just activated {purchased.tier}.<br />
              <span style={{ color: G.gold }}>Here&rsquo;s what you&rsquo;re missing in {upsellProduct.tier}.</span>
            </h2>
            <p style={{ fontSize: "13px", color: G.text, marginBottom: "22px", maxWidth: "500px", lineHeight: 1.7 }}>
              Most operators who reach $1K+/month upgraded within two weeks of their first sale.
              {upsellProduct.slug === "golden-delivery-pro"
                ? " The Pro Pack adds funnels, traffic strategy, a 30-day calendar, and 5 ready-to-sell offer templates."
                : " The Commander Pack adds white-label rights, a 60-day scale sprint, and the full empire architecture."
              }
            </p>

            <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px", listStyle: "none", padding: 0 }}>
              {upsellProduct.bullets.slice(0, 4).map((b) => (
                <li key={b} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "#d1d5db" }}>
                  <span style={{ color: G.gold, flexShrink: 0 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px" }}>
              <a
                href={upsellProduct.checkoutUrl}
                className="lemonsqueezy-button"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: G.gold, color: "#09070a",
                  fontWeight: 800, fontSize: "13px", letterSpacing: "0.08em",
                  padding: "14px 28px", borderRadius: "6px",
                  textTransform: "uppercase", textDecoration: "none", cursor: "pointer",
                }}
              >
                UPGRADE TO {upsellProduct.name.toUpperCase()} — ${upsellProduct.price} →
              </a>
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                  <span style={{ fontSize: "20px", fontWeight: 900, color: G.gold }}>${upsellProduct.price}</span>
                  <span style={{ fontSize: "13px", color: "#444", textDecoration: "line-through" }}>${upsellProduct.originalPrice}</span>
                </div>
                <p style={{ fontSize: "10px", color: G.muted, marginTop: "2px" }}>30-day guarantee · instant download</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Commander: partnership invite */}
      {purchased.slug === "golden-delivery-commander" && (
        <section style={{ padding: "0 24px 56px", maxWidth: "780px", margin: "0 auto" }}>
          <div style={{
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.28)",
            borderRadius: "10px",
            padding: "32px",
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#a78bfa", marginBottom: "12px" }}>
              👑 You&apos;re at the top of the ladder.
            </h2>
            <p style={{ fontSize: "13px", color: G.text, lineHeight: 1.7, marginBottom: "20px" }}>
              Commander owners hold white-label rights. You can resell this system as your own and keep 100%
              of your revenue. The Partnership Playbook inside your pack shows exactly how — 5 deal
              structures, outreach templates, and commission tables included.
            </p>
            <Link href="/contact" style={{
              display: "inline-flex", alignItems: "center",
              border: "1px solid rgba(139,92,246,0.42)", color: "#a78bfa",
              fontWeight: 700, fontSize: "12px", letterSpacing: "0.1em",
              padding: "12px 22px", borderRadius: "6px",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              APPLY FOR KAGANATE COUNCIL →
            </Link>
          </div>
        </section>
      )}

      {/* ── SUPPORT ── */}
      <section style={{ padding: "0 24px 60px", maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: G.muted }}>
          Questions? Email{" "}
          <a href="mailto:lazylarries@gmail.com" style={{ color: G.gold }}>lazylarries@gmail.com</a>
          {" "}— we respond within 24 hours.
        </p>
        <Link href="/" style={{ display: "inline-block", marginTop: "16px", fontSize: "12px", color: "#444", textDecoration: "none" }}>
          ← Back to AIKAGAN
        </Link>
      </section>

    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
