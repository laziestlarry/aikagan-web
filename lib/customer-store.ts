import crypto from "crypto";

export type Entitlement = {
  slug: string;
  transactionId: string;
  grantedAt: string;
  status: "active" | "revoked";
};

export type Mission = {
  id: string;
  title: string;
  segment: string;
  objective: string;
  status: "planned" | "active" | "blocked" | "delivered";
  progress: number;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
};

export type Deliverable = {
  id: string;
  missionId?: string;
  title: string;
  kind: "download" | "report" | "blueprint" | "workflow" | "service";
  href?: string;
  status: "ready" | "processing" | "delivered";
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: "open" | "resolved";
  createdAt: string;
};

export type CustomerRecord = {
  customerId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  entitlements: Entitlement[];
  missions: Mission[];
  deliverables: Deliverable[];
  supportTickets: SupportTicket[];
};

const PREFIX = "customer:v1:";
const TTL_S = 365 * 24 * 60 * 60;
const memory = new Map<string, CustomerRecord>();
let _kv: { get: Function; set: Function } | null = null;

async function getKv() {
  if (_kv) return _kv;
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      _kv = kv;
    }
  } catch {}
  return _kv;
}

function key(customerId: string) {
  return `${PREFIX}${customerId}`;
}

function newRecord(customerId: string, email: string): CustomerRecord {
  const now = new Date().toISOString();
  return { customerId, email, createdAt: now, updatedAt: now, entitlements: [], missions: [], deliverables: [], supportTickets: [] };
}

async function persist(record: CustomerRecord) {
  record.updatedAt = new Date().toISOString();
  memory.set(record.customerId, record);
  const kv = await getKv();
  if (kv) {
    try { await kv.set(key(record.customerId), record, { ex: TTL_S }); } catch {}
  }
  return record;
}

export const customerStore = {
  async get(customerId: string): Promise<CustomerRecord | null> {
    const kv = await getKv();
    if (kv) {
      try {
        const record = await kv.get(key(customerId));
        if (record) return record as CustomerRecord;
      } catch {}
    }
    return memory.get(customerId) ?? null;
  },

  async ensure(customerId: string, email: string): Promise<CustomerRecord> {
    return (await this.get(customerId)) ?? persist(newRecord(customerId, email));
  },

  async grantEntitlement(customerId: string, email: string, slug: string, transactionId: string, downloadHref?: string | null) {
    const record = await this.ensure(customerId, email);
    const existing = record.entitlements.find((e) => e.transactionId === transactionId);
    if (!existing) {
      record.entitlements.push({ slug, transactionId, grantedAt: new Date().toISOString(), status: "active" });
    }
    if (downloadHref && !record.deliverables.some((d) => d.href === downloadHref)) {
      record.deliverables.unshift({
        id: crypto.randomUUID(),
        title: `${slug.replace(/-/g, " ")} delivery`,
        kind: "download",
        href: downloadHref,
        status: "ready",
        createdAt: new Date().toISOString(),
      });
    }
    return persist(record);
  },

  async createMission(customerId: string, email: string, input: { title: string; segment: string; objective: string; nextAction: string }) {
    const record = await this.ensure(customerId, email);
    const now = new Date().toISOString();
    const mission: Mission = {
      id: crypto.randomUUID(),
      title: input.title,
      segment: input.segment,
      objective: input.objective,
      status: "active",
      progress: 10,
      nextAction: input.nextAction,
      createdAt: now,
      updatedAt: now,
    };
    record.missions.unshift(mission);
    await persist(record);
    return mission;
  },

  async createSupportTicket(customerId: string, email: string, subject: string, message: string) {
    const record = await this.ensure(customerId, email);
    const ticket: SupportTicket = { id: crypto.randomUUID(), subject, message, status: "open", createdAt: new Date().toISOString() };
    record.supportTickets.unshift(ticket);
    await persist(record);
    return ticket;
  },
};
