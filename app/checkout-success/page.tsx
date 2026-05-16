"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { products } from "@/lib/products";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const selected =
    products.find((product) => product.slug === searchParams.get("product")) ||
    products[0];

  return (
    <main className="min-h-screen bg-[#08080a] px-6 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
          Checkout Complete
        </p>

        <h1 className="mt-4 text-5xl font-bold md:text-7xl">
          Your Golden Delivery pack is ready.
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-neutral-300">
          Download your pack below. Save the ZIP locally, then open the included
          start-here file for the execution sequence.
        </p>

        <div className="mt-10 rounded-3xl border border-amber-300/20 bg-[#111827] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
            {selected.tier}
          </p>

          <h2 className="mt-3 text-3xl font-semibold">{selected.name}</h2>

          <p className="mt-4 text-neutral-300">{selected.description}</p>

          <a
            href={selected.downloadUrl}
            download
            className="mt-8 inline-flex rounded-2xl bg-amber-300 px-7 py-4 font-semibold text-black hover:bg-amber-200"
          >
            Download ZIP Pack
          </a>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-8">
          <h2 className="text-2xl font-semibold">Customer success handoff</h2>
          <ol className="mt-5 space-y-3 text-neutral-300">
            <li>1. Download and unzip the pack.</li>
            <li>2. Open the Start Here file.</li>
            <li>3. Follow the setup checklist.</li>
            <li>4. Contact support if delivery access fails.</li>
          </ol>
        </div>

        <Link href="/" className="mt-10 inline-block text-sm text-neutral-400">
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
