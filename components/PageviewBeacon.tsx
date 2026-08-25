"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PageviewBeacon() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    void fetch("/api/income/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "pageview", path }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
