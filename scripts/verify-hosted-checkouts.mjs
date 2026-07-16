const checkouts = [
  ["masterclass-starter", "https://nomadauto.gumroad.com/l/autonomax-starter-29"],
  ["masterclass-pro", "https://nomadauto.gumroad.com/l/autonomax-pro-79"],
  ["masterclass-commander", "https://nomadauto.gumroad.com/l/autonomax-commander-149"],
];

let failed = false;

for (const [slug, url] of checkouts) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "AIKAGAN-checkout-smoke/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    const finalUrl = new URL(response.url);
    const validHost = finalUrl.hostname.endsWith("gumroad.com");
    const validStatus = response.status >= 200 && response.status < 400;

    console.log(JSON.stringify({ slug, status: response.status, finalUrl: response.url, validHost }));

    if (!validStatus || !validHost) failed = true;
  } catch (error) {
    failed = true;
    console.error(JSON.stringify({ slug, error: error instanceof Error ? error.message : String(error) }));
  }
}

if (failed) process.exit(1);
console.log("All hosted Gumroad checkout pages resolved successfully.");
