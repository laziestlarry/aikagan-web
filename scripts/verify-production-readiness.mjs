const baseUrl = process.env.PRODUCTION_URL || process.argv[2];

if (!baseUrl) {
  console.error("Set PRODUCTION_URL or pass the deployment URL as the first argument.");
  process.exit(2);
}

const endpoint = new URL("/api/health", baseUrl).toString();
const response = await fetch(endpoint, { headers: { "user-agent": "profitos-readiness-gate/1.0" } });
const payload = await response.json().catch(() => null);

if (!payload || typeof payload.ok !== "boolean" || typeof payload.storefront_mode !== "string") {
  console.error("Public readiness endpoint returned invalid evidence.", payload);
  process.exit(1);
}

if (!response.ok || payload.ok !== true || payload.storefront_mode !== "open") {
  console.error("Production is blocked.", { status: response.status, storefrontMode: payload.storefront_mode });
  process.exit(1);
}

console.log("Production readiness verified.", {
  version: payload.version,
  environment: payload.environment,
});
