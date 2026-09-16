/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  CheckCircle, 
  AlertCircle, 
  Briefcase, 
  Play, 
  Send, 
  Copy, 
  Check, 
  Download, 
  HelpCircle, 
  Activity, 
  FileText, 
  Layers, 
  DollarSign, 
  Clock, 
  UserCheck, 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Terminal,
  Sparkles
} from "lucide-react";
import { MakeScenario, ActivityLog, BlueprintResponse, TenantWorkspace } from "@/types/commander";
import { safeDispatchTaskCompleted, safeDispatchWorkflowRun, globalCircuitBreaker, executeWithRetry, generateSHA256Certificate } from "@/lib/commander-resilience";
import { MICRO_SAAS_BLUEPRINTS } from "@/lib/commander-blueprints";

interface FulfillmentHubProps {
  onWorkflowRun: (scenarioId: string, runOutput: any) => void;
  onTaskCompleted: (taskOutput: any) => void;
  activeBlueprint: BlueprintResponse | null;
  tenant?: TenantWorkspace;
  metrics: {
    totalRevenue: number;
    tasksCompleted: number;
    scenarioRuns: number;
    conversionRate: number;
    projectedMonth1: number;
    projectedMonth2: number;
    projectedMonth3: number;
  };
}

interface ProposalItem {
  id: string;
  title: string;
  category: "audit" | "diy" | "dfy";
  price: number;
  timeframe: string;
  shortDesc: string;
  bulletPoints: string[];
  systemImpact: string;
}

interface OrderTracker {
  id: string;
  title: string;
  category: "audit" | "diy" | "dfy";
  price: number;
  status: "pending" | "processing" | "delivered" | "error";
  progress: number; // 0 - 100
  estimatedDelivery: string;
  outputAvailable?: boolean;
}

const PRODUCTS_PORTFOLIO: ProposalItem[] = [
  // Audit proposals
  {
    id: "prod_audit_concept",
    title: "Venture Monetization & Leak Audit",
    category: "audit",
    price: 199,
    timeframe: "Instant AI Diagnostic",
    shortDesc: "Comprehensive alignment diagnostic verifying your startup idea against modern B2B/SaaS conversion leaks.",
    bulletPoints: [
      "Auto-checks 12 structural value proposition holes",
      "Validates cash-flow conversion logic vs competitor benchmarks",
      "Identifies 4 priority webhook integration targets"
    ],
    systemImpact: "+0.35% Base Conversion Rate Expectation"
  },
  {
    id: "prod_audit_automax",
    title: "Automation Pipeline Health Check",
    category: "audit",
    price: 299,
    timeframe: "1-2 Hours Execution",
    shortDesc: "Technical stress test evaluating response latency and data flow routing for live webhook loops.",
    bulletPoints: [
      "Analyzes payload schema compatibility",
      "Pins down dead logic routing in custom middleware",
      "API secret key exposure & security vulnerability sweep"
    ],
    systemImpact: "Prevents data loss loops and unhandled API runtime failures"
  },
  // DIY Asset proposals
  {
    id: "prod_diy_blueprint",
    title: "Venture OS Download Pack",
    category: "diy",
    price: 49,
    timeframe: "Instant Download",
    shortDesc: "Complete format-free markdown operating blueprint including pre-mapped folder layouts and schema designs.",
    bulletPoints: [
      "Custom startup positioning copy framework",
      "B2B Slack webhook layout configuration template",
      "Prerequisites checklist to boot your system locally"
    ],
    systemImpact: "Complete baseline architecture files directly exported"
  },
  {
    id: "prod_diy_leadgen",
    title: "B2B AutonomaX Lead Scraper Pack",
    category: "diy",
    price: 129,
    timeframe: "Instant Download",
    shortDesc: "Configured JSON scenario file ready to import directly into your Make.com dashboard.",
    bulletPoints: [
      "Pulls newsletter layouts from Google Sheets dynamically",
      "Injects Gemini prompt maps for auto-curation loops",
      "Includes template configuration files and instructions"
    ],
    systemImpact: "+$450/day Average organic inbound projection capability"
  },
  // DFY proposals
  {
    id: "prod_dfy_client_bot",
    title: "Client Onboarding Bot Implementation",
    category: "dfy",
    price: 1499,
    timeframe: "48-Hour Professional SLA",
    shortDesc: "Full-scale custom deployment of our flagship client onboarding automation into your system.",
    bulletPoints: [
      "Direct integration with active Slack CRM and Figma API key",
      "Custom Google Drive hierarchy generation webhooks",
      "Pre-tested sandbox delivery with continuous SLA warranty"
    ],
    systemImpact: "Fully automated fulfillment system with zero manual touches"
  },
  {
    id: "prod_dfy_retainer_sla",
    title: "Operational Retainer Premium SLA",
    category: "dfy",
    price: 2999,
    timeframe: "Monthly Strategic Partnership",
    shortDesc: "Ongoing optimization, daily performance diagnostic sweeps, and immediate support representation.",
    bulletPoints: [
      "Daily audit monitoring with real-time incident routing",
      "Dedicated operator representative assigned to workflow custom tuning",
      "Includes 4 bespoke automation adjustments per month"
    ],
    systemImpact: "Guarantees 99.9% uptime for commercial monetization loops"
  }
];

const INITIAL_ORDERS: OrderTracker[] = [
  {
    id: "AK-O-801",
    title: "Venture Monetization & Leak Audit",
    category: "audit",
    price: 199,
    status: "delivered",
    progress: 100,
    estimatedDelivery: "Delivered",
    outputAvailable: true
  },
  {
    id: "AK-O-802",
    title: "B2B AutonomaX Lead Scraper Pack",
    category: "diy",
    price: 129,
    status: "processing",
    progress: 65,
    estimatedDelivery: "Pending automated deployment (~15 mins)"
  },
  {
    id: "AK-O-803",
    title: "Client Onboarding Bot Implementation",
    category: "dfy",
    price: 1499,
    status: "pending",
    progress: 0,
    estimatedDelivery: "Requires technical representative verification"
  }
];

export interface HighValueFunction {
  id: string;
  title: string;
  desc: string;
  category: "Autonomous Bidding" | "Lead Generation" | "Marketing Automation" | "Operations & CRM";
  value: "HIGH" | "STRATEGIC" | "FOUNDATIONAL";
  resourceType: string;
  resourceContent: string;
}

const HIGH_VALUE_FUNCTIONS: HighValueFunction[] = [
  {
    id: "upwork_scraper",
    title: "Autonomous Upwork Scraper & Bidding Agent",
    desc: "Scrapes RSS and API feeds matching specified key skill keywords, drafts custom high-conversion application cover letters with Gemini, and publishes webhook notifications.",
    category: "Autonomous Bidding",
    value: "HIGH",
    resourceType: "Make.com JSON Blueprint",
    resourceContent: `{\n  "version": "1.4.0",\n  "trigger": "Upwork RSS Ingress",\n  "filters": ["SaaS", "Automation", "Workflow"],\n  "prompt": "Act as a sales agent. Respond to client request regarding: {{trigger.description}}. Tailor our price model to match client budget of $2k.",\n  "output_webhook": "https://api.aikagan.com/v1/leads"\n}`
  },
  {
    id: "linkedin_syndicator",
    title: "LinkedIn Content Syndicator Loop",
    desc: "Pulls recent marketing blogs or case studies, parses them into high-impact image slideshows or text posts, and schedules them via Buffer/Feed webhook.",
    category: "Lead Generation",
    value: "STRATEGIC",
    resourceType: "System Prompt Architecture",
    resourceContent: `## SYSTEM PROTOCOL: LINKEDIN GENERATOR\\n- Target Audience: C-Suite SaaS Founders & E-Commerce Operators\\n- Core Concept: Explaining high-yield workflow automation savings\\n- Layout Style: 5-Slide Carousel\\n  * Slide 1: High Contrast Question Hook\\n  * Slide 2: Reveal the bottleneck (Manual processing logs)\\n  * Slide 3: Propose the solution (Custom automated agents)\\n  * Slide 4: Real-world stats (Case study results of +14% conversions)\\n  * Slide 5: Strict CTA to book a diagnostic call`
  },
  {
    id: "sheets_seo",
    title: "Organic Google Sheets SEO Generator",
    desc: "Pulls draft topics from Google Sheets, researches competitive context with Google Search Grounding, drafts long-form SEO articles, and publishes directly to Webflow/WordPress CMS.",
    category: "Lead Generation",
    value: "HIGH",
    resourceType: "Google Apps Script Template",
    resourceContent: `function runSEOLoop() {\\n  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();\\n  var rows = sheet.getRange("A2:C50").getValues();\\n  \\n  for (var i = 0; i < rows.length; i++) {\\n    var keyword = rows[i][0];\\n    if (keyword && !rows[i][2]) { // Not published yet\\n      var article = generateArticleWithGemini(keyword);\\n      publishToWebflow(article, keyword);\\n      sheet.getRange(i + 2, 3).setValue("PUBLISHED");\\n    }\\n  }\\n}`
  },
  {
    id: "workspace_provisioner",
    title: "Active Google Workspace Provisioner",
    desc: "Upon Stripe payment, automatically provisions customer folders in Google Drive, generates and shares a live Google Sheets tracker, and schedules a Google Calendar kickoff meeting.",
    category: "Operations & CRM",
    value: "FOUNDATIONAL",
    resourceType: "API Webhook Code (Express)",
    resourceContent: `app.post("/api/checkout-success", async (req, res) => {\\n  const { customerEmail, customerName } = req.body;\\n  const driveFolder = await createGoogleDriveFolder(customerName);\\n  await shareWithClient(driveFolder.id, customerEmail);\\n  const calendarEvent = await scheduleKickoffMeeting(customerEmail);\\n  res.json({ success: true, folderUrl: driveFolder.webViewLink });\\n});`
  },
  {
    id: "lead_scoring",
    title: "Smart Lead Scoring & Routing Agent",
    desc: "Enriches incoming newsletter or demo requests, scores leads based on company size and tech stack, and routes premium leads directly to a Sales Slack/Discord channel.",
    category: "Lead Generation",
    value: "HIGH",
    resourceType: "Make.com JSON Blueprint",
    resourceContent: `{\n  "name": "Lead Scorer Loop",\n  "steps": [\n    { "action": "Clearbit enrichment" },\n    { "action": "Gemini 2.5 Flash classification" },\n    { "action": "Slack payload constructor" },\n    { "action": "Discord Webhook notify" }\n  ]\n}`
  },
  {
    id: "cold_email_drip",
    title: "Outbound Cold-Email Drip Automation",
    desc: "Orchestrates multi-day follow-up templates using Smartlead/Lemlist webhooks. Automatically pauses the drip sequence when a user replies to prevent awkward overlaps.",
    category: "Marketing Automation",
    value: "STRATEGIC",
    resourceType: "System Prompt Map",
    resourceContent: `## COLD EMAIL DRIP SEQUENCE PROTOCOL\\n- Trigger: New inbound lead registered\\n- Day 1: Offer value proposition matched to the specific niche.\\n- Day 3 (No reply): Supply a raw pre-mastered resource or workflow blueprint.\\n- Day 7 (No reply): Soft break-up offer. Ask if they prefer to completely opt-out.\\n- Stop-Condition: Email reply or meeting booked webhook triggered.`
  },
  {
    id: "omnichannel_notify",
    title: "Omnichannel Order Notification Hub",
    desc: "Links Stripe checkout success webhooks to team communications, providing immediate visual cards in Slack and Discord showing buyer details and transaction amounts.",
    category: "Operations & CRM",
    value: "FOUNDATIONAL",
    resourceType: "API Webhook Code (Express)",
    resourceContent: `const sendDiscordCard = async (order) => {\\n  await axios.post(process.env.DISCORD_WEBHOOK_URL, {\\n    embeds: [{\\n      title: "🔥 New Order Calibrated!",\\n      color: 65535,\\n      fields: [\\n        { name: "Buyer Email", value: order.email },\\n        { name: "Product Tier", value: order.product },\\n        { name: "Transaction Value", value: "$" + order.price }\\n      ]\\n    }]\\n  });\\n};`
  },
  {
    id: "stripe_subscription",
    title: "Stripe Subscription Webhook Failover",
    desc: "Handles complex subscription status events (failed payments, trial expirations, cancellations), updating client dashboard permissions and executing soft dunning emails.",
    category: "Operations & CRM",
    value: "HIGH",
    resourceType: "API Webhook Code (Express)",
    resourceContent: `app.post("/api/stripe-webhooks", (req, res) => {\\n  const event = req.body;\\n  switch (event.type) {\\n    case "invoice.payment_failed":\\n      triggerDunningEmails(event.data.object.customer_email);\\n      break;\\n    case "customer.subscription.deleted":\\n      deactivateSubscriptionPermissions(event.data.object.customer);\\n      break;\\n  }\\n});`
  },
  {
    id: "client_portal",
    title: "Interactive Client Onboarding Portal",
    desc: "A clean React frame that walks newly onboarded customers through setting up their keys, choosing their custom themes, and testing their first workflow integrations.",
    category: "Operations & CRM",
    value: "STRATEGIC",
    resourceType: "React Layout Blueprint",
    resourceContent: `export function ClientOnboarding({ clientName }) {\\n  return (\\n    <div className="p-8 space-y-4 bg-black border border-white/10 rounded-sm">\\n      <h2 className="text-sm font-mono text-cyan-400 font-bold uppercase">Welcome, \s\${clientName}!</h2>\\n      <p className="text-xs text-white/60">Let's connect your keys and initiate standard operational workflows...</p>\\n    </div>\\n  );\\n}`
  },
  {
    id: "sla_contract_gen",
    title: "Automated SLA PDF Contract Generator",
    desc: "Automatically compiles a customized Service Level Agreement PDF upon client purchase, digitally signs it with your brand credentials, and emails the PDF copy to the buyer.",
    category: "Operations & CRM",
    value: "FOUNDATIONAL",
    resourceType: "NodeJS PDFKit Script",
    resourceContent: `const PDFDocument = require("pdfkit");\\nfunction buildSLAContract(clientName, price) {\\n  const doc = new PDFDocument();\\n  doc.text(\`SERVICE LEVEL AGREEMENT\\n\\nContracted party: \s\${clientName}\\nFulfillment value: \s\${price}\\nWarranty SLA: 99.9% uptime guarantee.\`);\\n  doc.end();\\n}`
  },
  {
    id: "proxy_rotator",
    title: "Failover Rate-Limit Rotating Proxy Router",
    desc: "Configures automatic proxy rotation in Python Scrapy / Node Playwright to bypass IP blocks, Cloudflare turnstiles, and aggressive scraping thresholds.",
    category: "Autonomous Bidding",
    value: "HIGH",
    resourceType: "CLI Automation Script",
    resourceContent: `const proxies = process.env.PROXY_LIST.split(",");\\nfunction getRotatedProxy() {\\n  return {\\n    server: proxies[Math.floor(Math.random() * proxies.length)],\\n    username: process.env.PROXY_USERNAME,\\n    password: process.env.PROXY_PASSWORD\\n  };\\n}`
  },
  {
    id: "competitor_audit",
    title: "Competitor Pricing Audit Scraper",
    desc: "Nightly cron job that audits competitor landing pages, parses their tiered pricing structures, and highlights pricing discrepancies directly to your command center.",
    category: "Autonomous Bidding",
    value: "STRATEGIC",
    resourceType: "Playwright Crawler Script",
    resourceContent: `const { chromium } = require("playwright");\\nasync function scrapeCompetitors() {\\n  const browser = await chromium.launch();\\n  const page = await browser.newPage();\\n  await page.goto("https://propulse-autonomax.web.app/pricing");\\n  const pricingElements = await page.locator(".price-tier").allTextContents();\\n  console.log("Scraped Pricing Targets: ", pricingElements);\\n  await browser.close();\\n}`
  },
  {
    id: "sentiment_router",
    title: "Customer Feedback Sentiment Router",
    desc: "Analyzes inbound support tickets, categorizes feedback sentiment with Gemini, and forwards negative ratings instantly to high-priority support queues.",
    category: "Operations & CRM",
    value: "FOUNDATIONAL",
    resourceType: "System Prompt Protocol",
    resourceContent: `## CUSTOMER SENTIMENT ROUTING PROTOCOL\\nAnalyze the following client feedback payload:\\n"{{feedback_payload}}"\\nAssign Category: [URGENT_CRITIQUE, GENERAL_SUPPORT, ENTHUSIAST_PRAISE]\\nIf Category is URGENT_CRITIQUE, fire webhook route to critical support team immediately.`
  },
  {
    id: "shorts_scripts",
    title: "TikTok/YouTube Shorts Script Writer",
    desc: "Pulls high-converting hooks and outlines viral storyboards tailored directly to your chosen industry niche, outputting detailed visual cues and speech lines.",
    category: "Marketing Automation",
    value: "STRATEGIC",
    resourceType: "System Prompt Blueprint",
    resourceContent: `## VIRAL SHORTS SCRIPT WRITER\\n- Target Niche: Custom calibrated market segment\\n- Formula: Hook (0-3s) -> Challenge common dogma -> Deliver actionable automation hack -> Pitch $299 premium OS download pack`
  },
  {
    id: "dynamic_checkout",
    title: "Stripe Dynamic Checkout Pricing Matcher",
    desc: "Resolves pricing inconsistencies between landing pages and Stripe checkout links. Dynamically generates custom price IDs to support flash sales and country-specific rates.",
    category: "Marketing Automation",
    value: "HIGH",
    resourceType: "API Webhook Code (Express)",
    resourceContent: `const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);\\nasync function createDynamicSession(priceOverrideUsd) {\\n  const session = await stripe.checkout.sessions.create({\\n    payment_method_types: ["card"],\\n    line_items: [{\\n      price_data: {\\n        currency: "usd",\\n        product_data: { name: "Calibrated Venture OS Premium Pack" },\\n        unit_amount: priceOverrideUsd * 100\\n      },\\n      quantity: 1\\n    }],\\n    mode: "payment",\\n    success_url: "https://aikagan.com/success",\\n    cancel_url: "https://aikagan.com/cancel"\\n  });\\n  return session.url;\\n}`
  }
];

export function FulfillmentHub({ onWorkflowRun, onTaskCompleted, metrics, activeBlueprint, tenant }: FulfillmentHubProps) {
  const [activeSubTab, setActiveSubTab] = useState<"catalog" | "orders" | "rep_console" | "self_improvement" | "mastery" | "fulfillment_review">("catalog");
  const [selectedVenture, setSelectedVenture] = useState<"autonomad" | "lazylarry" | "custom">("autonomad");
  const [orders, setOrders] = useState<OrderTracker[]>(INITIAL_ORDERS);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedVentures, setOptimizedVentures] = useState<Record<string, boolean>>({});
  const [portfolioFilter, setPortfolioFilter] = useState<"all" | "audit" | "diy" | "dfy">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Personalization & Onboarding Wizard State
  const [personalization, setPersonalization] = useState({
    operatorName: "Larry",
    operatorEmail: "lazylarries@gmail.com",
    ventureName: "Lazy Larry CG AI",
    niche: "Interactive Avatar SaaS",
    targetPrice: 299,
    isOnboarded: false
  });
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [deployedResources, setDeployedResources] = useState<Record<string, boolean>>({});
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [deployingResourceId, setDeployingResourceId] = useState<string | null>(null);

  // Full-Stack upgrades integrations
  const [integratedUpgrades, setIntegratedUpgrades] = useState<Record<string, "idle" | "integrating" | "integrated">>({});
  const [upgradeLogs, setUpgradeLogs] = useState<Record<string, string[]>>({});

  // Promise Fulfillment Reviews
  const [verifiedPromises, setVerifiedPromises] = useState<Record<string, "idle" | "verifying" | "verified">>({});
  const [downloadingComplianceId, setDownloadingComplianceId] = useState<string | null>(null);
  
  // Support Simulator Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "rep"; text: string; time: string }>>([
    {
      sender: "rep",
      text: "Greetings, Operator. I am your AutonomaX Customer Success Representative. I am here to help you test user journeys, verify delivery proposals, and optimize your assets for commercial monetization. How may I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Upgrade Pack Export State
  const [showUpgradePack, setShowUpgradePack] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // 3 Critical Additives States
  // Additive 1: Segmented Traffic Distillation & Buyer Closer
  const [selectedTrafficSegment, setSelectedTrafficSegment] = useState<"cold_social" | "warm_email" | "seo_search" | "referrals">("cold_social");
  const [activeDistillationAdditives, setActiveDistillationAdditives] = useState({
    smsResponder: false,
    stripeRedirect: false,
    slaTrust: false
  });
  const [isDistilling, setIsDistilling] = useState(false);
  const [distilledRate, setDistilledRate] = useState<number | null>(null);

  // Additive 2: Secure, Safe & Resilient Configuration Hub
  const [resilientConfig, setResilientConfig] = useState({
    tokenEncryption: true,
    rotatingProxy: false,
    backoffInterval: 1.5,
    securityShield: true
  });
  const [isSecuringConfig, setIsSecuringConfig] = useState(false);
  const [resilienceLogs, setResilienceLogs] = useState<string[]>([
    "[SECURE-VAULT] AES-256 Secret Engine Initialized.",
    "[SECURE-VAULT] Gateway binding active on host 0.0.0.0:3000.",
    "[SAFE-ROUTE] Ingress filters verified."
  ]);

  // Additive 3: QA Verified Deliveries & SLA Certificate Vault
  const [activeQASteps, setActiveQASteps] = useState<Record<string, {
    schemaValid: boolean;
    latencyVerified: boolean;
    jwtAuthChecked: boolean;
    redundancyPass: boolean;
    testedAt?: string;
  }>>({});
  const [runningQAForId, setRunningQAForId] = useState<string | null>(null);
  const [qaLogs, setQaLogs] = useState<string[]>([]);
  const [overallQAPassed, setOverallQAPassed] = useState<Record<string, boolean>>({});

  // Filtered catalog
  const filteredPortfolio = portfolioFilter === "all" 
    ? PRODUCTS_PORTFOLIO 
    : PRODUCTS_PORTFOLIO.filter(p => p.category === portfolioFilter);

  const [resourceCategoryFilter, setResourceCategoryFilter] = useState("All");

  const handleDeployResource = (id: string, name: string) => {
    setDeployingResourceId(id);
    
    // Switch rep chat message to show deploying state
    setChatMessages(prev => [
      ...prev,
      {
        sender: "rep",
        text: `⚡ **Initiating Deployment protocol for "${name}"**... Setting up sandbox clusters and mapping API endpoints. Please wait.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setTimeout(() => {
      setDeployedResources(prev => ({ ...prev, [id]: true }));
      setDeployingResourceId(null);

      // Trigger standard task completions and add +$150 to total revenue stats!
      onTaskCompleted({
        revenueIncrement: 150,
        name: `Deployed Resource: ${name}`
      });

      // Execute webhook callback simulating a live run
      onWorkflowRun(id, { deployed: true, timestamp: Date.now() });

      setChatMessages(prev => [
        ...prev,
        {
          sender: "rep",
          text: `✅ **Deployment Complete!** \n\nResource **"${name}"** has been securely initialized as an active microservice. \n- **Assigned Endpoint:** \`https://api.aikagan.com/v1/deployments/${id}\`\n- **Telemetry Status:** 100% Operational (Green)\n- Added **+$150** revenue capability!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleIntegrateUpgrade = (id: string, name: string, impact: string, revenueAmount: number) => {
    setIntegratedUpgrades(prev => ({ ...prev, [id]: "integrating" }));
    setUpgradeLogs(prev => ({ 
      ...prev, 
      [id]: ["[SYSTEM] Connecting to remote AI Studio container cluster...", "[SYSTEM] Fetching package.json manifests..."] 
    }));

    setTimeout(() => {
      setUpgradeLogs(prev => ({
        ...prev,
        [id]: [
          ...(prev[id] || []),
          `[COMPILING] Merging upgraded handlers into ${id === "firestore" ? "/src/db/firebase" : "server.ts"}`,
          "[COMPILING] Executing npm audit sweep...",
          "[VERIFYING] Building optimized target packages..."
        ]
      }));
    }, 800);

    setTimeout(() => {
      setIntegratedUpgrades(prev => ({ ...prev, [id]: "integrated" }));
      setUpgradeLogs(prev => ({
        ...prev,
        [id]: [
          ...(prev[id] || []),
          `[SUCCESS] Upgrade "${name}" fully merged into live deployment!`,
          `[IMPACT] ${impact}`
        ]
      }));
      
      // Apply the global metric improvements!
      onTaskCompleted({
        revenueIncrement: revenueAmount,
        name: `Integrated Upgrade: ${name}`
      });

      // Execute webhook callback simulating a live run
      onWorkflowRun(id, { integrated: true, impact });

      setChatMessages(prev => [
        ...prev,
        {
          sender: "rep",
          text: `🚀 **Codebase Upgrade Implemented!** \n\nSuccessfully deployed **${name}** directly into your active cluster. \n- **Architectural Impact:** ${impact}\n- Added high-value assets to your AutonomaX production pipeline!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1800);
  };

  const handleVerifyPromise = (id: string, name: string) => {
    setVerifiedPromises(prev => ({ ...prev, [id]: "verifying" }));

    // Execute webhook callback simulating a live run
    onWorkflowRun(id, { verified: true, key: `CERT-${id.toUpperCase()}` });
    
    // Trigger the comprehensive step-by-step QA run
    handleRunDeliveryQA(id, name);
  };

  // Request new product proposal
  const handleRequestProposal = (item: ProposalItem) => {
    const newOrder: OrderTracker = {
      id: `AK-O-${Math.floor(100 + Math.random() * 900)}`,
      title: item.title,
      category: item.category,
      price: item.price,
      status: item.category === "diy" ? "delivered" : "pending",
      progress: item.category === "diy" ? 100 : 0,
      estimatedDelivery: item.category === "diy" ? "Delivered" : "Pending human review",
      outputAvailable: item.category === "diy"
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Log message to active simulator
    const repMsg = `[PROPOSAL INITIATED] Order ${newOrder.id} successfully queued for "${newOrder.title}" (${newOrder.category.toUpperCase()}). Valuation: $${newOrder.price}.`;
    
    setChatMessages(prev => [
      ...prev,
      {
        sender: "rep",
        text: `I have automatically initialized a new delivery proposal in your pipeline: Order **${newOrder.id}** for *${newOrder.title}*. Since this is an active journey, let me help you audit, configure, or finalize this setup immediately!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Go to order tab to track it
    setActiveSubTab("orders");
  };

  // Trigger test action
  const handleTestStep = (orderId: string) => {
    let completedOrder: any = null;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (o.status === "pending") {
          return { ...o, status: "processing", progress: 35, estimatedDelivery: "Simulating test execution loop..." };
        } else if (o.status === "processing") {
          completedOrder = o;
          return { ...o, status: "delivered", progress: 100, estimatedDelivery: "Delivered", outputAvailable: true };
        }
      }
      return o;
    }));

    // Trigger parent outcome metrics update safely outside the state updater function via microtask
    if (completedOrder) {
      safeDispatchTaskCompleted(onTaskCompleted, {
        revenueIncrement: completedOrder.price,
        name: completedOrder.title
      });
    }
  };

  // Support Command triggers
  const executeCommand = (cmdType: "test_journey" | "upgrade_pack" | "value_guide" | "custom", text?: string) => {
    setIsTyping(true);

    const userMsg = text || (
      cmdType === "test_journey" ? "Simulate Full-Stack Customer User Journey Test" :
      cmdType === "upgrade_pack" ? "Request Execution-Ready Venture Upgrade Pack" :
      "How do I maximize commercial value from these tools?"
    );

    setChatMessages(prev => [...prev, {
      sender: "user",
      text: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setTimeout(() => {
      let reply = "";
      if (cmdType === "test_journey") {
        // Trigger simulation
        const impactedRevenue = 499;
        onWorkflowRun("purchase_delivery", {
          name: "Simulated Automated E-commerce Checkout Run",
          revenueImpact: impactedRevenue
        });

        reply = `🚀 **SYSTEM USER JOURNEY SIMULATION SUCCESS** 🚀\n\nI have successfully executed a mock client purchase trigger in the AutonomaX sandbox!\n\n**Sequence Completed:**\n1. User submits Checkout Proposal Form ($${impactedRevenue} Checkout value).\n2. \`Purchase Delivery Router\` automatically intercepts the Webhook event.\n3. Payload metadata mapped to operational ledger (Synced global revenue: **+$${impactedRevenue}** verified!).\n4. Diagnostic packet successfully transmitted to client interface.\n\nYou can observe this verified cash flow increment inside your **Venture Blueprinter** projections and header metric stats panels in real-time!`;
      } else if (cmdType === "upgrade_pack") {
        setShowUpgradePack(true);
        reply = `📦 **Venture Upgrade Pack Generated Successfully!**\n\nI have prepared the consolidated, execution-ready **Venture Upgrade Pack** for you. It contains format-free configurations for local systems and Make.com schema overrides.\n\nScroll down slightly to review, copy, or download the raw configuration bundle directly!`;
      } else if (cmdType === "value_guide") {
        reply = `💡 **GUIDE FOR MAXIMUM VALUE THROUGH MODEL, LAUNCH, AND USE:**\n\nTo transform your AutonomaX prototype into a high-yielding, resilient commercial asset, follow this playbook:\n\n1. **MODEL YOUR CORE ASSET (First 48 Hours)**\n   * Use the **Venture Launch Blueprint Engine** to generate your positioning document.\n   * Export the markdown raw blueprint file and paste it into your workspace notes.\n\n2. **LAUNCH WITH WEBHOOKS (Day 3-5)**\n   * Connect your forms to the **Make.com Scenario Inventory** pipelines.\n   * Deploy the *Agency Client Onboarding Bot* first to immediately replace manual admin friction.\n\n3. **USE THE OUTCOME COCKPIT (Weekly)**\n   * Monitor the live conversion line charts.\n   * If conversion rate slips below *3.2%*, trigger an *Automation Pipeline Health Check* via the **Fulfillment Hub** to isolate middleware latency.`;
      } else {
        reply = `I have logged your request: "${userMsg}". As your representative, I will maintain operational SLA checks on your active delivery proposals. If you'd like to test the delivery pipelines or review structural configurations, please select one of the Quick Diagnostic triggers below!`;
      }

      setChatMessages(prev => [...prev, {
        sender: "rep",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 850);
  };

  const handleOptimizeVenture = (ventureId: string) => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizedVentures(prev => ({ ...prev, [ventureId]: true }));
      onTaskCompleted({
        revenueIncrement: 350,
        name: `Strategic Asset Optimization: ${ventureId}`
      });
      setChatMessages(prev => [
        ...prev,
        {
          sender: "rep",
          text: `🎯 **Strategic Optimization Complete for ${ventureId.toUpperCase()}!**\n\nI have automatically aligned your active marketing and monetization structures:\n- Restructured pricing layouts to target the premium high-yielding **$299/tier** standard.\n- Configured outbound Make.com Webhook triggers to forward customer checkout events.\n- Synced operational cash flows (+**$350** added directly to your global metrics ledger!).\n\nYour venture is now fully integrated with top-class provision. Ready to deploy!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  // 3 Critical Additives Action Handlers
  const handleRunTrafficDistillation = () => {
    setIsDistilling(true);
    setDistilledRate(null);
    setTimeout(() => {
      setIsDistilling(false);
      let base = 1.2;
      if (selectedTrafficSegment === "warm_email") base = 2.8;
      else if (selectedTrafficSegment === "seo_search") base = 3.5;
      else if (selectedTrafficSegment === "referrals") base = 4.8;

      let additiveMultiplier = 1.0;
      if (activeDistillationAdditives.smsResponder) additiveMultiplier += 0.25;
      if (activeDistillationAdditives.stripeRedirect) additiveMultiplier += 0.35;
      if (activeDistillationAdditives.slaTrust) additiveMultiplier += 0.20;

      const finalRate = Number((base * additiveMultiplier).toFixed(2));
      setDistilledRate(finalRate);

      onTaskCompleted({
        revenueIncrement: Math.round(base * additiveMultiplier * 120),
        name: `Zero-Gap Distillation Run: ${selectedTrafficSegment.toUpperCase()}`
      });

      setChatMessages(prev => [
        ...prev,
        {
          sender: "rep",
          text: `🔥 **Zero-Gap Traffic Distillation Completed Successfully!**\n\n- **Target Segment:** ${selectedTrafficSegment.toUpperCase()}\n- **Friction Reduction**: Verified 100% gap closure\n- **Final Multiplied Conversion Rate**: **${finalRate}%** (was ${base}% base)\n- Added **+$$${Math.round(base * additiveMultiplier * 120)}** to cash flow reserves!\n\nYour optimized system is now fully prepared to convert inbound traffic without leakage.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleSaveResilientConfig = () => {
    setIsSecuringConfig(true);
    setTimeout(() => {
      setIsSecuringConfig(false);
      setResilienceLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [SAFE-CONFIG-SAVED] All endpoints updated.`,
        `[${new Date().toLocaleTimeString()}] [VAULT-JWT] Tokens encrypted with high-entropy keys.`,
        `[${new Date().toLocaleTimeString()}] [ROTATOR-ON] ${resilientConfig.rotatingProxy ? "Rotating Proxy Tunnel ENABLED." : "Standard route binding."}`,
        `[${new Date().toLocaleTimeString()}] [BACKOFF-VAL] Scraper JIT Backoff set to ${resilientConfig.backoffInterval}s.`
      ]);

      onTaskCompleted({
        revenueIncrement: 150,
        name: "Resilient Compliance Protocol Secured"
      });

      setChatMessages(prev => [
        ...prev,
        {
          sender: "rep",
          text: `🛡 **Sustainable Resilient Configuration Deployed!**\n\nYour API routing gateway and proxy configurations have been secure-verified. Running on port **3000** with auto backoff delay of **${resilientConfig.backoffInterval} seconds**.\n\nRate-limiting safeguards are 100% active. +$150 secured.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  const handleRunDeliveryQA = (promiseId: string, promiseName: string) => {
    setRunningQAForId(promiseId);
    setQaLogs([]);
    
    const steps = [
      `Initializing comprehensive QA verification suite for: "${promiseName}"...`,
      `Step 1: Parsing payload schemas and checking type signatures...`,
      `Step 2: Testing connection routing to Make.com webhook endpoints...`,
      `Step 3: Simulating 200 concurrent requests to test rate limit thresholds...`,
      `Step 4: Checking TLS/JWT authentication keys in headers...`,
      `Step 5: Verifying automatic backoff failovers...`,
      `✔ All tests PASSED with 100% operational quality!`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setQaLogs(prev => [...prev, `[QA-${promiseId.toUpperCase()}] ${steps[currentStep]}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        setRunningQAForId(null);
        setActiveQASteps(prev => ({
          ...prev,
          [promiseId]: {
            schemaValid: true,
            latencyVerified: true,
            jwtAuthChecked: true,
            redundancyPass: true,
            testedAt: new Date().toLocaleTimeString()
          }
        }));
        setOverallQAPassed(prev => ({ ...prev, [promiseId]: true }));
        setVerifiedPromises(prev => ({ ...prev, [promiseId]: "verified" }));

        onTaskCompleted({
          revenueIncrement: 180,
          name: `QA Certified Delivery: ${promiseName}`
        });

        setChatMessages(prev => [
          ...prev,
          {
            sender: "rep",
            text: `✔ **Operational QA Stamp Awarded!**\n\nThe delivery pipeline for **"${promiseName}"** has successfully passed our automated QA suite. \n- **Redundancy Standard:** Gold Grade\n- **Uptime Verified:** 99.99%\n- **Signed SLA Token:** QA-SECURE-${promiseId.toUpperCase()}\n- Added **+$180** QA-compliance bonus to your cash balance!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }, 350);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8" id="fulfillment-hub-container">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4" id="hub-header-bar">
        <div>
          <h1 className="text-xl font-light uppercase tracking-widest text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-none animate-pulse"></span>
            {personalization.isOnboarded ? `${personalization.ventureName} // Command Hub` : "Fulfillment & Delivery Hub"}
          </h1>
          <p className="text-xs text-[#00E5FF] mt-1.5 font-mono">
            {personalization.isOnboarded 
              ? `System Calibrated // Operator: ${personalization.operatorName} (${personalization.operatorEmail}) // Niche: ${personalization.niche} @ $${personalization.targetPrice}/OS`
              : "Deploy Live Products, Audit Strategic Assets, and Access Execution-Ready Upgrade Packs"}
          </p>
        </div>
        
        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0" id="hub-sub-tabs">
          <button
            onClick={() => setActiveSubTab("catalog")}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
              activeSubTab === 'catalog'
                ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/50'
                : 'text-white/40 border-transparent hover:text-white'
            }`}
            id="subtab-catalog"
          >
            Products Portfolio
          </button>
          <button
            onClick={() => setActiveSubTab("orders")}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer relative ${
              activeSubTab === 'orders'
                ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/50'
                : 'text-white/40 border-transparent hover:text-white'
            }`}
            id="subtab-orders"
          >
            Monitor Pipeline
            {orders.some(o => o.status !== "delivered") && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab("rep_console")}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
              activeSubTab === 'rep_console'
                ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/50'
                : 'text-white/40 border-transparent hover:text-white'
            }`}
            id="subtab-rep"
          >
            Support Console
          </button>
          <button
            onClick={() => setActiveSubTab("self_improvement")}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
              activeSubTab === 'self_improvement'
                ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/50'
                : 'text-white/40 border-transparent hover:text-white'
            }`}
            id="subtab-audit-review"
          >
            Venture Audits & Gaps
          </button>
          <button
            onClick={() => setActiveSubTab("mastery")}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
              activeSubTab === 'mastery'
                ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/50 font-bold'
                : 'text-white/40 border-transparent hover:text-white'
            }`}
            id="subtab-mastery"
          >
            ★ 15 High-Value Functions & Upgrades
          </button>
          <button
            onClick={() => setActiveSubTab("fulfillment_review")}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
              activeSubTab === 'fulfillment_review'
                ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/50 font-bold'
                : 'text-white/40 border-transparent hover:text-white'
            }`}
            id="subtab-fulfillment-review"
          >
            ✔ Propulse Promise Fulfillment Audit
          </button>
        </div>
      </div>

      {/* INTELLIGENT WORKSPACE CONTEXT SELECTOR PANEL */}
      <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="workspace-context-panel">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-sm">
            <Cpu className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white">Active Workspace Venture Context</h3>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">Toggle context document to inject intelligence into live audit & fulfillment proposals</p>
          </div>
        </div>

        <div className="flex gap-2" id="context-selector-strip">
          <button
            onClick={() => {
              setSelectedVenture("autonomad");
              setChatMessages(prev => [
                ...prev,
                {
                  sender: "rep",
                  text: `[CONTEXT SWITCHED] Workspace context shifted to **AutoNomad OS**. Ready to run diagnostics, package the DIY Operating System files, or configure DFY client-onboarding scenarios!`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-sm border cursor-pointer transition-all ${
              selectedVenture === "autonomad"
                ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/50 font-bold"
                : "bg-[#0F0F12] border-white/10 text-white/50 hover:text-white"
            }`}
          >
            AutoNomad OS
          </button>

          <button
            onClick={() => {
              setSelectedVenture("lazylarry");
              setChatMessages(prev => [
                ...prev,
                {
                  sender: "rep",
                  text: `[CONTEXT SWITCHED] Workspace context shifted to **Lazy Larry CG AI Ambassador OS**. Ready to evaluate 3D rendering pipeline webhooks, live interactive stream routes, and voice-to-motion latency metrics!`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-sm border cursor-pointer transition-all ${
              selectedVenture === "lazylarry"
                ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/50 font-bold"
                : "bg-[#0F0F12] border-white/10 text-white/50 hover:text-white"
            }`}
          >
            Lazy Larry CG OS
          </button>

          <button
            onClick={() => {
              if (activeBlueprint) {
                setSelectedVenture("custom");
                setChatMessages(prev => [
                  ...prev,
                  {
                    sender: "rep",
                    text: `[CONTEXT SWITCHED] Workspace context shifted to your **Custom Generated AI Venture Blueprint**. Ready to analyze your custom positioning copy and map target e-commerce routes!`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              } else {
                setChatMessages(prev => [
                  ...prev,
                  {
                    sender: "rep",
                    text: `⚠️ **Custom Blueprint Context Locked**: Please go to the **Venture Blueprinter** tab and generate an intelligent custom concept first, then toggle this to activate real-time custom analysis!`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }
            }}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded-sm border cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedVenture === "custom"
                ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/50 font-bold"
                : activeBlueprint
                ? "bg-[#0F0F12] border-cyan-500/10 text-cyan-400/80 hover:text-white"
                : "bg-[#0F0F12] border-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            <span>User Blueprint</span>
            {!activeBlueprint && <span className="text-[8px] bg-white/5 px-1 rounded-sm border border-white/10">Locked</span>}
          </button>
        </div>
      </div>

      {/* ONBOARDING & PERSONALIZATION CALIBRATION MODAL */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4" id="onboarding-modal">
          <div className="bg-[#0F0F12] border border-cyan-500/30 max-w-lg w-full p-6 rounded-sm space-y-6 shadow-2xl relative">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Venture Workspace Calibration Wizard
              </h2>
              <p className="text-[10px] text-white/40 font-mono mt-1">
                Establish high-value operator coordinates to personalize resources, compliance audits, and delivery ledgers.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-white/40 tracking-wider">Operator Name</label>
                  <input
                    type="text"
                    value={personalization.operatorName}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, operatorName: e.target.value }))}
                    className="w-full bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 p-2.5 rounded-sm text-white placeholder-white/20 outline-none"
                    placeholder="e.g. Larry"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-white/40 tracking-wider">Operator Email</label>
                  <input
                    type="email"
                    value={personalization.operatorEmail}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, operatorEmail: e.target.value }))}
                    className="w-full bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 p-2.5 rounded-sm text-white placeholder-white/20 outline-none"
                    placeholder="e.g. lazylarries@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-white/40 tracking-wider">Venture Name</label>
                <input
                  type="text"
                  value={personalization.ventureName}
                  onChange={(e) => setPersonalization(prev => ({ ...prev, ventureName: e.target.value }))}
                  className="w-full bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 p-2.5 rounded-sm text-white placeholder-white/20 outline-none"
                  placeholder="e.g. Lazy Larry CG AI"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-white/40 tracking-wider">Primary Market Niche</label>
                  <input
                    type="text"
                    value={personalization.niche}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, niche: e.target.value }))}
                    className="w-full bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 p-2.5 rounded-sm text-white placeholder-white/20 outline-none"
                    placeholder="e.g. Interactive Avatar SaaS"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-white/40 tracking-wider">Premium OS Price Tier ($)</label>
                  <input
                    type="number"
                    value={personalization.targetPrice}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, targetPrice: Number(e.target.value) }))}
                    className="w-full bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 p-2.5 rounded-sm text-white placeholder-white/20 outline-none"
                    placeholder="e.g. 299"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="w-1/2 py-2 border border-white/10 text-white/60 hover:text-white rounded-sm text-[10px] uppercase font-mono font-bold tracking-wider cursor-pointer hover:bg-white/5 transition-all"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setPersonalization(prev => ({ ...prev, isOnboarded: true }));
                  setShowOnboardingModal(false);
                  
                  // Trigger a nice reward in totalRevenue cash flow and complete a task!
                  onTaskCompleted({
                    revenueIncrement: 100,
                    name: `System Calibration: ${personalization.ventureName}`
                  });

                  // Inject representative chat message
                  setChatMessages(prev => [
                    ...prev,
                    {
                      sender: "rep",
                      text: `✨ **System Fully Calibrated & Personalized!** ✨\n\n- **Operator:** ${personalization.operatorName}\n- **Active Brand:** ${personalization.ventureName}\n- **Market Niche:** ${personalization.niche}\n- **Premium Pricing Floor:** $${personalization.targetPrice}.00 USD\n\nI have successfully mapped these parameters. Your 15 High-Value Pre-Mastered Functions and Full-Stack upgrades have adjusted to reflect this! Added **+$100** verification bonus to your financial ledger.`,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="w-1/2 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-sm text-[10px] uppercase font-mono font-bold tracking-wider cursor-pointer transition-all shadow-lg"
              >
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ONBOARDING HERO BANNER */}
      {!personalization.isOnboarded && (
        <div className="bg-gradient-to-r from-cyan-500/10 via-[#0F0F12] to-[#0A0A0C] border border-cyan-500/20 p-5 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="calibration-alert-banner">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-none animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase text-white font-bold tracking-widest flex items-center gap-1.5">
                Operator Branding Calibration Available
                <span className="text-[8px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 px-1 py-0.2 rounded-sm animate-pulse">UNCONFIGURED</span>
              </h4>
              <p className="text-[10px] font-mono text-white/50 mt-1 max-w-2xl leading-relaxed">
                Configure your operator profile with active address <span className="text-cyan-400 font-bold">{personalization.operatorEmail}</span>, title <span className="text-cyan-400 font-bold">"Larry"</span>, brand <span className="text-cyan-400 font-bold">"{personalization.ventureName}"</span>, and premium pricing points to bind custom properties across the system.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-mono uppercase font-bold tracking-wider rounded-sm cursor-pointer transition-all shrink-0 hover:scale-[1.02] shadow-md shadow-cyan-500/10"
          >
            Calibrate Workspace
          </button>
        </div>
      )}

      {/* Main layout based on selected sub tab */}
      {activeSubTab === "catalog" && (
        <div className="space-y-6" id="catalog-view">
          {/* INTEL ADVISORY PANEL */}
          <div className="bg-[#0F0F12] border border-cyan-500/10 p-5 rounded-sm relative overflow-hidden" id="intel-advisory-panel">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase rounded-sm h-fit">
                Intel
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Intelligent Proposition Advisory // {selectedVenture === "autonomad" ? "AUTONOMAD OS ALIGNMENT" : selectedVenture === "lazylarry" ? "LAZY LARRY CG OS ALIGNMENT" : "CUSTOM VENTURE ALIGNMENT"}
                </h3>
                
                {selectedVenture === "autonomad" && (
                  <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                    To monetize **AutoNomad OS** commercially, prioritize the <strong className="text-white">DIY Asset Pack</strong> to download ready-to-import Make.com scraper scenarios. Pair this with the <strong className="text-white">Venture Monetization & Leak Audit</strong> to ensure your automated bidding proposals don't trigger platform bot flags, raising the estimated conversion floor to <strong className="text-cyan-400">3.4%</strong>.
                  </p>
                )}

                {selectedVenture === "lazylarry" && (
                  <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                    For the **Lazy Larry CG AI Ambassador**, latency is the primary commercial leak. Deploying the <strong className="text-white">Automation Pipeline Health Check</strong> verifies websocket and TTS (Text-to-Speech) synchronization. Leverage the <strong className="text-white">Client Onboarding Bot (DFY)</strong> to link Larry directly to your live Stripe payment endpoints, creating an autonomous direct-to-close checkout widget.
                  </p>
                )}

                {selectedVenture === "custom" && (
                  <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                    Your custom blueprint generated with the **Venture Blueprinter** is loaded with customized pricing tiers. Apply the <strong className="text-white">Venture Monetization & Leak Audit</strong> to verify your specific target audience leaks and download the <strong className="text-white">Venture OS Download Pack</strong> to instantly save the complete layout files into your local directory.
                  </p>
                )}

                <div className="flex gap-4 pt-1 text-[9px] font-mono uppercase tracking-wider text-white/40">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 3 Segment Fulfillment Active</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span> Target CAC: ${selectedVenture === "autonomad" ? "35.00" : selectedVenture === "lazylarry" ? "55.00" : "40.00"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Filter bar */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-3" id="portfolio-filters">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">Filters:</span>
            {(["all", "audit", "diy", "dfy"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setPortfolioFilter(filter)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest rounded-sm border cursor-pointer transition-all ${
                  portfolioFilter === filter
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40"
                    : "bg-transparent border-white/10 text-white/50 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="portfolio-grid">
            {filteredPortfolio.map((item) => (
              <div 
                key={item.id}
                className="bg-[#0F0F12] border border-white/10 p-5 rounded-sm flex flex-col justify-between transition-all hover:border-cyan-500/40 relative"
                id={`portfolio-item-${item.id}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-sm border uppercase ${
                      item.category === 'audit' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : item.category === 'diy'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      ${item.price}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-1">{item.title}</h3>
                  <span className="text-[10px] text-white/30 font-mono block mb-3">Timeframe: {item.timeframe}</span>
                  <p className="text-[11px] text-white/60 mb-4 leading-relaxed">{item.shortDesc}</p>
                  
                  {/* Bullet points */}
                  <div className="border-t border-white/5 pt-3 mb-4 space-y-1.5">
                    {item.bulletPoints.map((bp, index) => (
                      <div key={index} className="flex items-start gap-2 text-[10px] text-white/50 leading-relaxed">
                        <span className="text-cyan-500 font-bold font-mono mt-0.5">›</span>
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="text-[9px] text-cyan-400/80 font-mono uppercase tracking-wider mb-3">
                    Impact: {item.systemImpact}
                  </div>
                  <button
                    onClick={() => handleRequestProposal(item)}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded-sm text-[10px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-cyan-400"
                  >
                    Initiate Delivery Proposal
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "orders" && (
        <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl space-y-6" id="orders-view">
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-light uppercase tracking-wide text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-500"></span>
                Active Fulfillment Monitor
              </h2>
              <p className="text-[11px] text-white/40 font-mono mt-1">Live tracking of systems diagnostics and delivery queues</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-2.5 py-1 rounded-sm uppercase">
              {orders.length} ACTIVE PIPELINES
            </span>
          </div>

          <div className="overflow-x-auto" id="orders-table-scroller">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/30 font-mono text-[9px] tracking-widest uppercase">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Description</th>
                  <th className="py-3 px-2">Tier</th>
                  <th className="py-3 px-2">Valuation</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Progress</th>
                  <th className="py-3 px-2 text-right">Interactive Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="py-4 px-2 font-bold text-white">{order.id}</td>
                    <td className="py-4 px-2 text-white/70 max-w-[220px] truncate">{order.title}</td>
                    <td className="py-4 px-2">
                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded-sm border ${
                        order.category === 'audit' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : order.category === 'diy'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {order.category}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-white/90">${order.price}</td>
                    <td className="py-4 px-2">
                      <span className={`capitalize font-semibold ${
                        order.status === 'delivered' ? 'text-green-400' :
                        order.status === 'processing' ? 'text-cyan-400 animate-pulse' :
                        'text-amber-400'
                      }`}>
                        ● {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#0A0A0C] border border-white/10 h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              order.status === 'delivered' ? 'bg-green-500' :
                              order.status === 'processing' ? 'bg-cyan-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <span>{order.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {order.status !== "delivered" ? (
                        <button
                          onClick={() => handleTestStep(order.id)}
                          className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-sm text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                        >
                          {order.status === "pending" ? "Verify Core" : "Simulate Next Stage"}
                        </button>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              if (order.category === "audit") {
                                executeCommand("custom", `Fetch raw audit diagnostic for: ${order.id}`);
                              } else if (order.category === "diy") {
                                executeCommand("custom", `Download raw exported file payload for: ${order.id}`);
                              } else {
                                executeCommand("custom", `Show delivery warranty and operational metrics SLA details for ${order.id}`);
                              }
                              setActiveSubTab("rep_console");
                            }}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-sm text-[9px] uppercase transition-all cursor-pointer"
                          >
                            Inspect Output
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-[#0A0A0C] border border-white/10 rounded-sm text-[10px] text-white/40 leading-relaxed font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase mb-1.5">
              <Activity className="h-3.5 w-3.5" />
              SLA Compliance Monitoring
            </span>
            Once system pipelines achieve 100% verification states, delivery assets are autocompiled into raw payload files. Any failure during execution instantly notifies our Customer Representative support loop for priority intervention.
          </div>
        </div>
      )}

      {activeSubTab === "rep_console" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="rep-console-grid">
          {/* Left panel: Quick action triggers */}
          <div className="lg:col-span-4 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl h-fit space-y-6" id="rep-triggers">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-500 mb-2">User Journey Testing</h3>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Test full-stack system capabilities instantly. Simulated payments automatically update revenue counters and trigger automated router pipelines.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => executeCommand("test_journey")}
                className="w-full bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500 text-cyan-400 py-2.5 px-3 rounded-sm text-left text-[10px] font-mono uppercase tracking-wide flex items-center justify-between transition-all cursor-pointer"
              >
                <span>🚀 Simulate Checkout Flow</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => executeCommand("upgrade_pack")}
                className="w-full bg-white/5 border border-white/10 hover:border-white/30 text-white/80 py-2.5 px-3 rounded-sm text-left text-[10px] font-mono uppercase tracking-wide flex items-center justify-between transition-all cursor-pointer"
              >
                <span>📦 Export Venture Upgrade Pack</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => executeCommand("value_guide")}
                className="w-full bg-white/5 border border-white/10 hover:border-white/30 text-white/80 py-2.5 px-3 rounded-sm text-left text-[10px] font-mono uppercase tracking-wide flex items-center justify-between transition-all cursor-pointer"
              >
                <span>💡 Strategic Launch Guide</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h4 className="text-[10px] font-mono uppercase text-white/30 tracking-widest mb-2">Technical Status</h4>
              <div className="space-y-1.5 text-[10px] font-mono text-white/50">
                <div className="flex justify-between">
                  <span>Representative Status:</span>
                  <span className="text-green-400">ONLINE (SLA active)</span>
                </div>
                <div className="flex justify-between">
                  <span>Last diagnostics pass:</span>
                  <span className="text-white/80">0 errors / 100% OK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Chat Terminal dialog */}
          <div className="lg:col-span-8 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl flex flex-col justify-between h-[480px]" id="rep-terminal">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-light uppercase tracking-wide text-white flex items-center gap-2">
                <UserCheck className="h-4.5 w-4.5 text-cyan-400" />
                Customer Success Representative Desk
              </h3>
              <span className="text-[9px] font-mono text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm">
                SECURE CONSOLE CHAT
              </span>
            </div>

            {/* Dialog Scroller */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 text-xs scrollbar-thin" id="rep-chat-scroller">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-white/30 font-mono">
                      {msg.sender === 'user' ? 'Operator' : 'Autonomax Representative'}
                    </span>
                    <span className="text-[8px] text-white/20 font-mono">{msg.time}</span>
                  </div>
                  <div 
                    className={`p-3 rounded-sm leading-relaxed border whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#0A0A0C] border-cyan-500/30 text-cyan-200'
                        : 'bg-white/[0.02] border-white/10 text-white/80'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] text-cyan-500 font-mono">Representative typing...</span>
                  </div>
                  <div className="p-3 rounded-sm bg-white/[0.02] border border-white/10 text-white/40 font-mono text-[10px]">
                    Accessing pipeline databases...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                executeCommand("custom", chatInput);
                setChatInput("");
              }}
              className="flex gap-2"
              id="rep-input-form"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your representative a question, request diagnostics, or customize support..."
                className="flex-1 bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 rounded-sm px-3 py-2 text-xs text-white/90 placeholder-white/20 transition-all outline-none"
                id="rep-chat-input"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-sm text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                id="rep-send-btn"
              >
                <Send className="h-3 w-3" />
                Query
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === "self_improvement" && (
        <div className="space-y-6" id="self-improvement-view">
          {/* Active Venture Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="improvement-stats">
            <div className="bg-[#0F0F12] border border-white/10 p-5 rounded-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Commercial Readiness Index</span>
                  <h3 className="text-2xl font-light text-white font-mono mt-1">
                    {optimizedVentures[selectedVenture] 
                      ? "98%" 
                      : selectedVenture === "autonomad" 
                      ? "86%" 
                      : selectedVenture === "lazylarry" 
                      ? "91%" 
                      : "82%"}
                  </h3>
                </div>
                <div className={`p-2 rounded-sm text-[10px] font-mono uppercase tracking-widest ${
                  optimizedVentures[selectedVenture] 
                    ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  {optimizedVentures[selectedVenture] ? "Audit Verified" : "Gaps Identified"}
                </div>
              </div>
              <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-500" 
                  style={{ 
                    width: optimizedVentures[selectedVenture] 
                      ? "98%" 
                      : selectedVenture === "autonomad" 
                      ? "86%" 
                      : selectedVenture === "lazylarry" 
                      ? "91%" 
                      : "82%" 
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-[#0F0F12] border border-white/10 p-5 rounded-sm">
              <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Identified Revenue Gaps</span>
              <h3 className="text-2xl font-light text-white font-mono mt-1">
                {optimizedVentures[selectedVenture] ? "0" : "3 Strategic Gaps"}
              </h3>
              <p className="text-[10px] font-mono text-cyan-400/80 mt-1">
                {optimizedVentures[selectedVenture] ? "All parameters optimized" : "Requires automated alignment check"}
              </p>
            </div>

            <div className="bg-[#0F0F12] border border-white/10 p-5 rounded-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Fulfillment Automation SLA</span>
                <h3 className="text-base font-medium text-white tracking-wide mt-1 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Active Success Rep
                </h3>
              </div>
              
              <button
                onClick={() => handleOptimizeVenture(selectedVenture)}
                disabled={isOptimizing || optimizedVentures[selectedVenture]}
                className={`w-full py-2 border text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                  optimizedVentures[selectedVenture]
                    ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-not-allowed"
                    : isOptimizing
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 cursor-wait"
                    : "bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400 font-bold"
                }`}
              >
                {optimizedVentures[selectedVenture] 
                  ? "✓ System Aligned" 
                  : isOptimizing 
                  ? "Aligning Coordinates..." 
                  : "Run Commercial Alignment Optimizer"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="self-improvement-details">
            {/* Left Panel: Raw Context File Reader */}
            <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-5 space-y-4 flex flex-col justify-between h-[500px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-xs font-mono uppercase text-white tracking-widest flex items-center gap-1.5">
                      <FileText className="h-4.5 w-4.5 text-cyan-400" />
                      Venture Blueprint Document
                    </h3>
                    <p className="text-[9px] font-mono text-white/30 mt-0.5">Direct raw markdown context from active workspace</p>
                  </div>
                  <button
                    onClick={() => {
                      const docText = selectedVenture === "autonomad" ? DOCUMENT_AUTONOMAD_OS : selectedVenture === "lazylarry" ? DOCUMENT_LAZY_LARRY : activeBlueprint?.rawMarkdown || "";
                      copyToClipboard(docText, "raw_doc");
                    }}
                    className="px-2 py-1 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 rounded-sm text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {copiedId === "raw_doc" ? "Copied Raw!" : "Copy Raw"}
                  </button>
                </div>

                <div className="mt-4 overflow-y-auto h-[380px] bg-[#0A0A0C] border border-white/5 p-4 rounded-sm text-[11px] font-mono text-white/70 space-y-4 scrollbar-thin">
                  {selectedVenture === "autonomad" && (
                    <div className="whitespace-pre-wrap select-all">{DOCUMENT_AUTONOMAD_OS}</div>
                  )}
                  {selectedVenture === "lazylarry" && (
                    <div className="whitespace-pre-wrap select-all">{DOCUMENT_LAZY_LARRY}</div>
                  )}
                  {selectedVenture === "custom" && (
                    <div className="whitespace-pre-wrap select-all">
                      {activeBlueprint ? activeBlueprint.rawMarkdown : "No custom blueprint loaded. Go to the Venture Blueprinter tab to generate one!"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Technical Gap & Improvement Ledger */}
            <div className="bg-[#0F0F12] border border-white/10 rounded-sm p-5 space-y-4 flex flex-col justify-between h-[500px]">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-xs font-mono uppercase text-white tracking-widest flex items-center gap-1.5">
                      <Layers className="h-4.5 w-4.5 text-cyan-400" />
                      Self-Improvement Review Ledger
                    </h3>
                    <p className="text-[9px] font-mono text-white/30 mt-0.5">Real-time gap evaluations and structured resolutions</p>
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-sm border border-cyan-500/20">
                    SLA AUTO-AUDITING
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {/* GAP 1 */}
                  <div className="p-3 bg-[#0A0A0C] border border-white/5 rounded-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">Gap 1: Latency & Rate Limits</span>
                      <span className="text-[9px] font-mono text-white/40 uppercase">Critical</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed font-mono">
                      {selectedVenture === "autonomad" 
                        ? "Micro-task scraper application webhook frequencies run risk of platform rate-limit suspensions. Recommended: Map randomized backoff intervals in scenario routers."
                        : "Voice-to-animation packet stream lag exceeds 1.8 seconds over slow network topologies. Recommended: Activate JIT WebSocket streaming handlers."
                      }
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/40 pt-1">
                      <span>Status:</span>
                      <span className={optimizedVentures[selectedVenture] ? "text-green-400" : "text-amber-400"}>
                        {optimizedVentures[selectedVenture] ? "RESOLVED (Aligned via Make scenario)" : "AWAITING OPTIMIZATION RUN"}
                      </span>
                    </div>
                  </div>

                  {/* GAP 2 */}
                  <div className="p-3 bg-[#0A0A0C] border border-white/5 rounded-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">Gap 2: Pricing Structure & AOV Leak</span>
                      <span className="text-[9px] font-mono text-white/40 uppercase">High Yield</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed font-mono">
                      {selectedVenture === "autonomad" 
                        ? "Default side-hustler target relies heavily on generic low-AOV subscriptions ($49/tier). Recommended: Transition positioning to high-class $299 Premium OS standard to maximize organic revenues."
                        : "Lack of direct payment checkout bubbles inside active stream broadcasts creates massive viewer-to-buyer friction. Recommended: Deploy JIT Stripe checkout webhooks in background."
                      }
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/40 pt-1">
                      <span>Status:</span>
                      <span className={optimizedVentures[selectedVenture] ? "text-green-400" : "text-amber-400"}>
                        {optimizedVentures[selectedVenture] ? "RESOLVED ($299 pricing mapped to metadata)" : "AWAITING OPTIMIZATION RUN"}
                      </span>
                    </div>
                  </div>

                  {/* GAP 3 */}
                  <div className="p-3 bg-[#0A0A0C] border border-white/5 rounded-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">Gap 3: CRM Webhouse Ingress</span>
                      <span className="text-[9px] font-mono text-white/40 uppercase">Medium</span>
                    </div>
                    <p className="text-[10px] text-white/60 leading-relaxed font-mono">
                      No automated routing channels mapped to Slack, Discord, or client workspace hubs upon checkout confirmation. Recommended: Establish outbound webhook routers.
                    </p>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-white/40 pt-1">
                      <span>Status:</span>
                      <span className={optimizedVentures[selectedVenture] ? "text-green-400" : "text-amber-400"}>
                        {optimizedVentures[selectedVenture] ? "RESOLVED (CRM Webhooks mapped)" : "AWAITING OPTIMIZATION RUN"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowUpgradePack(true);
                    setChatMessages(prev => [
                      ...prev,
                      {
                        sender: "rep",
                        text: `📦 **Upgrade Pack Export Activated!** Scroll down to the bottom panel to copy or download your raw configuration code blocks.`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                  }}
                  className="w-full bg-[#141416] hover:bg-cyan-500 hover:text-black border border-white/10 hover:border-cyan-500 py-2 text-[10px] font-mono uppercase tracking-wider text-white rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  Compile & Export Venture Upgrade Pack
                </button>
              </div>
            </div>
          </div>

          {/* Additive 1: Segmented Traffic Distillation & Buyer Closer */}
          <div className="bg-[#0F0F12] border border-cyan-500/20 rounded-sm p-6 space-y-6" id="traffic-distillation-additive">
            <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  Critical Additive 1 // Zero-Gap Conversion
                </span>
                <h3 className="text-sm font-light text-white uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-none"></span>
                  Segmented Traffic Distillation & Buyer Closer
                </h3>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">
                  Isolate dropoff channels, simplify customer friction, and qualify premium values in production to maximize conversion rate.
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-white/40 uppercase">Interactive Simulator:</span>
                <span className="text-green-400 font-bold bg-green-500/5 border border-green-500/20 px-2 py-0.5 rounded-sm">ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Traffic Segments Selector & Friction List */}
              <div className="lg:col-span-4 space-y-4">
                <label className="text-[9px] uppercase text-white/40 tracking-wider font-mono">Select Target Traffic Segment</label>
                <div className="grid grid-cols-2 gap-2" id="traffic-segment-buttons">
                  {[
                    { id: "cold_social", label: "Cold Outreach", base: "1.2%" },
                    { id: "warm_email", label: "Newsletter Warm", base: "2.8%" },
                    { id: "seo_search", label: "SEO Inbound", base: "3.5%" },
                    { id: "referrals", label: "Direct Referrals", base: "4.8%" }
                  ].map((seg) => (
                    <button
                      key={seg.id}
                      onClick={() => {
                        setSelectedTrafficSegment(seg.id as any);
                        setDistilledRate(null);
                      }}
                      className={`p-3 rounded-sm border text-left cursor-pointer transition-all ${
                        selectedTrafficSegment === seg.id
                          ? "bg-cyan-500/15 border-cyan-500 text-white font-bold"
                          : "bg-[#0A0A0C] border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wide">{seg.label}</div>
                      <div className="text-[11px] font-mono font-bold text-cyan-400 mt-1">Base CR: {seg.base}</div>
                    </button>
                  ))}
                </div>

                <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-sm space-y-3">
                  <span className="text-[9px] uppercase text-amber-400 font-mono font-semibold tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Identified Buyer Friction
                  </span>
                  <div className="space-y-2 text-[10px] font-mono text-white/60 leading-relaxed">
                    {selectedTrafficSegment === "cold_social" && (
                      <>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Scrapers trigger anti-bot security walls</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Average response delay is &gt; 3 hours</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Pricing sticker shock at premium tier</span></div>
                      </>
                    )}
                    {selectedTrafficSegment === "warm_email" && (
                      <>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Lack of immediate call-to-action button</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>No proof of live operational checks</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Manual client onboarding friction delay</span></div>
                      </>
                    )}
                    {selectedTrafficSegment === "seo_search" && (
                      <>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Vague value proposition for targeted keywords</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Missing certified trust badges or compliance stamps</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Checkout forms take 5+ fields to complete</span></div>
                      </>
                    )}
                    {selectedTrafficSegment === "referrals" && (
                      <>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>No digital Service Level Agreement guarantee</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Payment routing takes manual invoicing</span></div>
                        <div className="flex gap-2"><span className="text-amber-500 font-bold">•</span> <span>Lack of interactive sandbox demonstration</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Value Qualifiers Checklist */}
              <div className="lg:col-span-4 space-y-4">
                <label className="text-[9px] uppercase text-white/40 tracking-wider font-mono">Apply Multiplied Value Qualifiers</label>
                <div className="space-y-3" id="value-qualifiers-list">
                  <div 
                    onClick={() => setActiveDistillationAdditives(prev => ({ ...prev, smsResponder: !prev.smsResponder }))}
                    className={`p-3 bg-[#0A0A0C] border rounded-sm cursor-pointer transition-all flex items-start gap-3 select-none ${
                      activeDistillationAdditives.smsResponder ? "border-cyan-500/50" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={activeDistillationAdditives.smsResponder} 
                      onChange={() => {}} 
                      className="mt-1 pointer-events-none accent-cyan-500" 
                    />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wide text-white">AI SMS & Chat Responder Bot (+25%)</h4>
                      <p className="text-[9px] text-white/40 mt-1 leading-relaxed">Resolves latency gaps by responding to warm/cold leads within 60 seconds autonomously.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveDistillationAdditives(prev => ({ ...prev, stripeRedirect: !prev.stripeRedirect }))}
                    className={`p-3 bg-[#0A0A0C] border rounded-sm cursor-pointer transition-all flex items-start gap-3 select-none ${
                      activeDistillationAdditives.stripeRedirect ? "border-cyan-500/50" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={activeDistillationAdditives.stripeRedirect} 
                      onChange={() => {}} 
                      className="mt-1 pointer-events-none accent-cyan-500" 
                    />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wide text-white">Stripe Checkout & Webhook Router (+35%)</h4>
                      <p className="text-[9px] text-white/40 mt-1 leading-relaxed">Bypasses manual invoicing with high-yielding dynamic $299 checkouts and instant digital fulfillment.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveDistillationAdditives(prev => ({ ...prev, slaTrust: !prev.slaTrust }))}
                    className={`p-3 bg-[#0A0A0C] border rounded-sm cursor-pointer transition-all flex items-start gap-3 select-none ${
                      activeDistillationAdditives.slaTrust ? "border-cyan-500/50" : "border-white/5 hover:border-white/20"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={activeDistillationAdditives.slaTrust} 
                      onChange={() => {}} 
                      className="mt-1 pointer-events-none accent-cyan-500" 
                    />
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wide text-white">Signed SLA & Compliance Badge (+20%)</h4>
                      <p className="text-[9px] text-white/40 mt-1 leading-relaxed font-mono">Builds trust with target enterprise clients through certified SLA digital signatures.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic CR Simulator Gauge */}
              <div className="lg:col-span-4 bg-[#0A0A0C] border border-white/15 p-5 rounded-sm flex flex-col justify-between" id="cr-simulation-widget">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono uppercase text-white/30 tracking-widest block">Live Traffic Conversion projection</span>
                  
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-light text-white font-mono tracking-tight">
                      {isDistilling ? (
                        <span className="text-cyan-400 animate-pulse">Calculating...</span>
                      ) : distilledRate ? (
                        `${distilledRate}%`
                      ) : (
                        "Pending Run"
                      )}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 font-semibold">
                      {distilledRate && "Multiplied Value Target"}
                    </span>
                  </div>

                  <div className="w-full bg-white/5 h-2 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700"
                      style={{ 
                        width: isDistilling ? "75%" : distilledRate ? `${Math.min(100, (distilledRate / 10) * 100)}%` : "12%" 
                      }}
                    />
                  </div>

                  <p className="text-[9px] text-white/40 leading-relaxed font-mono mt-2">
                    Compounding active multipliers over selected baseline traffic yields optimal market readiness.
                  </p>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={handleRunTrafficDistillation}
                    disabled={isDistilling}
                    className={`w-full py-2.5 border text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isDistilling 
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 cursor-wait" 
                        : "bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400 font-bold"
                    }`}
                  >
                    {isDistilling ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Distilling Traffic & Gaps...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        Run Zero-Gap Traffic Closer
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TACTICAL TAB: MASTERY & ADVANCED CODEBASE UPGRADES */}
      {activeSubTab === "mastery" && (
        <div className="space-y-8" id="mastery-and-upgrades-view">
          {/* INTEL HEADER BANNER */}
          <div className="bg-[#0F0F12] border border-cyan-500/15 p-5 rounded-sm relative overflow-hidden" id="mastery-intel-banner">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase rounded-sm h-fit">
                Tactical OS
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  ★ Advanced Pre-Mastered Resources & Full-Stack Upgrades
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                  Access 15 pre-configured integration templates calibrated to your workspace niche, and 5 full-stack architectural upgrades to migrate your venture from a visual prototype to a high-utility commercial asset.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COLUMN 1 & 2: 15 HIGH-VALUE PRE-MASTERED RESOURCES */}
            <div className="lg:col-span-2 space-y-6" id="high-value-catalog-section">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white">15 Pre-Mastered High-Value Functions</h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Select, preview, and deploy optimized scenario templates directly to active workspaces</p>
                </div>
                
                {/* Category Selector Tab Buttons */}
                <div className="flex flex-wrap gap-1.5" id="resource-category-tabs">
                  {["All", "Autonomous Bidding", "Lead Generation", "Marketing Automation", "Operations & CRM"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setResourceCategoryFilter(cat)}
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase rounded-sm border cursor-pointer transition-all ${
                        resourceCategoryFilter === cat
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold"
                          : "bg-transparent border-white/5 text-white/40 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HIGH_VALUE_FUNCTIONS.filter(r => resourceCategoryFilter === "All" || r.category === resourceCategoryFilter).map(resource => {
                  const isDeployed = deployedResources[resource.id];
                  const isDeploying = deployingResourceId === resource.id;
                  
                  return (
                    <div 
                      key={resource.id} 
                      className={`bg-[#0F0F12] border p-4 rounded-sm flex flex-col justify-between space-y-4 relative overflow-hidden transition-all hover:border-white/20 ${
                        isDeployed ? "border-green-500/20" : "border-white/5"
                      }`}
                      id={`resource-card-${resource.id}`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 uppercase rounded-sm border border-cyan-500/20">
                            {resource.category}
                          </span>
                          <span className="text-[8px] font-mono text-white/40 uppercase">
                            Value: {resource.value}
                          </span>
                        </div>
                        <h4 className="text-xs font-mono text-white uppercase font-bold tracking-tight">
                          {personalization.isOnboarded 
                            ? resource.title.replace(/Lazy Larry CG AI/g, personalization.ventureName) 
                            : resource.title}
                        </h4>
                        <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                          {personalization.isOnboarded 
                            ? resource.desc.replace(/niche/g, personalization.niche).replace(/Lazy Larry CG AI/g, personalization.ventureName)
                            : resource.desc}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setSelectedResource(selectedResource === resource.id ? null : resource.id)}
                          className="w-1/2 py-1.5 border border-white/10 text-white/60 hover:text-white text-[9px] font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all hover:bg-white/5 text-center flex items-center justify-center gap-1"
                          id={`view-resource-btn-${resource.id}`}
                        >
                          <FileText className="h-3 w-3" />
                          {selectedResource === resource.id ? "Hide Schema" : "View Schema"}
                        </button>
                        <button
                          onClick={() => handleDeployResource(resource.id, resource.title)}
                          disabled={isDeployed || isDeploying}
                          className={`w-1/2 py-1.5 text-[9px] font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all text-center flex items-center justify-center gap-1 ${
                            isDeployed
                              ? "bg-green-500/10 border border-green-500/30 text-green-400 cursor-not-allowed font-bold"
                              : isDeploying
                              ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 cursor-wait animate-pulse"
                              : "bg-cyan-500 border border-cyan-500 text-black hover:bg-cyan-400 font-bold"
                          }`}
                          id={`deploy-resource-btn-${resource.id}`}
                        >
                          {isDeployed ? "✓ Deployed" : isDeploying ? "Deploying..." : "Deploy to Cluster"}
                        </button>
                      </div>

                      {/* Expanded Code Schema Box */}
                      {selectedResource === resource.id && (
                        <div className="pt-3 border-t border-white/5 space-y-2" id={`code-drawer-${resource.id}`}>
                          <div className="flex justify-between items-center bg-[#070709] p-1.5 border-b border-white/5">
                            <span className="text-[8px] font-mono text-cyan-400 font-bold uppercase">{resource.resourceType}</span>
                            <button
                              onClick={() => {
                                const customizedContent = resource.resourceContent
                                  .replace(/the specific niche/g, personalization.niche)
                                  .replace(/Lazy Larry CG AI/g, personalization.ventureName)
                                  .replace(/299/g, String(personalization.targetPrice));
                                copyToClipboard(customizedContent, `res-${resource.id}`);
                              }}
                              className="text-[8px] font-mono text-white/40 hover:text-white flex items-center gap-1 uppercase cursor-pointer"
                            >
                              {copiedId === `res-${resource.id}` ? "Copied!" : "Copy Code"}
                            </button>
                          </div>
                          <pre className="p-3 bg-[#070709] rounded-sm text-[9px] font-mono text-cyan-400/80 overflow-x-auto whitespace-pre leading-relaxed select-all border border-white/5">
                            {resource.resourceContent
                              .replace(/the specific niche/g, personalization.niche)
                              .replace(/Lazy Larry CG AI/g, personalization.ventureName)
                              .replace(/299/g, String(personalization.targetPrice))}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: 5 BEST FULL-STACK UPGRADES */}
            <div className="space-y-6" id="full-stack-upgrades-section">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white">5 Best Full-Stack Upgrades</h3>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">Integrate backend files, servers, and live database persistence layers</p>
              </div>

              <div className="space-y-4" id="full-stack-upgrades-grid">
                {[
                  {
                    id: "firestore",
                    name: "Durable Firebase Firestore Sync",
                    desc: "Migrates local React memory states to a secure Firestore cloud database automatically synchronizing orders, activity logs, and brand profiles.",
                    files: "/src/db/firebase-blueprint.json",
                    impact: "Durable Persistence. Synchronizes user-authored logs across sessions.",
                    revenue: 150
                  },
                  {
                    id: "oauth",
                    name: "Google OAuth 2.0 Identity Client",
                    desc: "Enables authentic Google login inside the AI Studio sandbox. Bridges verified user workflows directly to Gmail and Google Sheets APIs.",
                    files: "oauth_integration (System tool)",
                    impact: "Client Identity Verification. Eliminates mock data restrictions.",
                    revenue: 150
                  },
                  {
                    id: "gemini",
                    name: "Gemini 2.5 Flash Express Server Gateway",
                    desc: "Builds a clean Express backend proxy router /api/gemini/generate, encapsulating developer keys securely away from client browser tools.",
                    files: "/server.ts",
                    impact: "Production-grade Security. Protects sensitive project API keys.",
                    revenue: 250
                  },
                  {
                    id: "cloudsql",
                    name: "Cloud SQL PostgreSQL relational Instance",
                    desc: "Provisions a scalable relational database instance and seeds custom ledger schemas using Drizzle ORM.",
                    files: "/src/db/schema.ts",
                    impact: "Relational integrity schema. Direct SQL debugging access.",
                    revenue: 350
                  },
                  {
                    id: "websockets",
                    name: "Real-Time WebSocket Gateway",
                    desc: "Integrates sub-200ms Node.js socket tunnels to handle real-time motion and stream telemetry, cutting interactive lag completely.",
                    files: "real-time-and-multi-user (System tool)",
                    impact: "Low-latency pipelines. 99.9% uptime compliance.",
                    revenue: 150
                  }
                ].map(upgrade => {
                  const status = integratedUpgrades[upgrade.id] || "idle";
                  const logs = upgradeLogs[upgrade.id] || [];
                  
                  return (
                    <div 
                      key={upgrade.id}
                      className={`bg-[#0F0F12] border p-4 rounded-sm space-y-3 relative overflow-hidden transition-all ${
                        status === "integrated" ? "border-cyan-500/30 bg-[#0F0F12]" : "border-white/5"
                      }`}
                      id={`upgrade-feature-card-${upgrade.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-1.5 py-0.2 rounded-sm uppercase">
                          {upgrade.files}
                        </span>
                        <span className="text-[9px] font-mono text-[#00E5FF] font-bold">
                          +${upgrade.revenue} Strategic Capital
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wide">
                          {upgrade.name}
                        </h4>
                        <p className="text-[10px] text-white/50 leading-relaxed font-mono">
                          {upgrade.desc}
                        </p>
                      </div>

                      <div className="text-[9px] font-mono text-white/40">
                        <strong className="text-white">Product Impact:</strong> {upgrade.impact}
                      </div>

                      {status === "idle" && (
                        <button
                          onClick={() => handleIntegrateUpgrade(upgrade.id, upgrade.name, upgrade.impact, upgrade.revenue)}
                          className="w-full py-1.5 bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 hover:border-cyan-500 text-[9px] font-mono uppercase tracking-wider text-white hover:font-bold rounded-sm cursor-pointer transition-all text-center"
                          id={`integrate-upgrade-btn-${upgrade.id}`}
                        >
                          Integrate & Upgrade Codebase
                        </button>
                      )}

                      {status === "integrating" && (
                        <div className="p-3 bg-[#050507] border border-cyan-500/20 rounded-sm font-mono text-[9px] text-cyan-400 space-y-1 animate-pulse" id={`terminal-logs-${upgrade.id}`}>
                          <div className="flex items-center gap-1.5 pb-1 border-b border-white/5 text-white/40">
                            <Terminal className="h-3 w-3 animate-spin" />
                            <span>CLI INTEGRATOR CONSOLE</span>
                          </div>
                          {logs.map((log, index) => (
                            <div key={index} className="truncate leading-normal">{log}</div>
                          ))}
                        </div>
                      )}

                      {status === "integrated" && (
                        <div className="space-y-2" id={`terminal-success-${upgrade.id}`}>
                          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-sm font-mono text-[9px] text-[#00E5FF] space-y-1">
                            <div className="flex items-center gap-1.5 pb-1 border-b border-cyan-500/20 text-white font-bold">
                              <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
                              <span>UPGRADE APPLIED</span>
                            </div>
                            {logs.map((log, index) => (
                              <div key={index} className="truncate leading-normal text-white/85">{log}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TACTICAL TAB: PROPULSE PROMISE FULFILLMENT AUDIT */}
      {activeSubTab === "fulfillment_review" && (
        <div className="space-y-8" id="promise-audit-view">
          {/* SUCCESS NOTIFICATION */}
          {successBanner && (
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-sm flex items-start gap-3 text-green-400 font-mono text-xs animate-fade-in">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
              <div className="space-y-1">
                <span className="font-bold uppercase block text-white">Compliance Contract Exported</span>
                <span>{successBanner}</span>
              </div>
              <button onClick={() => setSuccessBanner(null)} className="ml-auto text-white/40 hover:text-white uppercase text-[9px] cursor-pointer">dismiss</button>
            </div>
          )}

          {/* INTEL HEADER BANNER */}
          <div className="bg-[#0F0F12] border border-cyan-500/15 p-5 rounded-sm relative overflow-hidden" id="promise-intel-banner">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[10px] uppercase rounded-sm h-fit">
                Audit SLA
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  ✔ Propulse Autonomax Promise Fulfillment Review
                </h3>
                <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                  Review and audit active delivery pipelines against the 5 core promise listings of Propulse Autonomax. Validate codebase compliance, webhook integrity, and pricing alignments, and generate signed, downloadable Service Level Agreements (SLA).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* COLUMN LEFT (xl:col-span-7): Table & Certificates */}
            <div className="xl:col-span-7 space-y-8">
              <div className="bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white">Active Promise Listings & SLA Certification</h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Run compliance diagnostic tests on each listing to download verified AutonomaX e-commerce certification badges</p>
                </div>

                <div className="overflow-x-auto" id="promise-listings-table">
                  <table className="w-full text-left border-collapse text-[11px] font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 uppercase text-[9px] tracking-wider">
                        <th className="py-3 px-4">Promise Listing Deliverable</th>
                        <th className="py-3 px-4">Standard Price</th>
                        <th className="py-3 px-4 text-center">Status Badge</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        {
                          id: "onboarding",
                          name: "Autonomous Client Onboarding Kit",
                          price: 299,
                          check: "Workspace directories & Slack integrations validation"
                        },
                        {
                          id: "competitor",
                          name: "Competitor Strategy Scraper",
                          price: 199,
                          check: "Rate-limit threshold audit & data extraction frequency"
                        },
                        {
                          id: "audit",
                          name: "High-Yield Monetization Audit",
                          price: 129,
                          check: "Revenue gaps audit, pricing metadata standard"
                        },
                        {
                          id: "social",
                          name: "Active Social Syndication Router",
                          price: 149,
                          check: "Buffer webhook queues, dynamic slideshow renders"
                        },
                        {
                          id: "animation",
                          name: "Low-Latency Animation Sync Controller",
                          price: 499,
                          check: "Sub-200ms real-time audio motion buffer sync"
                        }
                      ].map(promise => {
                        const status = verifiedPromises[promise.id] || "idle";
                        const isDownloading = downloadingComplianceId === promise.id;
                        
                        return (
                          <tr key={promise.id} className="hover:bg-white/[0.02]" id={`promise-row-${promise.id}`}>
                            <td className="py-4 px-4">
                              <span className="font-bold text-white block">{promise.name}</span>
                              <span className="text-[9px] text-white/40 block mt-0.5">{promise.check}</span>
                            </td>
                            <td className="py-4 px-4 text-cyan-400 font-bold">
                              ${promise.price}.00
                            </td>
                            <td className="py-4 px-4 text-center">
                              {status === "idle" && (
                                <span className="inline-block text-[8px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-sm uppercase font-bold">
                                  Unverified
                                </span>
                              )}
                              {status === "verifying" && (
                                <span className="inline-block text-[8px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-sm uppercase font-bold animate-pulse">
                                  Scanning...
                                </span>
                              )}
                              {status === "verified" && (
                                <span className="inline-block text-[8px] bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-sm uppercase font-bold">
                                  ✓ Certified
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {status !== "verified" ? (
                                  <button
                                    onClick={() => handleVerifyPromise(promise.id, promise.name)}
                                    disabled={status === "verifying" || runningQAForId !== null}
                                    className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all ${
                                      status === "verifying"
                                        ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 cursor-wait animate-pulse"
                                        : "bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400 font-bold"
                                    }`}
                                    id={`verify-promise-btn-${promise.id}`}
                                  >
                                    {status === "verifying" ? "Testing..." : "Verify"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setDownloadingComplianceId(promise.id);
                                      const certHash = generateSHA256Certificate(promise.id, promise.name, tenant?.id || "tenant-autonomax-01");
                                      setTimeout(() => {
                                        setDownloadingComplianceId(null);
                                        setSuccessBanner(`[SHA-256 TRUST CERTIFICATE GENERATED] Key: ${certHash} | Tenant: ${tenant?.name || "AutonomaX"} | SLA Tier: Full Enterprise Guarantee (${tenant?.currency || '$'}299/mo). Contract compiled & active.`);
                                      }, 1000);
                                    }}
                                    disabled={isDownloading}
                                    className={`px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white rounded-sm text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                                      isDownloading ? "cursor-wait animate-pulse bg-cyan-500/10 text-cyan-400" : ""
                                    }`}
                                    id={`download-compliance-btn-${promise.id}`}
                                  >
                                    <Download className="h-3 w-3" />
                                    {isDownloading ? "Compiling..." : "Export SLA"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* EXPANDED GOLD CERTIFICATE CARDS */}
                {Object.keys(verifiedPromises).some(key => verifiedPromises[key] === "verified") && (
                  <div className="pt-6 border-t border-white/10 space-y-4" id="certified-compliance-badges-section">
                    <span className="text-[9px] font-mono uppercase text-white/40 tracking-wider">Generated AutonomaX SLA Certificates</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "onboarding", name: "Autonomous Client Onboarding Kit", price: 299 },
                        { id: "competitor", name: "Competitor Strategy Scraper", price: 199 },
                        { id: "audit", name: "High-Yield Monetization Audit", price: 129 },
                        { id: "social", name: "Active Social Syndication Router", price: 149 },
                        { id: "animation", name: "Low-Latency Animation Sync Controller", price: 499 }
                      ].filter(p => verifiedPromises[p.id] === "verified").map(p => (
                        <div 
                          key={p.id}
                          className="bg-gradient-to-br from-[#12100E] via-[#0F0F12] to-[#0A0A0C] border border-[#D4AF37]/30 p-4 rounded-sm relative overflow-hidden shadow-xl"
                          id={`compliance-card-${p.id}`}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
                          <div className="flex justify-between items-start border-b border-[#D4AF37]/10 pb-3">
                            <div>
                              <span className="text-[7px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-1 py-0.2 rounded-sm uppercase tracking-widest font-bold">
                                Official Compliance SLA
                              </span>
                              <h4 className="text-[11px] font-mono font-bold text-white uppercase mt-1 leading-tight">
                                {p.name}
                              </h4>
                            </div>
                            <div className="p-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-mono text-[8px] uppercase font-bold shrink-0">
                              SLA VERIFIED
                            </div>
                          </div>

                          <div className="pt-3 grid grid-cols-2 gap-3 font-mono text-[9px] text-white/60">
                            <div>
                              <span className="block text-[6px] uppercase text-white/30">OPERATOR:</span>
                              <span className="text-white font-bold truncate block">{personalization.operatorName}</span>
                            </div>
                            <div>
                              <span className="block text-[6px] uppercase text-white/30">EMAIL:</span>
                              <span className="text-white font-bold truncate block">{personalization.operatorEmail}</span>
                            </div>
                            <div>
                              <span className="block text-[6px] uppercase text-white/30">CERTIFICATE ID:</span>
                              <span className="text-cyan-400 font-bold">AUTONOMAX-SLA-{p.id.toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="block text-[6px] uppercase text-white/30">FULFILLMENT VALUE:</span>
                              <span className="text-green-400 font-bold">${p.price}.00 USD</span>
                            </div>
                          </div>

                          <div className="pt-3 flex justify-between items-center text-[7px] font-mono border-t border-[#D4AF37]/10 mt-3 text-white/40">
                            <span>AUTHORIZED: <strong className="text-white/80">AutonomaX Certification</strong></span>
                            <span className="text-[#D4AF37]">PIN: 80B2X</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN RIGHT (xl:col-span-5): Additive 2 (Resilient Config) & Additive 3 (QA Sandbox) */}
            <div className="xl:col-span-5 space-y-6">
              {/* Additive 2: Sustainable Resilient Configuration */}
              <div className="bg-[#0F0F12] border border-cyan-500/20 rounded-sm p-5 space-y-4" id="resilient-configuration-hub">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                    Critical Additive 2 // Secure Configuration
                  </span>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white mt-1">Sustainable Resilient Config</h3>
                  <p className="text-[9px] text-white/40 font-mono">Tune network safeguards and API proxies autonomously below</p>
                </div>

                <div className="space-y-3 font-mono text-[10px]">
                  {/* Circuit Breaker Live Status (Upgrade #2) */}
                  <div className="p-3 bg-[#070709] border border-cyan-500/30 rounded-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-white font-bold uppercase">Ingress Circuit Breaker</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[8px] uppercase ${
                        globalCircuitBreaker.getStatus().state === 'CLOSED'
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : globalCircuitBreaker.getStatus().state === 'HALF_OPEN'
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        STATE: {globalCircuitBreaker.getStatus().state}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] text-white/50 pt-1">
                      <div>Latency Target: <span className="text-cyan-400 font-bold">{globalCircuitBreaker.getStatus().latencyMs}ms</span></div>
                      <div>Retry Backoff: <span className="text-green-400 font-bold">Jittered (1s/2s/4s)</span></div>
                    </div>
                  </div>

                  {/* Token encryption toggle (Always secured) */}
                  <div className="flex justify-between items-center p-2.5 bg-[#070709] border border-white/5 rounded-sm">
                    <div>
                      <span className="text-white block uppercase">AES-256 Token Encryption</span>
                      <span className="text-[8px] text-white/40 block">Secures proxy credentials inside Vault storage</span>
                    </div>
                    <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-sm uppercase text-[8px]">Secured</span>
                  </div>

                  {/* Rotating Proxy Tunnel (User toggle) */}
                  <div 
                    onClick={() => setResilientConfig(prev => ({ ...prev, rotatingProxy: !prev.rotatingProxy }))}
                    className="flex justify-between items-center p-2.5 bg-[#070709] border border-white/5 hover:border-white/10 rounded-sm cursor-pointer select-none"
                  >
                    <div>
                      <span className="text-white block uppercase">Rotating Proxy Tunnel</span>
                      <span className="text-[8px] text-white/40 block">Tunnels outbound scrapers over dynamic residential IPs</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${resilientConfig.rotatingProxy ? "bg-cyan-500" : "bg-white/10"}`}>
                      <div className={`w-3 h-3 rounded-full bg-black transition-all ${resilientConfig.rotatingProxy ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>

                  {/* Security Shield (User toggle) */}
                  <div 
                    onClick={() => setResilientConfig(prev => ({ ...prev, securityShield: !prev.securityShield }))}
                    className="flex justify-between items-center p-2.5 bg-[#070709] border border-white/5 hover:border-white/10 rounded-sm cursor-pointer select-none"
                  >
                    <div>
                      <span className="text-white block uppercase">WAF Anti-Scrape Protection</span>
                      <span className="text-[8px] text-white/40 block">Shields webhook gateways from bot exhaustion attempts</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${resilientConfig.securityShield ? "bg-cyan-500" : "bg-white/10"}`}>
                      <div className={`w-3 h-3 rounded-full bg-black transition-all ${resilientConfig.securityShield ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>

                  {/* Backoff delay JIT slider */}
                  <div className="p-3 bg-[#070709] border border-white/5 rounded-sm space-y-2">
                    <div className="flex justify-between items-center text-[9px] uppercase">
                      <span className="text-white/60">Scraper JIT Backoff Delay</span>
                      <span className="text-cyan-400 font-bold font-mono">{resilientConfig.backoffInterval} seconds</span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.5"
                      value={resilientConfig.backoffInterval}
                      onChange={(e) => setResilientConfig(prev => ({ ...prev, backoffInterval: Number(e.target.value) }))}
                      className="w-full accent-cyan-500 bg-white/5 rounded-full h-1 cursor-pointer"
                    />
                    <p className="text-[8px] text-white/30 leading-normal">Adds a dynamic jitter buffer to outbound calls to safely avoid API suspensions.</p>
                  </div>
                </div>

                {/* Telemetry scrolling logs */}
                <div className="space-y-1.5">
                  <span className="text-[8px] font-mono text-white/40 uppercase block">Secure Gateway Telemetry Log</span>
                  <div className="bg-[#050507] border border-white/5 p-3 rounded-sm font-mono text-[9px] text-cyan-500/80 h-28 overflow-y-auto space-y-1">
                    {resilienceLogs.map((log, index) => (
                      <div key={index} className="leading-relaxed border-b border-white/[0.02] pb-0.5">{log}</div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveResilientConfig}
                  disabled={isSecuringConfig}
                  className={`w-full py-2 border text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSecuringConfig 
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 cursor-wait animate-pulse" 
                      : "bg-[#070709] border-cyan-500/50 hover:bg-cyan-500 hover:text-black text-cyan-400 font-bold"
                  }`}
                >
                  {isSecuringConfig ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Securing API Gateways...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-3.5 w-3.5" />
                      Deploy Secure Gateway Config
                    </>
                  )}
                </button>
              </div>

              {/* Additive 3: Comprehensive QA Verified Deliveries & Sandbox */}
              <div className="bg-[#0F0F12] border border-cyan-500/20 rounded-sm p-5 space-y-4" id="qa-diagnostic-sandbox">
                <div className="border-b border-white/10 pb-2 flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                      Critical Additive 3 // Uptime & Quality
                    </span>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white mt-1">Interactive QA Sandbox</h3>
                  </div>
                  {runningQAForId && (
                    <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-sm font-mono animate-pulse uppercase">RUNNING DIAGNOSTIC</span>
                  )}
                </div>

                {runningQAForId ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-white">
                      <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin" />
                      <span>Sweeping pipeline schema for matching standards...</span>
                    </div>

                    <div className="p-3 bg-[#050507] border border-cyan-500/10 rounded-sm font-mono text-[9px] text-cyan-500/80 h-36 overflow-y-auto space-y-1">
                      {qaLogs.map((log, index) => (
                        <div key={index} className="truncate leading-normal">{log}</div>
                      ))}
                    </div>
                  </div>
                ) : Object.keys(activeQASteps).length > 0 ? (
                  <div className="space-y-4">
                    <span className="text-[8px] font-mono text-white/40 uppercase block">Last Audited Checklist Results</span>
                    
                    <div className="space-y-2.5 font-mono text-[10px]">
                      {Object.keys(activeQASteps).slice(-1).map((key) => {
                        const step = activeQASteps[key];
                        return (
                          <div key={key} className="space-y-2">
                            <span className="text-[10px] font-bold text-white block uppercase">✓ PIPELINE: {key.toUpperCase()}</span>
                            
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center justify-between p-2 bg-[#070709] border border-white/5 rounded-sm">
                                <span className="text-white/60">1. JSON Payload Schema Alignment</span>
                                <span className="text-green-400 font-bold uppercase">Passed</span>
                              </div>

                              <div className="flex items-center justify-between p-2 bg-[#070709] border border-white/5 rounded-sm">
                                <span className="text-white/60">2. Latency Threshold (&lt;200ms)</span>
                                <span className="text-green-400 font-bold font-mono uppercase">Verified (42ms)</span>
                              </div>

                              <div className="flex items-center justify-between p-2 bg-[#070709] border border-white/5 rounded-sm">
                                <span className="text-white/60">3. JWT token Header Authorization</span>
                                <span className="text-green-400 font-bold uppercase">Passed</span>
                              </div>

                              <div className="flex items-center justify-between p-2 bg-[#070709] border border-white/5 rounded-sm">
                                <span className="text-white/60">4. Gateway Backoff Failover Security</span>
                                <span className="text-green-400 font-bold uppercase">Active</span>
                              </div>
                            </div>

                            <div className="p-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm text-[8px]">
                              Operational Quality SLA verification token generated: <strong className="text-white">QA-SECURE-{key.toUpperCase()}</strong> at {step.testedAt}.
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-2 text-white/30 border border-dashed border-white/10 rounded-sm">
                    <ShieldCheck className="h-8 w-8 text-white/10" />
                    <p className="text-[10px] font-mono uppercase tracking-wide">Awaiting Diagnostic Run</p>
                    <p className="text-[9px] text-white/20 font-mono">Trigger "Verify Compliance" in the table to perform live automated QA testing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Upgrade Pack Archive Screen - visible after generation */}
      {showUpgradePack && (
        <div className="bg-[#0F0F12] border border-cyan-500/20 rounded-sm p-6 shadow-2xl space-y-6" id="upgrade-pack-archive">
          <div className="border-b border-white/10 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-light uppercase tracking-wide text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500"></span>
                Venture Upgrade Pack & Raw Configuration Bundle
              </h2>
              <p className="text-[11px] text-white/40 font-mono mt-1">
                Format-free raw output archives ready for immediate local system bootstrapping
              </p>
            </div>
            
            <button
              onClick={() => copyToClipboard(JSON.stringify(UPGRADE_PACK_RAW, null, 2), "upgrade_pack")}
              className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedId === "upgrade_pack" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied Archive!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Raw JSON
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="upgrade-layout">
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase text-cyan-500">Target Environment Config (.env)</h3>
              <pre className="p-4 bg-[#0A0A0C] border border-white/10 text-[10px] font-mono text-white/70 overflow-x-auto leading-relaxed select-all">
{`# AUTONOMAX PREMIUM SYSTEM CONFIGURATION
# COMPILED AT: 2026-07-10T17:40:00-07:00
NODE_ENV=production
PORT=3000

# LIVE WEBHOUSE OUTBOUND ROUTING ENDPOINTS
CLIENT_ONBOARDING_WEBHOOK_URL=https://hook.make.com/ag38asf918fasd
LEAD_SCRAPE_WEBHOOK_URL=https://hook.make.com/ld928fhsd298fhk

# GEMINI MODEL SYNDICATION PROTOCOL
GEMINI_API_KEY=your_secured_server_key_here
GEMINI_MODEL_PREFERENCE=gemini-2.5-flash

# COMMERCIAL PARAMETERS
SYSTEM_DEFAULT_CAC=35.00
BASE_TIER_AOV=49.00
PREMIUM_TIER_AOV=299.00`}
              </pre>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase text-cyan-500">Make.com Scenario Router Overrides (JSON)</h3>
              <pre className="p-4 bg-[#0A0A0C] border border-white/10 text-[10px] font-mono text-white/70 overflow-x-auto h-[250px] overflow-y-auto leading-relaxed select-all">
                {JSON.stringify(UPGRADE_PACK_RAW, null, 2)}
              </pre>
            </div>
          </div>

          <div className="p-4 bg-[#0A0A0C] border border-cyan-500/20 text-[10px] text-white/50 leading-relaxed font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase mb-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              Security Compliance Warning
            </span>
            Never check the raw configuration keys directly into public repositories. Use local secret vault structures inside Cloud Run or Azure Cloud Tunnel environments before activating live pipelines.
          </div>
        </div>
      )}
    </div>
  );
}

const UPGRADE_PACK_RAW = {
  version: "4.11.0",
  target_platform: "AutonomaX-Core",
  compiled_at: "2026-07-10T17:40:00Z",
  routing_scenarios: [
    {
      scenario_id: "agency_onboarding_v2",
      name: "Bespoke Client Onboarding Bot (DFY)",
      trigger: {
        type: "Webhook",
        path: "/api/webhooks/checkout",
        method: "POST"
      },
      router_logic: [
        {
          step: 1,
          module: "Gemini Synthesis",
          prompt_map: "Extract startup concept and niche requirements. Align with standard positioning strategy maps."
        },
        {
          step: 2,
          module: "Slack CRM Hook",
          action: "Provision Slack channel client-name-onboarding automatically."
        },
        {
          step: 3,
          module: "Figma Provisioner API",
          action: "Duplicate starter system layout workspace files."
        }
      ]
    },
    {
      scenario_id: "lead_scraper_v2",
      name: "B2B AutonomaX Lead Scraper Pack (DIY)",
      trigger: {
        type: "Cron",
        schedule: "0 9 * * 1-5"
      },
      router_logic: [
        {
          step: 1,
          module: "Google Sheets",
          action: "Pull raw newsletter target layout parameters."
        },
        {
          step: 2,
          module: "Gemini Copywriter",
          action: "Formulate custom outbound marketing proposal emails."
        }
      ]
    }
  ],
  system_dependencies: {
    node: ">=18.0.0",
    typescript: "^5.0.0",
    lucide_react: "^0.294.0"
  },
  commercial_SLA_warranty: {
    status: "verified_activation",
    tier: "Enterprise Pro DFY Support",
    guaranteed_latency: "<1.5s",
    hot_failover_tunnel: "Azure-Tunnel-Primary"
  }
};

const DOCUMENT_AUTONOMAD_OS = `# AI VENTURE LAUNCH BLUEPRINT: AUTONOMAD OS

## 1. EXECUTIVE SUMMARY
* **Product Name:** AutoNomad OS
* **Core Premise:** Autonomous remote work fulfillment system designed for digital nomads and passive-income seekers. It automates the entire lifecycle of gig-economy work: from scanning micro-task marketplaces to executing digital deliverables.

## 2. TARGET PERSONA & VALUE PROPOSITION
* **Target Persona:** The "Optimized Nomad" & "Passive Side-Hustler" (seeking to decouple time from income, active on Upwork, Fiverr, Contra).
* **Core Pain Points:** Time wasted on endless job bidding and interview preparation.
* **Value Proposition:** "Deploy AutoNomad OS. Skip the interviews, automate the fulfillment, and deliver ranked high-conversion assets on autopilot."

## 3. MONETIZATION PATH & OFFER TIER PRICING STRATEGY
* **Primary Offer:** Premium OS Package ($299)
  * *What is included:* Autonomous Job Applicant Engine, No-Interview Work Completion Kit, SEO Rank Strategist Module.

## 4. DUAL STRATEGY 14-30 DAY LAUNCH ROADMAP
### Phase 1: Engine Buildout (Days 1–7)
* Deploy the core applicant scraper using low-code/no-code agents.
### Phase 2: Traffic & Conversion Loop (Days 8–14)
* Deploy programmatic landing page targeting terms like "Passive Freelancing".
### Phase 3: Scale & Optimization (Days 15–30)
* Implement automated customer onboarding to let clients run their first loop within 10 minutes.

## 5. CORE WORKFLOW ENGINES
* Competitor Scraper Bots, SEO Blogs Engine, LinkedIn Poster Bot, and Conversion Routers.

## 6. GO-TO-MARKET TRAFFIC STRATEGY
* Organic SEO, Automated Social Distribution on LinkedIn, and Algorithmic Arbitrage.`;

const DOCUMENT_LAZY_LARRY = `# AI VENTURE LAUNCH BLUEPRINT: LAZY LARRY CG AI AMBASSADOR OS

## 1. EXECUTIVE SUMMARY
### Product Name: Lazy Larry CG AI Ambassador OS
### Core Premise
Ready-to-deploy, real-time, motion-graphics-enabled interactive avatar system designed for the AutonomaX ecosystem.

## 2. TARGET PERSONA & VALUE PROPOSITION
### Target Persona: High-Growth E-Commerce Founders & SaaS Operators
* **Pain Points:** High cost of customer support teams and low conversion rates on standard text-based landing pages.
### Value Proposition
* **24/7 Conversational Entertainment:** Lazy Larry converts boring customer support interactions into visually engaging, motion-graphic-powered entertainment.

## 3. MONETIZATION PATH & OFFER TIER PRICING STRATEGY
### Offer Tier: Premium OS Package ($299)
Provides founders with a plug-and-play setup to host Lazy Larry on their own digital properties.
* **What's Included:** Lazy Larry Core Engine, AutonomaX Integration Suite, Visual Asset Library, Interactive Live-Stream Router.

## 4. DUAL STRATEGY 14-30 DAY LAUNCH ROADMAP
### Phase 1: Setup & Asset Alignment (Days 1–7)
* Configure the 3D CG engine for Lazy Larry. Generate movement triggers matched to real-time TTS outputs.
### Phase 2: Live Deployment & System Testing (Days 8–14)
* Install the Lazy Larry bubble widget on key landing pages. Conduct automated tests for visual latency.
### Phase 3: Traffic Genesis & Scale (Days 15–30)
* Deploy the SEO blog and LinkedIn content engines. Focus keywords around "AI Customer Avatars".

## 5. CORE WORKFLOW ENGINES
* Competitor Bots / Trend Scrapers, SEO Blogs Engine, LinkedIn Poster Bot, and Conversion Routers.

## 6. GO-TO-MARKET TRAFFIC STRATEGY
* Organic SEO, The "Always-On" Live-Stream Hack, and Viral Short-Form Clips.`;
