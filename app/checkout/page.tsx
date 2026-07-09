"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const ptxn = searchParams.get("_ptxn");
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "completed">("loading");

  useEffect(() => {
    if (!ptxn) {
      // No _ptxn parameter — redirect to products
      window.location.href = "/products";
      return;
    }

    // Wait for Paddle.js to be ready
    const checkPaddle = setInterval(() => {
      if (window.Paddle?.Checkout) {
        clearInterval(checkPaddle);
        setStatus("ready");
        
        // Open the checkout
        try {
          window.Paddle.Checkout.open({
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
    setTimeout(() => {
      clearInterval(checkPaddle);
      if (status === "loading") {
        setStatus("error");
      }
    }, 10000);

    return () => clearInterval(checkPaddle);
  }, [ptxn, status]);

  if (!ptxn) return null;

  return (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
      {status === "loading" && (
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-2 border-amber-300 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-amber-200 text-sm">Preparing secure checkout...</p>
        </div>
      )}
      
      {status === "error" && (
        <div className="max-w-md text-center p-8">
          <div className="text-red-400 text-4xl mb-4">⚠</div>
          <h2 className="text-xl font-bold text-white mb-2">Checkout unavailable</h2>
          <p className="text-neutral-400 mb-4">
            We couldn't open the checkout. This might be a temporary issue.
          </p>
          <Link
            href="/products"
            className="inline-block rounded-xl bg-amber-300 px-6 py-3 font-semibold text-black hover:bg-amber-200"
          >
            Back to products
          </Link>
          <p className="mt-4 text-xs text-neutral-500">
            Or email hello@aikagan.com with your order details.
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
