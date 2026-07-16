import fs from "node:fs";

const files = process.argv.slice(2);
const keys = [
  "PADDLE_API_KEY",
  "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN",
  "PADDLE_WEBHOOK_SECRET",
  "PADDLE_CHECKOUT_DISABLED",
  "LEMONSQUEEZY_API_KEY",
  "LEMONSQUEEZY_STORE_ID",
  "LEMONSQUEEZY_WEBHOOK_SECRET",
  "GUMROAD_WEBHOOK_TOKEN",
  "SHOPIER_PAT",
  "AUTONOMAX_SHOPIER_PAT",
  "SHOPIER_OSB_USERNAME",
  "AUTONOMAX_SHOPIER_OSB_USERNAME",
  "SHOPIER_OSB_PASSWORD",
  "AUTONOMAX_SHOPIER_OSB_KEY",
  "AUTONOMAX_SHOPIER_OSB_PASSWORD",
  "DOWNLOAD_TOKEN_SECRET",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "MAKE_WEBHOOK_URL",
  "MAKE_PURCHASE_WEBHOOK_URL",
  "MAKE_CUSTOMER_SERVICE_WEBHOOK_URL",
  "MAKE_OMNICHANNEL_WEBHOOK_URL",
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "META_CAPI_ACCESS_TOKEN",
];

function parse(file) {
  if (!fs.existsSync(file)) return {};
  const entries = {};
  for (const rawLine of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    value = value.replace(/^['\"]|['\"]$/g, "");
    entries[key] = value;
  }
  return entries;
}

for (const file of files) {
  const values = parse(file);
  const configured = Object.fromEntries(keys.map((key) => [key, Boolean(values[key])]));
  console.log(JSON.stringify({ file, configured }));
}
