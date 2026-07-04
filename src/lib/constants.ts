export const SITE = {
  name: 'AutonomaX Profit OS',
  tagline: 'AI Revenue Ops — Checkout, Delivery & Growth',
  description:
    'AutonomaX Profit OS turns scattered digital products, checkouts, delivery steps, and KPI dashboards into one measurable revenue operations funnel. Built for founders, operators, and small teams.',
  url: 'https://aikagan.com',
  appUrl: 'https://app.aikagan.com',
  author: 'AutonomaX / ProPulse Group',
  year: 2026,
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Products', href: '/products/' },
  { label: 'Mission Control', href: '/mission-control/' },
  { label: 'About', href: '/about/' },
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
  'Production-Grade AI',
  'SLA-Backed Delivery',
  'End-to-End Execution',
  'No Placeholder Marketing',
  'Real Conversion Engineering',
] as const;

export const SOCIAL = {
  facebook:  'https://www.facebook.com/kagan.aikagan',
  instagram: 'https://www.instagram.com/kagan.aikagan',
} as const;
