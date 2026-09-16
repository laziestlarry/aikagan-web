import { MicroSaaSBlueprint } from '../types';

export const MICRO_SAAS_BLUEPRINTS: MicroSaaSBlueprint[] = [
  {
    id: 'autonomad',
    title: 'AutoNomad OS',
    niche: 'Freelance & Agency Gig Automation',
    tagline: 'Automate job board scraping, proposal bidding, and CRM sync on autopilot.',
    priceStarter: 49,
    pricePro: 149,
    priceEnterprise: 299,
    conversionFloor: 3.4,
    category: 'Automation',
    description: 'An autonomous gig-finding engine that scrapes premium job boards, synthesizes customized high-conversion proposal pitches, and syncs client pipeline leads into CRM databases.',
    features: [
      'Multi-Platform Job Board Scraper (Upwork, Fiverr, Indeed)',
      'Gemini AI Pitch Customizer with Tone Dialing',
      'Make.com Scenario Inventory Export (JSON)',
      'Automated SLA Trust Certificate Verification'
    ],
    makeScenarios: [
      'Upwork RSS Pitch Synthesizer',
      'Agency Lead Enrichment Bot',
      'Client Onboarding Webhook Pipeline'
    ],
    rawMarkdown: `# AutoNomad OS — Executive Venture Blueprint

## Executive Summary
AutoNomad OS turns job hunting into a programmatic client acquisition pipeline. By pairing proxy scraping with Gemini AI tone matching, agency operators land contracts 4x faster.

## Monetization Strategy
- **DIY Starter ($49/mo):** Pre-built Make.com scenario templates and raw prompt matrices.
- **Hybrid Pro ($149/mo):** Hosted webhook dispatchers with backoff retries and proxy support.
- **Full-DFY Enterprise ($299/mo):** Dedicated custom CRM integrations, branded proposal PDF compilation, and priority SLA seals.

## Architectural Specs
- **Frontend:** React + Tailwind CSS + Vite
- **AI Processing:** Gemini API Server-Side Route
- **Integration:** Make.com Webhook WebSockets + Stripe Webhooks`,
    architecturalSpecs: 'Node.js Express + Gemini 1.5 Flash + Make.com Webhooks + JIT Proxy Scraper'
  },
  {
    id: 'lazylarry',
    title: 'Lazy Larry',
    niche: 'Digital Content Monetization',
    tagline: 'Transform passive stream feeds into automated digital product sales funnels.',
    priceStarter: 39,
    pricePro: 129,
    priceEnterprise: 249,
    conversionFloor: 3.8,
    category: 'Monetization',
    description: 'Automated monetization engine for creators and streamers, turning live audience interactions into instant Stripe checkout links and automated digital asset downloads.',
    features: [
      'Live-Stream Event Router & Trigger Engine',
      'Dynamic Stripe Payment Link Generator',
      'Instant Digital Download Delivery Webhook',
      'Interactive Viewer Engagement Metrics'
    ],
    makeScenarios: [
      'Live Chat Stripe Purchase Trigger',
      'Digital Asset Delivery Vault Dispatcher',
      'Social Proof Syndication Streamer'
    ],
    rawMarkdown: `# Lazy Larry — Digital Asset Monetization Blueprint

## Executive Summary
Lazy Larry empowers digital creators to monetize streaming feeds without manual administration. Automated checkout triggers convert passive viewers into active buyers.

## Monetization Strategy
- **DIY Starter ($39/mo):** Self-hosted widget code with Stripe API hooks.
- **Hybrid Pro ($129/mo):** Hosted stream overlays with live sales popups.
- **Full-DFY Enterprise ($249/mo):** Multi-stream syndication and automated affiliate payouts.

## Architectural Specs
- **Frontend:** Responsive React Dashboard
- **Payments:** Stripe Checkout API
- **Events:** Server-Sent Events / SSE Webhooks`,
    architecturalSpecs: 'React + SSE WebSockets + Stripe Webhooks + Digital Asset Vault'
  },
  {
    id: 'client_bot',
    title: 'Autonomous Client Onboarding Bot',
    niche: 'Agency Intake & CRM Operations',
    tagline: 'Zero-touch client intake, contract signing, and project workspace provisioning.',
    priceStarter: 59,
    pricePro: 179,
    priceEnterprise: 349,
    conversionFloor: 4.1,
    category: 'CRM',
    description: 'Replaces manual agency onboarding friction with an automated intake form, instant NDA/contract generation, and Notion/Slack workspace provisioning.',
    features: [
      'Interactive Smart Questionnaire Intake',
      'Instant Legal Agreement & Contract PDF Builder',
      'Slack & Notion Workspace Auto-Provisioner',
      'Stripe Deposit & Milestone Invoice Sync'
    ],
    makeScenarios: [
      'Typeform Client Intake Webhook',
      'Contract Signature & Google Drive Vault',
      'Notion Project Board Auto-Provisioner'
    ],
    rawMarkdown: `# Autonomous Client Onboarding Bot — Blueprint

## Executive Summary
Eliminate hours of back-and-forth client intake emails. The Bot collects project specs, issues contracts, collects deposits, and sets up project channels automatically.

## Monetization Strategy
- **DIY Starter ($59/mo):** Make.com workflow blueprints for Typeform and Notion.
- **Hybrid Pro ($179/mo):** White-labeled intake portal with branded contract outputs.
- **Full-DFY Enterprise ($349/mo):** Custom CRM API synchronization and enterprise SSO integration.

## Architectural Specs
- **Frontend:** React Multi-Step Intake Engine
- **Legal:** HTML-to-PDF Contract Compiler
- **Integrations:** Google Drive API + Slack API + Notion API`,
    architecturalSpecs: 'React + Express API + Google Workspace OAuth + Notion/Slack Webhooks'
  },
  {
    id: 'proxy_scraper',
    title: 'Competitor Intelligence Proxy Scraper',
    niche: 'Market Research & Dynamic Pricing',
    tagline: 'Monitor competitor pricing, product updates, and ad campaigns with rotating proxies.',
    priceStarter: 69,
    pricePro: 199,
    priceEnterprise: 399,
    conversionFloor: 3.9,
    category: 'Scraper',
    description: 'Resilient market intelligence scraper that continuously tracks competitor storefront changes, price drops, and ad creatives using rotating proxies and circuit breakers.',
    features: [
      'Circuit Breaker Resilience Engine',
      'IP Proxy Pool Rotation & User-Agent Spoofing',
      'Automated Price Deviation Alert System',
      'Visual Storefront Snapshot Archiver'
    ],
    makeScenarios: [
      'Storefront Price Scraper Scheduler',
      'Competitor Ad Library Monitor',
      'Slack/Email Price Alert Dispatcher'
    ],
    rawMarkdown: `# Competitor Intelligence Proxy Scraper — Blueprint

## Executive Summary
Track market shifts and pricing dynamics in real-time. The Proxy Scraper gives eCommerce brands and agencies unfair pricing dominance.

## Monetization Strategy
- **DIY Starter ($69/mo):** Scraping scenario files with basic HTTP requests.
- **Hybrid Pro ($199/mo):** Residential proxy pool access and daily alert digests.
- **Full-DFY Enterprise ($399/mo):** Hourly monitoring, custom data pipelines, and raw S3 dumps.

## Architectural Specs
- **Scraper:** Node.js + Axios + Cheerio / Playwright
- **Resilience:** Circuit Breaker + Backoff Retries + Rotating IP Proxies
- **Storage:** Firestore Realtime Metrics DB`,
    architecturalSpecs: 'Node.js Scraping Worker + Circuit Breaker Circuitry + Firestore DB'
  },
  {
    id: 'sla_cert',
    title: 'Cryptographic SLA Compliance Seal Engine',
    niche: 'Enterprise Trust & Compliance',
    tagline: 'Generate verifiable cryptographic SLA guarantees and digital compliance seals.',
    priceStarter: 79,
    pricePro: 229,
    priceEnterprise: 499,
    conversionFloor: 4.5,
    category: 'Compliance',
    description: 'Embed real-time, tamper-proof SLA verification badges on your checkout pages to build trust and dramatically increase enterprise buyer conversion.',
    features: [
      'SHA-256 Cryptographic Hash Generation',
      'Live SLA Health & Latency Verification Shield',
      'Interactive Verification Popup Modal for Buyers',
      'Automated Audit Trail & Contract Archiver'
    ],
    makeScenarios: [
      'SLA Heartbeat Monitoring Webhook',
      'Cryptographic Hash Verification API',
      'Compliance Audit Report Generator'
    ],
    rawMarkdown: `# Cryptographic SLA Compliance Seal Engine — Blueprint

## Executive Summary
Elevate buyer trust instantly. By displaying a mathematically verifiable SHA-256 SLA badge on high-ticket sales pages, enterprise buyer hesitation vanishes.

## Monetization Strategy
- **DIY Starter ($79/mo):** Static SLA badge widgets with SHA-256 validator script.
- **Hybrid Pro ($229/mo):** Real-time system monitoring badge with auto-updating uptime stats.
- **Full-DFY Enterprise ($499/mo):** Custom legal warranty backing and automated auditor reporting.

## Architectural Specs
- **Frontend:** React Trust Seal Badge Component
- **Crypto:** SHA-256 Cryptographic Hasher
- **API:** Express SLA Verification Route`,
    architecturalSpecs: 'React Badge Component + Express Crypto Validator + SHA-256 Engine'
  }
];
