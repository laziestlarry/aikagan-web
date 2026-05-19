import Link from "next/link";
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
  border: string; hdr: string; cta: string; ctaFg: string; ctaBorder?: string;
}> = {
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
                KAGAN&apos;S<br />GIANT GOLD<br />TREASURY ROOM
              </h1>

              <p style={{ marginTop: "18px", fontSize: "15px", lineHeight: 1.8, color: G.text, maxWidth: "480px" }}>
                Done-For-You AI Revenue Execution Packs. Built to help you pursue your first
                AI-assisted sale in 7 days — using guided outreach scripts, offer frameworks,
                and step-by-step checklists. Results depend on implementation.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "32px" }}>
                <Link href="/products/golden-delivery-starter" style={{
                  display: "inline-flex", alignItems: "center",
                  background: G.gold, color: "#09070a",
                  fontWeight: 800, fontSize: "13px", letterSpacing: "0.08em",
                  padding: "14px 30px", borderRadius: "6px",
                  textTransform: "uppercase", textDecoration: "none",
                }}>
                  START AT $29 →
                </Link>
                <Link href="#packs" style={{
                  display: "inline-flex", alignItems: "center",
                  border: `1px solid ${G.goldDim}`, color: G.gold,
                  fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em",
                  padding: "14px 30px", borderRadius: "6px",
                  textTransform: "uppercase", textDecoration: "none",
                  background: G.goldFaint,
                }}>
                  SEE ALL THREE PACKS
                </Link>
              </div>

              {/* trust strip */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "24px" }}>
                {[["↓","INSTANT DOWNLOAD"],["◈","WHITE-LABEL (COMMANDER)"],["$","KEEP 100% PROFITS"]].map(([icon, label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: G.muted }}>
                    <span style={{ color: G.gold }}>{icon}</span>{label}
                  </div>
                ))}
              </div>
              <p style={{ marginTop: "12px", fontSize: "10px", color: G.mutedLo, maxWidth: "380px", lineHeight: 1.6 }}>
                Results depend on individual effort and implementation. This is an execution toolkit, not a guaranteed income program.
              </p>
            </div>

            {/* ── Right: vault arch ── */}
            <div className="relative hidden lg:block" style={{ height: "420px" }}>

              {/* outer arch */}
              <div className="absolute" style={{
                bottom: 0, left: "50%", transform: "translateX(-50%)",
                width: "340px", height: "400px",
                borderRadius: "170px 170px 0 0",
                border: "1px solid rgba(212,175,55,0.11)",
                background: "radial-gradient(ellipse at 50% 85%,rgba(212,175,55,0.12) 0%,transparent 70%)",
              }} />
              {/* inner arch */}
              <div className="absolute" style={{
                bottom: 0, left: "50%", transform: "translateX(-50%)",
                width: "230px", height: "278px",
                borderRadius: "115px 115px 0 0",
                border: "1px solid rgba(212,175,55,0.22)",
                background: "radial-gradient(ellipse at 50% 78%,rgba(212,175,55,0.22) 0%,rgba(212,175,55,0.04) 55%,transparent 80%)",
              }} />

              {/* crown */}
              <div className="absolute" style={{
                bottom: "126px", left: "50%", transform: "translateX(-50%)",
                fontSize: "70px",
                filter: `drop-shadow(0 0 40px ${G.gold}) drop-shadow(0 0 16px ${G.gold})`,
                zIndex: 10, lineHeight: 1,
              }}>👑</div>

              {/* coins */}
              <div className="absolute" style={{ bottom: "36px", left: "68px", fontSize: "38px", opacity: 0.55 }}>🪙</div>
              <div className="absolute" style={{ bottom: "66px", right: "66px", fontSize: "34px", opacity: 0.45 }}>🪙</div>
              <div className="absolute" style={{ bottom: "20px", right: "96px", fontSize: "46px", opacity: 0.40 }}>🪙</div>
              <div className="absolute" style={{ bottom: "18px", left: "108px", fontSize: "30px", opacity: 0.35 }}>🪙</div>

              {/* corner ornaments */}
              <div className="absolute" style={{ top:16, left:16, width:22, height:22, borderTop:`2px solid ${G.goldDim}`, borderLeft:`2px solid ${G.goldDim}` }} />
              <div className="absolute" style={{ top:16, right:16, width:22, height:22, borderTop:`2px solid ${G.goldDim}`, borderRight:`2px solid ${G.goldDim}` }} />
              <div className="absolute" style={{ bottom:16, left:16, width:22, height:22, borderBottom:`2px solid ${G.goldDim}`, borderLeft:`2px solid ${G.goldDim}` }} />
              <div className="absolute" style={{ bottom:16, right:16, width:22, height:22, borderBottom:`2px solid ${G.goldDim}`, borderRight:`2px solid ${G.goldDim}` }} />
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
                    background: cfg.cta,
                    color: cfg.ctaFg,
                    border: cfg.ctaBorder ?? "none",
                    borderRadius: "6px",
                    padding: "12px 20px",
                    fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em",
                    textTransform: "uppercase", textDecoration: "none",
                  }}>
                    {ctaLabel}
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
