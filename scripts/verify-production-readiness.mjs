const baseUrl = process.env.PRODUCTION_URL || process.argv[2];

if (!baseUrl) {
  console.error("Set PRODUCTION_URL or pass the deployment URL as the first argument.");
  process.exit(2);
}

const endpoint = new URL("/api/ops/status", baseUrl).toString();
const response = await fetch(endpoint, { headers: { "user-agent": "profitos-readiness-gate/1.0" } });
const payload = await response.json().catch(() => null);

if (!payload || payload.simulated !== false) {
  console.error("Readiness endpoint returned invalid or simulated evidence.", payload);
  process.exit(1);
}

if (!response.ok || payload.ready !== true) {
  console.error("Production is blocked.", { status: response.status, blockers: payload.blockers });
  process.exit(1);
}

console.log("Production readiness verified.", {
  service: payload.service,
  checkedAt: payload.checkedAt,
  paidProducts: payload.products?.paid,
});
