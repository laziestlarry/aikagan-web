# AIKAGAN Web

The public web interface for **AIKAGAN / The Kaganate** — a premium AI infrastructure, e-commerce conversion, and mission-control platform.

Built with **Next.js 14** (App Router), **TypeScript**, and **Tailwind CSS**. Statically exported for deployment anywhere.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build
# → outputs static site to /out
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (metadata, Navbar, Footer)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Tailwind + global styles
│   ├── services/page.tsx   # Services listing
│   ├── products/page.tsx   # Products & offers
│   ├── mission-control/page.tsx  # Delivery process dashboard
│   ├── about/page.tsx      # About Kagan / The Kaganate
│   ├── contact/page.tsx    # Intake form & contact
│   └── not-found.tsx       # Custom 404
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Sticky nav with mobile menu
│   │   └── Footer.tsx      # Site footer
│   ├── ui/
│   │   ├── Button.tsx      # Reusable button (variants, sizes, link support)
│   │   ├── Section.tsx     # Page section wrapper
│   │   ├── Card.tsx        # Card container with hover/glow states
│   │   ├── Badge.tsx       # Status/category badge
│   │   └── CTA.tsx         # Call-to-action block
│   ├── home/
│   │   ├── Hero.tsx        # Home hero with CTA buttons
│   │   ├── TrustBar.tsx    # Trust signals strip
│   │   ├── ValueProposition.tsx  # Four principles
│   │   └── FeatureGrid.tsx # Featured services grid
│   └── shared/
│       ├── ServiceCard.tsx # Service detail card
│       ├── ProductCard.tsx # Product/offer card
│       └── ProcessStages.tsx # Mission Control pipeline stages
├── lib/
│   ├── constants.ts        # All content: services, products, nav, stages
│   ├── metadata.ts         # SEO metadata builder
│   └── utils.ts            # Utility functions (cn)
```

---

## Design System

| Token | Value |
|---|---|
| Background | `#0a0a0b` (black), `#111113` (darker), `#1a1a1f` (dark) |
| Card | `#222228` |
| Gold accent | `#c9923a` → `#e0b04a` (hover) |
| Text | `#c4c4cf` (light), `#f0f0f5` (white), `#6b6b7b` (muted) |
| Font | Inter (body), JetBrains Mono (monospace) |

All colors are defined in `tailwind.config.ts` under the `kagan` namespace.

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, trust signals, value propositions, featured services, CTA |
| `/services/` | Services | Five service lines: AI automation, e-commerce conversion, deployment, Golden Delivery, advisory |
| `/products/` | Products | Four offers: starter kit, store audit, Golden Delivery bundle, blueprint |
| `/mission-control/` | Mission Control | Six-stage delivery pipeline with live stats dashboard |
| `/about/` | About | Kagan / Lazy Larry story, AutonomaX, ProPulse, Golden Delivery |
| `/contact/` | Contact / Intake | Structured project intake form with interest routing |

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

> If you want ISR/SSR, remove `output: 'export'` from `next.config.js`.

### Cloudflare Pages

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build settings:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Output directory**: `out`

### GitHub Pages

```bash
# Build static export
npm run build

# Deploy /out to gh-pages branch
npx gh-pages -d out
```

Or use GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

## Customization

### Update Content

All content lives in `src/lib/constants.ts`:

- `NAV_LINKS` — navigation items
- `SERVICES` — service cards
- `PRODUCTS` — product cards
- `MISSION_STAGES` — pipeline stages
- `TRUST_SIGNALS` — trust bar items
- `SITE` — site metadata (name, URL, description)

### Contact Form

The contact form is set up for **Formspree**. Replace the `action` URL in `src/app/contact/page.tsx`:

```tsx
<form action="https://formspree.io/f/YOUR-FORM-ID" method="POST">
```

You can also swap in Netlify Forms, Getform, or a custom API endpoint.

### Theme Colors

Edit `tailwind.config.ts` → `theme.extend.colors.kagan` to change the palette.

---

## Tech Stack

- **Next.js 14** — App Router, static export
- **React 18** — Server + client components
- **TypeScript** — Strict mode
- **Tailwind CSS 3** — Utility-first styling
- **Lucide React** — Icon library

---

## License

Private — © 2026 AIKAGAN. All rights reserved.
