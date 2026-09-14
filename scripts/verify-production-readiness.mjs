const baseUrl = process.env.PRODUCTION_URL || process.argv[2];
const adminSecret = process.env.ADMIN_SECRET || process.env.PRODUCTION_ADMIN_SECRET;

if (!baseUrl) {
  console.error("Set PRODUCTION_URL or pass the deployment URL as the first argument.");
  process.exit(2);
}

const healthEndpoint = new URL("/api/health", baseUrl).toString();
const healthResponse = await fetch(healthEndpoint, {
  headers: { "user-agent": "profitos-readiness-gate/3.1" },
});
const health = await healthResponse.json().catch(() => null);

if (!healthResponse.ok || !health || health.ok !== true || health.checkout_startable !== true || health.startable_paid_offers < 1) {
  console.error("Public health/commerce gate failed.", {
    healthStatus: healthResponse.status,
    storefrontMode: health?.storefront_mode,
    checkoutStartable: health?.checkout_startable,
    startablePaidOffers: health?.startable_paid_offers,
    primaryCheckoutProvider: health?.primary_checkout_provider,
  });
  process.exit(1);
}

if (!adminSecret) {
  console.log("Public commerce verified. Protected /api/ops/status skipped — ADMIN_SECRET is not configured on this workflow.");
  console.log({
    version: health.version,
    environment: health.environment,
    checkoutProvider: health.primary_checkout_provider,
    startablePaidOffers: health.startable_paid_offers,
    commercialEvidence: health.commercial_evidence,
    protectedEvidence: "skipped",
  });
  process.exit(0);
}

const opsEndpoint = new URL("/api/ops/status", baseUrl).toString();
const headers = {
  "user-agent": "profitos-readiness-gate/3.1",
  authorization: `Bearer ${adminSecret}`,
  "x-admin-secret": adminSecret,
};
const opsResponse = await fetch(opsEndpoint, { headers });
const ops = await opsResponse.json().catch(() => null);

if (!ops || typeof ops.ready !== "boolean" || typeof ops.commerceReady !== "boolean" || ops.simulated !== false) {
  console.error("Protected operational readiness endpoint returned invalid or simulated evidence.", { status: opsResponse.status, payload: ops });
  process.exit(1);
}

if (!opsResponse.ok || ops.ready !== true || ops.commerceReady !== true) {
  console.error("Production commerce configuration is blocked.", {
    healthStatus: healthResponse.status,
    storefrontMode: health.storefront_mode,
    checkoutStartable: health.checkout_startable,
    startablePaidOffers: health.startable_paid_offers,
    primaryCheckoutProvider: health.primary_checkout_provider,
    opsStatus: opsResponse.status,
    blockers: ops?.blockers ?? [],
  });
  process.exit(1);
}

console.log("Production commerce configuration verified. External payment, delivery and acceptance remain separate evidence gates.", {
  version: health.version,
  environment: health.environment,
  checkoutProvider: health.primary_checkout_provider ?? ops?.architecture?.defaultCheckoutProvider ?? null,
  startablePaidOffers: health.startable_paid_offers,
  commercialEvidence: health.commercial_evidence,
  simulated: ops.simulated,
});
