import fs from "node:fs";

const envFile = process.argv[2] || ".env.production.local";
const outputFile = process.argv[3] || "gumroad-capability.jsonl";
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
  fs.writeFileSync(outputFile, `${JSON.stringify({ error: "GUMROAD_ACCESS_TOKEN missing" })}\n`);
  console.error("GUMROAD_ACCESS_TOKEN is not available in the pulled environment.");
  process.exit(1);
}

const probes = [
  ["user", "https://api.gumroad.com/v2/user"],
  ["products", "https://api.gumroad.com/v2/products"],
  ["resource_subscriptions", "https://api.gumroad.com/v2/resource_subscriptions"],
];

const rows = [];
async function request(base, mode) {
  const url = new URL(base);
  const headers = { "user-agent": "AIKAGAN-Gumroad-capability-probe/1.0" };
  if (mode === "query") url.searchParams.set("access_token", token);
  else headers.authorization = `Bearer ${token}`;
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  const body = await response.json().catch(() => null);
  return {
    status: response.status,
    ok: response.ok,
    keys: body && typeof body === "object" ? Object.keys(body).sort() : [],
  };
}

for (const [name, base] of probes) {
  let mode = "bearer";
  let result = await request(base, mode);
  if (result.status === 401 || result.status === 403) {
    mode = "query";
    result = await request(base, mode);
  }
  const row = { name, mode, ...result };
  rows.push(row);
  console.log(JSON.stringify(row));
}

fs.writeFileSync(outputFile, rows.map((row) => JSON.stringify(row)).join("\n") + "\n");

const identityOk = rows.find((row) => row.name === "user")?.ok;
const productsOk = rows.find((row) => row.name === "products")?.ok;
if (!identityOk || !productsOk) {
  console.error("Gumroad access token could not read the authenticated user and products endpoints.");
  process.exit(1);
}

console.log("Gumroad identity and product capabilities passed. Subscription capability is recorded separately.");
