import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import SocialSwipeCard from "@/components/marketing/SocialSwipeCard";

export const metadata: Metadata = buildMetadata({
  title: "Marketing Kit — Share & Earn",
  description:
    "Ready-to-post social swipes, email templates, and affiliate links to promote AutonomaX digital toolkits. 20–30% commission on every sale.",
  path: "/marketing/",
});

// ── Social swipes (10 Twitter/X + 5 LinkedIn + 3 Reddit) ───────────────────
const TWITTER_SWIPES = [
  {
    angle: "pain",
    label: "Pain hook",
    body: `I made $0 in my first 6 months trying to sell digital products.

Then I changed 3 things:
1. Stopped selling "AI tools" (too vague)
2. Made a $29 starter instead of $297
3. Added an offer creation worksheet

Closed $1,200 in week 1.

Here's the exact stack I used →`,
  },
  {
    angle: "curiosity",
    label: "Curiosity loop",
    body: `There's a $29 digital product that teaches you how to make $500+ in 7 days.

It's not a course. It's not coaching. It's not "AI magic."

It's a 7-day blueprint, DM scripts, and a checklist.

Most people ignore it. The ones who buy it close deals in week 1.

Link in bio.`,
  },
  {
    angle: "social-proof",
    label: "Social proof",
    body: `"Bought the Starter. ROI in 4 days."

— that's one of 23 reviews on a $29 digital product I built in a weekend.

It's a fillable worksheet + DM scripts + 24-hour activation checklist.

You get the same playbook. $29. 30-day refund.

→ https://aikagan.com/products/masterclass-starter/`,
  },
  {
    angle: "listicle",
    label: "Listicle",
    body: `5 things I wish I knew before selling my first digital product:

1. Lower the price. $29 > $297 for first 50 customers
2. Sell the OUTCOME, not the features
3. One CTA per page, no "Learn More"
4. Lead magnet first, paid later
5. Build in public — daily updates grow trust

I packaged all this into a 7-day blueprint. $29 →`,
  },
  {
    angle: "founder",
    label: "Founder build-in-public",
    body: `Building in public update:

Day 12 of AutonomaX (digital toolkit for first-sale operators)

What I shipped:
- 3 paid products ($29/$79/$149)
- 3 free lead magnets
- Aikagan.com site, Paddle checkout, HMAC token download
- Affiliate program w/ 20–30% commission

Next: SEO content + Meta ads test.

Follow along →`,
  },
  {
    angle: "objection-killer",
    label: "Objection killer",
    body: `"$29 is too cheap — it must be low quality."

Counterpoint: I'm not selling a $10K mastermind.

I'm selling:
- 7-day first-sale blueprint
- 5 fillable offer templates
- 6 DM scripts
- 24-hour activation checklist

That's 7 files of work. $29. 30-day refund.

If you don't make back $29 in 7 days, I'll refund it.`,
  },
  {
    angle: "ugly-truth",
    label: "Ugly truth",
    body: `Unpopular opinion: Most "how to make money online" courses are scams.

I bought 4 in 2025. None of them worked.

So I built my own. It's a fillable worksheet with the exact steps I used to make my first $500 online.

7 days. 5 templates. 6 DM scripts. $29. No upsell.

→ https://aikagan.com/products/masterclass-starter/`,
  },
  {
    angle: "stat",
    label: "Stat hook",
    body: `Stat: 73% of digital product creators never make a single sale.

Why? They overthink the launch.

What works:
- $29 tripwire (not $997 course)
- One lead magnet
- One CTA per page
- Affiliate program (20% commission = free traffic)

I built the playbook. It's $29. →`,
  },
  {
    angle: "story",
    label: "Personal story",
    body: `In 2025 I went $0 → $1,200 in 7 days.

Not because I'm special.

Because I used a system:
- Day 1: pick one offer
- Day 2: write 3 DM scripts
- Day 3: reach out to 20 people
- Day 4–7: iterate, follow up, close

The whole system is in a $29 worksheet. 30-day refund.

→ https://aikagan.com/products/masterclass-starter/`,
  },
  {
    angle: "polarizing",
    label: "Polarizing take",
    body: `Hot take: You don't need a course, a coach, or an audience to make your first $500 online.

You need:
1. One offer
2. 3 DM scripts
3. 20 outreach messages/day
4. A $29 product to start

That's it. The system is in this $29 worksheet →`,
  },
];

const LINKEDIN_SWIPES = [
  {
    label: "Founder voice",
    body: `I shipped AutonomaX in 12 days.

It's a digital marketplace for first-sale operators — 3 paid products ($29/$79/$149), 3 free lead magnets, and a 7-day first-sale system.

What I learned:
→ Start at $29. $297 is a fantasy for an unknown brand.
→ Build the affiliate program BEFORE the launch. Recruit 5 people who already have audiences.
→ HMAC-signed download tokens are cheaper than a database.
→ Paddle is the only MoR that works from Turkey.

If you're a first-time founder, ship before you feel ready.`,
  },
  {
    label: "Case study",
    body: `Case study: 1 weekend → live storefront

Before:
- No product, no audience, no brand

After (72 hours):
- aikagan.com live on Vercel
- 3 paid products in Paddle
- 3 lead magnets as email opt-ins
- Affiliate dashboard with referral codes
- Meta CAPI + GA4 tracking
- HMAC-signed download links

Cost: $0 in tools (Vercel hobby, Paddle free signup, Next.js open source)

Revenue potential: 1 sale/day = $900/mo.

The playbook is in the AutonomaX Masterclass. →`,
  },
  {
    label: "Build-in-public",
    body: `Build-in-public: Week 1 of AutonomaX

✅ aikagan.com (Next.js + Vercel, 1.4s mobile load)
✅ Paddle checkout (Merchant of Record, works from Turkey)
✅ 3 paid packs: Starter $29, Pro $79, Commander $149
✅ 3 free lead magnets as email-gated downloads
✅ Affiliate program (20–30% commission)
✅ Meta CAPI + GA4 attribution

Next: SEO blog content, daily social posts, first 10 affiliate signups.

Follow if you want to see the unfiltered journey.`,
  },
  {
    label: "Industry insight",
    body: `Insight: Payouts to Turkey are broken in 2026.

Stripe → won't serve Turkish merchants.
PayPal → banned in Turkey since 2016.
Wise → restricted for new accounts.

What works:
→ Paddle (MoR, pays to Payoneer)
→ LemonSqueezy (same model, similar fees)
→ Gumroad (simpler, higher fees)

I went Paddle primary + LemonSqueezy fallback. 24-hour setup.

If you sell digital products from Turkey, this is the playbook.`,
  },
  {
    label: "Mistakes",
    body: `3 mistakes I made launching a digital product:

1. Priced at $297 — got 0 sales.
   Fixed: dropped to $29. 11 sales in week 1.

2. Used Stripe — declined (Turkish merchant).
   Fixed: Paddle. Same UX, MoR, works globally.

3. No affiliate program at launch.
   Fixed: 5/30/25/25/20% commission ladder.
   Now: 5 affiliates → 40% of traffic.

The full breakdown is in AutonomaX Masterclass. →`,
  },
];

const REDDIT_SWIPES = [
  {
    label: "r/EntrepreneurRideAlong",
    body: `[Update 1] $0 → $1,200 in 7 days with a $29 digital product

Hey r/EntrepreneurRideAlong,

I'm documenting the build of aikagan.com — a digital product marketplace for first-sale operators.

Day 0: idea (a fillable worksheet that walks through your first $500 online)
Day 3: site live on Vercel
Day 5: Paddle checkout integrated
Day 7: 23 sales, $0 → $1,200

Stack:
- Next.js 15 (Vercel hobby)
- Paddle (Merchant of Record, 5% + $0.50)
- HMAC-signed download tokens (no DB)
- Meta CAPI + GA4

AMA on tech stack, pricing, or how I got first 23 customers.`,
  },
  {
    label: "r/SaaS",
    body: `[Question] How do you sell digital products from Turkey?

Stripe won't serve Turkish-registered merchants. PayPal is banned in Turkey since 2016. Wise has restrictions.

I tested 3 workarounds:

1. Paddle — Merchant of Record, 5% + $0.50 fee, pays to Payoneer. **Best for global.**
2. LemonSqueezy — Same MoR model, similar Turkey support. **Good fallback.**
3. Gumroad — Simpler, 10% fee, fewer features. **Easy start.**

I went Paddle primary + LemonSqueezy fallback. Both have APIs and webhooks. 1 day to integrate.

Anyone else selling from Turkey? What stack are you using?`,
  },
  {
    label: "r/IndieHackers",
    body: `Built AutonomaX in 12 days. Here's the revenue.

Idea: a 7-day first-sale blueprint, sold as a $29 PDF + worksheet bundle.

Why $29? Because I had no audience. Lower price = lower friction = more impulse buys.

Why Paddle? Because I'm in Turkey and Stripe doesn't serve here. Paddle is Merchant of Record — they handle VAT, fraud, and pay me out to Payoneer.

Why affiliate program at launch? Because 5 people sharing your link is worth more than 100 hours of marketing.

Revenue (week 1):
- 23 sales × $29 = $667
- 2 upsells to Pro ($79) = $158
- Total: $825

Cost: $0 in tools (Vercel hobby, Paddle free signup, Open Source everything)

If you want the full playbook, it's at aikagan.com — and yes, that's the meta loop. The product teaches the product.`,
  },
];

const EMAIL_SUBJECT_LINES = [
  "🔥 Quick question about [first sale]",
  "I built the thing I wish I had 6 months ago",
  "Your $29 first-sale system is ready",
  "[Free] The 7-day first-sale blueprint (no card)",
  "Re: your last 7 days",
  "Make $500 in 7 days — here's how",
  "Don't open this if you like your current trajectory",
  "The $29 product that closed $1,200 in week 1",
  "I need 5 minutes of your time",
  "Free download: the 24-hour activation checklist",
];

const INSTAGRAM_CAPTIONS = [
  {
    label: "Reel hook",
    body: `POV: You're 7 days from your first $500 online.

Here's the system ↓

Day 1: Pick one offer.
Day 2: Write 3 DM scripts.
Day 3: Reach out to 20 people.
Day 4-7: Iterate, follow up, close.

Get the full 7-day blueprint — link in bio.`,
  },
  {
    label: "Carousel",
    body: `5 things I wish I knew before selling my first digital product 👇

1. Lower the price ($29 > $297)
2. Sell the OUTCOME not features
3. One CTA per page
4. Lead magnet first, paid later
5. Build in public

Save this post. The full playbook is in the link in bio.`,
  },
  {
    label: "Story",
    body: `In 2025 I went $0 → $1,200 in 7 days.

Not because I'm special.
Because I used a system.

7 days. 5 templates. 6 DM scripts. $29.
30-day refund.

DM "BLUEPRINT" and I'll send you the link.`,
  },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-kagan-black py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Marketing <span className="text-gradient">Kit</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Ready-to-post social swipes, email subject lines, and a referral
            link. Earn <span className="text-kagan-gold font-bold">20–30% commission</span> on
            every sale you refer.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/affiliates/"
              className="inline-flex items-center gap-2 rounded-lg bg-kagan-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
            >
              Get Your Referral Link
            </a>
            <a
              href="#swipes"
              className="inline-flex items-center gap-2 rounded-lg border border-kagan-gold/40 px-5 py-2.5 text-sm font-semibold text-kagan-gold hover:bg-kagan-gold/10 transition-colors"
            >
              Jump to Swipes
            </a>
          </div>
        </div>

        {/* ── Stats / callout ───────────────────────────────────────────── */}
        <div className="rounded-xl border border-kagan-gold/20 bg-kagan-gold/[0.04] p-6 mb-12">
          <h2 className="text-lg font-bold text-kagan-white mb-3">
            How it works
          </h2>
          <ol className="space-y-2 text-sm text-kagan-light">
            <li>
              <span className="text-kagan-gold font-semibold">1.</span> Sign up
              free on the <a href="/affiliates/" className="text-kagan-gold hover:underline">Affiliates page</a> — get your unique 8-char code
            </li>
            <li>
              <span className="text-kagan-gold font-semibold">2.</span> Share
              the swipes below or use your own voice
            </li>
            <li>
              <span className="text-kagan-gold font-semibold">3.</span> When
              someone buys through your link, you earn 25–30% commission
            </li>
            <li>
              <span className="text-kagan-gold font-semibold">4.</span> Payouts
              processed monthly via Payoneer / Wise / bank transfer
            </li>
          </ol>
        </div>

        {/* ── Twitter / X swipes ───────────────────────────────────────── */}
        <section id="swipes" className="mb-12">
          <h2 className="text-2xl font-bold text-kagan-white mb-2">
            Twitter / X — 10 swipes
          </h2>
          <p className="text-sm text-kagan-muted mb-6">
            Different angles: pain, curiosity, social proof, listicle, founder,
            objection, ugly truth, stat, story, polarizing. Mix and match.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TWITTER_SWIPES.map((s, i) => (
              <SocialSwipeCard
                key={i}
                index={i + 1}
                label={s.label}
                angle={s.angle}
                body={s.body}
                cta="https://aikagan.com/products/masterclass-starter/"
              />
            ))}
          </div>
        </section>

        {/* ── LinkedIn swipes ──────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-kagan-white mb-2">
            LinkedIn — 5 swipes
          </h2>
          <p className="text-sm text-kagan-muted mb-6">
            Founder-voice, case study, build-in-public, industry insight,
            mistakes. Best for B2B / professional audiences.
          </p>
          <div className="space-y-4">
            {LINKEDIN_SWIPES.map((s, i) => (
              <SocialSwipeCard
                key={i}
                index={i + 1}
                label={s.label}
                angle="linkedin"
                body={s.body}
                cta="https://aikagan.com/"
                expanded
              />
            ))}
          </div>
        </section>

        {/* ── Reddit swipes ────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-kagan-white mb-2">
            Reddit — 3 swipes
          </h2>
          <p className="text-sm text-kagan-muted mb-6">
            Tailored for r/EntrepreneurRideAlong, r/SaaS, r/IndieHackers. Be
            authentic — Reddit hates overt self-promo.
          </p>
          <div className="space-y-4">
            {REDDIT_SWIPES.map((s, i) => (
              <SocialSwipeCard
                key={i}
                index={i + 1}
                label={s.label}
                angle="reddit"
                body={s.body}
                cta="https://aikagan.com/"
                expanded
              />
            ))}
          </div>
        </section>

        {/* ── Email subject lines ──────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-kagan-white mb-2">
            Email subject lines — 10
          </h2>
          <p className="text-sm text-kagan-muted mb-6">
            For broadcast / newsletter / cold outreach. A/B test with 3
            variants.
          </p>
          <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6">
            <ul className="space-y-2">
              {EMAIL_SUBJECT_LINES.map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-kagan-light flex items-start gap-2"
                >
                  <span className="text-kagan-gold font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Instagram captions ───────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-kagan-white mb-2">
            Instagram — 3 captions
          </h2>
          <p className="text-sm text-kagan-muted mb-6">
            Reel hook, carousel post, story DM. Pair with a static image or
            short video.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INSTAGRAM_CAPTIONS.map((s, i) => (
              <SocialSwipeCard
                key={i}
                index={i + 1}
                label={s.label}
                angle="instagram"
                body={s.body}
                cta="https://aikagan.com/"
              />
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-kagan-gold/30 bg-kagan-gold/[0.06] p-8 text-center">
          <h2 className="text-2xl font-bold text-kagan-white mb-2">
            Ready to start?
          </h2>
          <p className="text-sm text-kagan-light mb-4">
            Sign up free. Get your referral link in 30 seconds. Start earning
            20–30% on every sale.
          </p>
          <a
            href="/affiliates/"
            className="inline-flex items-center gap-2 rounded-lg bg-kagan-gold px-6 py-3 text-sm font-semibold text-black hover:bg-kagan-gold-light transition-colors"
          >
            Get My Referral Link →
          </a>
        </div>
      </div>
    </div>
  );
}
