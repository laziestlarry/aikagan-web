import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sitemap = readFileSync(resolve(root, '.next/server/app/sitemap.xml.body'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const failures = [];

function metadata(html, pattern) {
  return html.match(pattern)?.[1]?.replaceAll('&amp;', '&') ?? null;
}

for (const url of urls) {
  const parsed = new URL(url);
  if (parsed.origin !== 'https://aikagan.com') failures.push(`${url}: non-canonical host`);
  if (parsed.search) failures.push(`${url}: sitemap URL has a query string`);
  if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) failures.push(`${url}: trailing slash`);

  const relative = parsed.pathname === '/' ? 'index' : parsed.pathname.slice(1);
  const htmlPath = resolve(root, `.next/server/app/${relative}.html`);
  let html;
  try {
    html = readFileSync(htmlPath, 'utf8');
  } catch {
    failures.push(`${url}: missing prerendered HTML at ${htmlPath}`);
    continue;
  }

  const title = metadata(html, /<title>([^<]+)<\/title>/);
  const description = metadata(html, /<meta name="description" content="([^"]+)"/);
  const canonical = metadata(html, /<link rel="canonical" href="([^"]+)"/);
  const openGraphUrl = metadata(html, /<meta property="og:url" content="([^"]+)"/);

  if (canonical !== url) failures.push(`${url}: canonical is ${canonical}`);
  if (openGraphUrl !== url) failures.push(`${url}: og:url is ${openGraphUrl}`);
  if (!title || title.length > 65) failures.push(`${url}: title length is ${title?.length ?? 0}`);
  if (!description || description.length < 100 || description.length > 160) {
    failures.push(`${url}: description length is ${description?.length ?? 0}`);
  }
  if (title?.includes('| AutonomaX Profit OS | AutonomaX Profit OS')) {
    failures.push(`${url}: duplicate title suffix`);
  }
}

const sourceFiles = [
  'app/page.tsx',
  'app/tools/page.tsx',
  'src/components/layout/Navbar.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/shared/ProductCard.tsx',
  'src/components/shared/ServiceCard.tsx',
];
for (const file of sourceFiles) {
  const source = readFileSync(resolve(root, file), 'utf8');
  const redirectingHref = source.match(/(?:href=|href:)\s*["'`]([^"'`?#]+\/)['"`]/);
  if (redirectingHref && redirectingHref[1] !== '/') {
    failures.push(`${file}: redirecting internal href ${redirectingHref[1]}`);
  }
}

if (failures.length) {
  console.error(`SEO verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`SEO verification passed for ${urls.length} canonical sitemap URLs.`);
