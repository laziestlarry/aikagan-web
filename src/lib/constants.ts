export const SITE = {
  name: 'AIKAGAN',
  tagline: 'The Kaganate',
  description:
    'Premium AI infrastructure, e-commerce conversion, productized services, and Golden Delivery — orchestrated for serious operators.',
  url: 'https://aikagan.com',
  author: 'Kagan / Lazy Larry',
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
    id: 'autonomax-starter',
    name: 'AutonomaX Starter Kit',
    category: 'Downloadable Pack',
    price: '$497',
    description:
      'Pre-built AI automation templates, prompt libraries, and agent configuration blueprints. Deploy your first AutonomaX pipeline this weekend.',
    includes: [
      '15 prompt templates',
      '3 agent configurations',
      'API wiring guide',
      'Deployment checklist',
      '30-day update access',
    ],
    badge: 'Instant Download',
  },
  {
    id: 'propulse-audit',
    name: 'ProPulse Store Audit',
    category: 'Consulting Package',
    price: '$1,997',
    description:
      'Comprehensive conversion audit of your e-commerce store. We deliver a prioritized action plan with AI-driven recommendations for every page in your funnel.',
    includes: [
      'Full funnel analysis',
      '20+ page audit report',
      'AI recommendation engine',
      'Competitor benchmarking',
      '90-min strategy call',
    ],
    badge: '2-Week Delivery',
  },
  {
    id: 'golden-bundle',
    name: 'Golden Delivery Bundle',
    category: 'Automation Bundle',
    price: '$4,997/mo',
    description:
      'Ongoing done-for-you AI operations. We run your AutonomaX + ProPulse stack, deliver weekly improvements, and manage your entire AI commerce infrastructure.',
    includes: [
      'Full stack management',
      'Weekly delivery reports',
      '24/7 monitoring',
      'Priority support',
      'Quarterly strategy sessions',
      'SLA guarantee',
    ],
    badge: 'Most Popular',
  },
  {
    id: 'kaganate-blueprint',
    name: 'Kaganate Blueprint',
    category: 'Downloadable Pack',
    price: '$297',
    description:
      'The complete system architecture document for building an AI-powered commerce operation. Patterns, decisions, and trade-offs from real deployments.',
    includes: [
      'Architecture diagrams',
      'Technology selection guide',
      'Cost modeling spreadsheet',
      'Team structure blueprint',
      '12-month roadmap template',
    ],
    badge: 'Digital Download',
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
