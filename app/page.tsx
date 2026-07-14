import Link from "next/link";
import { products } from "@/lib/products";
import CountdownTimer from "@/components/ui/CountdownTimer";
import CheckoutLink from "@/components/ui/CheckoutLink";
import ExitIntentModal from "@/components/ui/ExitIntentModal";
import SocialProof from "@/components/home/SocialProof";

// ── Gold palette ──────────────────────────────────────────────────────────
const G = {
  gold:      "#D4AF37",
  goldDim:   "rgba(212,175,55,0.38)",
  goldGlow:  "rgba(212,175,55,0.14)",
  goldFaint: "rgba(212,175,55,0.06)",
  bg:        "#09070a",
  bgSection: "#0d0b07",
  bgCard:    "#0a0802",
  text:      "#c5b47a",
  muted:     "#7a6830",
  mutedLo:   "#444",
};

// ── Per-pack colour config ────────────────────────────────────────────────
const packCfg: Record<string, {
  border: string; hdr: string; cta: string; ctaFg: string; ctaBorder?: string;
}> = {
  "ai-venture-launch-blueprint": {
    border: "rgba(56,189,248,0.42)",
    hdr: "#38bdf8",
    cta: "#38bdf8",
    ctaFg: "#041018",
  },
  // Free row — emerald accent
  "weekly-operating-map": {
    border:    "rgba(52,211,153,0.32)",
    hdr:       "#34d399",
    cta:       "transparent",
    ctaFg:     "#34d399",
    ctaBorder: "1px solid rgba(52,211,153,0.38)",
  },
  "builder-starter-checklist": {
    border:    "rgba(52,211,153,0.32)",
    hdr:       "#34d399",
    cta:       "transparent",
    ctaFg:     "#34d399",
    ctaBorder: "1px solid rgba(52,211,153,0.38)",
  },
  "golden-delivery-sample": {
    border:    "rgba(52,211,153,0.32)",
    hdr:       "#34d399",
    cta:       "transparent",
    ctaFg:     "#34d399",
    ctaBorder: "1px solid rgba(52,211,153,0.38)",
  },
  // Paid row — gold/purple
  "masterclass-starter": {
    border:    "rgba(245,158,11,0.42)",
    hdr:       "#f59e0b",
    cta:       "transparent",
    ctaFg:     "#f59e0b",
    ctaBorder: "1px solid rgba(245,158,11,0.55)",
  },
  "masterclass-pro": {
    border: "rgba(212,175,55,0.52)",
    hdr:    G.gold,
    cta:    G.gold,
    ctaFg:  "#09070a",
  },
  "masterclass-commander": {
    border: "rgba(139,92,246,0.42)",
    hdr:    "#a78bfa",
    cta:    "rgba(139,92,246,0.60)",
    ctaFg:  "#fff",
  },
  // Legacy golden-delivery paid packs (still rendered on /products/[slug])
  "golden-delivery-starter": {
    border:    "rgba(52,211,153,0.32)",
    hdr:       "#34d399",
    cta:       "transparent",
    ctaFg:     "#34d399",
    ctaBorder: "1px solid rgba(52,211,153,0.38)",
  },
  "golden-delivery-pro": {
    border: "rgba(212,175,55,0.52)",
    hdr:    G.gold,
    cta:    G.gold,
    ctaFg:  "#09070a",
  },
  "golden-delivery-commander": {
    border: "rgba(139,92,246,0.42)",
    hdr:    "#a78bfa",
    cta:    "rgba(139,92,246,0.60)",
    ctaFg:  "#fff",
  },
};

// Slugs shown on the home grid in display order
const FREE_ROW_SLUGS  = ["weekly-operating-map", "builder-starter-checklist", "golden-delivery-sample"];
const PAID_ROW_SLUGS  = ["masterclass-starter", "masterclass-pro", "masterclass-commander"];
const FLAGSHIP_PRODUCT =
  products.find((product) => product.slug === "ai-venture-launch-blueprint")
  ?? products.find((product) => product.priceModel === "one_time")
  ?? products[0];

// ── Shared section header ─────────────────────────────────────────────────
function OrnHeader({ label, sub }: { label: string; sub?: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "8px" }}>
        <div style={{ height: "1px", width: "56px", background: `linear-gradient(to left,${G.goldDim},transparent)` }} />
        <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.3em", color: G.gold }}>⚜ {label} ⚜</span>
        <div style={{ height: "1px", width: "56px", background: `linear-gradient(to right,${G.goldDim},transparent)` }} />
      </div>
      {sub && <p style={{ fontSize: "10px", letterSpacing: "0.2em", color: G.muted, textTransform: "uppercase" }}>{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: G.bg, color: "#fff", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* ── LAUNCH-PRICE URGENCY BANNER ──────────────────────────────────── */}
      {/* Non-sticky: lives above the Navbar at top of page only. Scrolls out
          of view so it never overlaps the sticky Navbar (top-0 z-50) below.   */}
      <div style={{
        background: "linear-gradient(90deg,#1a1000,#2a1e00,#1a1000)",
        borderBottom: `1px solid ${G.goldDim}`,
        padding: "10px 20px",
        textAlign: "center",
        position: "relative", zIndex: 1,
      }}>
        <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.18em", color: G.gold }}>
          🔥 LAUNCH PRICE ENDS IN:{" "}
          <CountdownTimer style={{ color: "#fff", fontFamily: "monospace" }} />
          {" "}— UP TO 85% OFF TODAY ONLY
        </span>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "580px" }}>

        {/* warm-black bg gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#0a0702 0%,#130f04 100%)" }} />
        {/* vault glow — right side */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 55% 90% at 72% 55%,rgba(212,175,55,0.22) 0%,rgba(180,130,20,0.07) 45%,transparent 70%)`
        }} />
        {/* top ambient */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 50% 35% at 50% 0%,rgba(212,175,55,0.08) 0%,transparent 70%)`
        }} />
        {/* outer frame */}
        <div className="absolute inset-3 pointer-events-none" style={{ border: "1px solid rgba(212,175,55,0.07)" }} />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* ── Left: copy ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <div style={{ height: "1px", width: "32px", background: G.goldDim }} />
                <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.3em", color: G.gold }}>→ WELCOME TO</span>
              </div>

              <h1 style={{
                fontSize: "clamp(38px,5.5vw,66px)",
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
                color: G.gold,
                margin: 0,
              }}>
                AutonomaX&apos;s<br />
                <span style={{
                  fontFamily: "'Caveat', cursive",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "clamp(44px,6.6vw,76px)",
                  letterSpacing: "0.01em",
                  color: "rgba(212,175,55,0.68)",
                  display: "inline",
                  lineHeight: 1,
                }}>giant</span>{" "}DIGITAL<br />TOOLKIT VAULT
              </h1>

              <p style={{ marginTop: "18px", fontSize: "15px", lineHeight: 1.8, color: G.text, maxWidth: "480px" }}>
                Instant-Download Digital Toolkits. Ready-to-use PDF templates, outreach scripts, and step-by-step checklists — designed to help you pursue your first sale in 7 days. Results depend on implementation.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "32px" }}>
                <CheckoutLink
                  href={FLAGSHIP_PRODUCT.checkoutUrl}
                  productSlug={FLAGSHIP_PRODUCT.slug}
                  productName={FLAGSHIP_PRODUCT.name}
                  price={FLAGSHIP_PRODUCT.price}
                  style={{
                    display: "inline-flex", alignItems: "center",
                    background: G.gold, color: "#09070a",
                    fontWeight: 800, fontSize: "13px", letterSpacing: "0.08em",
                    padding: "14px 30px", borderRadius: "6px",
                    textTransform: "uppercase", textDecoration: "none", cursor: "pointer",
                  }}>
                  GET BLUEPRINT — $99 →
                </CheckoutLink>
                <Link href="#packs" style={{
                  display: "inline-flex", alignItems: "center",
                  border: `1px solid ${G.goldDim}`, color: G.gold,
                  fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em",
                  padding: "14px 30px", borderRadius: "6px",
                  textTransform: "uppercase", textDecoration: "none",
                  background: G.goldFaint,
                }}>
                  SEE ALL OFFERS
                </Link>
              </div>

              {/* ── Social proof strip ── */}
              <div style={{ marginTop: "28px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {["★","★","★","★","★"].map((s, i) => (
                    <span key={i} style={{ color: G.gold, fontSize: "13px" }}>{s}</span>
                  ))}
                  <span style={{ fontSize: "11px", color: G.text, marginLeft: "4px", fontWeight: 700 }}>4.9 / 5</span>
                  <span style={{ fontSize: "10px", color: G.muted, marginLeft: "4px" }}>(23 verified buyers)</span>
                </div>
                <div style={{ width: "1px", height: "16px", background: G.goldDim }} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: G.text }}>
                  ⚡ <span style={{ color: G.gold }}>47 operators</span> activated this week
                </span>
              </div>

              {/* ── Micro-testimonials ── */}
              <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "460px" }}>
                {[
                  { quote: "Closed my first $500 deal on Day 5. The DM scripts are insane.", handle: "@devmarcus_builds" },
                  { quote: "Bought Starter, upgraded to Commander same day. ROI in week 1.", handle: "@soph.automates" },
                ].map((t) => (
                  <div key={t.handle} style={{
                    background: "rgba(212,175,55,0.05)",
                    border: `1px solid ${G.goldDim}`,
                    borderRadius: "6px",
                    padding: "10px 14px",
                  }}>
                    <p style={{ fontSize: "11px", color: G.text, lineHeight: 1.6, margin: 0 }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p style={{ fontSize: "10px", color: G.muted, marginTop: "4px", fontWeight: 700 }}>{t.handle}</p>
                  </div>
                ))}
              </div>

              {/* trust strip */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
                {[["→","FOUNDER INTAKE"],["↓","INSTANT PACKS"],["$","PADDLE-FIRST CHECKOUT"]].map(([icon, label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: G.muted }}>
                    <span style={{ color: G.gold }}>{icon}</span>{label}
                  </div>
                ))}
              </div>
              <p style={{ marginTop: "12px", fontSize: "10px", color: G.mutedLo, maxWidth: "380px", lineHeight: 1.6 }}>
                <strong style={{ color: G.text }}>What you actually get:</strong> either a delivered AI Venture Launch Blueprint or a digital toolkit with branded PDFs, fillable templates, ready-to-send scripts, and checklists. <strong style={{ color: G.text }}>Not</strong> guaranteed income or irreversible account automation.
              </p>
            </div>

            {/* ── Right: AI Income Network (3-D broadcast) ── */}
            <div className="relative hidden lg:block" style={{ height: "420px" }}>
              <svg viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <style>{`
                    @keyframes corePulse2 { 0%,100%{opacity:.7} 50%{opacity:1} }
                    @keyframes nodeFade2  { 0%,100%{opacity:.5} 50%{opacity:.92} }
                    /* Rare white energy flash inside the AI core.
                       Most of the 14s cycle is invisible — only a brief
                       ~700ms shimmer near the start of every loop.        */
                    @keyframes whiteSpark {
                      0%   { opacity: 0; r: 4;  }
                      3%   { opacity: 0.95; r: 14; }
                      8%   { opacity: 0.6; r: 22; }
                      14%  { opacity: 0; r: 28; }
                      100% { opacity: 0; r: 4;  }
                    }
                  `}</style>
                  <radialGradient id="hg2" cx="50%" cy="53%" r="50%">
                    <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.18"/>
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="ng2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.14"/>
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.02"/>
                  </radialGradient>
                  <filter id="gl2" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* ambient bg */}
                <ellipse cx="200" cy="220" rx="170" ry="140" fill="url(#hg2)"/>

                {/* ── 5 staggered 3-D broadcast rings from core ── */}
                {/* ring 1 */}
                <ellipse cx="200" cy="210" rx="46" ry="35" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="rx"      from="46"   to="188" dur="3.5s" begin="0s"   repeatCount="indefinite"/>
                  <animate attributeName="ry"      from="35"   to="143" dur="3.5s" begin="0s"   repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.52" to="0"   dur="3.5s" begin="0s"   repeatCount="indefinite"/>
                </ellipse>
                {/* ring 2 */}
                <ellipse cx="200" cy="210" rx="46" ry="35" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="rx"      from="46"   to="188" dur="3.5s" begin="0.7s" repeatCount="indefinite"/>
                  <animate attributeName="ry"      from="35"   to="143" dur="3.5s" begin="0.7s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.52" to="0"   dur="3.5s" begin="0.7s" repeatCount="indefinite"/>
                </ellipse>
                {/* ring 3 */}
                <ellipse cx="200" cy="210" rx="46" ry="35" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="rx"      from="46"   to="188" dur="3.5s" begin="1.4s" repeatCount="indefinite"/>
                  <animate attributeName="ry"      from="35"   to="143" dur="3.5s" begin="1.4s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.52" to="0"   dur="3.5s" begin="1.4s" repeatCount="indefinite"/>
                </ellipse>
                {/* ring 4 */}
                <ellipse cx="200" cy="210" rx="46" ry="35" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="rx"      from="46"   to="188" dur="3.5s" begin="2.1s" repeatCount="indefinite"/>
                  <animate attributeName="ry"      from="35"   to="143" dur="3.5s" begin="2.1s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.52" to="0"   dur="3.5s" begin="2.1s" repeatCount="indefinite"/>
                </ellipse>
                {/* ring 5 */}
                <ellipse cx="200" cy="210" rx="46" ry="35" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="rx"      from="46"   to="188" dur="3.5s" begin="2.8s" repeatCount="indefinite"/>
                  <animate attributeName="ry"      from="35"   to="143" dur="3.5s" begin="2.8s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.52" to="0"   dur="3.5s" begin="2.8s" repeatCount="indefinite"/>
                </ellipse>

                {/* connection lines */}
                <line x1="200" y1="210" x2="200" y2="72"  stroke="rgba(212,175,55,0.12)" strokeWidth="1"/>
                <line x1="200" y1="210" x2="320" y2="140" stroke="rgba(212,175,55,0.12)" strokeWidth="1"/>
                <line x1="200" y1="210" x2="320" y2="280" stroke="rgba(212,175,55,0.12)" strokeWidth="1"/>
                <line x1="200" y1="210" x2="200" y2="348" stroke="rgba(212,175,55,0.15)" strokeWidth="1.2"/>
                <line x1="200" y1="210" x2="80"  y2="280" stroke="rgba(212,175,55,0.12)" strokeWidth="1"/>
                <line x1="200" y1="210" x2="80"  y2="140" stroke="rgba(212,175,55,0.12)" strokeWidth="1"/>

                {/* ── Core ── */}
                <circle cx="200" cy="210" r="46" fill="rgba(212,175,55,0.07)" stroke="rgba(212,175,55,0.6)" strokeWidth="1.5"
                  style={{ animation:"corePulse2 3s ease-in-out infinite" }}/>
                <circle cx="200" cy="210" r="30" fill="rgba(212,175,55,0.12)" stroke="rgba(212,175,55,0.3)" strokeWidth="1"/>
                {/* Rare white energy flash — fires for ~1s of every 14s loop.
                    Anti-boredom: gives long lookers a tiny "alive" moment
                    without continuous distraction. */}
                <circle cx="200" cy="210" r="4" fill="#ffffff" filter="url(#gl2)" opacity="0"
                  style={{ animation:"whiteSpark 14s ease-out infinite" }}/>
                <text x="200" y="207" textAnchor="middle" fill="#D4AF37"              fontSize="15" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2">AI</text>
                <text x="200" y="221" textAnchor="middle" fill="rgba(212,175,55,0.5)" fontSize="7"  fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="2">CORE</text>

                {/* ── Node: AUTOMATE — top, far/small r=23 ── */}
                <circle cx="200" cy="72" r="23" fill="url(#ng2)" stroke="rgba(212,175,55,0.32)" strokeWidth="1"
                  style={{ animation:"nodeFade2 4.2s ease-in-out 0.3s infinite" }}/>
                <circle cx="200" cy="72" r="23" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="23" to="57"  dur="2s" begin="0s"    repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="0s"    repeatCount="indefinite"/>
                </circle>
                <circle cx="200" cy="72" r="23" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="23" to="57"  dur="2s" begin="0.66s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
                </circle>
                <circle cx="200" cy="72" r="23" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="23" to="57"  dur="2s" begin="1.32s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="1.32s" repeatCount="indefinite"/>
                </circle>
                <text x="200" y="69" textAnchor="middle" fill="rgba(212,175,55,0.85)" fontSize="6.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">AUTO</text>
                <text x="200" y="78" textAnchor="middle" fill="rgba(212,175,55,0.85)" fontSize="6.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">MATE</text>

                {/* ── Node: META ADS — top-right, mid-far r=25 ── */}
                <circle cx="320" cy="140" r="25" fill="url(#ng2)" stroke="rgba(212,175,55,0.35)" strokeWidth="1"
                  style={{ animation:"nodeFade2 3.8s ease-in-out 0.7s infinite" }}/>
                <circle cx="320" cy="140" r="25" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="25" to="60"  dur="2s" begin="0s"    repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="0s"    repeatCount="indefinite"/>
                </circle>
                <circle cx="320" cy="140" r="25" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="25" to="60"  dur="2s" begin="0.66s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
                </circle>
                <circle cx="320" cy="140" r="25" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="25" to="60"  dur="2s" begin="1.32s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="1.32s" repeatCount="indefinite"/>
                </circle>
                <text x="320" y="137" textAnchor="middle" fill="rgba(212,175,55,0.85)" fontSize="6.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">META</text>
                <text x="320" y="146" textAnchor="middle" fill="rgba(212,175,55,0.85)" fontSize="6.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">ADS</text>

                {/* ── Node: SHOPIFY — bottom-right, mid-near r=28 ── */}
                <circle cx="320" cy="280" r="28" fill="url(#ng2)" stroke="rgba(212,175,55,0.38)" strokeWidth="1.2"
                  style={{ animation:"nodeFade2 4.5s ease-in-out 1.1s infinite" }}/>
                <circle cx="320" cy="280" r="28" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="28" to="63"  dur="2s" begin="0s"    repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.38" to="0" dur="2s" begin="0s"    repeatCount="indefinite"/>
                </circle>
                <circle cx="320" cy="280" r="28" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="28" to="63"  dur="2s" begin="0.66s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.38" to="0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
                </circle>
                <circle cx="320" cy="280" r="28" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="28" to="63"  dur="2s" begin="1.32s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.38" to="0" dur="2s" begin="1.32s" repeatCount="indefinite"/>
                </circle>
                <text x="320" y="277" textAnchor="middle" fill="rgba(212,175,55,0.88)" fontSize="7" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">SHOP</text>
                <text x="320" y="287" textAnchor="middle" fill="rgba(212,175,55,0.88)" fontSize="7" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">IFY</text>

                {/* ── Node: REVENUE — bottom, nearest/largest r=30, glow ── */}
                <circle cx="200" cy="348" r="30" fill="url(#ng2)" stroke="rgba(212,175,55,0.5)" strokeWidth="1.5"
                  filter="url(#gl2)" style={{ animation:"nodeFade2 3.5s ease-in-out 1.5s infinite" }}/>
                <circle cx="200" cy="348" r="30" fill="none" stroke="rgba(212,175,55,0.42)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="r"       from="30" to="66"  dur="2s" begin="0s"    repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.42" to="0" dur="2s" begin="0s"    repeatCount="indefinite"/>
                </circle>
                <circle cx="200" cy="348" r="30" fill="none" stroke="rgba(212,175,55,0.42)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="r"       from="30" to="66"  dur="2s" begin="0.66s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.42" to="0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
                </circle>
                <circle cx="200" cy="348" r="30" fill="none" stroke="rgba(212,175,55,0.42)" strokeWidth="1.2" opacity="0">
                  <animate attributeName="r"       from="30" to="66"  dur="2s" begin="1.32s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.42" to="0" dur="2s" begin="1.32s" repeatCount="indefinite"/>
                </circle>
                <text x="200" y="345" textAnchor="middle" fill="rgba(212,175,55,0.95)" fontSize="8" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">REVE</text>
                <text x="200" y="356" textAnchor="middle" fill="rgba(212,175,55,0.95)" fontSize="8" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">NUE</text>

                {/* ── Node: OUTREACH — bottom-left, mid-near r=28 ── */}
                <circle cx="80" cy="280" r="28" fill="url(#ng2)" stroke="rgba(212,175,55,0.38)" strokeWidth="1.2"
                  style={{ animation:"nodeFade2 4.8s ease-in-out 0.9s infinite" }}/>
                <circle cx="80" cy="280" r="28" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="28" to="63"  dur="2s" begin="0s"    repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.38" to="0" dur="2s" begin="0s"    repeatCount="indefinite"/>
                </circle>
                <circle cx="80" cy="280" r="28" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="28" to="63"  dur="2s" begin="0.66s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.38" to="0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
                </circle>
                <circle cx="80" cy="280" r="28" fill="none" stroke="rgba(212,175,55,0.38)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="28" to="63"  dur="2s" begin="1.32s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.38" to="0" dur="2s" begin="1.32s" repeatCount="indefinite"/>
                </circle>
                <text x="80" y="277" textAnchor="middle" fill="rgba(212,175,55,0.88)" fontSize="7" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">OUT</text>
                <text x="80" y="287" textAnchor="middle" fill="rgba(212,175,55,0.88)" fontSize="7" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">REACH</text>

                {/* ── Node: AI SCRIPTS — top-left, mid-far r=25 ── */}
                <circle cx="80" cy="140" r="25" fill="url(#ng2)" stroke="rgba(212,175,55,0.35)" strokeWidth="1"
                  style={{ animation:"nodeFade2 4s ease-in-out 0.5s infinite" }}/>
                <circle cx="80" cy="140" r="25" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="25" to="60"  dur="2s" begin="0s"    repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="0s"    repeatCount="indefinite"/>
                </circle>
                <circle cx="80" cy="140" r="25" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="25" to="60"  dur="2s" begin="0.66s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="0.66s" repeatCount="indefinite"/>
                </circle>
                <circle cx="80" cy="140" r="25" fill="none" stroke="rgba(212,175,55,0.36)" strokeWidth="1" opacity="0">
                  <animate attributeName="r"       from="25" to="60"  dur="2s" begin="1.32s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.36" to="0" dur="2s" begin="1.32s" repeatCount="indefinite"/>
                </circle>
                <text x="80" y="137" textAnchor="middle" fill="rgba(212,175,55,0.85)" fontSize="6.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">AI</text>
                <text x="80" y="146" textAnchor="middle" fill="rgba(212,175,55,0.85)" fontSize="6.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1">SCRIPTS</text>

                {/* corner ornaments */}
                <rect x="16"  y="16"  width="22" height="1"  fill="rgba(212,175,55,0.2)"/>
                <rect x="16"  y="16"  width="1"  height="22" fill="rgba(212,175,55,0.2)"/>
                <rect x="362" y="16"  width="22" height="1"  fill="rgba(212,175,55,0.2)"/>
                <rect x="383" y="16"  width="1"  height="22" fill="rgba(212,175,55,0.2)"/>
                <rect x="16"  y="403" width="22" height="1"  fill="rgba(212,175,55,0.2)"/>
                <rect x="16"  y="382" width="1"  height="22" fill="rgba(212,175,55,0.2)"/>
                <rect x="362" y="403" width="22" height="1"  fill="rgba(212,175,55,0.2)"/>
                <rect x="383" y="382" width="1"  height="22" fill="rgba(212,175,55,0.2)"/>
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <div style={{
        background: "#0a0802",
        borderTop: "1px solid rgba(212,175,55,0.13)",
        borderBottom: "1px solid rgba(212,175,55,0.08)",
        padding: "14px 24px",
      }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {[
              { icon: "🔒", label: "SECURE CHECKOUT" },
              { icon: "⚡", label: "INSTANT DELIVERY" },
              { icon: "↩", label: "30-DAY GUARANTEE" },
              { icon: "📄", label: "PDF TEMPLATES" },
              { icon: "⚡", label: "FAST DOWNLOAD" },
              { icon: "💳", label: "ONE-TIME PAYMENT" },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "7px",
                fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em",
                color: "#5a4a22",
              }}>
                <span style={{ fontSize: "13px" }}>{icon}</span>
                <span style={{ color: "#7a6830" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PICK YOUR LEVEL ──────────────────────────────────────────────── */}
      <section id="packs" style={{ background: G.bgSection, padding: "80px 24px", borderTop: "1px solid rgba(212,175,55,0.08)" }}>
        <div className="mx-auto max-w-6xl">
          {/* ── ROW 1 — 3 free gifts (email-gated download) ─────────────── */}
          <OrnHeader label="FREE GIFTS — INSTANT DOWNLOAD" sub="ENTER EMAIL · WE SEND IT · NO CARD" />

          <div className="grid md:grid-cols-3 gap-5">
            {FREE_ROW_SLUGS.map((slug) => {
              const product = products.find((p) => p.slug === slug);
              if (!product) return null;
              const cfg = packCfg[product.slug] ?? packCfg["weekly-operating-map"];
              return (
                <article key={product.slug} style={{
                  background: G.bgCard,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: "8px",
                  padding: "28px 24px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  {/* header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", color: cfg.hdr, textTransform: "uppercase", marginBottom: "3px" }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: "10px", color: G.mutedLo, letterSpacing: "0.05em" }}>{product.tier}</div>
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 900, color: cfg.hdr, letterSpacing: "0.02em" }}>FREE</div>
                  </div>

                  {/* divider strip */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", paddingBottom: "16px", borderBottom: `1px solid ${cfg.border}` }}>
                    <span style={{ fontSize: "22px" }}>🎁</span>
                    <span style={{ fontSize: "10px", color: G.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Email Delivery</span>
                  </div>

                  {/* bullets */}
                  <ul style={{ flex: 1, marginBottom: "20px", listStyle: "none", padding: 0, margin: "0 0 20px 0" }}>
                    {(product.bullets ?? []).slice(0, 5).map((item: string) => (
                      <li key={item} style={{
                        display: "flex", gap: "8px", alignItems: "flex-start",
                        fontSize: "12px", color: "#9ca3af", marginBottom: "8px", lineHeight: 1.45,
                      }}>
                        <span style={{ color: cfg.hdr, flexShrink: 0, marginTop: "1px" }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA — straight to lead-magnet email form */}
                  <Link href={`/free/${product.slug}`} style={{
                    display: "block", textAlign: "center",
                    background: cfg.cta,
                    color: cfg.ctaFg,
                    border: cfg.ctaBorder ?? "none",
                    borderRadius: "6px",
                    padding: "12px 20px",
                    fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em",
                    textTransform: "uppercase", textDecoration: "none", cursor: "pointer",
                  }}>
                    SEND IT TO MY EMAIL →
                  </Link>
                  <p style={{ fontSize: "10px", color: G.mutedLo, textAlign: "center", marginTop: "8px" }}>
                    No spam. Unsubscribe any time.
                  </p>
                </article>
              );
            })}
          </div>

          {/* ── ROW 2 — 3 paid Masterclass products ─────────────────────── */}
          <div style={{ marginTop: "72px" }}>
            <OrnHeader label="FLAGSHIP OFFER — AI VENTURE LAUNCH BLUEPRINT" sub="IDEA INTAKE · MARKET MAP · MONETIZATION ROADMAP" />
          </div>

          {(() => {
            const product = products.find((p) => p.slug === "ai-venture-launch-blueprint");
            if (!product) return null;
            const cfg = packCfg[product.slug];
            return (
              <article style={{
                maxWidth: "880px",
                margin: "0 auto 72px",
                background: "linear-gradient(135deg,rgba(56,189,248,0.10),rgba(212,175,55,0.05))",
                border: `1px solid ${cfg.border}`,
                borderRadius: "8px",
                padding: "30px",
                display: "grid",
                gap: "24px",
              }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "18px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.16em", color: cfg.hdr, textTransform: "uppercase", marginBottom: "8px" }}>
                      {product.tier}
                    </div>
                    <h2 style={{ color: "#fff", fontSize: "clamp(24px,4vw,40px)", lineHeight: 1.1, fontWeight: 900, margin: 0 }}>
                      {product.name}
                    </h2>
                    <p style={{ color: G.text, lineHeight: 1.7, fontSize: "14px", maxWidth: "620px", marginTop: "12px" }}>
                      {product.description}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: cfg.hdr, fontSize: "38px", fontWeight: 900 }}>${product.price}</div>
                    {product.originalPrice && (
                      <div style={{ color: G.mutedLo, fontSize: "13px", textDecoration: "line-through" }}>${product.originalPrice}</div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {product.bullets.slice(0, 6).map((item) => (
                    <div key={item} style={{ display: "flex", gap: "9px", color: "#b8c7d8", fontSize: "12px", lineHeight: 1.45 }}>
                      <span style={{ color: cfg.hdr, flexShrink: 0 }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                  <CheckoutLink
                    href={product.checkoutUrl}
                    productSlug={product.slug}
                    productName={product.name}
                    price={product.price}
                    style={{
                      display: "inline-flex", alignItems: "center",
                      background: cfg.cta, color: cfg.ctaFg,
                      fontWeight: 900, fontSize: "12px", letterSpacing: "0.1em",
                      padding: "13px 24px", borderRadius: "6px",
                      textTransform: "uppercase", textDecoration: "none",
                    }}>
                    BUY BLUEPRINT — ${product.price} →
                  </CheckoutLink>
                  <Link href={`/products/${product.slug}`} style={{ color: cfg.hdr, fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textDecoration: "none" }}>
                    View full delivery scope →
                  </Link>
                  <span style={{ color: G.muted, fontSize: "11px" }}>{product.fulfillmentWindow}</span>
                </div>
              </article>
            );
          })()}

          <div style={{ marginTop: "0" }}>
            <OrnHeader label="MASTERCLASS — PICK YOUR LEVEL" sub="EVERYTHING YOU NEED TO WIN ONLINE" />
          </div>

          {/* Expectation-management disclaimer — visible directly above the paid row */}
          <div style={{
            maxWidth: "780px",
            margin: "0 auto 32px",
            padding: "14px 20px",
            border: `1px solid ${G.goldDim}`,
            borderRadius: "8px",
            background: G.goldFaint,
            textAlign: "center",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: G.gold, marginBottom: "6px" }}>
              ⚠  WHAT YOU&apos;RE BUYING — READ FIRST
            </p>
            <p style={{ fontSize: "12px", color: G.text, lineHeight: 1.6 }}>
              This is a <strong style={{ color: "#fff" }}>digital toolkit</strong> — branded PDFs, fillable templates, ready-to-send scripts, and step-by-step checklists.
              It is <strong style={{ color: "#fff" }}>not</strong> an automated AI software, hosted SaaS, or done-for-you service.
              You execute it yourself. We provide the system, you provide the work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {PAID_ROW_SLUGS.map((slug) => {
              const product = products.find((p) => p.slug === slug);
              if (!product) return null;
              const cfg = packCfg[product.slug] ?? packCfg["masterclass-pro"];
              const isPro = product.slug === "masterclass-pro";
              const isCmd = product.slug === "masterclass-commander";
              const ctaLabel = isPro
                ? `GET PRO — $${product.price} →`
                : isCmd
                  ? `GET COMMANDER — $${product.price} →`
                  : `GET STARTER — $${product.price} →`;

              return (
                <article key={product.slug} style={{
                  background: G.bgCard,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: "8px",
                  padding: "28px 24px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  {isPro && (
                    <div style={{
                      position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)",
                      background: G.gold, color: "#09070a",
                      fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em",
                      padding: "4px 18px", borderRadius: "20px", whiteSpace: "nowrap",
                    }}>⭐ MOST POPULAR ⭐</div>
                  )}

                  {/* header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", color: cfg.hdr, textTransform: "uppercase", marginBottom: "3px" }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: "10px", color: G.mutedLo, letterSpacing: "0.05em" }}>{product.tier}</div>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: cfg.hdr }}>${product.price}</div>
                  </div>

                  {/* divider strip */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", paddingBottom: "16px", borderBottom: `1px solid ${cfg.border}` }}>
                    <span style={{ fontSize: "22px" }}>
                      {isPro ? "⚡" : isCmd ? "👑" : "🚀"}
                    </span>
                    {product.originalPrice && (
                      <span style={{ fontSize: "12px", color: "#3a3a3a", textDecoration: "line-through" }}>${product.originalPrice}</span>
                    )}
                  </div>

                  {/* bullets */}
                  <ul style={{ flex: 1, marginBottom: "20px", listStyle: "none", padding: 0, margin: "0 0 20px 0" }}>
                    {(product.bullets ?? []).slice(0, 5).map((item: string) => (
                      <li key={item} style={{
                        display: "flex", gap: "8px", alignItems: "flex-start",
                        fontSize: "12px", color: "#9ca3af", marginBottom: "8px", lineHeight: 1.45,
                      }}>
                        <span style={{ color: cfg.hdr, flexShrink: 0, marginTop: "1px" }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <CheckoutLink
                    href={product.checkoutUrl}
                    productSlug={product.slug}
                    productName={product.name}
                    price={product.price}
                    style={{
                      display: "block", textAlign: "center",
                      background: cfg.cta,
                      color: cfg.ctaFg,
                      border: cfg.ctaBorder ?? "none",
                      borderRadius: "6px",
                      padding: "12px 20px",
                      fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em",
                      textTransform: "uppercase", textDecoration: "none", cursor: "pointer",
                    }}>
                    {ctaLabel}
                  </CheckoutLink>
                  <Link href={`/products/${product.slug}`} style={{
                    display: "block", textAlign: "center",
                    color: G.muted, fontSize: "10px", letterSpacing: "0.08em",
                    textDecoration: "none", marginTop: "6px",
                  }}>
                    View full details →
                  </Link>
                  <p style={{ fontSize: "10px", color: G.mutedLo, textAlign: "center", marginTop: "8px" }}>
                    {product.guarantee}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU ACTUALLY RECEIVE ────────────────────────────────────── */}
      <section style={{ background: G.bg, padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-6xl">
          <OrnHeader label="WHAT YOU ACTUALLY RECEIVE" sub="INSIDE EVERY PACK — REAL FILES, REAL SYSTEMS" />

          <div className="grid md:grid-cols-3 gap-5">

            {/* Starter deliverables */}
            <div style={{
              background: G.bgCard,
              border: "1px solid rgba(52,211,153,0.22)",
              borderRadius: "8px", padding: "24px",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", color: "#34d399", marginBottom: "16px" }}>
                🚀 STARTER PACK — $29
              </div>
              {[
                { icon: "📄", file: "START_HERE.pdf",           desc: "Orientation guide — read first" },
                { icon: "📋", file: "7-Day Checklist.pdf",      desc: "Day-by-day execution blueprint" },
                { icon: "💬", file: "Outreach Scripts.pdf",     desc: "Cold DM + email templates" },
                { icon: "🏗",  file: "Offer Builder.pdf",        desc: "AI offer framework, step-by-step" },
                { icon: "📦", file: "Starter_Pack.zip",         desc: "All files, instant download" },
              ].map(({ icon, file, desc }) => (
                <div key={file} style={{
                  display: "flex", gap: "10px", alignItems: "flex-start",
                  padding: "9px 0", borderBottom: "1px solid rgba(52,211,153,0.08)",
                }}>
                  <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#d1fae5", fontFamily: "monospace", letterSpacing: "0.02em" }}>{file}</div>
                    <div style={{ fontSize: "10px", color: "#4a7a62", marginTop: "2px" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro deliverables */}
            <div style={{
              background: G.bgCard,
              border: `1px solid rgba(212,175,55,0.30)`,
              borderRadius: "8px", padding: "24px",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                background: G.gold, color: "#09070a",
                fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em",
                padding: "3px 14px", borderRadius: "20px", whiteSpace: "nowrap",
              }}>⭐ MOST POPULAR</div>
              <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", color: G.gold, marginBottom: "16px" }}>
                ⚡ PRO PACK — $79
              </div>
              {[
                { icon: "📄", file: "START_HERE.pdf",              desc: "Orientation guide — read first" },
                { icon: "📊", file: "AI Revenue Dashboard.xlsx",   desc: "Automated revenue tracking sheet" },
                { icon: "🔄", file: "Automation Workflows.pdf",    desc: "Make.com + Zapier flow diagrams" },
                { icon: "💼", file: "Client Proposal Template.pdf",desc: "Plug-and-play agency proposal" },
                { icon: "🤖", file: "AI Prompt Library.pdf",       desc: "50+ production-ready GPT prompts" },
                { icon: "📦", file: "Pro_Pack.zip",                desc: "Everything above — instant download" },
              ].map(({ icon, file, desc }) => (
                <div key={file} style={{
                  display: "flex", gap: "10px", alignItems: "flex-start",
                  padding: "9px 0", borderBottom: `1px solid rgba(212,175,55,0.07)`,
                }}>
                  <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#fef3c7", fontFamily: "monospace", letterSpacing: "0.02em" }}>{file}</div>
                    <div style={{ fontSize: "10px", color: G.muted, marginTop: "2px" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Commander deliverables */}
            <div style={{
              background: G.bgCard,
              border: "1px solid rgba(139,92,246,0.28)",
              borderRadius: "8px", padding: "24px",
            }}>
              <div style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", color: "#a78bfa", marginBottom: "16px" }}>
                👑 COMMANDER PACK — $149
              </div>
              {[
                { icon: "📄", file: "START_HERE.pdf",                  desc: "Orientation guide — read first" },
                { icon: "🏢", file: "White-Label License.pdf",         desc: "Resell as your own product" },
                { icon: "⚙",  file: "Full AI System Blueprint.pdf",    desc: "End-to-end operator infrastructure" },
                { icon: "📱", file: "Shopify Store Template.pdf",      desc: "Pre-configured store setup guide" },
                { icon: "📣", file: "60-Day Ad Campaign Plan.pdf",     desc: "Meta + organic launch roadmap" },
                { icon: "🔗", file: "API Integration Guide.pdf",       desc: "OpenAI, Meta, Google Cloud wiring" },
                { icon: "📦", file: "Commander_Pack.zip",              desc: "All 9 assets — instant download" },
              ].map(({ icon, file, desc }) => (
                <div key={file} style={{
                  display: "flex", gap: "10px", alignItems: "flex-start",
                  padding: "9px 0", borderBottom: "1px solid rgba(139,92,246,0.07)",
                }}>
                  <span style={{ fontSize: "15px", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#ede9fe", fontFamily: "monospace", letterSpacing: "0.02em" }}>{file}</div>
                    <div style={{ fontSize: "10px", color: "#5b4a7a", marginTop: "2px" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* delivery proof strip */}
          <div style={{
            marginTop: "36px",
            padding: "18px 28px",
            border: `1px solid ${G.goldDim}`,
            borderRadius: "8px",
            background: G.goldFaint,
            display: "flex", flexWrap: "wrap",
            justifyContent: "center", alignItems: "center",
            gap: "28px",
          }}>
            {[
              "⚡ Delivered via Paddle",
              "📧 Download link to your inbox",
              "♾  Lifetime access — re-download anytime",
              "🔒 256-bit encrypted checkout",
            ].map(item => (
              <span key={item} style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: G.muted }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPGRADE: AUTONOMAX AI ENGINE ──────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg,#0a0702 0%,#130f04 100%)',
        padding: "80px 24px",
        borderTop: `1px solid ${G.goldDim}`,
        borderBottom: `1px solid ${G.goldDim}`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 60% at 50% 50%,rgba(111,66,193,0.12) 0%,rgba(212,175,55,0.04) 40%,transparent 70%)`,
        }} />

        <div className="mx-auto max-w-6xl relative">
          <style>{`
            .engine-card { transition: all 0.2s ease; cursor: pointer; }
            .engine-card:hover { transform: translateY(-2px); }
            .diag-card:hover { border-color: rgba(111,66,193,0.60) !important; }
            .cmd-card:hover { border-color: rgba(212,175,55,0.70) !important; }
            .act-card:hover { border-color: rgba(34,197,94,0.50) !important; }
          `}</style>
          <OrnHeader label="READY FOR THE FULL SYSTEM?" sub="THE AUTONOMAX ENGINE — DONE-FOR-YOU AUTOMATION" />


          <div className="grid lg:grid-cols-2 gap-12 items-center mt-8">

            {/* Left: copy */}
            <div>
              <h3 style={{
                fontSize: "clamp(22px,3vw,34px)",
                fontWeight: 900, lineHeight: 1.15,
                color: "#fff", margin: "0 0 18px 0",
                letterSpacing: "-0.01em",
              }}>
                From Toolkits to{" "}
                <span style={{ color: G.gold }}>Autonomous Operations</span>
              </h3>

              <p style={{ fontSize: "13px", color: G.text, lineHeight: 1.8, marginBottom: "16px" }}>
                The Masterclass toolkits give you the blueprint. The{" "}
                <strong style={{ color: "#fff" }}>Autonoma-X Platform</strong>{" "}
                runs it for you — AI agents, automated
                pipelines, real-time analytics, and 24/7 operations monitoring.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", margin: "24px 0" }}>
                {[
                  { icon: "🤖", title: "Multi-Provider AI Network", desc: "Groq, DeepSeek, Gemini, OpenAI — auto-fallback, zero downtime" },
                  { icon: "⚡", title: "Automated 24/7 Operations", desc: "Bot execution, health checks, pipeline monitoring — no human needed" },
                  { icon: "📊", title: "Live Revenue Dashboard", desc: "MRR tracking, conversion analytics, churn prediction in real time" },
                  { icon: "🛡", title: "Paddle Payment Intelligence", desc: "Multi-rail revenue processing with automatic failover" },
                  { icon: "🔗", title: "Seamless API Integration", desc: "Connect your existing stack — Paddle, analytics, webhooks, CRM" },
                ].map((item) => (
                  <div key={item.title} style={{
                    display: "flex", gap: "12px", alignItems: "flex-start",
                    padding: "10px 14px",
                    background: "rgba(212,175,55,0.04)",
                    border: "1px solid rgba(212,175,55,0.10)",
                    borderRadius: "8px",
                  }}>
                    <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#f0f0f5", marginBottom: "2px" }}>{item.title}</div>
                      <div style={{ fontSize: "11px", color: G.muted, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: pricing cards */}
            <div>
              {/* Tier 1: Diagnostic */}
              <a href="https://app.aikagan.com" target="_blank" rel="noopener noreferrer"
                style={{ display: "block", textDecoration: "none", marginBottom: "16px" }}>
                <div className="engine-card diag-card" style={{
                  background: "rgba(111,66,193,0.06)",
                  border: "1px solid rgba(111,66,193,0.30)",
                  borderRadius: "10px",
                  padding: "22px 24px",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.12em", color: "#a78bfa", textTransform: "uppercase" }}>
                      🔍 Diagnostic
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#a78bfa" }}>$497</div>
                  </div>
                  <p style={{ fontSize: "11px", color: G.muted, lineHeight: 1.5, margin: 0 }}>
                    7-Day Action Plan · Pipeline Audit · Revenue Leak Report · One-Time
                  </p>
                </div>
              </a>

              {/* Tier 2: Command — Most Popular */}
              <a href="https://app.aikagan.com" target="_blank" rel="noopener noreferrer"
                style={{ display: "block", textDecoration: "none", marginBottom: "16px" }}>
                <div className="engine-card cmd-card" style={{
                  background: "rgba(212,175,55,0.06)",
                  border: "2px solid rgba(212,175,55,0.40)",
                  borderRadius: "10px",
                  padding: "22px 24px",
                  position: "relative",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}>
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: G.gold, color: "#09070a",
                    fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em",
                    padding: "3px 16px", borderRadius: "20px", whiteSpace: "nowrap",
                  }}>⭐ ACTIVATED</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.12em", color: G.gold, textTransform: "uppercase" }}>
                      ⚡ Command
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: G.gold }}>$997</div>
                  </div>
                  <p style={{ fontSize: "11px", color: G.muted, lineHeight: 1.5, margin: 0 }}>
                    AI Agents · Automated Workflows · Monthly Retainer · Slack Integration
                  </p>
                </div>
              </a>

              {/* Tier 3: Activation */}
              <a href="https://app.aikagan.com" target="_blank" rel="noopener noreferrer"
                style={{ display: "block", textDecoration: "none" }}>
                <div className="engine-card act-card" style={{
                  background: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.28)",
                  borderRadius: "10px",
                  padding: "22px 24px",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 800, letterSpacing: "0.12em", color: "#34d399", textTransform: "uppercase" }}>
                      👑 Activation
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#34d399" }}>$2,497</div>
                  </div>
                  <p style={{ fontSize: "11px", color: G.muted, lineHeight: 1.5, margin: 0 }}>
                    Full-System Deployment · 72hr Turnaround · Done-For-You · One-Time
                  </p>
                </div>
              </a>

              {/* CTA buttons */}
              <div style={{ marginTop: "28px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <a href="https://app.aikagan.com" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: G.gold, color: "#09070a",
                    fontWeight: 800, fontSize: "12px", letterSpacing: "0.08em",
                    padding: "14px 28px", borderRadius: "6px",
                    textTransform: "uppercase", textDecoration: "none",
                  }}>
                  Open the Platform →
                </a>
                <a href="https://app.aikagan.com" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    border: `1px solid ${G.goldDim}`, color: G.gold,
                    fontWeight: 700, fontSize: "12px", letterSpacing: "0.08em",
                    padding: "14px 28px", borderRadius: "6px",
                    textTransform: "uppercase", textDecoration: "none",
                    background: G.goldFaint,
                  }}>
                  Compare Plans →
                </a>
              </div>
            </div>
          </div>

          {/* separator note */}
          <div style={{
            marginTop: "48px",
            padding: "14px 20px",
            border: `1px solid ${G.goldDim}`,
            borderRadius: "8px",
            background: G.goldFaint,
            textAlign: "center",
          }}>
            <p style={{ fontSize: "11px", color: G.text, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: G.gold }}>Already bought a Masterclass pack?</strong>{" "}
              Your toolkit knowledge applies directly. The platform automates everything
              the packs teach you —{" "}
              <a href="https://app.aikagan.com" target="_blank" rel="noopener noreferrer"
                style={{ color: G.gold, textDecoration: "underline" }}>
                upgrade to live operations →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ background: G.bg, padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-5xl">
          <OrnHeader label="HOW IT WORKS" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {[
              { n: "1", icon: "↓", title: "CHOOSE YOUR PACK",  desc: "Pick the pack that fits your goals and grab instant access." },
              { n: "2", icon: "📖", title: "START HERE",        desc: "Read the orientation guide and follow simple steps." },
              { n: "3", icon: "✏",  title: "EXECUTE",           desc: "Follow the day-by-day blueprint. Use the scripts. Check the checklist." },
              { n: "4", icon: "$",  title: "GET PAID",          desc: "Launch, sell, and keep 100% of the profits you make." },
            ].map((s, i, arr) => (
              <div key={s.n} className="relative flex flex-col items-center text-center" style={{ padding: "24px 16px" }}>
                {i < arr.length - 1 && (
                  <div className="hidden md:block absolute" style={{
                    top: "36px", right: "-10px", color: G.goldDim, fontSize: "18px", zIndex: 10,
                  }}>→</div>
                )}
                <div style={{
                  width: "54px", height: "54px", borderRadius: "50%",
                  border: `1px solid ${G.goldDim}`,
                  background: `rgba(212,175,55,0.06)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "14px", flexShrink: 0,
                }}>
                  <span style={{ color: G.gold, fontSize: "20px", fontWeight: 900 }}>{s.n}</span>
                </div>
                <div style={{ fontSize: "22px", marginBottom: "10px", color: G.gold }}>{s.icon}</div>
                <h3 style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", color: "#fff", marginBottom: "8px", lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <div style={{
        background: G.bgSection,
        borderTop: "1px solid rgba(212,175,55,0.09)",
        borderBottom: "1px solid rgba(212,175,55,0.09)",
      }}>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "↓", n: "INSTANT",   label: "DOWNLOAD AFTER CHECKOUT" },
              { icon: "📦", n: "28 FILES",  label: "ACROSS ALL THREE PACKS" },
              { icon: "⭐", n: "100%",      label: "PROFITS YOURS TO KEEP" },
              { icon: "✓",  n: "30 DAYS",  label: "MONEY BACK GUARANTEE" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center text-center" style={{ gap: "6px" }}>
                <span style={{ fontSize: "28px" }}>{s.icon}</span>
                <div style={{ fontSize: "22px", fontWeight: 900, color: G.gold, letterSpacing: "0.02em" }}>{s.n}</div>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: G.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: "32px", padding: "20px 24px",
            border: `1px solid ${G.goldDim}`,
            borderRadius: "8px",
            background: G.goldFaint,
            textAlign: "center",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.15em", color: G.gold, marginBottom: "6px" }}>
              OUR GUARANTEE
            </p>
            <p style={{ fontSize: "13px", color: G.text, lineHeight: 1.6 }}>
              Not satisfied? Email us within 30 days of purchase and we&apos;ll review your request promptly.
              Refunds are processed within 5 business days. See our{" "}
              <a href="/legal/refund/" style={{ color: G.gold, textDecoration: "underline" }}>refund policy</a> for full details.
            </p>
          </div>
        </div>
      </div>

      {/* ── BUILT WITH ───────────────────────────────────────────────────── */}
      <section style={{ background: G.bgSection, borderTop: "1px solid rgba(212,175,55,0.07)", padding: "52px 24px" }}>
        <div className="mx-auto max-w-5xl">
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.28em", color: G.muted }}>
              INFRASTRUCTURE POWERING EVERY PACK
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {[
              { logo: "☁",  name: "Google Cloud",   sub: "Hosting & AI APIs"     },
              { logo: "🛍",  name: "Shopify",         sub: "Store templates"       },
              { logo: "⬡",  name: "OpenAI",          sub: "GPT-4 prompts"         },
              { logo: "◈",  name: "GitHub",           sub: "Version control"       },
              { logo: "⬡",  name: "Meta",             sub: "Ad systems & Pixel"    },
              { logo: "📊", name: "Google Analytics", sub: "GA4 tracking"          },
              { logo: "⚡", name: "Make.com",          sub: "Workflow automation"   },
              { logo: "⚙",  name: "Zapier",           sub: "No-code automation"    },
            ].map(({ logo, name, sub }) => (
              <div key={name} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
                minWidth: "80px",
              }}>
                <div style={{
                  width: "48px", height: "48px",
                  border: `1px solid rgba(212,175,55,0.12)`,
                  borderRadius: "10px",
                  background: "rgba(212,175,55,0.04)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px",
                }}>
                  {logo}
                </div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#5a4a22", letterSpacing: "0.06em", textAlign: "center" }}>{name}</div>
                <div style={{ fontSize: "9px", color: "#3a3020", letterSpacing: "0.04em", textAlign: "center" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ background: G.bgCard, borderTop: "1px solid rgba(212,175,55,0.10)", padding: "80px 24px" }}>
        <div className="mx-auto max-w-4xl text-center">
          <div style={{
            border: `1px solid ${G.goldDim}`,
            borderRadius: "12px",
            padding: "56px 40px",
            background: "linear-gradient(160deg,rgba(212,175,55,0.08) 0%,transparent 60%)",
            position: "relative",
          }}>
            {/* corner ornaments */}
            <div className="absolute" style={{ top:14, left:14, width:20, height:20, borderTop:`1px solid ${G.goldDim}`, borderLeft:`1px solid ${G.goldDim}` }} />
            <div className="absolute" style={{ top:14, right:14, width:20, height:20, borderTop:`1px solid ${G.goldDim}`, borderRight:`1px solid ${G.goldDim}` }} />
            <div className="absolute" style={{ bottom:14, left:14, width:20, height:20, borderBottom:`1px solid ${G.goldDim}`, borderLeft:`1px solid ${G.goldDim}` }} />
            <div className="absolute" style={{ bottom:14, right:14, width:20, height:20, borderBottom:`1px solid ${G.goldDim}`, borderRight:`1px solid ${G.goldDim}` }} />

            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: G.muted, marginBottom: "12px" }}>
              THIS ISN&apos;T JUST A STORE. IT&apos;S THE TREASURY.
            </p>
            <h2 style={{
              fontSize: "clamp(28px,4vw,50px)",
              fontWeight: 900, letterSpacing: "-0.01em",
              textTransform: "uppercase", color: G.gold,
              lineHeight: 1.1, margin: "0 0 28px 0",
            }}>
              YOUR FUTURE.<br />YOUR FREEDOM.<br />YOUR LEGACY.
            </h2>

            {/* 3 paid Masterclass CTAs — calls /api/paddle-checkout */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              {PAID_ROW_SLUGS.map((slug) => {
                const product = products.find((p) => p.slug === slug);
                if (!product) return null;
                const cfg = packCfg[product.slug] ?? packCfg["masterclass-pro"];
                const isStarter = product.slug === "masterclass-starter";
                const labels: Record<string,string> = {
                  "masterclass-starter":  "STARTER — $29 →",
                  "masterclass-pro":      "PRO — $79 →",
                  "masterclass-commander":"COMMANDER — $149 →",
                };
                return (
                  <CheckoutLink
                    key={product.slug}
                    href={product.checkoutUrl}
                    productSlug={product.slug}
                    productName={product.name}
                    price={product.price}
                    style={{
                      border: isStarter ? "none" : `1px solid ${cfg.border}`,
                      background: isStarter ? G.gold : cfg.cta,
                      color: isStarter ? "#09070a" : cfg.ctaFg,
                      fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em",
                      padding: "14px 28px", borderRadius: "6px",
                      textTransform: "uppercase", textDecoration: "none", cursor: "pointer",
                    }}>
                    {labels[product.slug] ?? product.name}
                  </CheckoutLink>
                );
              })}
            </div>

            <p style={{ marginTop: "18px", fontSize: "10px", letterSpacing: "0.12em", color: G.mutedLo }}>
              30-DAY GUARANTEE · IN-DOMAIN CHECKOUT · INSTANT DOWNLOAD · ONE-TIME PAYMENT
            </p>

            {/* ── Free-gift fallback row ─────────────────────────────────── */}
            <div style={{
              marginTop: "32px",
              paddingTop: "26px",
              borderTop: `1px dashed ${G.goldDim}`,
            }}>
              <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", color: G.muted, marginBottom: "14px" }}>
                ⚜  OR GRAB A FREE GIFT FIRST  ⚜
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
                {FREE_ROW_SLUGS.map((slug) => {
                  const product = products.find((p) => p.slug === slug);
                  if (!product) return null;
                  return (
                    <Link key={slug} href={`/free/${slug}`} style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      border: `1px solid rgba(52,211,153,0.38)`,
                      color: "#34d399",
                      fontWeight: 700, fontSize: "11px", letterSpacing: "0.08em",
                      padding: "10px 18px", borderRadius: "6px",
                      textTransform: "uppercase", textDecoration: "none",
                      background: "rgba(52,211,153,0.04)",
                    }}>
                      🎁 {product.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof — real testimonials */}
      <SocialProof />

      {/* Exit-intent overlay — captures abandoning visitors */}
      <ExitIntentModal
        discountCode="KAGANATE"
        productName="AutonomaX Profit OS"
        productSlug="masterclass-starter"
        price={29}
        fallbackHref="/free/golden-delivery-sample/"
      />
    </div>
  );
}
