export type BroadcastMetric = {
  label: string;
  value: string;
  detail?: string;
};

export type BroadcastScene = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: 'gold' | 'emerald' | 'cyan' | 'violet';
};

export const DEFAULT_LAZY_LARRY_SCRIPT =
  "Hey, I’m Lazy Larry — AIKAGAN’s business-lazying assistant. I finished the boring stuff, turned work into button-work, and kept progress moving. Welcome to AIKAGAN.";

export const INTELLIGENCE_LAYERS = [
  ['BI', 'Business'],
  ['MI', 'Marketing'],
  ['SI', 'Strategic'],
  ['OI', 'Operational'],
  ['CI', 'Cultural'],
  ['HI', 'Human'],
  ['FI', 'Financial'],
] as const;

export const LAZY_LARRY_SCENES: BroadcastScene[] = [
  {
    id: 'hero',
    eyebrow: 'AIKAGAN BRAND AMBASSADOR',
    title: 'Lazy Larry',
    subtitle: 'Professional business-lazying, presented in 2D.',
    accent: 'gold',
  },
  {
    id: 'button-work',
    eyebrow: 'AUTOMATION',
    title: 'Boring work → button-work',
    subtitle: 'Research, offers, workflows and approved execution paths.',
    accent: 'emerald',
  },
  {
    id: 'intelligence',
    eyebrow: 'MONTHLY PROGRESS BRIEFING',
    title: 'Seven intelligence layers',
    subtitle: 'Business, marketing, strategy, operations, culture, people and finance.',
    accent: 'cyan',
  },
  {
    id: 'progress',
    eyebrow: 'STATUS',
    title: 'Only verified metrics belong here',
    subtitle: 'Connect real sources before publishing revenue, profit or conversion claims.',
    accent: 'violet',
  },
  {
    id: 'roadmap',
    eyebrow: 'ROADMAP',
    title: 'Discover → automate → execute → scale',
    subtitle: 'A reusable 2D visual grammar for live and asynchronous briefings.',
    accent: 'emerald',
  },
  {
    id: 'final',
    eyebrow: 'INTELLIGENCE • AUTOMATION • FREEDOM',
    title: 'Welcome to AIKAGAN',
    subtitle: 'If a machine can do it, why am I standing up?',
    accent: 'gold',
  },
];

export const EMPTY_BROADCAST_METRICS: BroadcastMetric[] = [
  { label: 'Revenue', value: '—', detail: 'Connect verified source' },
  { label: 'Profit', value: '—', detail: 'Connect verified source' },
  { label: 'Conversion', value: '—', detail: 'Connect verified source' },
  { label: 'Recurring revenue', value: '—', detail: 'Connect verified source' },
];
