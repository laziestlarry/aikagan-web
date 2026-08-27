'use client';

import type { MouseEvent } from 'react';

declare global {
  interface Window { dataLayer?: unknown[]; }
}

export default function MarketCheckoutLink({ href, sku, title, priceTry, cta, className }: { href:string; sku:string; title:string; priceTry:number; cta:string; className?:string }) {
  function handleClick(_event: MouseEvent<HTMLAnchorElement>) {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'TRY',
        value: priceTry,
        items: [{ item_id: sku, item_name: title, price: priceTry, quantity: 1 }],
      },
      checkout_provider: 'shopier',
      market: 'TR',
    });
  }

  return <a href={href} onClick={handleClick} className={className} rel="noopener noreferrer">{cta}</a>;
}
