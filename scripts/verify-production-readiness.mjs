const baseUrl = process.env.PRODUCTION_URL || process.argv[2];
const adminSecret = process.env.ADMIN_SECRET || process.env.PRODUCTION_ADMIN_SECRET;

if (!baseUrl) {
  console.error("Set PRODUCTION_URL or pass the deployment URL as the first argument.");
  process.exit(2);
}
if (!adminSecret) {
  console.error("Set ADMIN_SECRET (or PRODUCTION_ADMIN_SECRET) so the readiness gate can inspect protected operational evidence.");
  process.exit(2);
}

const healthEndpoint = new URL("/api/health", baseUrl).toString();
const opsEndpoint = new URL("/api/ops/status", baseUrl).toString();
const headers = {
  "user-agent": "profitos-readiness-gate/3.0",
  authorization: `Bearer ${adminSecret}`,
  "x-admin-secret": adminSecret,
};

const [healthResponse, opsResponse] = await Promise.all([
  fetch(healthEndpoint, { headers }),
  fetch(opsEndpoint, { headers }),
]);
const health = await healthResponse.json().catch(() => null);
const ops = await opsResponse.json().catch(() => null);

if (!health || typeof health.ok !== "boolean" || typeof health.checkout_startable !== "boolean" || typeof health.startable_paid_offers !== "number") {
  console.error("Health endpoint returned invalid commerce evidence.", health);
  process.exit(1);
}
if (!ops || typeof ops.ready !== "boolean" || typeof ops.commerceReady !== "boolean" || ops.simulated !== false) {
  console.error("Protected operational readiness endpoint returned invalid or simulated evidence.", { status: opsResponse.status, payload: ops });
  process.exit(1);
}

if (!healthResponse.ok || health.ok !== true || health.checkout_startable !== true || health.startable_paid_offers < 1 || !opsResponse.ok || ops.ready !== true || ops.commerceReady !== true) {
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
