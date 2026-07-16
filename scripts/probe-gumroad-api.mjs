import fs from "node:fs";

const envFile = process.argv[2] || ".env.production.local";
const raw = fs.readFileSync(envFile, "utf8");
const env = Object.fromEntries(
  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1).replace(/^['\"]|['\"]$/g, "")];
    }),
);

const token = env.GUMROAD_ACCESS_TOKEN;
if (!token) {
  console.error("GUMROAD_ACCESS_TOKEN is not available in the pulled environment.");
  process.exit(1);
}

const probes = [
  ["user", "https://api.gumroad.com/v2/user"],
  ["products", "https://api.gumroad.com/v2/products"],
  ["resource_subscriptions", "https://api.gumroad.com/v2/resource_subscriptions"],
];

let failed = false;
for (const [name, base] of probes) {
  const url = new URL(base);
  url.searchParams.set("access_token", token);
  const response = await fetch(url, {
    headers: { "user-agent": "AIKAGAN-Gumroad-capability-probe/1.0" },
    signal: AbortSignal.timeout(15000),
  });
  const body = await response.json().catch(() => null);
  const keys = body && typeof body === "object" ? Object.keys(body).sort() : [];
  console.log(JSON.stringify({ name, status: response.status, ok: response.ok, keys }));
  if (!response.ok) failed = true;
}

if (failed) process.exit(1);
console.log("Gumroad API capability probe passed without modifying account state.");
