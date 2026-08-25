"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";

function CheckoutContent() {
  const [ptxn, setPtxn] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "completed">("loading");
  const [seconds, setSeconds] = useState(0);
  const [errorDetail, setErrorDetail] = useState("");
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("_ptxn");
    if (!token) { window.location.replace("https://aikagan.com/products/"); return; }
    setPtxn(token);

    let mounted = true;
    let opened = false;
    const start = Date.now();

    const onComplete = () => {
      if (!mounted) return;
      setStatus("completed");
      window.location.replace(`/checkout-success?transaction_id=${encodeURIComponent(token)}`);
    };
    const onError = (event: Event) => {
      if (!mounted) return;
      const detail = (event as CustomEvent)?.detail;
      setErrorDetail(detail?.detail || detail?.code || "The payment provider could not open this transaction.");
      setStatus("error");
    };
    window.addEventListener("checkout.completed", onComplete);
    window.addEventListener("checkout.error", onError);

    const checkPaddle = setInterval(() => {
      if (!mounted) return;
      setSeconds(Math.floor((Date.now() - start) / 1000));
      const Paddle = (window as any).Paddle;
      if (!opened && Paddle?.Checkout?.open) {
        opened = true;
        clearInterval(checkPaddle);
        setStatus("ready");
        try {
          Paddle.Checkout.open({
            transactionId: token,
            settings: {
              displayMode: "overlay",
              theme: "dark",
              variant: "one-page",
              successUrl: `${window.location.origin}/checkout-success?transaction_id=${encodeURIComponent(token)}`,
            },
          });
        } catch (e) {
          setErrorDetail(e instanceof Error ? e.message : "Checkout initialization failed.");
          setStatus("error");
        }
      }
    }, 200);

    const timeout = setTimeout(() => {
      clearInterval(checkPaddle);
      if (mounted && !opened) {
        setErrorDetail("Paddle.js did not become ready within 10 seconds.");
        setStatus("error");
      }
    }, 10000);

    return () => {
      mounted = false;
      clearInterval(checkPaddle);
      clearTimeout(timeout);
      window.removeEventListener("checkout.completed", onComplete);
      window.removeEventListener("checkout.error", onError);
    };
  }, []);

  if (!ptxn) return <div className="min-h-screen bg-[#08080a]" />;

  async function handleDeliveryUpdates(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailState("saving");
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), slug: "checkout-delivery-updates", note: `delivery_updates_requested ptxn=${ptxn}` }) });
      if (!res.ok) throw new Error("Request failed");
      setEmailState("saved");
    } catch { setEmailState("error"); }
  }

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-6 py-12">
      {(status === "loading" || status === "ready") && <div className="w-full max-w-lg rounded-2xl border border-amber-300/20 bg-[#111319] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300/90">Secure checkout</p><h1 className="mt-2 text-2xl font-extrabold text-white">Finalizing your payment session</h1><p className="mt-2 text-sm text-neutral-300">Your hosted payment window should open automatically. AIKAGAN never receives your card details.</p>
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4"><div className="animate-spin h-10 w-10 border-2 border-amber-300 border-t-transparent rounded-full" /><div><p className="text-sm font-semibold text-amber-200">{status === "ready" ? "Secure checkout opened" : "Preparing secure checkout…"}</p><p className="text-xs text-neutral-400">Elapsed: {seconds}s</p></div></div>
        <p className="mt-5 text-xs text-neutral-500">If the provider blocks the checkout, this page will show the failure and preserve a fallback path instead of leaving you stuck.</p>
      </div>}

      {status === "error" && <div className="w-full max-w-lg rounded-2xl border border-red-400/25 bg-[#111319] p-8 text-center">
        <div className="text-red-400 text-4xl mb-4">⚠</div><h2 className="text-xl font-bold text-white mb-2">Hosted checkout could not open</h2><p className="text-neutral-300 mb-2">Your purchase has not been charged.</p>{errorDetail && <p className="rounded-lg bg-red-400/10 p-3 text-xs text-red-200 mb-5">{errorDetail}</p>}
        <div className="flex flex-col gap-3"><button onClick={() => window.location.reload()} className="inline-flex justify-center rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black hover:bg-amber-200">Retry secure checkout</button><Link href="/checkout/manual" className="inline-flex justify-center rounded-xl border border-amber-300/30 bg-amber-300/10 px-6 py-3 font-semibold text-amber-200 hover:bg-amber-300/20">Continue with payment fallback</Link><Link href="https://aikagan.com/products/" className="inline-flex justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5">Choose another offer</Link></div>
        <form onSubmit={handleDeliveryUpdates} className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-left"><p className="text-xs font-semibold text-neutral-200">Send me checkout/delivery help</p><div className="mt-2 flex flex-col sm:flex-row gap-2"><input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@company.com" className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-neutral-500"/><button type="submit" disabled={emailState === "saving"} className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">{emailState === "saving" ? "Saving…" : "Get help"}</button></div>{emailState === "saved" && <p className="mt-2 text-xs text-green-400">Saved. We&apos;ll use this address for checkout support.</p>}{emailState === "error" && <p className="mt-2 text-xs text-red-400">Could not save right now. Email hello@aikagan.com.</p>}</form>
      </div>}
    </div>
  );
}

export default function CheckoutPage() { return <Suspense fallback={<div className="min-h-screen bg-[#08080a]"/>}><CheckoutContent /></Suspense>; }
