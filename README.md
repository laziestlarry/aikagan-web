# AIKAGAN — AI-Powered Infrastructure for Modern Commerce

Production-ready Next.js 16 web application for [aikagan.com](https://aikagan.com).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Inter (Google Fonts)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, trust signals, services preview, CTA |
| `/services` | Services & Capabilities |
| `/products` | Products & Packages |
| `/mission-control` | Operational pipeline dashboard |
| `/about` | About AIKAGAN / The Kaganate |
| `/contact` | Project intake form |

## Components

- `Navbar` — Fixed top navigation with mobile hamburger menu
- `Footer` — Site-wide footer with link columns
- `CTAButton` — Reusable button/link (primary, secondary, outline variants)
- `SectionHeader` — Section title + subtitle component
- `ServiceCard` — Service feature card with icon and feature list
- `ProductCard` — Pricing/product card with CTA

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```

## Deployment

Deploy to [Vercel](https://vercel.com) — connect the GitHub repository and it will auto-deploy on push to `main`.
