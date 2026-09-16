import { spawn } from 'node:child_process';
import http from 'node:http';

const port = 3197;
const origin = `http://127.0.0.1:${port}`;
const routes = [
  '/tr', '/tr/start-free', '/tr/tools', '/tr/tools/revenue-leak-scan',
  '/tr/free/golden-delivery-sample', '/tr/outcome', '/tr/outcome/intake',
  '/tr/products', '/tr/products/masterclass-starter', '/tr/products/masterclass-pro',
  '/tr/products/masterclass-commander', '/tr/services', '/tr/flight', '/tr/genesis',
  '/tr/network', '/tr/feedback', '/tr/about', '/tr/contact',
  '/tr/legal/privacy', '/tr/legal/terms', '/tr/legal/refund',
];
const failures = [];
let firstHtml = '';
let sitemap = '';
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '';
child.stdout.on('data', chunk => { logs += chunk; });
child.stderr.on('data', chunk => { logs += chunk; });

async function waitUntilReady() {
  for (let i = 0; i < 40; i++) {
    try { const res = await request('/tr'); if (res.status === 200) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`local server did not become ready\n${logs}`);
}

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path, method: 'GET', headers: { Host: 'aikagan.com', 'Accept-Language': 'tr-TR,tr;q=0.9' } }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString('utf8'), headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

function value(html, re) { return html.match(re)?.[1]?.replaceAll('&amp;', '&') ?? ''; }

try {
  await waitUntilReady();
  for (const route of routes) {
    const res = await request(route);
    const html = res.body;
    if (!firstHtml) firstHtml = html;
    if (res.status !== 200) failures.push(`${route}: status ${res.status}`);
    if (!html.includes('<html lang="tr"')) failures.push(`${route}: html language is not tr`);
    const canonical = value(html, /<link rel="canonical" href="([^"]+)"/);
    const title = value(html, /<title>([^<]+)<\/title>/);
    const description = value(html, /<meta name="description" content="([^"]+)"/);
    if (canonical !== `https://aikagan.com${route}`) failures.push(`${route}: canonical ${canonical || 'missing'}`);
    if (!html.includes('hrefLang="tr-TR"') || !html.includes('hrefLang="en"')) failures.push(`${route}: missing bilingual hreflang`);
    if (!title || title.length > 75) failures.push(`${route}: invalid title length ${title.length}`);
    if (!description || description.length < 60 || description.length > 180) failures.push(`${route}: invalid description length ${description.length}`);
    if (!html.includes('application/ld+json') || !html.includes('AIKAGAN Türkiye')) failures.push(`${route}: Turkish structured data missing`);
    if (/Gelir Kaçağı|gelir kaçağı|nerede kaçıyor/.test(html)) failures.push(`${route}: ambiguous Turkish leak wording remains`);
    if (/hello@aikagan\.com|kagan@kagandolek\.com/.test(html)) failures.push(`${route}: obsolete contact identity remains`);
    const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'));
    for (const href of hrefs) {
      if (/^https:\/\/(?:www\.)?aikagan\.com\//.test(href)) {
        const url = new URL(href);
        if (!url.pathname.startsWith('/tr') && url.searchParams.get('lang') !== 'en' && !url.pathname.startsWith('/api/')) failures.push(`${route}: Turkish page links to English route ${href}`);
      }
      if (href.startsWith('/') && !href.startsWith('/tr') && !href.startsWith('/api/') && !href.startsWith('/_next/') && !href.startsWith('/free-assets/') && href !== '/') failures.push(`${route}: Turkish page links to non-Turkish route ${href}`);
    }
  }
  const contentChecks = [
    ['/tr/products/masterclass-starter', 'İş Kararı Başlangıç Paketi'],
    ['/tr/products/masterclass-pro', 'Gelir Sistemi Pro Paketi'],
    ['/tr/products/masterclass-commander', 'İşletme Sistemi Üst Paket'],
    ['/tr/contact', 'Bugünkü durumu anlatın'],
    ['/tr/outcome/intake', 'Adım adım ilerleyin'],
    ['/tr/tools/revenue-leak-scan', 'Satış yolunuzda'],
  ];
  for (const [route, expected] of contentChecks) {
    const html = (await request(route)).body;
    if (!html.includes(expected)) failures.push(`${route}: expected Turkish content not rendered: ${expected}`);
  }
  for (const asset of ['/llms.txt', '/llms-full.txt', '/robots.txt', '/sitemap.xml', '/free-assets/golden-delivery-sample-kit.pdf']) {
    const res = await request(asset);
    if (res.status !== 200) failures.push(`${asset}: status ${res.status}`);
  }
  sitemap = (await request('/sitemap.xml')).body;
  for (const route of routes.filter(path => path !== '/tr/outcome/intake')) if (!sitemap.includes(`<loc>https://aikagan.com${route}</loc>`)) failures.push(`${route}: absent from sitemap`);
} finally {
  child.kill('SIGTERM');
}

if (failures.length) {
  console.error(`Turkish journey verification failed (${failures.length})`);
  console.error('Metadata sample:', (firstHtml.match(/<link[^>]+(?:alternate|canonical)[^>]*>/g) || []).slice(0, 8));
  console.error('Sitemap sample:', sitemap.slice(0, 350));
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Turkish journey verification passed: ${routes.length} pages, bilingual metadata, internal language continuity, discovery files, and free delivery asset.`);
