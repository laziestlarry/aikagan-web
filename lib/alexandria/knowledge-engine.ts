// lib/alexandria/knowledge-engine.ts
// Alexandria Knowledge Core — RAG context provider for Gemini Commanders
// and the public /knowledge hub. Sources: bundled markdown docs in
// lib/alexandria/docs plus a curated fallback set. Results are KV-cached.

import { kvGet, kvSet } from '@/lib/kv';

export type KnowledgeCategory = 'SOP' | 'Framework' | 'PromptTemplate' | 'CaseStudy';

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  tags: string[];
  updatedAt: string;
}

interface BundledDoc {
  id: string;
  title: string;
  category: KnowledgeCategory;
  tags: string[];
  content: string;
}

const BUNDLED_DOCS: BundledDoc[] = [
  {
    id: 'sop-golden-delivery',
    title: 'Golden Delivery Onboarding Protocol',
    category: 'SOP',
    tags: ['fulfillment', 'onboarding', 'delivery', 'purchase'],
    content: 'Golden Delivery Onboarding Protocol.\n\nFulfillment within 60 seconds of a confirmed payment via automated HMAC download tokens. Step 1: verify the webhook signature and idempotency key. Step 2: issue a single-use download token bound to the buyer email. Step 3: send the post-purchase email with secure download link. Step 4: write the income ledger transaction to KV with the provider order id. Step 5: trigger Meta CAPI Purchase server-side event. SLA: 100% of paid orders fulfilled, median time-to-token under 60 seconds.',
  },
  {
    id: 'framework-revenue-leak',
    title: '7-Point Revenue Leak Audit Framework',
    category: 'Framework',
    tags: ['audit', 'cro', 'conversion', 'revenue', 'checkout'],
    content: '7-Point Revenue Leak Diagnostic Framework.\n\n1. Offer Clarity — can the buyer name the outcome, price, and delivery in 5 seconds? 2. Proof Placement — is social proof next to the CTA, not buried? 3. Checkout Friction — how many clicks and form fields between intent and pay? 4. Tracking Integrity — is server-side CAPI firing on purchase? 5. Exit Velocity — is there a last-chance offer before abandon? 6. Refund Barriers — is the guarantee visible and confident? 7. Follow-Up — is there an email recovery sequence for abandoned carts?',
  },
  {
    id: 'prompt-marketing-commander',
    title: 'Omnichannel Launch Wave Generator',
    category: 'PromptTemplate',
    tags: ['marketing', 'agents', 'launch', 'social', 'conversion_router'],
    content: 'Omnichannel Launch Wave Generator prompt template.\n\nRole: You are the AIKAGAN Marketing Commander. Task: produce platform-native copy for 14+ channels for a single campaign concept. For each piece: hook, body, CTA, media prompt, and UTM-tagged URL via conversion_router.py. Channels: X, LinkedIn, Instagram, Facebook, TikTok, YouTube, Threads, WhatsApp, Email, Blog, Newsletter, Pinterest, Reddit, Telegram. Quality gate: every asset must lead with a concrete buyer pain and end with a single CTA.',
  },
  {
    id: 'sop-locale-router',
    title: 'Locale & Checkout Rail Routing',
    category: 'SOP',
    tags: ['checkout', 'gumroad', 'shopier', 'turkish', 'turkiye', 'locale'],
    content: 'Locale & Checkout Rail Routing SOP.\n\nPrimary global rail: Gumroad. Primary Turkish rail: Shopier (TRY / TR-IP buyers). LemonSqueezy is disabled (demo only) and is never used in production. Routing order in lib/provider-router.ts: 1. Detect buyer locale via accept-language, IP country header, and aikagan_locale cookie. 2. Turkish users get the Shopier checkout rail first. 3. All other users get the Gumroad rail. 4. If the selected rail fails, fall back to /checkout/manual so no buyer is stranded.',
  },
  {
    id: 'case-creator-hub-wave',
    title: 'Creator Hub Wave Approval Case Study',
    category: 'CaseStudy',
    tags: ['creator-hub', 'campaign', 'wave', 'approval', 'board'],
    content: 'Creator Hub Wave Approval Case Study.\n\nThe Marketing Commander produces a campaign wave (draft posts across platforms). Items land in the Creator Hub board (app.aikagan.com/creator-hub or board.aikagan.com). Operator flow: review copy per item, click Approve to mark approved, Schedule to queue, then publish. Approved items route through Make.com omnichannel webhooks with UTM params already attached. Lesson captured: waves with 5-7 items per platform and a single CTA outperform 1-item bursts; approval gates keep quality at E2+ before publishing.',
  },
  {
    id: 'framework-progress-bus',
    title: 'Progress Bus L0-L8 Definition',
    category: 'Framework',
    tags: ['progress-bus', 'pipeline', 'gates', 'autonomax', 'governance'],
    content: 'Progress Bus L0-L8.\n\nL0 Intake: lead captured (leak scan / outcome form). L1 Intent: intent scored and segmented. L2 Strategy: decision brief produced. L3 Build: assets generated (campaign waves, blueprints). L4 Test: Delivery/QA gate verifies quality score >= 4. L5 Deploy: fulfilled / published. L6 Revenue: income ledger records the transaction. L7 Governance: audit and release signoff. L8 Scale: affiliate and expansion loops. No item moves without the gate of the prior level passing.',
  },
  {
    id: 'sop-health-monitoring',
    title: 'Production Health Monitoring SOP',
    category: 'SOP',
    tags: ['health', 'monitoring', 'sla', 'api', 'uptime'],
    content: 'Production Health Monitoring SOP.\n\nGET /api/health returns ok:true only when core dependencies respond: KV store, checkout provider reachability, site origin, and env key presence. Cadence: verified after every deploy and on a daily check. SLAs: storefront HTTP 200, health 200 ok:true, zero runtime error clusters in the last 24h. On failure: fail-closed behavior, alert via configured webhook, and check deployment status before touching production.',
  },
];

function hydrate(doc: BundledDoc): KnowledgeDocument {
  return { ...doc, updatedAt: '2026-09-17' };
}

export class AlexandriaKnowledgeEngine {
  private static DOC_KEY = 'alexandria:doc:all';
  private static CACHE_TTL = 3600;

  /**
   * Retrieve contextually relevant documents for AI Commander context
   * injection. Matches on title, content, and tags, optionally filtered by
   * category. Results are KV-cached for 1 hour.
   */
  static async queryContext(query: string, category?: KnowledgeCategory): Promise<KnowledgeDocument[]> {
    const q = query.trim().toLowerCase();
    const cacheKey = `alexandria:query:${q.slice(0, 80)}`;
    const cached = await kvGet<KnowledgeDocument[]>(cacheKey);
    if (cached && cached.length) return cached;

    const docs = await this.getAllDocuments();
    const tokens = q.split(/\s+/).filter(Boolean);
    const filtered = docs.filter((doc) => {
      if (category && doc.category !== category) return false;
      if (!tokens.length) return true;
      const haystack = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
      return tokens.some((t) => haystack.includes(t));
    });

    await kvSet(cacheKey, filtered, this.CACHE_TTL);
    return filtered;
  }

  /** Return the full document corpus (bundled docs hydrated to KnowledgeDocument). */
  static async getAllDocuments(): Promise<KnowledgeDocument[]> {
    const cached = await kvGet<KnowledgeDocument[]>(this.DOC_KEY);
    if (cached && cached.length) return cached;

    const docs = BUNDLED_DOCS.map(hydrate);
    await kvSet(this.DOC_KEY, docs, this.CACHE_TTL);
    return docs;
  }

  /** Get documents by id(s), useful for deterministic context injection. */
  static async getByIds(ids: string[]): Promise<KnowledgeDocument[]> {
    const docs = await this.getAllDocuments();
    const wanted = new Set(ids);
    return docs.filter((d) => wanted.has(d.id));
  }
}