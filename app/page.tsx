import Link from "next/link";
import { products } from "@/lib/products";

const productStyles: Record<string, any> = {
  starter: {
    accent: "border-emerald-400/40",
    glow: "shadow-emerald-400/10",
    badge: "bg-emerald-400/15 text-emerald-300 border-emerald-300/30",
  },
  pro: {
    accent: "border-amber-300/60",
    glow: "shadow-amber-300/20",
    badge: "bg-amber-300 text-black border-amber-200",
    ribbon: "MOST POPULAR",
  },
  commander: {
    accent: "border-purple-400/50",
    glow: "shadow-purple-400/20",
    badge: "bg-purple-400/15 text-purple-300 border-purple-300/30",
  },
};

const features = [
  ["Instant Access", "Download Immediately"],
  ["Proven Systems", "Ready to Deploy"],
  ["Elite Quality", "Built for Scale"],
];

const trust = [
  "30-Day Guarantee",
  "Instant Download",
  "Secure & Private",
  "Elite Support",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#08080a]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-black tracking-[0.25em] text-amber-300">
            AIKAGAN
          </Link>

          <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
            {["Home", "Products", "About", "Blog", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="transition hover:text-amber-300"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button aria-label="Search" className="rounded-full border border-white/10 px-3 py-2 text-zinc-300 hover:text-amber-300">
              ⌕
            </button>
            <Link href="/cart" aria-label="Cart" className="rounded-full border border-white/10 px-3 py-2 text-zinc-300 hover:text-amber-300">
              🛒
            </Link>
            <Link href="/account" className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-black hover:bg-amber-200">
              My Account
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_75%_20%,rgba(245,197,66,0.22),transparent_32%),linear-gradient(135deg,#08080a,#0d1119_50%,#111827)]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:py-32">
          <div>
            <p className="mb-5 text-sm font-bold tracking-[0.35em] text-amber-300">
              AIKAGAN GOLDEN DELIVERY
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Premium Delivery.{" "}
              <span className="text-amber-300">Instant Impact.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-300">
              Plug-and-play AI business operating systems. Delivered instantly.
              Built to scale.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {features.map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
                  <div className="mb-3 h-2 w-10 rounded-full bg-amber-300" />
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/products" className="rounded-full bg-amber-300 px-7 py-4 font-black text-black hover:bg-amber-200">
                Browse Products
              </Link>
              <Link href="/about" className="rounded-full border border-amber-300/40 px-7 py-4 font-bold text-amber-200 hover:bg-amber-300/10">
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-80 w-80 rounded-full border border-amber-300/30 bg-amber-300/10 blur-2xl" />
            <div className="relative w-full max-w-md rotate-3 rounded-[2rem] border border-amber-300/40 bg-gradient-to-br from-[#1b1b1d] via-[#0d1119] to-black p-8 shadow-2xl shadow-amber-300/20">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-8">
                <p className="text-sm font-bold tracking-[0.3em] text-amber-300">
                  GOLDEN DELIVERY
                </p>
                <h2 className="mt-6 text-4xl font-black">
                  AI Business OS
                </h2>
                <p className="mt-4 text-zinc-300">
                  Templates. SOPs. Automations. Delivery assets. Scale-ready execution.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                  {["SOP", "Prompts", "Funnels", "Delivery"].map((x) => (
                    <div key={x} className="rounded-xl bg-amber-300/10 px-4 py-3 text-amber-200">
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm font-bold tracking-[0.3em] text-amber-300">
            PRODUCT LINE
          </p>
          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Choose Your Golden Delivery Pack
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product: any) => {
            const style = productStyles[product.slug] ?? productStyles.starter;

            return (
              <article
                key={product.slug}
                className={`relative rounded-[2rem] border ${style.accent} bg-[#0d1119] p-7 shadow-2xl ${style.glow}`}
              >
                {style.ribbon && (
                  <div className="absolute right-6 top-6 rounded-full bg-amber-300 px-4 py-1 text-xs font-black text-black">
                    {style.ribbon}
                  </div>
                )}

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                  ✦
                </div>

                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${style.badge}`}>
                  {product.tier ?? product.name}
                </span>

                <h3 className="mt-5 text-3xl font-black">{product.name}</h3>
                <p className="mt-2 text-4xl font-black text-amber-300">
                  ${product.price}
                </p>

                <p className="mt-4 min-h-16 text-zinc-400">
                  {product.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                  {(product.bullets ?? product.features ?? []).slice(0, 5).map((item: string) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-amber-300">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/products/${product.slug}`}
                  className="mt-8 inline-flex w-full justify-center rounded-full border border-amber-300/50 px-5 py-3 font-black text-amber-200 hover:bg-amber-300 hover:text-black"
                >
                  View Details
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#111827]">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center font-bold text-zinc-200">
              <span className="mr-2 text-amber-300">◆</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-300/15 via-[#111827] to-black p-10 text-center shadow-2xl shadow-amber-300/10 md:p-16">
          <h2 className="text-4xl font-black md:text-5xl">
            Ready to Transform Your Business?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-zinc-300">
            Start with a proven Golden Delivery pack and move from scattered ideas to deployable AI infrastructure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/products" className="rounded-full bg-amber-300 px-7 py-4 font-black text-black hover:bg-amber-200">
              Browse All Products
            </Link>
            <Link href="/about" className="rounded-full border border-white/15 px-7 py-4 font-bold text-white hover:border-amber-300/50">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black tracking-[0.25em] text-amber-300">
              AIKAGAN
            </h3>
            <p className="mt-4 max-w-md text-zinc-400">
              Premium AI infrastructure, e-commerce conversion systems, productized services, and Golden Delivery packs for serious operators.
            </p>

            <form className="mt-6 flex max-w-md gap-3">
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-zinc-500"
              />
              <button className="rounded-full bg-amber-300 px-5 py-3 font-black text-black">
                Join
              </button>
            </form>
          </div>

          {[
            ["Products", ["Starter", "Pro", "Commander"]],
            ["Company", ["About", "Blog", "Contact"]],
            ["Support", ["Refund Policy", "Legal", "Help"]],
          ].map(([title, links]) => (
            <div key={title as string}>
              <h4 className="font-black text-white">{title}</h4>
              <div className="mt-4 space-y-3 text-sm text-zinc-400">
                {(links as string[]).map((link) => (
                  <Link
                    key={link}
                    href={
                      link === "Refund Policy"
                        ? "/legal/refund"
                        : `/${link.toLowerCase().replaceAll(" ", "-")}`
                    }
                    className="block hover:text-amber-300"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
          © 2026 AIKAGAN. All rights reserved.
        </div>
      </footer>
    </main>
  );
}