"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const ptxn = searchParams.get("_ptxn");
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "completed">("loading");
  const [seconds, setSeconds] = useState(0);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!ptxn) {
      // No _ptxn parameter — redirect to products
      window.location.href = "/products";
      return;
    }

    let mounted = true;
    const start = Date.now();

    // Wait for Paddle.js to be ready
    const checkPaddle = setInterval(() => {
      if (!mounted) return;
      setSeconds(Math.floor((Date.now() - start) / 1000));

      if ((window as any).Paddle?.Checkout) {
        clearInterval(checkPaddle);
        setStatus("ready");

        // Open the checkout
        try {
          (window as any).Paddle.Checkout.open({
            transactionId: ptxn,
          });

          // Listen for completion
          const onComplete = () => {
            window.removeEventListener("checkout.completed", onComplete);
            setStatus("completed");
            window.location.href = `/checkout-success?transaction_id=${ptxn}`;
          };
          window.addEventListener("checkout.completed", onComplete);
        } catch (e) {
          setStatus("error");
        }
      }
    }, 200);

    // Timeout after 10s
    const timeout = setTimeout(() => {
      clearInterval(checkPaddle);
      if (mounted) {
        setStatus("error");
      }
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(checkPaddle);
      clearTimeout(timeout);
    };
  }, [ptxn]);

  if (!ptxn) return null;

  async function handleDeliveryUpdates(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailState("saving");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          slug: "checkout-delivery-updates",
          note: `delivery_updates_requested ptxn=${ptxn}`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setEmailState("saved");
    } catch {
      setEmailState("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-6">
      {(status === "loading" || status === "ready") && (
        <div className="w-full max-w-lg rounded-2xl border border-amber-300/20 bg-[#111319] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300/90">Secure checkout</p>
          <h1 className="mt-2 text-2xl font-extrabold text-white">Finalizing your payment session</h1>
          <p className="mt-2 text-sm text-neutral-300">
            We are opening the hosted checkout window so your purchase can complete safely.
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="animate-spin h-10 w-10 border-2 border-amber-300 border-t-transparent rounded-full" />
            <div>
              <p className="text-sm font-semibold text-amber-200">
                {status === "ready" ? "Checkout is opening…" : "Preparing secure checkout…"}
              </p>
              <p className="text-xs text-neutral-400">Elapsed: {seconds}s</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-300">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">Card</span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">PayPal</span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">Apple/Google Pay</span>
          </div>

          <p className="mt-5 text-xs text-neutral-500">
            If the payment window does not appear in 10 seconds, use the fallback actions below.
          </p>

          <form onSubmit={handleDeliveryUpdates} className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs font-semibold text-neutral-200">Business email for delivery updates</p>
            <p className="mt-1 text-[11px] text-neutral-400">
              We&apos;ll notify you immediately if manual delivery support is needed.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
              />
              <button
                type="submit"
                disabled={emailState === "saving"}
                className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-200 disabled:opacity-60"
              >
                {emailState === "saving" ? "Saving…" : "Submit"}
              </button>
            </div>
            {emailState === "saved" && <p className="mt-2 text-xs text-green-400">Saved. We&apos;ll send delivery updates to this email.</p>}
            {emailState === "error" && <p className="mt-2 text-xs text-red-400">Could not save right now. Please try again.</p>}
          </form>
        </div>
      )}

      {status === "error" && (
        <div className="w-full max-w-lg rounded-2xl border border-red-400/25 bg-[#111319] p-8 text-center">
          <div className="text-red-400 text-4xl mb-4">⚠</div>
          <h2 className="text-xl font-bold text-white mb-2">Checkout window unavailable</h2>
          <p className="text-neutral-400 mb-6">
            We couldn&apos;t open the payment modal. You can retry now or continue via manual checkout.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex justify-center rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black hover:bg-amber-200"
            >
              Retry secure checkout
            </button>
            <Link
              href="/checkout/manual"
              className="inline-flex justify-center rounded-xl border border-amber-300/30 bg-amber-300/10 px-6 py-3 font-semibold text-amber-200 hover:bg-amber-300/20"
            >
              Use manual checkout fallback
            </Link>
            <Link
              href="/products"
              className="inline-flex justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              Back to products
            </Link>
          </div>

          <form onSubmit={handleDeliveryUpdates} className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-left">
            <p className="text-xs font-semibold text-neutral-200">Business email for delivery updates</p>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
              />
              <button
                type="submit"
                disabled={emailState === "saving"}
                className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-200 disabled:opacity-60"
              >
                {emailState === "saving" ? "Saving…" : "Submit"}
              </button>
            </div>
            {emailState === "saved" && <p className="mt-2 text-xs text-green-400">Saved. We&apos;ll send delivery updates to this email.</p>}
            {emailState === "error" && <p className="mt-2 text-xs text-red-400">Could not save right now. Please try again.</p>}
          </form>

          <p className="mt-4 text-xs text-neutral-500">
            Need help now? Email <a className="text-amber-300 hover:underline" href="mailto:hello@aikagan.com">hello@aikagan.com</a>.
          </p>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
