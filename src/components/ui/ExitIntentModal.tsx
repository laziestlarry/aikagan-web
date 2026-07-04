"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { X, Gift, ArrowRight } from "lucide-react";
import CheckoutLink from "@/components/ui/CheckoutLink";

export default function ExitIntentModal({ 
  discountCode = "KAGANATE", 
  productName = "this toolkit",
  checkoutUrl,
  productSlug,
  price,
  fallbackHref = "/free/golden-delivery-sample",
}: { 
  discountCode?: string;
  productName?: string;
  checkoutUrl?: string;
  productSlug?: string;
  price?: number;
  fallbackHref?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only trigger once per session
    if (sessionStorage.getItem("kagan_exit_intent_shown")) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse leaves top of viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem("kagan_exit_intent_shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasTriggered]);

  if (!isOpen) return null;

  const isPaddle = checkoutUrl === "paddle";
  const canCheckout = Boolean(isPaddle && productSlug && typeof price === "number");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md bg-kagan-card border border-kagan-gold/30 rounded-xl shadow-2xl p-6 sm:p-8 overflow-hidden animate-fade-up">
        
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-kagan-gold/20 rounded-full blur-3xl pointer-events-none" />
        
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-kagan-muted hover:text-kagan-white transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-12 h-12 bg-kagan-gold/10 border border-kagan-gold/30 rounded-full flex items-center justify-center mb-4 text-kagan-gold shadow-[0_0_15px_rgba(201,146,58,0.15)]">
            <Gift className="w-6 h-6" />
          </div>
          
          <h3 className="text-2xl font-black text-kagan-white uppercase tracking-tight mb-2">
            Wait! Before You Go...
          </h3>
          
          <p className="text-sm text-kagan-light mb-6 leading-relaxed">
            I know building an online income takes real effort. As a thank you for checking out {productName}, here is a 24-hour 20% discount code to help you get started today.
          </p>

          <div 
            className="w-full bg-kagan-dark border border-dashed border-kagan-gold/50 rounded-lg p-4 mb-6 relative group cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(discountCode);
              const el = document.getElementById("exit-copied-msg");
              if (el) { el.style.display = "block"; setTimeout(() => { el.style.display = "none"; }, 1500); }
            }}
          >
            <div className="text-xs text-kagan-muted uppercase tracking-wider mb-1 font-bold">Use code at checkout:</div>
            <div className="text-2xl font-mono font-bold text-kagan-gold tracking-widest">{discountCode}</div>
            <div className="absolute inset-0 bg-kagan-gold/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-[2px]">
              <span id="exit-copied-msg" className="text-sm font-bold text-kagan-gold uppercase tracking-widest bg-kagan-dark/80 px-3 py-1 rounded" style={{display: "none"}}>
                Copied
              </span>
              <span className="text-sm font-bold text-kagan-gold uppercase tracking-widest bg-kagan-dark/80 px-3 py-1 rounded group-hover:hidden">
                Click to Copy
              </span>
            </div>
          </div>

          {canCheckout ? (
            <CheckoutLink
              href="paddle"
              productSlug={productSlug!}
              productName={productName}
              price={price!}
              className="w-full bg-kagan-gold text-black font-bold uppercase tracking-wider text-sm py-3 px-6 rounded-lg hover:bg-kagan-gold-light transition-colors inline-flex items-center justify-center gap-2"
            >
              Claim 20% Off Now
              <ArrowRight className="w-4 h-4" />
            </CheckoutLink>
          ) : (
            <Link
              href={fallbackHref}
              className="w-full bg-kagan-gold text-black font-bold uppercase tracking-wider text-sm py-3 px-6 rounded-lg hover:bg-kagan-gold-light transition-colors inline-flex items-center justify-center gap-2"
            >
              Grab the Free Sample First
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          
          <button 
            onClick={() => setIsOpen(false)}
            className="mt-4 text-xs text-kagan-muted hover:text-kagan-light transition-colors"
          >
            No thanks, I'll pay full price later
          </button>
        </div>
      </div>
    </div>
  );
}
