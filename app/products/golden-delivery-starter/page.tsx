import Link from "next/link";
import { products } from "@/lib/products";
import MetaPixelEvent from "@/components/MetaPixelEvent";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata = {
  title: "AutonomaX Golden Delivery Starter Pack — First Sale in 7 Days",
  description:
    "7-file Launch Ignition System. Get your first AI-assisted revenue sale in 7 days using the exact blueprint, DM scripts, and activation checklist. $29 one-time.",
  openGraph: {
    title: "First AI Revenue Sale in 7 Days — $29 Starter Pack",
    description:
      "7 files. Day-by-day blueprint, DM scripts, and activation checklist. No audience required. First sale in 7 days or money back.",
    url: "https://aikagan.com/products/golden-delivery-starter",
    siteName: "AIKAGAN",
    images: [{ url: "https://aikagan.com/visuals/starter_pack.png", width: 1200, height: 630, alt: "Golden Delivery Starter Pack" }],
    type: "website",
  },
};

export default function Page() {
  const product = products.find((p) => p.slug === "golden-delivery-starter");
  if (!product) return <main className="p-10">Product not found.</main>;

  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      {/* Fire ViewContent for FB/IG ad optimisation */}
      <MetaPixelEvent event="ViewContent" params={{ content_ids: ["golden-delivery-starter"], content_type: "product", value: 29, currency: "USD" }} />

      {/* HERO */}
      <section className="px-6 pt-24 pb-16 mx-auto max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-300">
          AutonomaX Golden Delivery · Starter Pack
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          Your First AI Revenue Sale.<br />
          <span className="text-amber-300">In 7 Days. For $29.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-neutral-300 leading-relaxed">
          No audience. No ads. No expensive tools. Just 7 files that hand you an exact day-by-day map, plug-in DM scripts, and a 24-hour activation checklist — everything you need to close your first deal this week.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <CheckoutButton
            href={product.checkoutUrl!}
            slug="golden-delivery-starter"
            price={29}
            className="inline-flex rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
          >
            Get Instant Access — $29
          </CheckoutButton>
          <span className="text-sm text-neutral-400 line-through">${product.originalPrice} regular price</span>
        </div>
        <p className="mt-3 text-xs text-neutral-500">✓ Instant download &nbsp;·&nbsp; ✓ 30-day money-back guarantee &nbsp;·&nbsp; ✓ One-time payment</p>
      </section>

      {/* PROBLEM / STAKES */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Most people spend months "getting ready" and never make a single dollar.
          </h2>
          <p className="mt-4 text-neutral-300 text-lg leading-relaxed max-w-3xl">
            They watch tutorials, tweak their offer, wait for the perfect moment. Meanwhile the window closes. The Starter Pack exists to end that loop — you'll have a concrete first-sale execution map in your hands in the next 5 minutes.
          </p>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">What's Inside</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-12">7 files. Zero fluff.</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "7-Day First Sale Blueprint",
                desc: "Day-by-day execution map from zero to first paid customer. Exact tasks, exact hour-by-hour activation sequence, and benchmarks so you know you're on track.",
              },
              {
                num: "02",
                title: "Offer Creation Worksheet",
                desc: "5-section fillable guide: define your target buyer, design the deliverable, set your price, name it, and run through the validation checklist before you post.",
              },
              {
                num: "03",
                title: "Objection Crusher Scripts",
                desc: "6 pre-written DM responses for 'too expensive,' 'I need to think,' 'prove it works,' 'no time,' 'just give me it free,' and 'I'll do it myself.' Copy, paste, close.",
              },
              {
                num: "04",
                title: "Quick Win Activation Checklist",
                desc: "24-hour fast-start sequence — hour-by-hour tasks to get your offer live and your first outreach sent within one day of downloading.",
              },
              {
                num: "05",
                title: "Start Here — Orientation Guide",
                desc: "System overview, Profit OS modules explained, what to do first, and the mindset shift that separates people who sell from people who prepare.",
              },
              {
                num: "06",
                title: "First Sale Plan",
                desc: "The condensed playbook: who to contact, what to say, how to handle payment, how to deliver. Built for zero-to-one, not optimization.",
              },
              {
                num: "07",
                title: "System Access Guide",
                desc: "Full walkthrough of the AutonomaX AI revenue engine — offer analysis, revenue path modeling, and behavior tracking so the system works for you, not the other way around.",
              },
            ].map((item) => (
              <div key={item.num} className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                <span className="text-xs text-amber-300 font-mono">{item.num}</span>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Who This Is For</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-4">✓ This is for you if…</h3>
              <ul className="space-y-3 text-neutral-300 text-sm">
                {[
                  "You haven't made your first AI-assisted dollar yet",
                  "You have a service or skill but no repeatable sales process",
                  "You've been 'getting ready' for weeks and need to ship",
                  "You want exact scripts, not vague advice",
                  "You have less than 2 hours a day to dedicate to this",
                ].map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-4">✗ This is NOT for you if…</h3>
              <ul className="space-y-3 text-neutral-300 text-sm">
                {[
                  "You're already making $1K+/month and need scaling strategy",
                  "You want a passive system with zero effort",
                  "You need live coaching or 1-on-1 support",
                  "You're looking for a get-rich-quick scheme",
                ].map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-neutral-500">
            Already making sales? <Link href="/products/golden-delivery-pro" className="text-amber-300 hover:underline">See the Pro Pack →</Link>
          </p>
        </div>
      </section>

      {/* CTA / PRICING */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">Get Started Today</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            7 files. One week. First sale.
          </h2>
          <p className="text-neutral-300 mb-8 text-lg">
            Skip the months of "preparation." Download the system, follow the map, close your first deal.
          </p>

          <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 text-left mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-semibold text-amber-300">${product.price}</span>
              <span className="text-neutral-400 line-through text-xl">${product.originalPrice}</span>
              <span className="text-sm text-green-400 font-medium">Limited offer</span>
            </div>
            <p className="text-sm text-neutral-400 mb-6">One-time payment. Instant download. Yours forever.</p>
            <ul className="space-y-2 text-sm text-neutral-300 mb-8">
              {product.bullets?.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-amber-300 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <CheckoutButton
              href={product.checkoutUrl!}
              slug="golden-delivery-starter"
              price={29}
              className="w-full inline-flex justify-center rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
            >
              Get Instant Access — $29
            </CheckoutButton>
            <p className="mt-4 text-xs text-neutral-500 text-center">
              ✓ 30-day money-back guarantee — if you don't make progress, get a full refund.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300 mb-4">FAQ</p>
          <h2 className="text-2xl font-semibold mb-10">Questions, answered.</h2>
          <div className="space-y-8">
            {[
              {
                q: "Is this really $29? What's the catch?",
                a: "No catch. This is a low-ticket entry point into the AutonomaX system. We'd rather you get real results at $29 than be impressed by a $297 price tag that sits in your downloads folder.",
              },
              {
                q: "I have no audience. Will this still work?",
                a: "Yes — the First Sale Blueprint is specifically designed for zero-audience, zero-follower situations. The scripts target warm outreach (people who already know you), not cold social traffic.",
              },
              {
                q: "How is this different from free content on YouTube?",
                a: "YouTube gives you concepts. This gives you copy-paste scripts, a filled-out worksheet you complete once, and a day-by-day checklist. You don't learn — you execute.",
              },
              {
                q: "What if I don't make a sale in 7 days?",
                a: "We offer a 30-day money-back guarantee. If you followed the blueprint and didn't close anything, email us and we'll refund you in full. No hoops.",
              },
              {
                q: "What comes after the Starter Pack?",
                a: "The Pro Pack ($79) adds funnels, traffic strategy, a 30-day revenue calendar, and 5 offer templates. Most Starter customers upgrade within 2 weeks once they've made their first sale.",
              },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 py-16 border-t border-white/5 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-semibold mb-4">Ready to stop preparing and start selling?</h2>
          <CheckoutButton
            href={product.checkoutUrl!}
            slug="golden-delivery-starter"
            price={29}
            className="inline-flex rounded-full bg-amber-300 px-10 py-4 text-base font-semibold text-black transition hover:bg-amber-200"
          >
            Download the Starter Pack — $29
          </CheckoutButton>
          <p className="mt-4 text-xs text-neutral-500">30-day guarantee · Instant download · One-time payment</p>
        </div>
      </section>

      <div className="px-6 py-8 text-center border-t border-white/5">
        <Link href="/" className="text-sm text-neutral-400 hover:text-white">
          ← Back to AIKAGAN
        </Link>
      </div>
    </main>
  );
}
