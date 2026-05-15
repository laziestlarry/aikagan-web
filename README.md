# AIKAGAN Web

Production-ready public web app for **AIKAGAN / The Kaganate** with:

- Core pages: Home, Services, Products, Mission Control, About, Contact/Intake
- Premium dark, responsive UI
- Conversion-first CTAs: **Start Project**, **View Offers**, **Request Audit**
- Hash-based routing for static deployment compatibility
- SEO-ready metadata defaults and page-level metadata updates

## Tech

- React + Vite
- ESLint
- Vitest + Testing Library

## Local Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Validation

```bash
npm run lint
npm run test:run
npm run build
```

## Deployment

### Vercel

1. Import repository in Vercel
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`

### Cloudflare Pages

1. Connect repository in Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`

### GitHub Pages

1. Build static files:
   ```bash
   npm run build
   ```
2. Publish the `dist/` folder using your preferred Pages workflow/action.
3. Hash routing (`#/path`) works without server-side rewrite rules.
