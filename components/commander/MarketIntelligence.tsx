/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Database, 
  Activity, 
  Network, 
  Layers, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  FileCheck, 
  CheckCircle, 
  RefreshCw, 
  ArrowRight, 
  Terminal, 
  AlertCircle, 
  Briefcase, 
  BookOpen,
  DollarSign,
  Maximize2,
  Lock,
  Code,
  Users,
  Award,
  Flame,
  Plus,
  ThumbsUp,
  BarChart2,
  Megaphone,
  UserCheck,
  Server,
  Workflow,
  ClipboardList,
  ShieldAlert
} from "lucide-react";

interface MarketIntelligenceProps {
  metrics: {
    totalRevenue: number;
    tasksCompleted: number;
    scenarioRuns: number;
    conversionRate: number;
    projectedMonth1: number;
    projectedMonth2: number;
    projectedMonth3: number;
  };
  onTaskCompleted: (taskOutput: { revenueIncrement: number; name: string }) => void;
}

// Data science profile assets
const ASSET_PROFILES = [
  {
    id: "cloud_container",
    name: "Cloud Run Container Gateway (Port 3000)",
    category: "Cloud Project",
    status: "optimized",
    latency: "38ms",
    reliability: "99.98%",
    density: "88%",
    details: "Container ingress routes to port 3000 with nginx reverse proxy. Verified high throughput configuration."
  },
  {
    id: "firebase_store",
    name: "Firestore Persistent Schema & Auth blueprint",
    category: "Cloud Project",
    status: "active",
    latency: "52ms",
    reliability: "99.99%",
    density: "94%",
    details: "Stores relational user-authored logs and transaction histories. Auto-scaling active with secure firestore.rules."
  },
  {
    id: "ai_studio_context",
    name: "AI Studio Gemini-3.5-Flash Core Model",
    category: "AI Studio App",
    status: "optimized",
    latency: "140ms",
    reliability: "99.95%",
    density: "91%",
    details: "Configured with server-side prompt-leak guards, optimal system instructions, and system parameters."
  },
  {
    id: "drive_onboarding",
    name: "Client Onboarding SOP Checklist (Google Drive)",
    category: "Drive Asset",
    status: "linked",
    latency: "N/A",
    reliability: "100%",
    density: "76%",
    details: "PDF asset linked to automated onboarding kit. Scans customer profile schema for immediate sync."
  },
  {
    id: "drive_pricing_sheet",
    name: "E-Commerce Profit & SLA Metadata (Google Drive)",
    category: "Drive Asset",
    status: "linked",
    latency: "N/A",
    reliability: "100%",
    density: "82%",
    details: "Contains tiered pricing metadata ($49, $149, $299). Synchronized with Stripe webhook routes."
  },
  {
    id: "make_webhooks",
    name: "Make.com Live Action Workhooks Gateway",
    category: "Cloud Project",
    status: "optimized",
    latency: "75ms",
    reliability: "99.92%",
    density: "85%",
    details: "Handles continuous outbound data syndication, social routing, and webhook failover checks."
  }
];

// High-yielding trendy niche markets with pain-killer solutions
const NICHE_MARKETS = [
  {
    id: "saas_onboarding",
    niche: "Autonomous SaaS Client Onboarding Kit",
    volume: "High Demand ($12.5B Market)",
    friction: "Manual client workspace setup takes 2-4 hours, creating massive post-checkout conversion dropoff.",
    solution: "A self-healing, instant Slack & Google Workspace provisioning bot with SLA contract delivery.",
    baseValue: 299,
    demandScore: 94,
    metricsBoost: 1.25
  },
  {
    id: "competitor_intel",
    niche: "Real-time Competitor Intelligence Scraper",
    volume: "High Demand ($8.2B Market)",
    friction: "Boutique businesses cannot track competitors' newsletter hooks, leading to stale visual pricing models.",
    solution: "A JIT proxy-rotating scraper pulling content hooks directly into a command center spreadsheet.",
    baseValue: 199,
    demandScore: 89,
    metricsBoost: 1.15
  },
  {
    id: "compliance_sla",
    niche: "Automated SLA Compliance Seal Generator",
    volume: "Critical Demand ($15.4B Market)",
    friction: "Enterprise leads resist e-commerce checkouts due to lack of certified, signed SLA legal guarantees.",
    solution: "An instant HTML-to-PDF certificate compilation node offering a secure digital signature badge.",
    baseValue: 499,
    demandScore: 97,
    metricsBoost: 1.45
  },
  {
    id: "social_syndicator",
    niche: "Active Multi-Channel Content Router",
    volume: "Steady Demand ($6.1B Market)",
    friction: "Manual social posting drains operator bandwidth, restricting outbound organic lead-gen flows.",
    solution: "A webhook queue poster pulling fresh copy from a central database and syndicating over multiple targets.",
    baseValue: 149,
    demandScore: 82,
    metricsBoost: 1.10
  }
];

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ metrics, onTaskCompleted }) => {
  // Versional Upgrade: Tab controllers spanning across the 5 Corporate Departments & original Assets/Trends
  const [activeTab, setActiveTab] = useState<'profiler' | 'od_transform' | 'bus_dev' | 'prj_mgt' | 'cod_eng' | 'mar_digital'>('profiler');

  // Success Notification banner
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Original Profiler States
  const [selectedAssetId, setSelectedAssetId] = useState<string>("cloud_container");
  const [isProfiling, setIsProfiling] = useState<boolean>(false);
  const [profileLogs, setProfileLogs] = useState<string[]>([]);
  const [profiledAssets, setProfiledAssets] = useState<Record<string, boolean>>({});
  const [profileResult, setProfileResult] = useState<any | null>(null);

  // Original Niche Simulator States
  const [selectedNicheId, setSelectedNicheId] = useState<string>("saas_onboarding");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "highly_resilient" | "extreme_dominance">("highly_resilient");
  const [includeSlaSeal, setIncludeSlaSeal] = useState<boolean>(true);
  const [includeAutoresponder, setIncludeAutoresponder] = useState<boolean>(true);
  const [deployingNiche, setDeployingNiche] = useState<boolean>(false);
  const [deployedNiches, setDeployedNiches] = useState<Record<string, { price: number; crGain: number; timestamp: string }>>({});

  // TRACK 1: ORGANIZATIONAL READINESS ASSESSMENT & ROADMAP STATES
  const [readinessScores, setReadinessScores] = useState({
    leadership: 70,
    employeeEngagement: 60,
    processAgility: 50,
    dataAccess: 65,
    changeCapacity: 55
  });
  const [isOdScanning, setIsOdScanning] = useState(false);
  const [odLogs, setOdLogs] = useState<string[]>([]);
  const [odScanScore, setOdScanScore] = useState<number | null>(null);
  const [activeOdPhase, setActiveOdPhase] = useState<number>(0);

  // TRACK 2: BUS - VALUE PROPOSITION BUILDER & BURNOUT STATES
  const [valuePropJobs, setValuePropJobs] = useState("Automated client provisioning and SLA contract badging");
  const [valuePropPains, setValuePropPains] = useState("Manual 4-hour workspace overhead and checkout conversion dropoffs");
  const [valuePropPainRelievers, setValuePropPainRelievers] = useState("Self-healing webhooks provisioning in under 60 seconds");
  const [valuePropOffer, setValuePropOffer] = useState("Autonomous SaaS Client Onboarding Kit & Trust Badge Portal");
  const [isValidatingValueProp, setIsValidatingValueProp] = useState(false);
  const [validatedValueProps, setValidatedValueProps] = useState<string[]>([]);
  const [burnoutHeatmap, setBurnoutHeatmap] = useState([
    { dept: "BUS (Business Dev)", score: 85, color: "text-red-400 bg-red-500/10 border-red-500/30" },
    { dept: "PRJ (Project Management)", score: 72, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { dept: "COD (Software Dev)", score: 91, color: "text-red-500 bg-red-600/10 border-red-600/30" },
    { dept: "MAR (Marketing & Co)", score: 58, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { dept: "HR (Operations Staff)", score: 42, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
  ]);
  const [isRebalancingHeat, setIsRebalancingHeat] = useState(false);

  // TRACK 3: PRJ - PRINCE2 METHODOLOGY STANDARDIZER & ROLES
  const [assignedExecutive, setAssignedExecutive] = useState("Lazylarries Business Sponsor");
  const [assignedSeniorUser, setAssignedSeniorUser] = useState("B2B SaaS Clients Lead");
  const [assignedSeniorSupplier, setAssignedSeniorSupplier] = useState("Gemini-3.5-Flash Core Node");
  const [assignedPM, setAssignedPM] = useState("AI Transform Agent");
  const [assignedTM, setAssignedTM] = useState("Local Webhook Executor");
  const [princeTailoringCriteria, setPrinceTailoringCriteria] = useState({
    glossaryDefined: true,
    stageBoundariesSet: false,
    toleranceMarginsSet: true,
    riskLogsMaintained: false
  });
  const [maturityScanResult, setMaturityScanResult] = useState<number | null>(null);
  const [isScanningMaturity, setIsScanningMaturity] = useState(false);

  // TRACK 4: COD - DEVOPS GATEWAY & DEFINITION OF DONE (DoD)
  const [dodChecklist, setDodChecklist] = useState({
    codeReviewed_200_lines: true,
    unitTestsCover_80: false,
    securityScanVulnerabilityChecked: false,
    port3000IngressConfigured: true,
    envExampleDeclared: true
  });
  const [isCIRunning, setIsCIRunning] = useState(false);
  const [ciResult, setCiResult] = useState<{ status: string; code: number; coverage: string; logs: string[] } | null>(null);

  // TRACK 5: MAR - CUSTOMER CO-CREATION PORTAL & TARGETING
  const [coCreationIdeas, setCoCreationIdeas] = useState([
    { id: "1", title: "Instant Slack & Workspace SOP provisioning bot", author: "alex_tech", votes: 48, status: "approved" },
    { id: "2", title: "Digital SLA Certified Badge generator API", author: "mercer_legal", votes: 37, status: "approved" },
    { id: "3", title: "Real-time Competitor Pricing Proxy crawler", author: "growth_hacker", votes: 29, status: "suggested" },
    { id: "4", title: "Multi-Channel webhook poster queues", author: "social_lead", votes: 15, status: "suggested" }
  ]);
  const [newIdeaInput, setNewIdeaInput] = useState("");
  const [marketingTarget, setMarketingTarget] = useState("Technology-Intensive Enterprises seeking digital transformation");
  const [positioningStatement, setPositioningStatement] = useState("A secure, self-healing pain-killer system restoring +4.2x buyer trust margins.");
  const [romsPrediction, setRomsPrediction] = useState<number | null>(null);

  // SCROLL ANCHORS FOR TERMINAL LOGS
  useEffect(() => {
    const el = document.getElementById("terminal-scroller");
    if (el) el.scrollTop = el.scrollHeight;
  }, [profileLogs]);

  useEffect(() => {
    const el = document.getElementById("od-terminal-scroller");
    if (el) el.scrollTop = el.scrollHeight;
  }, [odLogs]);

  // HANDLER: Run original asset profiling
  const handleRunProfiling = (assetId: string) => {
    const asset = ASSET_PROFILES.find(a => a.id === assetId);
    if (!asset) return;

    setIsProfiling(true);
    setProfileResult(null);
    setProfileLogs([]);

    const steps = [
      `[INTEL] Connecting to relational data source "${asset.name}"...`,
      `[INTEL] Querying operational state headers & performance endpoints...`,
      `[INTEL] Analyzing cloud telemetry on standard Port 3000...`,
      `[INTEL] Parsing data-science schema cohesion metrics...`,
      `[INTEL] Correlating Drive templates with active live endpoints...`,
      `[INTEL] Relational profiling complete. Density and integrity successfully verified.`
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProfileLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[current]}`]);
        current++;
      } else {
        clearInterval(interval);
        setIsProfiling(false);
        setProfiledAssets(prev => ({ ...prev, [assetId]: true }));
        
        const baselineDensity = parseInt(asset.density);
        const efficiencyFactor = asset.latency !== "N/A" ? 94.5 : 82.0;
        const totalScore = Number(((baselineDensity * 0.6) + (efficiencyFactor * 0.4)).toFixed(1));

        setProfileResult({
          densityScore: totalScore,
          cohesionRate: asset.reliability,
          revenueValue: Math.round(totalScore * 2.2),
          scannedAt: new Date().toLocaleTimeString()
        });
      }
    }, 200);
  };

  // HANDLER: Claim profile revenue gain
  const handleClaimProfileGain = () => {
    if (!profileResult) return;
    const asset = ASSET_PROFILES.find(a => a.id === selectedAssetId);
    const amount = profileResult.revenueValue;
    
    onTaskCompleted({
      revenueIncrement: amount,
      name: `Asset Profile Cohesion: ${asset?.name}`
    });

    setSuccessBanner(`Relational intelligence optimized! Recaptured +$${amount} USD in premium business value.`);
    setProfileResult(null);
  };

  // HANDLER: Deploy original Trend-Niche Solution
  const handleDeployNiche = () => {
    const niche = NICHE_MARKETS.find(n => n.id === selectedNicheId);
    if (!niche) return;

    setDeployingNiche(true);

    setTimeout(() => {
      setDeployingNiche(false);

      let baseMultiplier = niche.metricsBoost;
      if (deliveryMethod === "highly_resilient") baseMultiplier += 0.15;
      if (deliveryMethod === "extreme_dominance") baseMultiplier += 0.35;
      if (includeSlaSeal) baseMultiplier += 0.10;
      if (includeAutoresponder) baseMultiplier += 0.10;

      const finalPrice = Math.round(niche.baseValue * (deliveryMethod === "extreme_dominance" ? 1.5 : deliveryMethod === "highly_resilient" ? 1.2 : 1.0));
      const conversionGain = Number((baseMultiplier * 1.5).toFixed(2));

      setDeployedNiches(prev => ({
        ...prev,
        [selectedNicheId]: {
          price: finalPrice,
          crGain: conversionGain,
          timestamp: new Date().toLocaleTimeString()
        }
      }));

      onTaskCompleted({
        revenueIncrement: Math.round(finalPrice * 0.8),
        name: `Niche Product Launched: ${niche.niche}`
      });

      setSuccessBanner(`PROFIT BOOSTER ACTIVE: Deployed "${niche.niche}" into high-demand trendy-niche. Earned +$${Math.round(finalPrice * 0.8)} USD initial licensing revenue!`);
    }, 1000);
  };

  // HANDLER: OD Readiness Assessment Diagnostic Sweep
  const handleOdScanner = () => {
    setIsOdScanning(true);
    setOdScanScore(null);
    setOdLogs([]);

    const steps = [
      "[DIAGNOSTIC] Querying organizational layers (2,000 employees)...",
      "[DIAGNOSTIC] Checking Strategy and Design elements alignment coefficients...",
      "[DIAGNOSTIC] Measuring leadership active sponsor modeling index...",
      "[DIAGNOSTIC] Quantifying multi-dimensional process agility & cross-department friction...",
      "[DIAGNOSTIC] Assessing Drive checklist metadata linkages...",
      "[DIAGNOSTIC] Analysis complete. Generating transformation readiness report..."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setOdLogs(prev => [...prev, `[OD] ${steps[current]}`]);
        current++;
      } else {
        clearInterval(interval);
        setIsOdScanning(false);
        
        // Calculate dynamic readiness score
        const { leadership, employeeEngagement, processAgility, dataAccess, changeCapacity } = readinessScores;
        const total = Math.round((leadership + employeeEngagement + processAgility + dataAccess + changeCapacity) / 5);
        setOdScanScore(total);

        onTaskCompleted({
          revenueIncrement: 150,
          name: "Organizational Readiness Diagnostic Certified"
        });

        setSuccessBanner(`Readiness Diagnostic Complete! Calculated Overall Maturity: ${total}% score. Awarded +$150 USD strategic alignment value.`);
      }
    }, 200);
  };

  // HANDLER: Validate B2B Value Proposition
  const handleValidateValueProp = () => {
    if (!valuePropJobs || !valuePropPains || !valuePropPainRelievers || !valuePropOffer) return;
    setIsValidatingValueProp(true);

    setTimeout(() => {
      setIsValidatingValueProp(false);
      const combinedKey = `${valuePropOffer} for ${valuePropJobs}`;
      setValidatedValueProps(prev => [...prev, combinedKey]);

      onTaskCompleted({
        revenueIncrement: 220,
        name: `Value Proposition Validated: ${valuePropOffer}`
      });

      setSuccessBanner(`McKinsey-Validated Value Prop: "${valuePropOffer}" successfully passed psychological validation. Unlocked +$220 USD cash flow upgrade!`);
    }, 1200);
  };

  // HANDLER: Rebalance Department Workloads (Burnout Heatmap)
  const handleRebalanceBurnout = () => {
    setIsRebalancingHeat(true);

    setTimeout(() => {
      setIsRebalancingHeat(false);
      setBurnoutHeatmap(prev => prev.map(item => ({
        ...item,
        score: Math.max(40, item.score - Math.round(Math.random() * 20 + 5)),
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      })));

      onTaskCompleted({
        revenueIncrement: 130,
        name: "Burnout Rebalanced via Dialogic OD Intervention"
      });

      setSuccessBanner("Mental margins protected! Reduced department burnouts. Reclaimed +$130 USD in operational stability values.");
    }, 1100);
  };

  // HANDLER: Scan PRINCE2 Project Maturity
  const handleScanMaturity = () => {
    setIsScanningMaturity(true);

    setTimeout(() => {
      setIsScanningMaturity(false);
      let count = 0;
      if (princeTailoringCriteria.glossaryDefined) count += 25;
      if (princeTailoringCriteria.stageBoundariesSet) count += 25;
      if (princeTailoringCriteria.toleranceMarginsSet) count += 25;
      if (princeTailoringCriteria.riskLogsMaintained) count += 25;

      setMaturityScanResult(count);

      onTaskCompleted({
        revenueIncrement: 110,
        name: `PRINCE2 Maturity Scan: ${count}%`
      });

      setSuccessBanner(`PRINCE2 Alignment: Maturity certified at ${count}%. Earned +$110 USD standardisation credits.`);
    }, 900);
  };

  // HANDLER: DevOps CI/CD Runner
  const handleRunCI = () => {
    setIsCIRunning(true);
    setCiResult(null);

    const logs = [
      "Starting pipeline validator on container port 3000 ingress...",
      "Reading .env.example variables to prevent key-leak vulnerabilities...",
      "Lint check: Running 'tsc --noEmit'... Passed with 0 compilation errors.",
      "Vulnerability scan: Checking for exposed server API keys...",
      "Quality Gate: Code completeness DoD Checklist scan initiated...",
    ];

    setTimeout(() => {
      const allDone = Object.values(dodChecklist).every(val => val === true);
      const outputLogs = [...logs];
      
      if (allDone) {
        outputLogs.push("All DoD Gates Passed: 100% compliance score verified.", "Ready for Production container build: vite build successfully completed.");
        setCiResult({
          status: "PASSED GATEWAY // GREEN",
          code: 0,
          coverage: "92.4%",
          logs: outputLogs
        });

        onTaskCompleted({
          revenueIncrement: 240,
          name: "DevOps CI/CD Definition-of-Done Passed"
        });

        setSuccessBanner("DevOps Automation Certified! Container secure on Port 3000. Earned +$240 USD codebase alteration rewards.");
      } else {
        outputLogs.push("FAIL: Quality Gate blocked. Please check all Definition of Done parameters before integration.");
        setCiResult({
          status: "FAILED GATEWAY // RED",
          code: 1,
          coverage: "45.0%",
          logs: outputLogs
        });
      }
      setIsCIRunning(false);
    }, 1200);
  };

  // HANDLER: Co-creation Idea Submission
  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaInput.trim()) return;

    const newIdea = {
      id: String(coCreationIdeas.length + 1),
      title: newIdeaInput,
      author: "customer_co_create",
      votes: 1,
      status: "suggested" as const
    };

    setCoCreationIdeas(prev => [...prev, newIdea]);
    setNewIdeaInput("");

    onTaskCompleted({
      revenueIncrement: 60,
      name: `Co-creation Idea submitted: ${newIdea.title}`
    });

    setSuccessBanner(`Starbucks-style Co-Creation Event: Logged "${newIdea.title}" into queue. Earned +$60 USD market fit alignment boost.`);
  };

  // HANDLER: Vote Idea
  const handleVoteIdea = (id: string) => {
    setCoCreationIdeas(prev => prev.map(idea => {
      if (idea.id === id) {
        const updatedVotes = idea.votes + 1;
        const autoApproved = updatedVotes >= 35 ? "approved" as const : idea.status;
        return { ...idea, votes: updatedVotes, status: autoApproved };
      }
      return idea;
    }));
  };

  // HANDLER: Predict ROMS
  const handlePredictRoms = () => {
    if (!marketingTarget || !positioningStatement) return;
    const lengthFactor = (marketingTarget.length + positioningStatement.length) % 5;
    const computedRoms = Number((3.5 + lengthFactor * 0.45).toFixed(2));
    setRomsPrediction(computedRoms);

    onTaskCompleted({
      revenueIncrement: 140,
      name: "ROMS Target Strategy Formulated"
    });

    setSuccessBanner(`ROMS Prediction Complete: Foreseeing +${computedRoms}x Return on Marketing Spend! Unlocked +$140 USD capital projection upgrades.`);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="market-intel-hub">
      
      {/* GLOBAL SUCCESS NOTIFICATION */}
      {successBanner && (
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-sm flex items-start gap-3 text-green-400 font-mono text-xs animate-fade-in" id="global-success-banner">
          <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
          <div className="space-y-1">
            <span className="font-bold uppercase block text-white">Venture Intelligence Upgrade Success</span>
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="ml-auto text-white/40 hover:text-white uppercase text-[9px] cursor-pointer">dismiss</button>
        </div>
      )}

      {/* INTELLIGENCE HUB HEADER */}
      <div className="bg-[#0F0F12] border border-cyan-500/15 p-6 rounded-sm relative overflow-hidden" id="intel-header-box">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-sm uppercase tracking-widest font-semibold">
              Corporate Knowledge Transformation Initiative // Versional Upgrade v2.0
            </span>
            <h2 className="text-xl font-light text-white uppercase tracking-widest">
              Organizational Agility & Commercial Dominance Center
            </h2>
            <p className="text-xs text-white/50 leading-relaxed font-mono">
              Deploy phase-based implementation frameworks, customize pain-killer value propositions, enforce PRINCE2 compliance margins, audit DevOps DoD checklist gates, and trigger customer co-creation.
            </p>
          </div>

          <div className="flex gap-4 font-mono text-[10px]">
            <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-sm space-y-1 min-w-[120px]">
              <span className="text-white/40 uppercase block text-[8px]">Agility Factor</span>
              <span className="text-cyan-400 font-bold uppercase text-xs">Agile 2.0</span>
            </div>
            <div className="bg-black/50 border border-white/5 px-4 py-3 rounded-sm space-y-1 min-w-[120px]">
              <span className="text-white/40 uppercase block text-[8px]">Target Scope</span>
              <span className="text-green-400 font-bold text-xs">2,000 Staff</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTMENTAL TRACKS TAB BAR */}
      <div className="flex flex-wrap border-b border-white/5 gap-1" id="intel-tracks-tab-bar">
        {[
          { id: "profiler", label: "Asset Profiles & Trends", icon: Network },
          { id: "od_transform", label: "OD Change & Agile Transition", icon: Workflow },
          { id: "bus_dev", label: "BUS: Value & Burnout Map", icon: Award },
          { id: "prj_mgt", label: "PRJ: PRINCE2 Standardizer", icon: ClipboardList },
          { id: "cod_eng", label: "COD: DevOps DoD & CI Gates", icon: Code },
          { id: "mar_digital", label: "MAR: Co-Creation & Positioning", icon: Megaphone }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSuccessBanner(null);
              }}
              className={`px-4 py-3 text-[11px] font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-cyan-500 text-cyan-400 bg-cyan-500/5 font-bold"
                  : "border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}

      {/* TAB 1: ASSETS PROFILING AND TREND NICHES (ORIGINAL TAB COMBINATION) */}
      {activeTab === "profiler" && (
        <div className="space-y-8 animate-fade-in" id="panel-assets-trends">
          {/* Section A: Relational Profiling */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <span className="text-[11px] font-mono uppercase text-white/70 tracking-wider font-semibold">Connected Asset Directories</span>
              </div>
              <div className="space-y-2.5" id="original-assets-selector">
                {ASSET_PROFILES.map((asset) => {
                  const isSelected = selectedAssetId === asset.id;
                  const isProfiled = profiledAssets[asset.id];
                  return (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setSelectedAssetId(asset.id);
                        setProfileResult(null);
                      }}
                      className={`w-full p-4 rounded-sm border text-left cursor-pointer transition-all flex justify-between items-center ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-500 text-white"
                          : "bg-[#0F0F12] border-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className="space-y-1 max-w-[80%]">
                        <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded-sm uppercase tracking-widest block w-max">
                          {asset.category}
                        </span>
                        <h4 className="text-xs font-mono font-semibold truncate uppercase">{asset.name}</h4>
                      </div>
                      <div className="shrink-0">
                        {isProfiled ? (
                          <span className="text-[8px] font-mono text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded-sm uppercase">✓ Profiled</span>
                        ) : (
                          <span className="text-[8px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-sm uppercase">Unscanned</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="xl:col-span-8">
              {(() => {
                const currentAsset = ASSET_PROFILES.find(a => a.id === selectedAssetId);
                if (!currentAsset) return null;

                return (
                  <div className="bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
                    <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-mono uppercase text-white">{currentAsset.name}</h3>
                        <p className="text-[10px] text-white/40 font-mono mt-0.5">Relational metadata scan and telemetry analysis</p>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-black border border-cyan-500/20 px-2 py-0.5 rounded-sm">Port 3000 Ingress</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-sm font-mono">
                        <span className="text-[8px] text-white/40 uppercase block">Base Reliability</span>
                        <span className="text-white text-sm font-bold block mt-1">{currentAsset.reliability}</span>
                      </div>
                      <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-sm font-mono">
                        <span className="text-[8px] text-white/40 uppercase block">Asset Density</span>
                        <span className="text-white text-sm font-bold block mt-1">{currentAsset.density}</span>
                      </div>
                      <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-sm font-mono">
                        <span className="text-[8px] text-white/40 uppercase block">Latency Overhead</span>
                        <span className="text-cyan-400 text-sm font-bold block mt-1">{currentAsset.latency}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#0A0A0C] border border-white/5 rounded-sm font-mono text-xs text-white/70">
                      <span className="text-[9px] uppercase font-bold text-white/40 block mb-1">Architecture Cohesion Specs:</span>
                      {currentAsset.details}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/10">
                      <div className="lg:col-span-7 space-y-2">
                        <span className="text-[8px] font-mono text-white/40 uppercase block">Telemetry Scanner Stream</span>
                        <div className="bg-[#050507] border border-white/10 p-4 rounded-sm h-36 font-mono text-[10px] text-cyan-400/80 overflow-y-auto space-y-1" id="terminal-scroller">
                          {profileLogs.length > 0 ? (
                            profileLogs.map((log, i) => <div key={i} className="truncate">{log}</div>)
                          ) : (
                            <div className="text-white/20 h-full flex items-center justify-center uppercase tracking-widest text-[9px]">Awaiting scan trigger...</div>
                          )}
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col justify-between">
                        {profileResult ? (
                          <div className="bg-[#0A0A0C] border border-cyan-500/30 p-4 rounded-sm space-y-3">
                            <span className="text-[8px] font-mono text-green-400 uppercase tracking-widest block font-bold">✓ Target Profile Cohesion Active</span>
                            <div className="space-y-1 font-mono text-[10px]">
                              <div className="flex justify-between">
                                <span className="text-white/40">Density Index Score:</span>
                                <span className="text-white font-bold">{profileResult.densityScore}%</span>
                              </div>
                              <div className="flex justify-between border-t border-white/15 pt-1 text-xs">
                                <span className="text-white">Revenue Recaptured:</span>
                                <span className="text-green-400 font-bold">${profileResult.revenueValue}.00</span>
                              </div>
                            </div>
                            <button onClick={handleClaimProfileGain} className="w-full py-2 bg-green-500 text-black hover:bg-green-400 text-[10px] font-mono uppercase font-bold rounded-sm cursor-pointer transition-all">
                              Claim Financial Gain
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col h-full justify-between gap-4">
                            <p className="text-[9px] font-mono text-white/30 leading-normal">Profiling files, Google Drive metadata documents, and live port mappings identifies leakage coefficients instantly.</p>
                            <button onClick={() => handleRunProfiling(currentAsset.id)} disabled={isProfiling} className={`w-full py-3 border text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all ${isProfiling ? "bg-cyan-500/10 text-cyan-400 animate-pulse" : "bg-cyan-500 text-black font-bold"}`}>
                              {isProfiling ? "Running Cohesion Profiler..." : "Scan Relational Profile"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Section B: Trend Niche Pain Killer Simulator */}
          <div className="bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-mono uppercase text-white">Trend-Niche Market Research & Buyer Pain-Killer Solutions</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Deploy demand-fit trendy-niche offerings engineered to re-establish pricing leverage</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-3">
                <label className="text-[9px] uppercase font-mono text-white/40 tracking-wider block">Target Market Niche</label>
                <div className="grid grid-cols-1 gap-2">
                  {NICHE_MARKETS.map((n) => {
                    const isSelected = selectedNicheId === n.id;
                    const isDeployed = !!deployedNiches[n.id];
                    return (
                      <button key={n.id} onClick={() => setSelectedNicheId(n.id)} className={`p-4 rounded-sm border text-left cursor-pointer transition-all ${isSelected ? "bg-cyan-500/10 border-cyan-500 text-white" : "bg-[#0A0A0C] border-white/5 text-white/60 hover:text-white"}`}>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-mono font-bold uppercase">{n.niche}</h4>
                          {isDeployed && <span className="text-[7px] bg-green-500/10 border border-green-500/30 text-green-400 px-1.5 py-0.2 rounded-sm font-mono uppercase">✓ Deployed</span>}
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[9px] font-mono">
                          <span className="text-white/40">{n.volume}</span>
                          <span className="text-cyan-400">Demand: {n.demandScore}/100</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <label className="text-[9px] uppercase font-mono text-white/40 tracking-wider block">Configure Upgrades</label>
                <div className="bg-[#0A0A0C] border border-white/5 p-4 rounded-sm space-y-4 font-mono text-[11px]">
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-white/40 uppercase block">Safeguards & Proxy Tuning</span>
                    <div className="grid grid-cols-3 gap-1">
                      {["standard", "highly_resilient", "extreme_dominance"].map((method) => (
                        <button key={method} onClick={() => setDeliveryMethod(method as any)} className={`py-1 text-[8px] border rounded-sm font-bold uppercase cursor-pointer ${deliveryMethod === method ? "bg-cyan-500 text-black border-cyan-500" : "bg-[#050507] border-white/10 text-white/60"}`}>
                          {method.split("_")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div onClick={() => setIncludeSlaSeal(!includeSlaSeal)} className="flex justify-between items-center p-2.5 bg-[#050507] border border-white/5 rounded-sm cursor-pointer hover:border-white/10">
                    <div>
                      <span className="text-white block font-semibold uppercase text-[9px]">SLA Compliance Seal</span>
                      <span className="text-[8px] text-white/40 block">Digital certificate stored in Drive</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${includeSlaSeal ? "bg-cyan-500" : "bg-white/10"}`}>
                      <div className={`w-3 h-3 rounded-full bg-black transition-all ${includeSlaSeal ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>

                  <div onClick={() => setIncludeAutoresponder(!includeAutoresponder)} className="flex justify-between items-center p-2.5 bg-[#050507] border border-white/5 rounded-sm cursor-pointer hover:border-white/10">
                    <div>
                      <span className="text-white block font-semibold uppercase text-[9px]">Autonomous Lead Responder</span>
                      <span className="text-[8px] text-white/40 block">Instantly locks in leads under 60s</span>
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-all ${includeAutoresponder ? "bg-cyan-500" : "bg-white/10"}`}>
                      <div className={`w-3 h-3 rounded-full bg-black transition-all ${includeAutoresponder ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 bg-[#0A0A0C] border border-white/10 p-5 rounded-sm flex flex-col justify-between">
                {(() => {
                  const niche = NICHE_MARKETS.find(n => n.id === selectedNicheId);
                  if (!niche) return null;

                  let m = 1.0;
                  if (deliveryMethod === "highly_resilient") m += 0.20;
                  if (deliveryMethod === "extreme_dominance") m += 0.45;
                  if (includeSlaSeal) m += 0.15;
                  if (includeAutoresponder) m += 0.25;

                  const dynamicPrice = Math.round(niche.baseValue * m);
                  const crBoost = Number((niche.metricsBoost * m * 0.75).toFixed(2));

                  return (
                    <>
                      <div className="space-y-4 font-mono">
                        <span className="text-[8px] uppercase text-white/40 tracking-wider block">Target Value Model</span>
                        <div>
                          <span className="text-[9px] text-white/40 uppercase block">Calculated Solution Price:</span>
                          <span className="text-lg font-bold text-white block">${dynamicPrice}.00 USD</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-white/40 uppercase block">Projected CR Gain:</span>
                          <span className="text-md font-bold text-cyan-400 block">+{crBoost}% Gain</span>
                        </div>
                        <div className="bg-[#050507] p-3 rounded-sm border border-white/5 text-[9px] text-white/40">
                          <span className="text-amber-500 font-bold block mb-1 uppercase">Identified Friction:</span>
                          <p>{niche.friction}</p>
                        </div>
                      </div>
                      <button onClick={handleDeployNiche} disabled={deployingNiche} className={`w-full py-3 mt-4 text-[10px] font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all ${deployingNiche ? "bg-cyan-500/10 text-cyan-400 animate-pulse" : "bg-cyan-500 text-black font-bold"}`}>
                        {deployingNiche ? "Launching Niche Solution..." : "Deploy Pain-Killer Product"}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZATIONAL READINESS & AGILE TRANSITION */}
      {activeTab === "od_transform" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" id="panel-od-transform">
          {/* Left Panel: Diagnostic Assessment Scoring */}
          <div className="xl:col-span-5 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Maturity Diagnostic Sweep</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Analyze readiness variables across the 2,000 employee hierarchical organization</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {[
                { id: "leadership", label: "Executive Leadership Sponsorship" },
                { id: "employeeEngagement", label: "Employee Engagement Commitment" },
                { id: "processAgility", label: "Workforce Process Agility" },
                { id: "dataAccess", label: "Secure Data & API Ingress Capacity" },
                { id: "changeCapacity", label: "Cultural Transformation Adaptability" }
              ].map((field) => {
                const val = (readinessScores as any)[field.id];
                return (
                  <div key={field.id} className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/60 uppercase">{field.label}</span>
                      <span className="text-cyan-400 font-bold">{val}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={val}
                      onChange={(e) => {
                        setReadinessScores(prev => ({ ...prev, [field.id]: parseInt(e.target.value) }));
                        setOdScanScore(null);
                      }}
                      className="w-full accent-cyan-500 h-1 bg-white/10 rounded-sm cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleOdScanner}
              disabled={isOdScanning}
              className={`w-full py-3 border text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all ${
                isOdScanning ? "bg-cyan-500/10 text-cyan-400 animate-pulse" : "bg-cyan-500 text-black font-bold"
              }`}
            >
              {isOdScanning ? "Executing Organizational Diagnostics..." : "Run Transition Readiness Sweep"}
            </button>
          </div>

          {/* Right Panel: Phase-Based Transformation Roadmap & Telemetry logs */}
          <div className="xl:col-span-7 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-white">Continuous Change Roadmap</h3>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">Organizational Development Phase Implementation Milestones</p>
              </div>
              {odScanScore !== null && (
                <div className="bg-[#0A0A0C] border border-cyan-500/20 px-4 py-2 rounded-sm text-right">
                  <span className="text-[8px] font-mono text-white/40 uppercase block">Global Readiness</span>
                  <span className="text-green-400 font-mono font-bold text-sm">{odScanScore}% Score</span>
                </div>
              )}
            </div>

            {/* Diagnostic Log Console */}
            <div className="space-y-2">
              <span className="text-[8px] font-mono text-white/40 uppercase block">Diagnostic Audit Telemetry</span>
              <div className="bg-[#050507] border border-white/10 p-4 rounded-sm h-32 font-mono text-[10px] text-cyan-400/80 overflow-y-auto space-y-1" id="od-terminal-scroller">
                {odLogs.length > 0 ? (
                  odLogs.map((log, i) => <div key={i} className="leading-relaxed truncate">{log}</div>)
                ) : (
                  <div className="text-white/20 h-full flex items-center justify-center uppercase tracking-widest text-[9px]">Awaiting readiness scan sweep execution...</div>
                )}
              </div>
            </div>

            {/* Implementation Phase Steps */}
            <div className="space-y-3">
              <span className="text-[8px] font-mono text-white/40 uppercase block">Evidence-Based Implementation Steps (12-Month Master Plan)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="od-phase-grid">
                {[
                  { phase: 1, title: "Phase 1: Diagnosis & Alignment", timeline: "Months 1-3", detail: "Readiness sweeps, corporate stake mapping, strategy clarification processes." },
                  { phase: 2, title: "Phase 2: Structural Redesign", timeline: "Months 4-6", detail: "Control span optimization, work design structures, HR practices alignment." },
                  { phase: 3, title: "Phase 3: Change Implementation", timeline: "Months 7-9", detail: "Communication system architecture, resistance mitigation, pilot rollout programs." },
                  { phase: 4, title: "Phase 4: Institutionalization", timeline: "Months 10-12", detail: "Real-time metrics tracking, continuous feedback adaptation, learning loops." }
                ].map((item, index) => {
                  const isActive = activeOdPhase === index;
                  return (
                    <div 
                      key={item.phase} 
                      onClick={() => setActiveOdPhase(index)}
                      className={`p-3.5 border rounded-sm cursor-pointer transition-all ${
                        isActive 
                          ? "bg-cyan-500/10 border-cyan-500 text-white" 
                          : "bg-[#0A0A0C] border-white/5 text-white/50 hover:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 text-[9px] font-mono font-bold uppercase">
                        <span className={isActive ? "text-cyan-400" : "text-white"}>{item.title}</span>
                        <span className="text-white/30">{item.timeline}</span>
                      </div>
                      <p className="text-[9px] font-mono leading-relaxed">{item.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: B2B VALUE PROPOSITION BUILDER & BURNOUT HEATMAP MONITOR */}
      {activeTab === "bus_dev" && (
        <div className="space-y-8 animate-fade-in" id="panel-bus-dev">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Value Proposition Builder (BUS) */}
            <div className="xl:col-span-8 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-mono uppercase tracking-wider text-white">Osterwalder Value Proposition Architect</h3>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">Synthesize target market customer profiles with pain-killer technical deliverables</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase text-white/40 block">Customer Segment Jobs-to-be-Done</label>
                  <textarea 
                    value={valuePropJobs}
                    onChange={(e) => setValuePropJobs(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 font-mono text-xs text-white/80 focus:border-cyan-500 h-20 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase text-white/40 block">Identified Buyer Pain Points</label>
                  <textarea 
                    value={valuePropPains}
                    onChange={(e) => setValuePropPains(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 font-mono text-xs text-white/80 focus:border-cyan-500 h-20 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase text-white/40 block">Your Pain Relievers & Gains</label>
                  <textarea 
                    value={valuePropPainRelievers}
                    onChange={(e) => setValuePropPainRelievers(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 font-mono text-xs text-white/80 focus:border-cyan-500 h-20 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase text-white/40 block">Core Service Offer & Deliverable</label>
                  <textarea 
                    value={valuePropOffer}
                    onChange={(e) => setValuePropOffer(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 font-mono text-xs text-white/80 focus:border-cyan-500 h-20 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
                <p className="text-[9px] font-mono text-white/30 max-w-md">Validating value propositions matches customer psychological drivers against systemic solutions to eliminate checkout churn.</p>
                <button
                  onClick={handleValidateValueProp}
                  disabled={isValidatingValueProp}
                  className={`px-6 py-3 border text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all shrink-0 ${
                    isValidatingValueProp ? "bg-cyan-500/10 text-cyan-400 animate-pulse" : "bg-cyan-500 text-black font-bold"
                  }`}
                >
                  {isValidatingValueProp ? "Analyzing Alignment Cohesion..." : "Validate Value Proposition"}
                </button>
              </div>

              {validatedValueProps.length > 0 && (
                <div className="bg-[#050507] border border-white/10 p-4 rounded-sm space-y-2 font-mono text-[10px]">
                  <span className="text-cyan-400 font-bold uppercase block">Verified Value Statements Repository</span>
                  {validatedValueProps.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white/70 border-b border-white/[0.03] pb-1.5 last:border-0">
                      <CheckCircle className="h-3 w-3 text-green-400 shrink-0" />
                      <span className="truncate">{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Burnout Heatmap Analytics (BUS) */}
            <div className="xl:col-span-4 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
              <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-white">Burnout Heat Monitor</h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Optimizing staff mental margins</p>
                </div>
                <Flame className="h-5 w-5 text-red-500 animate-pulse" />
              </div>

              <div className="space-y-4" id="burnout-indicators">
                {burnoutHeatmap.map((item) => (
                  <div key={item.dept} className="bg-[#0A0A0C] border border-white/5 p-3.5 rounded-sm space-y-2">
                    <div className="flex justify-between items-center font-mono text-[10px]">
                      <span className="text-white font-semibold uppercase">{item.dept}</span>
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border ${item.color}`}>
                        {item.score}% Fatigue
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${item.score}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score >= 85 ? "bg-red-500 animate-pulse" : item.score >= 70 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <p className="text-[9px] font-mono text-white/30">Triggering dialogic organizational adjustments rebalances workloads to protect team velocity benchmarks.</p>
                <button
                  onClick={handleRebalanceBurnout}
                  disabled={isRebalancingHeat}
                  className={`w-full py-3.5 border text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all ${
                    isRebalancingHeat ? "bg-red-500/10 border-red-500/30 text-red-400 cursor-wait animate-pulse" : "bg-red-500/15 border-red-500/35 hover:bg-red-500 hover:text-black text-red-400 font-bold"
                  }`}
                >
                  {isRebalancingHeat ? "Stabilizing Workloads..." : "Execute Dialogic OD Intervention"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PRINCE2 METHODOLOGY STANDARDIZER & ROLES MATURITY (PRJ) */}
      {activeTab === "prj_mgt" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" id="panel-prj-mgt">
          {/* PRINCE2 Team Role Mandates Configuration */}
          <div className="xl:col-span-6 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">PRINCE2 Team Role Mandates</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Enforce standard governance chains from corporate layers down to PM execution</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-white/40 block font-bold">1. Executive Sponsor (Business Interest)</label>
                <input 
                  type="text" 
                  value={assignedExecutive}
                  onChange={(e) => setAssignedExecutive(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 text-white/80 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-white/40 block font-bold">2. Senior User representative (User Interest)</label>
                <input 
                  type="text" 
                  value={assignedSeniorUser}
                  onChange={(e) => setAssignedSeniorUser(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 text-white/80 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-white/40 block font-bold">3. Senior Supplier (Supplier/Dev Interest)</label>
                <input 
                  type="text" 
                  value={assignedSeniorSupplier}
                  onChange={(e) => setAssignedSeniorSupplier(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 text-white/80 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-white/40 block font-semibold">Project Manager</label>
                  <input 
                    type="text" 
                    value={assignedPM}
                    onChange={(e) => setAssignedPM(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 text-white/80 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-white/40 block font-semibold">Team Manager</label>
                  <input 
                    type="text" 
                    value={assignedTM}
                    onChange={(e) => setAssignedTM(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 text-white/80 focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0C] p-4 border border-white/5 rounded-sm font-mono text-[9px] text-white/40 space-y-1.5">
              <span className="text-cyan-400 font-bold uppercase block">Governance Mandate Rule:</span>
              <p>PRINCE2 mandates that Business, User, and Supplier interests are represented explicitly on the Project Board to prevent project drift.</p>
            </div>
          </div>

          {/* Project Maturity & Agile Tailoring Checklists */}
          <div className="xl:col-span-6 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Agile Tailoring & Maturity Parameters</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Customize PRINCE2 framework criteria to match agile development cycles</p>
            </div>

            {/* Checkbox criteria list */}
            <div className="space-y-3.5 font-mono text-xs">
              {[
                { id: "glossaryDefined", label: "Project Glossary Defined (Initial Minimum Feature Set)" },
                { id: "stageBoundariesSet", label: "Interactive Stage Boundaries Scheduled (Gates)" },
                { id: "toleranceMarginsSet", label: "Explicit Tolerance Margins Configured (+/- 10%)" },
                { id: "riskLogsMaintained", label: "Continuous Active Risk Logs Maintained" }
              ].map((criteria) => (
                <div 
                  key={criteria.id}
                  onClick={() => {
                    setPrinceTailoringCriteria(prev => ({
                      ...prev,
                      [criteria.id]: !(prev as any)[criteria.id]
                    }));
                    setMaturityScanResult(null);
                  }}
                  className="flex items-center gap-3 p-3 bg-[#0A0A0C] border border-white/5 rounded-sm cursor-pointer hover:bg-white/[0.01]"
                >
                  <div className={`w-4.5 h-4.5 rounded-sm border flex items-center justify-center transition-all ${
                    (princeTailoringCriteria as any)[criteria.id] ? "bg-cyan-500 border-cyan-500 text-black" : "border-white/20"
                  }`}>
                    {(princeTailoringCriteria as any)[criteria.id] && <CheckCircle className="h-3.5 w-3.5 text-black stroke-[3]" />}
                  </div>
                  <span className="text-white/80 select-none uppercase text-[10px]">{criteria.label}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 items-center">
              <div>
                <button
                  onClick={handleScanMaturity}
                  disabled={isScanningMaturity}
                  className={`w-full py-3.5 border text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all ${
                    isScanningMaturity ? "bg-cyan-500/10 text-cyan-400 animate-pulse" : "bg-cyan-500 text-black font-bold"
                  }`}
                >
                  {isScanningMaturity ? "Scanning PRINCE2 Maturity..." : "Scan Project Maturity"}
                </button>
              </div>

              <div>
                {maturityScanResult !== null ? (
                  <div className="bg-[#0A0A0C] border border-cyan-500/30 p-3.5 rounded-sm text-center">
                    <span className="text-[8px] font-mono text-white/40 uppercase block">Governance Compliance</span>
                    <span className="text-cyan-400 font-mono font-bold text-sm block mt-0.5">{maturityScanResult}% Standardised</span>
                  </div>
                ) : (
                  <p className="text-[9px] font-mono text-white/30">Ensuring standard PRINCE2 compliance reduces coordination drift across high-yielding agile operations.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COD - SOFTWARE DEVOPS GATEWAY & DoD GATES */}
      {activeTab === "cod_eng" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" id="panel-cod-eng">
          {/* Quality Gates checklist & DoD verification */}
          <div className="xl:col-span-5 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Quality Code DoD Gates</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Verify essential Definition of Done parameters before merging code assets</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                { id: "codeReviewed_200_lines", label: "Face-to-face Review (200-400 lines/hr rate)" },
                { id: "unitTestsCover_80", label: "Automated Unit Tests Cover > 80% coverage" },
                { id: "securityScanVulnerabilityChecked", label: "Container Vulnerability & Auth blueprint verified" },
                { id: "port3000IngressConfigured", label: "Standard Port 3000 binding parameters strictly mapped" },
                { id: "envExampleDeclared", label: "Secret Key protection variables declared in .env.example" }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setDodChecklist(prev => ({ ...prev, [item.id]: !(prev as any)[item.id] }));
                    setCiResult(null);
                  }}
                  className="flex items-center gap-3 p-3 bg-[#0A0A0C] border border-white/5 rounded-sm cursor-pointer hover:bg-white/[0.01]"
                >
                  <div className={`w-4.5 h-4.5 rounded-sm border flex items-center justify-center transition-all ${
                    (dodChecklist as any)[item.id] ? "bg-cyan-500 border-cyan-500 text-black" : "border-white/20"
                  }`}>
                    {(dodChecklist as any)[item.id] && <CheckCircle className="h-3.5 w-3.5 text-black stroke-[3]" />}
                  </div>
                  <span className="text-white/80 select-none uppercase text-[10px]">{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleRunCI}
              disabled={isCIRunning}
              className={`w-full py-3.5 border text-xs font-mono uppercase tracking-wider rounded-sm cursor-pointer transition-all ${
                isCIRunning ? "bg-cyan-500/10 text-cyan-400 animate-pulse" : "bg-cyan-500 text-black font-bold"
              }`}
            >
              {isCIRunning ? "Running Automated CI/CD Pipeline..." : "Validate Quality Gates & Run CI"}
            </button>
          </div>

          {/* CI/CD console logs & results */}
          <div className="xl:col-span-7 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-5">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Automated Container Deployment Telemetry</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Live validation feedback streaming from standard Cloud Run build environments</p>
            </div>

            <div className="space-y-2">
              <span className="text-[8px] font-mono text-white/40 uppercase block">CI Console Logs</span>
              <div className="bg-[#050507] border border-white/10 p-4 rounded-sm h-48 font-mono text-[10px] text-cyan-400/80 overflow-y-auto space-y-1.5" id="ci-scroller">
                {ciResult ? (
                  ciResult.logs.map((log, i) => <div key={i} className="truncate">{log}</div>)
                ) : isCIRunning ? (
                  <div className="text-white/50 h-full flex items-center justify-center uppercase tracking-widest text-[9px] animate-pulse">Executing security check audits...</div>
                ) : (
                  <div className="text-white/20 h-full flex items-center justify-center uppercase tracking-widest text-[9px]">Awaiting quality gate pipeline trigger...</div>
                )}
              </div>
            </div>

            {ciResult && (
              <div className={`p-4 rounded-sm border font-mono text-[11px] flex justify-between items-center ${
                ciResult.code === 0 ? "bg-green-500/5 border-green-500/30 text-green-400" : "bg-red-500/5 border-red-500/30 text-red-400"
              }`}>
                <div className="space-y-1">
                  <span className="font-bold uppercase block text-white">{ciResult.status}</span>
                  <span className="text-[9px] text-white/50">Test Coverage: {ciResult.coverage} | Exit Code: {ciResult.code}</span>
                </div>
                {ciResult.code === 0 ? (
                  <ShieldCheck className="h-6 w-6 text-green-400 shrink-0" />
                ) : (
                  <ShieldAlert className="h-6 w-6 text-red-400 shrink-0" />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: MAR - CUSTOMER CO-CREATION PORTAL & BRAND POSITIONING */}
      {activeTab === "mar_digital" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in" id="panel-mar-digital">
          {/* Customer Co-creation Portal (Starbucks My Idea / Dell IdeaStorm adaptation) */}
          <div className="xl:col-span-7 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-5">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Client Co-Creation Portal</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Active customer-collaborative ideation platform driving trend alignment</p>
            </div>

            {/* Submit new idea */}
            <form onSubmit={handleAddIdea} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Suggest a brand new 'pain-killer' feature/niche..."
                value={newIdeaInput}
                onChange={(e) => setNewIdeaInput(e.target.value)}
                className="flex-1 bg-[#0A0A0C] border border-white/10 rounded-sm p-3 text-xs font-mono text-white/80 focus:border-cyan-500 outline-none"
              />
              <button type="submit" className="px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded-sm cursor-pointer flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Submit
              </button>
            </form>

            {/* List of customer ideas */}
            <div className="space-y-2.5">
              <span className="text-[8px] font-mono text-white/40 uppercase block">Community Proposed Features Queue</span>
              <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {coCreationIdeas.map((idea) => (
                  <div key={idea.id} className="bg-[#0A0A0C] border border-white/5 p-3.5 rounded-sm flex justify-between items-center font-mono">
                    <div className="space-y-1 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className={`text-[7px] px-1.5 py-0.2 rounded-sm font-bold uppercase ${
                          idea.status === "approved" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white/5 text-white/40"
                        }`}>
                          {idea.status}
                        </span>
                        <span className="text-[8px] text-white/30">Proposed by @{idea.author}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white/80 leading-normal">{idea.title}</h4>
                    </div>

                    <button 
                      onClick={() => handleVoteIdea(idea.id)}
                      className="px-3 py-2 bg-white/[0.02] hover:bg-cyan-500 hover:text-black border border-white/10 hover:border-cyan-500 rounded-sm cursor-pointer transition-all flex flex-col items-center gap-1"
                    >
                      <ThumbsUp className="h-3 w-3 shrink-0" />
                      <span className="text-[9px] font-bold">{idea.votes}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brand & Target Market Positioning tool */}
          <div className="xl:col-span-5 bg-[#0F0F12] border border-white/5 rounded-sm p-6 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white">Target Brand Positioning</h3>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">Align marketing hooks with real commercial outcomes</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-white/40 block">Target Audience / Demographic Segment</label>
                <textarea 
                  value={marketingTarget}
                  onChange={(e) => {
                    setMarketingTarget(e.target.value);
                    setRomsPrediction(null);
                  }}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 font-mono text-xs text-white/80 focus:border-cyan-500 h-16 outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-white/40 block">Positioning Statement (Unique Value Hook)</label>
                <textarea 
                  value={positioningStatement}
                  onChange={(e) => {
                    setPositioningStatement(e.target.value);
                    setRomsPrediction(null);
                  }}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-sm p-3 font-mono text-xs text-white/80 focus:border-cyan-500 h-20 outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={handlePredictRoms}
              className="w-full py-3 bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <BarChart2 className="h-4 w-4" />
              Calculate ROMS Forecast Index
            </button>

            {romsPrediction !== null && (
              <div className="bg-[#0A0A0C] border border-cyan-500/30 p-4 rounded-sm font-mono text-center space-y-1 animate-fade-in">
                <span className="text-[8px] text-white/40 uppercase block">Predicted Return on Marketing Spend</span>
                <span className="text-green-400 font-bold text-lg block">+{romsPrediction}x ROMS Multiply</span>
                <span className="text-[8px] text-white/30 block">Co-creation alignment factor verified.</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
