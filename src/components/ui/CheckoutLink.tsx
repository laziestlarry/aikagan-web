"use client";

import React from "react";

interface CheckoutLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  productSlug: string;
  productName: string;
  price: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export default function CheckoutLink({
  productSlug,
  productName,
  price,
  children,
  onClick,
  ...rest
}: CheckoutLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Push GTM begin_checkout event
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "USD",
          value: price,
          items: [
            {
              item_id: productSlug,
              item_name: productName,
              price: price,
              quantity: 1,
            },
          ],
        },
      });
    }
    onClick?.(e);
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...rest}
      className={`lemonsqueezy-button${rest.className ? ` ${rest.className}` : ""}`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
