export const SITE = {
  name: 'AutonomaX Templates',
  tagline: 'Instant-Download Digital Toolkits — System Checklists & SOP Templates',
  description:
    'AutonomaX provides download-ready standard operating procedure (SOP) templates, system engineering boilerplates, and developer UI kits for tech operators and teams.',
  url: 'https://aikagan.com',
  appUrl: 'https://app.aikagan.com',
  author: 'AutonomaX',
  year: 2026,
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const SERVICES = [
  {
    id: 'ai-automation',
    title: 'AI Automation',
    subtitle: 'AutonomaX Engine',
    description:
      'End-to-end intelligent automation pipelines. From data ingestion to decision output — orchestrated agents that run your operations while you scale.',
    features: [
      'Custom agent pipelines',
      'LLM workflow orchestration',
      'Real-time decision engines',
      'API integration layer',
      'Observability & logging',
    ],
    icon: 'Brain',
    cta: 'Explore Automation',
  },
  {
    id: 'ecommerce-conversion',
    title: 'E-Commerce Conversion',
    subtitle: 'ProPulse System',
    description:
      'Conversion-rate intelligence for online stores. AI-driven product page optimization, cart recovery flows, and dynamic pricing that responds to buyer behavior.',
    features: [
      'Product-page intelligence',
      'Cart recovery sequences',
      'Dynamic offer routing',
      'A/B optimization engine',
      'LTV modeling',
    ],
    icon: 'ShoppingCart',
    cta: 'Boost Conversion',
  },
  {
    id: 'deployment',
    title: 'Deployment & Orchestration',
    subtitle: 'Infrastructure Layer',
    description:
      'Production-grade deployment pipelines for AI workloads. Containerized, monitored, and auto-scaling — ship with confidence.',
    features: [
      'Docker/K8s orchestration',
      'CI/CD pipeline design',
      'Edge & cloud deployment',
      'Secrets management',
      'Health monitoring',
    ],
    icon: 'Rocket',
    cta: 'Deploy Now',
  },
  {
    id: 'golden-delivery',
    title: 'Golden Delivery',
    subtitle: 'Done-For-You Operations',
    description:
      'The full-stack execution layer. We design, build, deploy, and operate your AI-powered commerce infrastructure — you focus on the vision.',
    features: [
      'Full-stack execution',
      'Dedicated ops team',
      'Weekly delivery cadence',
      'SLA-backed uptime',
      'Strategic advisory',
    ],
    icon: 'Zap',
    cta: 'Get Golden Delivery',
  },
  {
    id: 'advisory',
    title: 'Strategic Advisory',
    subtitle: 'Kaganate Council',
    description:
      'Direct access to Kagan for architecture reviews, strategy sessions, and technical due diligence on AI/automation investments.',
    features: [
      'Architecture review',
      'Strategy workshops',
      'Technical due diligence',
      'Roadmap design',
      'Vendor evaluation',
    ],
    icon: 'Target',
    cta: 'Book Advisory',
  },
] as const;

export const PRODUCTS = [
  {
    id: 'golden-delivery-starter',
    slug: 'golden-delivery-starter',
    name: 'Starter Pack',
    category: 'Golden Delivery · Launch Ignition',
    price: '$29',
    originalPrice: '$97',
    description:
      '7-file Launch Ignition System. First sale in 7 days using the exact blueprint, DM scripts, and 24-hour activation checklist. No audience required.',
    includes: [
      '7-Day First Sale Blueprint',
      'Offer Creation Worksheet',
      'Objection Crusher Scripts (6 DM responses)',
      '24-Hour Activation Checklist',
      'System Access Guide',
    ],
    badge: 'Best for beginners',
  },
  {
    id: 'golden-delivery-pro',
    slug: 'golden-delivery-pro',
    name: 'Pro Pack',
    category: 'Golden Delivery · Revenue Operations',
    price: '$79',
    originalPrice: '$297',
    description:
      '9-file Revenue Operations System. Funnels, AI tools stack, 30-day calendar, traffic playbook, and 5 ready-to-sell offer templates to hit $1K/month.',
    includes: [
      'Funnel Master Guide (3 architectures + copy)',
      'AI Tools Stack (7 tools, exact prompts)',
      'Traffic Playbook (5 organic + 2 paid channels)',
      '30-Day Revenue Calendar',
      '5 Complete Offer Templates ($27–$197)',
    ],
    badge: 'Most popular',
  },
  {
    id: 'golden-delivery-commander',
    slug: 'golden-delivery-commander',
    name: 'Commander Pack',
    category: 'Golden Delivery · Empire Architecture',
    price: '$149',
    originalPrice: '$997',
    description:
      '12-file Empire Architecture. White-label rights, 60-day sprint, partnership playbook, automation OS, KPI dashboard, and $10K+/month revenue models.',
    includes: [
      'Master System Map (5-layer empire)',
      'White-Label Guide (resell as your own)',
      '60-Day Scale Sprint (week-by-week)',
      'Partnership Playbook (5 deal types)',
      'Automation OS + KPI Dashboard',
    ],
    badge: 'Maximum value',
  },
] as const;

export const MISSION_STAGES = [
  {
    stage: '01',
    title: 'Intake',
    description: 'Project request received. Scope, goals, and constraints captured via structured intake form.',
    status: 'active',
  },
  {
    stage: '02',
    title: 'Analysis',
    description: 'Deep-dive audit of existing systems, data flows, and conversion funnels. AI-driven pattern detection.',
    status: 'active',
  },
  {
    stage: '03',
    title: 'Architecture',
    description: 'System design, technology selection, and integration blueprint. AutonomaX pipeline mapping.',
    status: 'active',
  },
  {
    stage: '04',
    title: 'Build',
    description: 'Development sprints with continuous delivery. Agents deployed, pipelines wired, ProPulse calibrated.',
    status: 'active',
  },
  {
    stage: '05',
    title: 'Golden Delivery',
    description: 'Testing, hardening, monitoring setup, and handover. Production launch with SLA activation.',
    status: 'active',
  },
  {
    stage: '06',
    title: 'Operate',
    description: 'Ongoing management, optimization, and strategic iteration. Weekly delivery cadence maintained.',
    status: 'active',
  },
] as const;

export const TRUST_SIGNALS = [
  'Instant ZIP Delivery',
  '30-Day Guarantee',
  'Download Anytime',
  'No Subscription Required',
  'Real Digital Products',
] as const;

export const PROJECT_OFFERS = [
  {
    id: 'freelance-automation',
    title: 'AI Automation — Freelance',
    subtitle: 'Project-Based at $75/hr',
    description: 'Available for freelance AI automation projects. Checkout routing, delivery automation, KPI tracking, workflow orchestration. Python, FastAPI, Cloud Run, Paddle, make.com.',
    features: ['Revenue ops setup', 'Checkout integration', 'Workflow automation', '3-5 day delivery', 'Documentation included'],
    icon: 'Code',
    cta: 'Hire on Fiverr',
    ctaUrl: 'https://www.fiverr.com/propulse_ai',
  },
  {
    id: 'digital-products',
    title: 'Digital Products — Passive',
    subtitle: 'One-Time Purchase, Lifetime Access',
    description: 'Ready-to-use digital toolkits for revenue operations. 7-Day First Sale Blueprint, Funnel Master Guide, AI Tools Stack. Instant ZIP delivery. 30-day refund.',
    features: ['Starter Pack $29', 'Pro Pack $79', 'Commander Pack $149', 'Instant download', 'White-label available'],
    icon: 'Package',
    cta: 'Browse Products',
    ctaUrl: '/products/',
  },
  {
    id: 'printables-marketplace',
    title: 'Printables — Etsy',
    subtitle: 'Digital Downloads from $4.99',
    description: 'Printable revenue planners, AI automation checklists, and Zen Art wall art collection. Instant PDF download. Print at home or through any POD service.',
    features: ['Weekly Operating Map $4.99', 'Checklist Bundle $9.99', 'Zen Art Collection $14.99', 'Instant PDF delivery', '300 DPI print-ready'],
    icon: 'Printer',
    cta: 'Shop Etsy',
    ctaUrl: 'https://www.etsy.com/shop/zentronomax',
  },
] as const;

export const SOCIAL = {
  facebook:  'https://www.facebook.com/kagan.aikagan',
  instagram: 'https://www.instagram.com/kagan.aikagan',
} as const;
