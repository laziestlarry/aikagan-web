export const SITE = {
  name: 'AutonomaX Profit OS',
  tagline: 'Instant-Download Digital Toolkits — Checkout, Delivery & Growth',
  description:
    'AutonomaX Profit OS turns scattered digital products, checkouts, delivery steps, and KPI dashboards into one measurable revenue operations funnel. Built for founders, operators, and small teams.',
  url: 'https://aikagan.com',
  appUrl: 'https://app.aikagan.com',
  author: 'AutonomaX / ProPulse Group',
  year: 2026,
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products/' },
  { label: 'Marketing', href: '/marketing/' },
  { label: 'Affiliates', href: '/affiliates/' },
  { label: 'Dashboard', href: '/dashboard/' },
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
      'Structured automation pipelines for data intake, analysis, routing, and decision support. Production behavior remains gated by configured integrations and evidence.',
    features: [
      'Agent workflow design',
      'LLM orchestration patterns',
      'Decision-support flows',
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
      'Conversion operations for online stores: product-page review, cart-recovery design, offer routing, and measurement plans tied to observable buyer behavior.',
    features: [
      'Product-page review',
      'Cart-recovery sequences',
      'Offer-routing design',
      'Experiment planning',
      'LTV measurement models',
    ],
    icon: 'ShoppingCart',
    cta: 'Review Conversion',
  },
  {
    id: 'deployment',
    title: 'Deployment & Orchestration',
    subtitle: 'Infrastructure Layer',
    description:
      'Production deployment design for AI workloads with explicit build, release, secrets, health, and rollback controls.',
    features: [
      'Container deployment patterns',
      'CI/CD pipeline design',
      'Edge & cloud deployment',
      'Secrets management',
      'Health monitoring',
    ],
    icon: 'Rocket',
    cta: 'Review Deployment',
  },
  {
    id: 'golden-delivery',
    title: 'Golden Delivery',
    subtitle: 'Implementation Operations',
    description:
      'A scoped implementation layer for design, build, deployment, and handoff. Commercial terms and delivery windows are confirmed before paid custom work begins.',
    features: [
      'Scoped implementation',
      'Defined delivery checkpoints',
      'Release verification',
      'Health and handoff checks',
      'Documented next actions',
    ],
    icon: 'Zap',
    cta: 'Request Scope',
  },
  {
    id: 'advisory',
    title: 'Strategic Advisory',
    subtitle: 'Kaganate Council',
    description:
      'Scoped architecture, strategy, and technical-review work. Availability, deliverables, timing, and pricing are confirmed through intake before payment.',
    features: [
      'Architecture review',
      'Strategy workshops',
      'Technical due diligence',
      'Roadmap design',
      'Vendor evaluation',
    ],
    icon: 'Target',
    cta: 'Request Advisory',
  },
] as const;

export const PRODUCTS = [
  {
    id: 'golden-delivery-starter',
    slug: 'golden-delivery-starter',
    name: 'Starter Pack',
    category: 'Golden Delivery · Launch Foundations',
    price: '$29',
    originalPrice: '$97',
    description:
      'Launch-foundation toolkit with a structured 7-day execution map, offer worksheet, response scripts, and activation checklist. Results depend on implementation and market response.',
    includes: [
      '7-Day Launch Blueprint',
      'Offer Creation Worksheet',
      'Buyer-objection response scripts',
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
      'Revenue-operations toolkit with funnel architectures, an AI tools stack, a 30-day operating calendar, traffic experiments, and editable offer templates.',
    includes: [
      'Funnel Master Guide (3 architectures + copy)',
      'AI Tools Stack (7 tools, exact prompts)',
      'Traffic Playbook (organic + paid experiments)',
      '30-Day Revenue Operations Calendar',
      '5 Editable Offer Templates',
    ],
    badge: 'Most popular',
  },
  {
    id: 'golden-delivery-commander',
    slug: 'golden-delivery-commander',
    name: 'Commander Pack',
    category: 'Golden Delivery · Operating Architecture',
    price: '$149',
    originalPrice: '$997',
    description:
      'Operating-architecture toolkit with licensing guidance, a 60-day scale sprint, partnership templates, automation-system patterns, and a KPI dashboard.',
    includes: [
      'Master System Map (5-layer operating model)',
      'White-Label Guide and usage boundaries',
      '60-Day Scale Sprint',
      'Partnership Playbook',
      'Automation OS + KPI Dashboard',
    ],
    badge: 'Maximum toolkit',
  },
] as const;

export const MISSION_STAGES = [
  {
    stage: '01',
    title: 'Intake',
    description: 'Capture project goals, constraints, source material, and required evidence before work begins.',
    status: 'process',
  },
  {
    stage: '02',
    title: 'Analysis',
    description: 'Review available systems, data flows, commercial assumptions, and measurable blockers.',
    status: 'process',
  },
  {
    stage: '03',
    title: 'Architecture',
    description: 'Define system boundaries, provider contracts, data flows, release gates, and failure behavior.',
    status: 'process',
  },
  {
    stage: '04',
    title: 'Build',
    description: 'Implement scoped changes with tests and explicit evidence requirements; no stage is considered complete from elapsed time alone.',
    status: 'process',
  },
  {
    stage: '05',
    title: 'Verify & Deliver',
    description: 'Run release checks, validate payment and fulfillment behavior, and hand off only what is actually evidenced.',
    status: 'process',
  },
  {
    stage: '06',
    title: 'Operate',
    description: 'Monitor evidence, support customers, resolve failures, and iterate only after observed production results.',
    status: 'process',
  },
] as const;

export const TRUST_SIGNALS = [
  'Verified Checkout Routing',
  '30-Day Guarantee',
  'Expiring Delivery Access',
  'No Subscription Required for Packs',
  'Evidence-Based Status',
] as const;

export const PROJECT_OFFERS = [
  {
    id: 'freelance-automation',
    title: 'AI Automation — Scoped Project',
    subtitle: 'Commercial terms confirmed before payment',
    description: 'Scoped automation and revenue-operations implementation covering checkout routing, delivery automation, KPI tracking, and workflow orchestration. Deliverables and timing are confirmed through intake.',
    features: ['Revenue-ops review', 'Checkout integration', 'Workflow automation', 'Defined delivery window', 'Documentation included'],
    icon: 'Code',
    cta: 'Request Project Scope',
    ctaUrl: '/contact/',
  },
  {
    id: 'digital-products',
    title: 'Digital Products',
    subtitle: 'One-Time Purchase, Downloadable Assets',
    description: 'Downloadable operating toolkits for launch, funnel, automation, and KPI workflows. Each product page states the exact contents, provider path, delivery behavior, and refund terms.',
    features: ['Starter Pack $29', 'Pro Pack $79', 'Commander Pack $149', 'Verified hosted checkout', 'Defined download contents'],
    icon: 'Package',
    cta: 'Browse Products',
    ctaUrl: '/products/',
  },
  {
    id: 'printables-marketplace',
    title: 'Printables & Templates',
    subtitle: 'Separate marketplace catalog',
    description: 'Printable planning, automation, and design assets are maintained as a separate marketplace line and should be evaluated independently from the core ProfitOS revenue system.',
    features: ['Planning templates', 'Checklist bundles', 'Digital artwork', 'PDF delivery', 'Print-ready assets'],
    icon: 'Printer',
    cta: 'Request Catalog',
    ctaUrl: '/contact/',
  },
] as const;

export const SOCIAL = {
  facebook:  'https://www.facebook.com/kagan.aikagan',
  instagram: 'https://www.instagram.com/kagan.aikagan',
} as const;
