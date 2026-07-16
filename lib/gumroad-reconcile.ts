import { listGumroadSales } from "./gumroad-api";
import { processVerifiedGumroadSale } from "./gumroad-fulfillment";

export async function reconcileRecentGumroadSales(days = 7): Promise<{
  ok: boolean;
  scanned: number;
  fulfilled: number;
  deduped: number;
  ignored: number;
  failed: number;
  detail?: string;
}> {
  const after = new Date(Date.now() - Math.max(1, days) * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  let pageKey: string | undefined;
  let scanned = 0;
  let fulfilled = 0;
  let deduped = 0;
  let ignored = 0;
  let failed = 0;

  for (let page = 0; page < 10; page += 1) {
    const listed = await listGumroadSales({ after, pageKey });
    if (!listed.ok) {
      return { ok: false, scanned, fulfilled, deduped, ignored, failed, detail: listed.detail };
    }

    for (const sale of listed.sales) {
      scanned += 1;
      const result = await processVerifiedGumroadSale(sale, { source: "gumroad_reconcile" });
      if (!result.ok) failed += 1;
      else if (result.dedup) deduped += 1;
      else if (result.ignored) ignored += 1;
      else fulfilled += 1;
    }

    if (!listed.nextPageKey) break;
    pageKey = listed.nextPageKey;
  }

  return { ok: failed === 0, scanned, fulfilled, deduped, ignored, failed };
}
