import Link from "next/link";

export const metadata = {
  title: "AIKAGAN | The Kaganate",
  description:
    "AIKAGAN is a premium AI infrastructure, productization, checkout, and Golden Delivery system.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-300">
          AIKAGAN · The Kaganate
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-7xl">
          AI infrastructure for productized digital revenue systems.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
          AIKAGAN installs practical business execution flows: productization,
          checkout, customer delivery, automation handoffs, and Golden Delivery
          operating systems.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/products/golden-delivery-starter"
            className="rounded-full bg-amber-300 px-7 py-4 text-sm font-semibold text-black transition hover:bg-amber-200"
          >
            Start with Golden Delivery
          </Link>

          <Link
            href="/thank-you"
            className="rounded-full border border-white/15 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Customer Download Area
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-amber-300">
          Downloadable Systems
        </p>

        <h2 className="max-w-4xl text-3xl font-semibold text-white md:text-5xl">
          Install the first customer checkout and delivery loop.
        </h2>

        <p className="mt-5 max-w-2xl text-neutral-300">
          Start with a productized AI execution pack. Each pack supports the core
          journey: offer, checkout, customer handoff, download, and next-step
          revenue workflow.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            href="/products/golden-delivery-starter"
            className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10"
          >
            <p className="text-sm text-amber-300">Starter · $29</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Golden Delivery Starter
            </h3>
            <p className="mt-3 text-neutral-300">
              First-sale workflow, checklist, and starter delivery pack.
            </p>
            <p className="mt-6 text-amber-300">View product →</p>
          </Link>

          <Link
            href="/products/golden-delivery-pro"
            className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10"
          >
            <p className="text-sm text-amber-300">Pro · $79</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Golden Delivery Pro
            </h3>
            <p className="mt-3 text-neutral-300">
              Offer templates, workflow templates, funnel structure, and traffic
              playbook.
            </p>
            <p className="mt-6 text-amber-300">View product →</p>
          </Link>

          <Link
            href="/products/golden-delivery-commander"
            className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10"
          >
            <p className="text-sm text-amber-300">Commander · $149</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Golden Delivery Commander
            </h3>
            <p className="mt-3 text-neutral-300">
              System map, revenue paths, automation logic, and scaling strategy.
            </p>
            <p className="mt-6 text-amber-300">View product →</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-300">
            Customer Flow
          </p>

          <h2 className="mt-4 text-3xl font-semibold">
            Offer → checkout → delivery → continuation.
          </h2>

          <p className="mt-4 max-w-3xl text-neutral-300">
            This first live version establishes the customer-facing route.
            Checkout links can now be connected from Shopier, Lemon Squeezy,
            Shopify, Payhip, Gumroad, or another provider.
          </p>
        </div>
      </section>
    </main>
  );
}
