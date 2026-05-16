import Link from "next/link";
import { products } from "@/lib/products";

export const metadata = {
  title: "AIKAGAN | The Kaganate",
  description:
    "Premium AI infrastructure, Golden Delivery systems, and productized automation operations.",
};

const trustBadges = [
  {
    title: "30-Day Guarantee",
    description: "Full money-back guarantee",
  },
  {
    title: "Instant Download",
    description: "Access your products immediately",
  },
  {
    title: "Secure & Private",
    description: "Bank-level security for your downloads",
  },
  {
    title: "Elite Support",
    description: "Get help when you need it",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <header className="border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-3xl font-semibold tracking-[0.2em] text-amber-300">AIKAGAN</p>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">The Kaganate</p>
          </div>

          <nav className="hidden gap-8 text-sm text-neutral-300 md:flex">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-neutral-300">⌕</button>
            <button className="text-neutral-300">🛒</button>
            <Link href="/account" className="rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-black">
              My Account
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(251,191,36,0.25),transparent_40%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">AIKAGAN GOLDEN DELIVERY</p>

            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
              Premium Delivery.
              <span className="block text-amber-300">Instant Impact.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-300">
              Plug-and-play AI business operating systems. Delivered instantly. Built to scale.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-5">
                <p className="text-sm font-semibold text-amber-300">Instant Access</p>
                <p className="mt-2 text-sm text-neutral-400">Download immediately</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-5">
                <p className="text-sm font-semibold text-amber-300">Proven Systems</p>
                <p className="mt-2 text-sm text-neutral-400">Ready to deploy</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-5">
                <p className="text-sm font-semibold text-amber-300">Elite Quality</p>
                <p className="mt-2 text-sm text-neutral-400">Built for scale</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative h-[520px] w-[340px] rounded-[2rem] border border-amber-300/30 bg-gradient-to-b from-[#1a1a1d] to-black p-10 shadow-[0_0_80px_rgba(251,191,36,0.25)]">
              <div className="absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-amber-300/30 blur-3xl" />

              <div className="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/10 bg-black/60 p-8">
                <div>
                  <p className="text-5xl text-amber-300">△</p>
                </div>

                <div>
                  <h2 className="text-4xl font-bold tracking-wide text-amber-300">AIKAGAN</h2>
                  <p className="mt-4 text-xl uppercase tracking-[0.2em] text-amber-200">Golden Delivery</p>
                </div>

                <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">AI Business Systems Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Our Product Line</p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Choose Your Golden Delivery Pack</h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {products.map((product, index) => (
            <div key={product.slug} className={`rounded-3xl border p-8 ${index === 1 ? "border-amber-300 bg-[#111827] shadow-[0_0_40px_rgba(251,191,36,0.12)]" : "border-white/10 bg-[#0d1119]"}`}>
              <div className="mb-6 inline-flex rounded-full bg-amber-300 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
                {product.tag}
              </div>

              <h3 className="text-3xl font-semibold">{product.name}</h3>
              <p className="mt-3 text-neutral-400">{product.description}</p>
              <p className="mt-8 text-5xl font-bold text-amber-300">{product.price}</p>

              <ul className="mt-8 space-y-4 text-sm text-neutral-300">
                {product.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1 text-amber-300">✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/products/${product.slug}`} className="mt-10 flex items-center justify-center rounded-2xl bg-amber-300 px-6 py-4 text-sm font-semibold text-black transition hover:bg-amber-200">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-20 md:grid-cols-4">
        {trustBadges.map((badge) => (
          <div key={badge.title} className="rounded-2xl border border-white/10 bg-[#0d1119] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">{badge.title}</p>
            <p className="mt-3 text-sm text-neutral-400">{badge.description}</p>
          </div>
        ))}
      </section>

      <section className="border-y border-white/10 bg-[#0b0f17]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-20 text-center lg:flex-row lg:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Ready to Transform Your Business?</p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">Join entrepreneurs deploying AI automation systems.</h2>
            <p className="mt-5 max-w-2xl text-lg text-neutral-400">Install conversion-ready AI business operations with instant delivery workflows and scalable execution systems.</p>
          </div>

          <div className="flex gap-4">
            <Link href="/products" className="rounded-2xl bg-amber-300 px-7 py-4 font-semibold text-black">Browse All Products</Link>
            <Link href="/about" className="rounded-2xl border border-white/10 px-7 py-4 font-semibold text-white">Learn More</Link>
          </div>
        </div>
      </section>

      <footer className="bg-black">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-3xl font-semibold tracking-[0.2em] text-amber-300">AIKAGAN</p>
            <p className="mt-4 max-w-md text-neutral-400">AIKAGAN is a premium AI infrastructure, productization, checkout, and Golden Delivery system.</p>
          </div>

          <div>
            <p className="font-semibold text-white">Products</p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>Golden Delivery Starter</li>
              <li>Golden Delivery Pro</li>
              <li>Golden Delivery Commander</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li>About AIKAGAN</li>
              <li>Our Mission</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Stay Connected</p>

            <div className="mt-5 flex overflow-hidden rounded-xl border border-white/10 bg-[#111827]">
              <input type="email" placeholder="Enter your email" className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none" />
              <button className="bg-amber-300 px-5 text-black">→</button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm text-neutral-500">
          © 2026 AIKAGAN. The Kaganate · Building the Future with AI.
        </div>
      </footer>
    </main>
  );
}
