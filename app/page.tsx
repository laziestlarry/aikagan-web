import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";

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
  border: string; hdr: string; cta: string; ctaFg: string; ctaBorder?: string; image: string;
}> = {
  "golden-delivery-starter": {
    border:    "rgba(52,211,153,0.32)",
    hdr:       "#34d399",
    cta:       "transparent",
    ctaFg:     "#34d399",
    ctaBorder: "1px solid rgba(52,211,153,0.38)",
    image:     "/visuals/starter_pack.png",
  },
  "golden-delivery-pro": {
    border: "rgba(212,175,55,0.52)",
    hdr:    G.gold,
    cta:    G.gold,
    ctaFg:  "#09070a",
    image:  "/visuals/pro_pack.png",
  },
  "golden-delivery-commander": {
    border: "rgba(139,92,246,0.42)",
    hdr:    "#a78bfa",
    cta:    "rgba(139,92,246,0.60)",
    ctaFg:  "#fff",
    image:  "/visuals/commander_pack.png",
  },
};

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

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes pulseDot   { 0%,100%{opacity:1;box-shadow:0 0 6px #22c55e} 50%{opacity:.5;box-shadow:0 0 14px #22c55e} }
        @keyframes floatCard  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes shimmerBtn { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .hero-cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(212,175,55,0.40) !important; }
        .hero-cta-secondary:hover { background:rgba(212,175,55,0.12) !important; }
        .pack-card { transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease; }
        .pack-card:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.5) !important; }
        .float-card-tr { animation:floatCard 4s ease-in-out infinite; }
        .float-card-bl { animation:floatCard 4s ease-in-out 1.5s infinite; }
      `}</style>

      <section className="relative overflow-hidden" style={{ minHeight: "700px" }}>

        {/* bg layers */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#09070a 0%,#130f04 55%,#0d0b07 100%)" }} />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 65% 100% at 78% 52%,rgba(212,175,55,0.20) 0%,rgba(180,130,20,0.07) 50%,transparent 75%)`
        }} />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 40% 30% at 50% 0%,rgba(212,175,55,0.07) 0%,transparent 70%)`
        }} />
        <div className="absolute inset-3 pointer-events-none" style={{ border: "1px solid rgba(212,175,55,0.06)" }} />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: copy ── */}
            <div>

              {/* live urgency pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(212,175,55,0.07)",
                border: "1px solid rgba(212,175,55,0.22)",
                borderRadius: "100px",
                padding: "6px 16px",
                marginBottom: "22px",
              }}>
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#22c55e", flexShrink: 0, display: "inline-block",
                  animation: "pulseDot 1.8s ease-in-out infinite",
                }} />
                <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", color: G.gold }}>
                  FOUNDING WAVE — DIGITAL ACCESS OPEN
                </span>
              </div>

              <h1 style={{
                fontSize: "clamp(40px,5.8vw,72px)",
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: G.gold,
                margin: 0,
              }}>
                AIKAGAN&apos;S<br />
                <span style={{
                  fontFamily: "'Caveat', cursive",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "clamp(48px,7.2vw,86px)",
                  letterSpacing: "0.01em",
                  color: "rgba(212,175,55,0.62)",
                  display: "inline",
                  lineHeight: 1,
                }}>giant</span>{" "}GOLDEN<br />
                <span style={{ color: "#ffffff" }}>AI TREASURY</span>
              </h1>

              <p style={{ marginTop: "20px", fontSize: "15px", lineHeight: 1.8, color: G.text, maxWidth: "470px" }}>
                Done-For-You AI Revenue Execution Packs — built to help you make
                your first AI-assisted sale in 7 days. Guided outreach scripts,
                offer frameworks, step-by-step checklists. Instant download.
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "34px" }}>
                <Link href="/products/golden-delivery-starter" className="hero-cta-primary" style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "linear-gradient(135deg,#D4AF37 0%,#b8860b 100%)",
                  color: "#09070a",
                  fontWeight: 900, fontSize: "13px", letterSpacing: "0.1em",
                  padding: "15px 34px", borderRadius: "6px",
                  textTransform: "uppercase", textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.28)",
                  transition: "transform .2s ease, box-shadow .2s ease",
                }}>
                  ⚡ START AT $29 →
                </Link>
                <Link href="#packs" className="hero-cta-secondary" style={{
                  display: "inline-flex", alignItems: "center",
                  border: `1px solid ${G.goldDim}`, color: G.gold,
                  fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em",
                  padding: "15px 34px", borderRadius: "6px",
                  textTransform: "uppercase", textDecoration: "none",
                  background: G.goldFaint,
                  transition: "background .2s ease",
                }}>
                  SEE ALL THREE PACKS
                </Link>
              </div>

              {/* numeric proof strip */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", marginTop: "34px" }}>
                {[
                  { n: "28",     label: "FILES DELIVERED" },
                  { n: "3",      label: "TIER PACKS" },
                  { n: "30-DAY", label: "GUARANTEE" },
                  { n: "100%",   label: "PROFIT YOURS" },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: "19px", fontWeight: 900, color: G.gold, lineHeight: 1.1 }}>{n}</div>
                    <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: G.muted, marginTop: "3px" }}>{label}</div>
                  </div>
                ))}
              </div>

              <p style={{ marginTop: "16px", fontSize: "10px", color: G.mutedLo, maxWidth: "380px", lineHeight: 1.6 }}>
                Results depend on individual effort and implementation. This is an execution toolkit, not a guaranteed income program.
              </p>
            </div>

            {/* ── Right: product visual with glassmorphism stat cards ── */}
            <div className="relative hidden lg:flex" style={{ justifyContent: "center", alignItems: "center", paddingTop: "24px", paddingBottom: "24px" }}>

              {/* glow backdrop */}
              <div className="absolute" style={{
                width: "80%", height: "70%",
                background: "radial-gradient(ellipse,rgba(212,175,55,0.20) 0%,transparent 70%)",
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                filter: "blur(38px)",
                pointerEvents: "none",
              }} />

              {/* product image container */}
              <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
                <div style={{
                  borderRadius: "18px", overflow: "hidden",
                  border: "1px solid rgba(212,175,55,0.24)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 50px rgba(212,175,55,0.10)",
                }}>
                  <Image
                    src="/visuals/all_packs.png"
                    alt="Golden Delivery AI Revenue Packs"
                    width={1536}
                    height={1024}
                    style={{ width: "100%", height: "auto", display: "block" }}
                    priority
                  />
                </div>

                {/* floating card — top right */}
                <div className="float-card-tr" style={{
                  position: "absolute", top: "-20px", right: "-26px",
                  background: "rgba(9,7,10,0.82)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(212,175,55,0.30)",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: G.muted }}>DELIVERY</div>
                  <div style={{ fontSize: "15px", fontWeight: 900, color: "#22c55e", marginTop: "3px", letterSpacing: "0.05em" }}>⚡ INSTANT</div>
                </div>

                {/* floating card — bottom left */}
                <div className="float-card-bl" style={{
                  position: "absolute", bottom: "-20px", left: "-26px",
                  background: "rgba(9,7,10,0.82)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(212,175,55,0.30)",
                  borderRadius: "12px",
                  padding: "12px 20px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: G.muted }}>PROJECTED ROI</div>
                  <div style={{ fontSize: "15px", fontWeight: 900, color: G.gold, marginTop: "3px", letterSpacing: "0.05em" }}>340%+</div>
                </div>

                {/* floating card — middle left edge */}
                <div style={{
                  position: "absolute", top: "50%", left: "-22px",
                  transform: "translateY(-50%)",
                  background: "rgba(9,7,10,0.82)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(52,211,153,0.28)",
                  borderRadius: "12px",
                  padding: "10px 16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: "#34d399" }}>PACKS</div>
                  <div style={{ fontSize: "13px", fontWeight: 900, color: "#fff", marginTop: "2px" }}>3 TIERS</div>
                </div>
              </div>
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
              { icon: "🤖", label: "AI-POWERED SYSTEMS" },
              { icon: "☁", label: "TRUSTED INFRASTRUCTURE" },
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
          <OrnHeader label="PICK YOUR LEVEL" sub="EVERYTHING YOU NEED TO WIN ONLINE" />

          <div className="grid md:grid-cols-3 gap-5">
            {products.map((product: any) => {
              const cfg = packCfg[product.slug] ?? packCfg["golden-delivery-starter"];
              const isPro = product.slug === "golden-delivery-pro";
              const isCmd = product.slug === "golden-delivery-commander";
              const ctaLabel = isPro
                ? `GET PRO — $${product.price} →`
                : isCmd
                  ? `GET COMMANDER — $${product.price} →`
                  : `GET STARTER — $${product.price} →`;

              return (
                <article key={product.slug} className="pack-card" style={{
                  background: "rgba(10,8,2,0.80)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${cfg.border}`,
                  borderRadius: "14px",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                }}>
                  {isPro && (
                    <div style={{
                      position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg,#D4AF37,#b8860b)",
                      color: "#09070a",
                      fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em",
                      padding: "4px 18px", borderRadius: "20px", whiteSpace: "nowrap",
                      boxShadow: "0 4px 14px rgba(212,175,55,0.35)",
                    }}>⭐ MOST POPULAR ⭐</div>
                  )}

                  {/* product image */}
                  {(product.slug === "golden-delivery-starter" || product.slug === "golden-delivery-pro" || product.slug === "golden-delivery-commander") && (
                    <div style={{ position: "relative", borderBottom: `1px solid ${cfg.border}` }}>
                      <Image
                        src={cfg.image}
                        alt={`${product.name} Pack`}
                        width={1448}
                        height={1086}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                      {/* instant badge overlay */}
                      <div style={{
                        position: "absolute", bottom: "10px", right: "10px",
                        background: "rgba(9,7,10,0.80)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(34,197,94,0.35)",
                        borderRadius: "8px",
                        padding: "5px 10px",
                        fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em",
                        color: "#22c55e",
                      }}>⚡ INSTANT DOWNLOAD</div>
                    </div>
                  )}

                  <div style={{ padding: "24px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", color: cfg.hdr, textTransform: "uppercase", marginBottom: "3px" }}>
                        {product.name} Pack
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
                  <Link href={`/products/${product.slug}`} style={{
                    display: "block", textAlign: "center",
                    background: isPro
                      ? "linear-gradient(135deg,#D4AF37 0%,#b8860b 100%)"
                      : cfg.cta,
                    color: cfg.ctaFg,
                    border: isPro ? "none" : (cfg.ctaBorder ?? "none"),
                    borderRadius: "6px",
                    padding: "13px 20px",
                    fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em",
                    textTransform: "uppercase", textDecoration: "none",
                    boxShadow: isPro ? "0 4px 16px rgba(212,175,55,0.30)" : "none",
                  }}>
                    {ctaLabel}
                  </Link>
                  <p style={{ fontSize: "10px", color: G.mutedLo, textAlign: "center", marginTop: "8px" }}>
                    {product.guarantee}
                  </p>
                  </div>
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
              "⚡ Delivered via LemonSqueezy",
              "📧 Download link to your inbox",
              "♾  Lifetime access — re-download anytime",
              "🔒 256-bit encrypted checkout",
            ].map(item => (
              <span key={item} style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: G.muted }}>{item}</span>
            ))}
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

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              <Link href="/products/golden-delivery-starter" style={{
                background: G.gold, color: "#09070a",
                fontWeight: 800, fontSize: "13px", letterSpacing: "0.08em",
                padding: "14px 28px", borderRadius: "6px",
                textTransform: "uppercase", textDecoration: "none",
              }}>
                STARTER — $29 →
              </Link>
              <Link href="/products/golden-delivery-pro" style={{
                border: `1px solid ${G.goldDim}`, color: G.gold,
                fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em",
                padding: "14px 28px", borderRadius: "6px",
                textTransform: "uppercase", textDecoration: "none",
                background: G.goldFaint,
              }}>
                PRO — $79 →
              </Link>
              <Link href="/products/golden-delivery-commander" style={{
                border: "1px solid rgba(139,92,246,0.42)", color: "#a78bfa",
                fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em",
                padding: "14px 28px", borderRadius: "6px",
                textTransform: "uppercase", textDecoration: "none",
                background: "rgba(139,92,246,0.06)",
              }}>
                COMMANDER — $149 →
              </Link>
            </div>

            <p style={{ marginTop: "18px", fontSize: "10px", letterSpacing: "0.12em", color: G.mutedLo }}>
              ALL PACKS · 30-DAY GUARANTEE · INSTANT DOWNLOAD · ONE-TIME PAYMENT
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
