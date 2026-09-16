/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  level: 'Executive' | 'Director' | 'Architect' | 'Specialist';
  status: 'idle' | 'busy' | 'completed' | 'offline';
  avatarColor: string;
  currentTask?: string;
  skills: string[];
  description: string;
}

export interface MissionTask {
  id: string;
  day: number;
  title: string;
  description: string;
  assignedTo: string; // AIAgent ID
  status: 'pending' | 'active' | 'completed';
  outcome?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface MakeScenario {
  id: string;
  name: string;
  commercialValue: 'HIGH' | 'MEDIUM-HIGH' | 'STRATEGIC' | 'FOUNDATIONAL';
  description: string;
  status: 'active' | 'inactive';
  lastRun?: string;
  runsCount: number;
}

export interface BlueprintRequest {
  idea: string;
  niche: string;
  tier: 'basic' | 'premium';
}

export interface TaskCompletionPayload {
  revenueIncrement: number;
  name?: string;
  title?: string;
  day?: number;
  tier?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowRunPayload {
  scenarioId?: string;
  name?: string;
  revenueImpact?: number;
  deployed?: boolean;
  integrated?: boolean;
  verified?: boolean;
  key?: string;
  timestamp?: number;
  [key: string]: any;
}

export type UserRole = 'Admin' | 'Operator' | 'Client';
export type CurrencySymbol = '$' | '€' | '£';

export interface TenantWorkspace {
  id: string;
  name: string;
  role: UserRole;
  currency: CurrencySymbol;
  customDomain?: string;
  primaryColor?: string;
  whiteLabelEnabled: boolean;
  operatorName: string;
  operatorEmail: string;
}

export interface CircuitBreakerStatus {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  lastFailureTime: number | null;
  successCount: number;
  latencyMs: number;
}

export interface SLACertificate {
  id: string;
  promiseId: string;
  promiseName: string;
  tenantId: string;
  issuedAt: string;
  sha256Hash: string;
  slaGuaranteeScore: number;
  status: 'active' | 'revoked' | 'audited';
  tier: 'Starter' | 'Pro' | 'Enterprise';
  price: number;
}

export interface MicroSaaSBlueprint {
  id: string;
  title: string;
  niche: string;
  tagline: string;
  priceStarter: number;
  pricePro: number;
  priceEnterprise: number;
  conversionFloor: number;
  category: 'Automation' | 'Monetization' | 'CRM' | 'Scraper' | 'Compliance';
  description: string;
  features: string[];
  makeScenarios: string[];
  rawMarkdown: string;
  architecturalSpecs: string;
}

export interface BlueprintResponse {
  success: boolean;
  rawMarkdown: string;
  parsedBlueprint: {
    title: string;
    executiveSummary: string;
    marketOpportunity: string;
    competitorAnalysis: string;
    monetizationStrategy: string;
    executionRoadmap: string[];
    investorMemoSummary: string;
    automationWorkflowSuggestions: string[];
    launchPhases: string[];
  };
  estimatedRevenues: {
    month1: number;
    month2: number;
    month3: number;
    conversionRate: number;
  };
}
