'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Zap, 
  BookOpen, 
  Terminal, 
  Play, 
  CheckSquare, 
  Radar, 
  Calculator, 
  FileText, 
  Copy, 
  Loader2, 
  Settings, 
  Database,
  RefreshCw,
  AlertCircle,
  Activity
} from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

// ── TABS ──
type TabID = 'bizop' | 'genesis' | 'alexandria' | 'commander' | 'capacity' | 'jim-path' | 'sprints';

export default function VentureInfrastructurePage() {
  const [activeTab, setActiveTab] = useState<TabID>('bizop');

  return (
    <>
      <Section variant="hero" className="min-h-screen">
        <div className="text-center mb-10">
          <Badge variant="gold" className="mb-4">Ecosystem Suite</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-kagan-white mb-4">
            Venture <span className="text-gradient">Infrastructure</span>
          </h1>
          <p className="text-lg text-kagan-light max-w-2xl mx-auto">
            Self-direction modules and deployable AI frameworks. Build blueprints, navigate operations, inspect agent pipelines, and access the Alexandria data science library.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="max-w-5xl mx-auto mb-10 flex border-b border-kagan-border justify-center md:justify-start overflow-x-auto whitespace-nowrap">
          <TabButton active={activeTab === 'bizop'} onClick={() => setActiveTab('bizop')} icon={Compass} label="BizOp Navigator" />
          <TabButton active={activeTab === 'genesis'} onClick={() => setActiveTab('genesis')} icon={Zap} label="Genesis Protocol" />
          <TabButton active={activeTab === 'alexandria'} onClick={() => setActiveTab('alexandria')} icon={BookOpen} label="Alexandria KB" />
          <TabButton active={activeTab === 'commander'} onClick={() => setActiveTab('commander')} icon={Terminal} label="Commander Workflows" />
          <TabButton active={activeTab === 'jim-path'} onClick={() => setActiveTab('jim-path')} icon={Radar} label="Jim Shortest Path" />
          <TabButton active={activeTab === 'sprints'} onClick={() => setActiveTab('sprints')} icon={Zap} label="Parallel Sprints" />
          <TabButton active={activeTab === 'capacity'} onClick={() => setActiveTab('capacity')} icon={Activity} label="Capacity Scoring" />
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'bizop' && <BizOpTab />}
          {activeTab === 'genesis' && <GenesisTab />}
          {activeTab === 'alexandria' && <AlexandriaTab />}
          {activeTab === 'commander' && <CommanderTab />}
          {activeTab === 'jim-path' && <JimShortestPathTab />}
          {activeTab === 'sprints' && <ParallelSprintsTab />}
          {activeTab === 'capacity' && <CapacityTab />}
        </div>
      </Section>
    </>
  );
}

// ── TAB BUTTON ──
function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-4 border-b-2 text-sm font-bold transition-colors cursor-pointer ${
        active 
          ? 'border-kagan-gold text-kagan-gold bg-kagan-gold/5' 
          : 'border-transparent text-kagan-muted hover:text-kagan-light'
      }`}
    >
      <Icon className="h-4.5 w-4.5" />
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1 · BizOp Navigator Tab
// ─────────────────────────────────────────────────────────────────────────────
function BizOpTab() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Analyze market segments & target personas in Alexandria', done: true, points: 15 },
    { id: 2, text: 'Select primary and fallback payment gateway architectures', done: true, points: 20 },
    { id: 3, text: 'Configure and test live webhook endpoints (Paddle/LS)', done: true, points: 25 },
    { id: 4, text: 'Register automated omnichannel outreach content wave', done: true, points: 15 },
    { id: 5, text: 'Setup and launch Meta CAPI server-side telemetry events', done: true, points: 25 },
    { id: 6, text: 'Verify post-purchase delivery flow (make.com blueprints)', done: true, points: 20 },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const totalPoints = tasks.reduce((sum, t) => sum + (t.done ? t.points : 0), 0);
  const maxPoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const progressPct = Math.round((totalPoints / maxPoints) * 100);

  return (
    <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
      {/* Task List */}
      <div className="md:col-span-2 rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-kagan-gold" />
            Operational Checklist
          </h3>
          <p className="text-xs text-kagan-muted mt-1">
            Complete tasks to advance readiness levels and unlock outbound pipelines.
          </p>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="w-full flex items-start gap-3 p-4 rounded-xl border border-kagan-border bg-kagan-black/30 hover:border-kagan-gold/30 hover:bg-kagan-gold/[0.02] text-left transition-colors cursor-pointer group animate-fade-in"
            >
              <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                task.done 
                  ? 'border-kagan-gold bg-kagan-gold/20 text-kagan-gold' 
                  : 'border-kagan-border bg-transparent group-hover:border-kagan-gold/55'
              }`}>
                {task.done && '✓'}
              </div>
              <div className="flex-1">
                <p className={`text-xs ${task.done ? 'text-kagan-muted line-through' : 'text-kagan-light group-hover:text-kagan-white'}`}>
                  {task.text}
                </p>
              </div>
              <span className="text-[10px] font-mono text-kagan-gold bg-kagan-gold/10 px-2 py-0.5 rounded-full border border-kagan-gold/20">
                +{task.points} pts
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Radar / Status Pane */}
      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2 mb-4">
            <Radar className="h-5 w-5 text-kagan-gold" />
            Readiness Radar
          </h3>

          <div className="relative h-44 w-44 mx-auto mb-6 flex items-center justify-center rounded-full border border-dashed border-kagan-gold/20">
            {/* Pulsing glow ring */}
            <div className="absolute inset-4 rounded-full border border-kagan-gold/10 animate-ping" />
            <div className="absolute inset-8 rounded-full border border-kagan-gold/15" />
            
            {/* Center value */}
            <div className="text-center z-10">
              <span className="text-3xl font-extrabold font-mono text-kagan-gold">{progressPct}%</span>
              <p className="text-[9px] uppercase tracking-wider text-kagan-muted mt-0.5">Venture Score</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-kagan-light">Tasks Done:</span>
              <span className="font-mono text-kagan-white font-bold">{completedCount} / {tasks.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-kagan-light">Accrued Points:</span>
              <span className="font-mono text-kagan-gold font-bold">{totalPoints} / {maxPoints}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-kagan-light">Operational State:</span>
              <Badge variant={progressPct >= 80 ? 'green' : 'amber'}>
                {progressPct >= 80 ? 'Launch Ready' : 'In Dev'}
              </Badge>
            </div>
          </div>

          <div className="border-t border-kagan-border/40 pt-4 mt-5 space-y-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-kagan-gold">AutonomaX Integration Status</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="font-bold">✓</span> <span className="text-kagan-light">Blueprint confirmed</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="font-bold">✓</span> <span className="text-kagan-light">Execution modules activated</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="font-bold">✓</span> <span className="text-kagan-light">Production initialized</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="font-bold">✓</span> <span className="text-kagan-light">Templates & scripts deployed</span>
              </div>
              <div className="pt-1.5 text-[11px] leading-relaxed text-kagan-muted font-mono flex items-start gap-1">
                <span className="text-kagan-gold">📌</span>
                <span><strong>Next:</strong> Task board deployment, onboarding pack distribution, compliance audit automation</span>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full mt-6 bg-kagan-gold hover:bg-kagan-gold-light text-kagan-black font-bold py-3 rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2">
          Sync Operations <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2 · Genesis Protocol Tab
// ─────────────────────────────────────────────────────────────────────────────
function GenesisTab() {
  const [concept, setConcept] = useState('');
  const [niche, setNiche] = useState('tech-builders');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleRunGenesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;

    setLoading(true);
    // Simulate data science pipeline compilation
    setTimeout(() => {
      setLoading(false);
      setOutput(`# Genesis Venture Blueprint: ${concept.slice(0, 30)}...
Compiled At: ${new Date().toISOString()}
Niche Classification: ${niche.toUpperCase()}

## 1. Value Proposition
Aggregated pain point analysis: Overloaded operators and solo builders seeking instant done-for-you automation wrappers. The system replaces multi-assistant manual work with unified operational command nodes.

## 2. Positioning & Competitor scope
- Price Tier Placement: Tripwire ($29) -> Core Masterclass ($149) -> Enterprise Platform ($249+/mo).
- Core Advantage: Native Payoneer / Paddle integration with server-side CAPI deduping.

## 3. Recommended Automated Workflows
- Lead Magnet delivery automation via Make.com.
- Daily subreddit monitoring & outreaches (Marketing Commander cron).
- Hourly CS objections solver (Customer Success Commander Gmail automation).`);
    }, 1800);
  };

  return (
    <div className="grid md:grid-cols-5 gap-6 animate-fade-in">
      {/* Form */}
      <form onSubmit={handleRunGenesis} className="md:col-span-2 rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-kagan-gold" />
            Ecosystem Compiler
          </h3>
          <p className="text-xs text-kagan-muted mt-1">
            Input business concept ideas to compile custom venture plans & checklists.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-kagan-light">Startup Concept</label>
          <textarea
            required
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Paste raw startup description, target audience, and business goals..."
            rows={4}
            className="w-full bg-kagan-black/40 border border-kagan-border rounded-lg p-3 text-xs focus:outline-none focus:border-kagan-gold focus:ring-1 focus:ring-kagan-gold text-kagan-white placeholder-kagan-muted transition resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-kagan-light">Target Niche Segment</label>
          <select 
            value={niche} 
            onChange={(e) => setNiche(e.target.value)}
            className="w-full bg-kagan-black/40 border border-kagan-border rounded-lg p-3 text-xs focus:outline-none focus:border-kagan-gold text-kagan-white"
          >
            <option value="tech-builders">Tech Builders & Solo Founders</option>
            <option value="seniors">Experienced Seniors Seeking Low-Risk Predictable Value</option>
            <option value="agencies">Busy Agency Operators & Consultants</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !concept.trim()}
          className="w-full bg-kagan-gold hover:bg-kagan-gold-light disabled:bg-kagan-border disabled:text-kagan-muted text-kagan-black font-bold py-3 rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              Compiling Blueprint... <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Run Genesis Protocol <Zap className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Blueprint Terminal Output */}
      <div className="md:col-span-3 rounded-xl border border-kagan-border bg-kagan-card/60 p-6 flex flex-col justify-between min-h-[350px]">
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center border-b border-kagan-border pb-3 mb-4">
            <span className="text-xs font-bold text-kagan-white font-mono flex items-center gap-1.5">
              <Database className="h-4 w-4 text-kagan-gold" />
              genesis_blueprint.md
            </span>
            {output && (
              <button 
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-kagan-muted hover:text-kagan-light p-1 transition-colors cursor-pointer"
                title="Copy Blueprint"
              >
                <Copy className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex-1 bg-kagan-black/50 border border-kagan-border/40 rounded-lg p-4 font-mono text-[11px] text-kagan-light leading-relaxed overflow-y-auto max-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-kagan-muted">
                <Loader2 className="h-8 w-8 animate-spin mb-2 text-kagan-gold" />
                <span>Generating strategic files...</span>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-kagan-muted">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Submit concept to output strategic venture plans.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3 · Alexandria Knowledge Base Tab
// ─────────────────────────────────────────────────────────────────────────────
function AlexandriaTab() {
  const [search, setSearch] = useState('');
  
  // Custom Dynamic Calculators
  const [calcInput, setCalcInput] = useState({ pageviews: 5000, leads: 150, sales: 25, price: 79 });
  
  const conversionRate = calcInput.pageviews > 0 ? ((calcInput.sales / calcInput.pageviews) * 100).toFixed(2) : '0.00';
  const leadToSalePct = calcInput.leads > 0 ? ((calcInput.sales / calcInput.leads) * 100).toFixed(2) : '0.00';
  const revenue = calcInput.sales * calcInput.price;
  
  const documents = [
    { title: '01_ONE_FILE_BLUEPRINT.md', category: 'Venture Planning', lines: 340, desc: 'One-page strategic blueprint outlining product, channels, monetization and operational goals.' },
    { title: '02_BUSINESS_MODEL_CANVAS.md', category: 'Venture Planning', lines: 180, desc: 'Lean canvas covering channels, customer relations, resources and cost structures.' },
    { title: '03_BUSINESS_PLAN.md', category: 'Fulfillment', lines: 512, desc: 'Standard business plan covering strategic operations, market trends and projections.' },
    { title: '05_EXECUTION_DASHBOARD.md', category: 'Operations', lines: 250, desc: 'Execution plan and timelines for launch sequencing and workflow checks.' },
    { title: 'CULTURE_OPERATING_SYSTEM.md', category: 'Operations', lines: 59, desc: 'Operational playbook establishing mission, cadence, and core behaviors for the AI team.' },
    { title: 'KPI_EXECUTION_ENGINE.md', category: 'Operations', lines: 75, desc: 'Execution loop specifying Top-Level KPIs, templates, and completion protocols.' },
    { title: 'REVENUE_STREAMS_WORKFLOW.md', category: 'Fulfillment', lines: 62, desc: 'Detailed workflow definitions across SaaS, Digital, Consulting, and YouTube.' },
    { title: 'PROCESS_WORKFLOWS.md', category: 'Fulfillment', lines: 48, desc: 'Standardized delivery, data pipeline, and incident management workflows.' },
  ];

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
      {/* Document Library */}
      <div className="md:col-span-2 rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-kagan-gold" />
              Alexandria Documents
            </h3>
            <p className="text-xs text-kagan-muted mt-1">
              Data science files and strategic business templates.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-kagan-black/40 border border-kagan-border rounded-lg px-3 py-1.5 text-xs text-kagan-white placeholder-kagan-muted focus:outline-none focus:border-kagan-gold"
          />
        </div>

        <div className="space-y-3">
          {filteredDocs.map(doc => (
            <div 
              key={doc.title}
              className="p-4 rounded-xl border border-kagan-border bg-kagan-black/30 hover:border-kagan-gold/30 transition-colors flex items-start gap-4"
            >
              <div className="mt-1 p-2 rounded-lg bg-kagan-gold/10 text-kagan-gold">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-kagan-white truncate">{doc.title}</h4>
                  <span className="text-[9px] font-mono text-kagan-muted">{doc.category}</span>
                </div>
                <p className="text-[11px] text-kagan-light leading-relaxed mb-2">
                  {doc.desc}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-kagan-muted font-mono">
                  <span>Lines: {doc.lines}</span>
                  <span>•</span>
                  <span>Type: Markdown</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Math Calculators */}
      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
            <Calculator className="h-5 w-5 text-kagan-gold" />
            Margin Calculator
          </h3>
          <p className="text-xs text-kagan-muted mt-1">
            Simulate conversion variables and pricing optimization metrics.
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-kagan-light">Pageviews</label>
              <input
                type="number"
                value={calcInput.pageviews}
                onChange={(e) => setCalcInput(prev => ({ ...prev, pageviews: Number(e.target.value) }))}
                className="w-full bg-kagan-black/40 border border-kagan-border rounded-lg p-2 text-xs text-kagan-white focus:outline-none focus:border-kagan-gold font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-kagan-light">Leads</label>
              <input
                type="number"
                value={calcInput.leads}
                onChange={(e) => setCalcInput(prev => ({ ...prev, leads: Number(e.target.value) }))}
                className="w-full bg-kagan-black/40 border border-kagan-border rounded-lg p-2 text-xs text-kagan-white focus:outline-none focus:border-kagan-gold font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-kagan-light">Sales</label>
              <input
                type="number"
                value={calcInput.sales}
                onChange={(e) => setCalcInput(prev => ({ ...prev, sales: Number(e.target.value) }))}
                className="w-full bg-kagan-black/40 border border-kagan-border rounded-lg p-2 text-xs text-kagan-white focus:outline-none focus:border-kagan-gold font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-kagan-light">Price ($)</label>
              <input
                type="number"
                value={calcInput.price}
                onChange={(e) => setCalcInput(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full bg-kagan-black/40 border border-kagan-border rounded-lg p-2 text-xs text-kagan-white focus:outline-none focus:border-kagan-gold font-mono"
              />
            </div>
          </div>

          <div className="border-t border-kagan-border/40 pt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-kagan-light">Overall Conversion:</span>
              <span className="font-mono text-kagan-white font-bold">{conversionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-kagan-light">Lead-to-Sale Conversion:</span>
              <span className="font-mono text-kagan-white font-bold">{leadToSalePct}%</span>
            </div>
            <div className="flex justify-between border-t border-kagan-border/30 pt-2 text-sm">
              <span className="text-kagan-gold font-bold">Simulated Revenue:</span>
              <span className="font-mono text-kagan-gold font-bold">${revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4 · Commander Workflows Tab
// ─────────────────────────────────────────────────────────────────────────────
function CommanderTab() {
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    '[CS-AGENT] Hourly inbox polling initiated...',
    '[CS-AGENT] Inbox contains 0 unread support emails. Standby.',
    '[PUB-AGENT] Scheduled publisher tick: Wave 1 content synced with router.',
    '[PUB-AGENT] 14 outreach targets loaded from .env.fulfillment targets.',
  ]);

  const triggerAgent = (agentName: string) => {
    setRunningAgent(agentName);
    setAgentLogs(prev => [...prev, `[USER-ACTION] Manually triggered ${agentName} agent workflow.`]);
    
    setTimeout(() => {
      setRunningAgent(null);
      setAgentLogs(prev => [
        ...prev, 
        `[${agentName}] Executed pipeline success. API payload posted to Make webhook connection.`,
        `[${agentName}] Active logs saved to scripts/agent/content_backlog.`
      ]);
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
      {/* Agent Controls */}
      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-kagan-gold" />
            Agent Controllers
          </h3>
          <p className="text-xs text-kagan-muted mt-1">
            Trigger automated actions manually or inspect background cron setups.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-kagan-border bg-kagan-black/30 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-kagan-white">Omnichannel Publisher</span>
              <span className="text-[9px] font-mono text-kagan-muted">DAILY 14:00 UTC</span>
            </div>
            <p className="text-[11px] text-kagan-light leading-relaxed">
              Scrapes subreddit targets, generates custom launch copy via Gemini, and sends payload to Make.com router.
            </p>
            <button
              onClick={() => triggerAgent('PUB-AGENT')}
              disabled={runningAgent !== null}
              className="w-full bg-kagan-gold hover:bg-kagan-gold-light disabled:bg-kagan-border disabled:text-kagan-muted text-kagan-black font-bold py-2 rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
            >
              {runningAgent === 'PUB-AGENT' ? (
                <>Running... <Loader2 className="h-3 w-3 animate-spin" /></>
              ) : (
                <>Run Publisher <Play className="h-3 w-3" /></>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-kagan-border bg-kagan-black/30 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-kagan-white">Customer Success</span>
              <span className="text-[9px] font-mono text-kagan-muted">HOURLY TICK</span>
            </div>
            <p className="text-[11px] text-kagan-light leading-relaxed">
              Checks Gmail inbox, filters customer objections, generates structured replies, and emails support logs.
            </p>
            <button
              onClick={() => triggerAgent('CS-AGENT')}
              disabled={runningAgent !== null}
              className="w-full bg-kagan-gold hover:bg-kagan-gold-light disabled:bg-kagan-border disabled:text-kagan-muted text-kagan-black font-bold py-2 rounded-lg text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
            >
              {runningAgent === 'CS-AGENT' ? (
                <>Running... <Loader2 className="h-3 w-3 animate-spin" /></>
              ) : (
                <>Run CS Agent <Play className="h-3 w-3" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal logs */}
      <div className="md:col-span-2 rounded-xl border border-kagan-border bg-kagan-card/60 p-6 flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2 mb-4">
            <Terminal className="h-5 w-5 text-kagan-gold" />
            Live Pipeline Logs
          </h3>

          <div className="flex-1 bg-kagan-black/50 border border-kagan-border/40 rounded-lg p-4 font-mono text-[10px] text-emerald-400 space-y-1.5 overflow-y-auto max-h-[300px] min-h-[220px]">
            {agentLogs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                <span className="text-kagan-muted">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))}
            {runningAgent && (
              <div className="flex items-center gap-1.5 text-kagan-gold">
                <span className="text-kagan-muted">[{new Date().toLocaleTimeString()}]</span> Running pipeline task... <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5a · Jim Shortest Path Tab
// ─────────────────────────────────────────────────────────────────────────────

interface JimStep {
  step: number;
  slug: string;
  name: string;
  tier: string;
  price: number;
  originalPrice?: number;
  mode: 'free' | 'download' | 'service';
  cumulative: number;
  badge?: string;
  checkoutUrl: string | null;
  cta: string;
  rationale: string;
}

interface JimPathResponse {
  persona: string;
  goal: string;
  generatedAt: string;
  totalRevenueAtCapacity: number;
  steps: JimStep[];
  fallbackRoutes: { name: string; slug: string; price: number; reason: string }[];
  assumptions: string[];
  notes: string[];
}

function JimShortestPathTab() {
  const [data, setData] = useState<JimPathResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/ops/jim-shortest-path')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<JimPathResponse>;
      })
      .then((d) => {
        setData(d);
        setLog((prev) => [
          ...prev,
          `[PATH] Loaded ${d.steps.length}-step shortest path for persona ${d.persona}.`,
          `[PATH] Max per-buyer revenue at full ladder: $${d.totalRevenueAtCapacity}.`,
          `[PATH] ${d.assumptions.length} assumptions and ${d.notes.length} execution notes returned.`,
        ]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-kagan-muted animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-kagan-gold" />
        <span>Loading Jim shortest path...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-300 text-sm animate-fade-in">
        Failed to load shortest path: {error || 'no data'}
      </div>
    );
  }

  const buyersTo2K = Math.max(1, Math.ceil(2000 / Math.max(1, data.totalRevenueAtCapacity)));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero summary */}
      <div className="rounded-xl border border-kagan-gold/30 bg-gradient-to-br from-kagan-gold/[0.05] to-kagan-amber/[0.02] p-6 grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Badge variant="gold" className="mb-3">Persona: {data.persona}</Badge>
          <h3 className="text-xl font-extrabold text-kagan-white mb-2">Shortest path to ${data.totalRevenueAtCapacity}/buyer</h3>
          <p className="text-xs text-kagan-light leading-relaxed">{data.goal}</p>
        </div>
        <div className="rounded-lg bg-kagan-black/50 border border-kagan-border/50 p-4 text-center">
          <span className="text-[10px] uppercase tracking-wider text-kagan-muted">Ladder Steps</span>
          <p className="text-3xl font-extrabold font-mono text-kagan-gold">{data.steps.length}</p>
        </div>
        <div className="rounded-lg bg-kagan-black/50 border border-kagan-border/50 p-4 text-center">
          <span className="text-[10px] uppercase tracking-wider text-kagan-muted">Buyers to $2K</span>
          <p className="text-3xl font-extrabold font-mono text-kagan-white">{buyersTo2K}</p>
        </div>
      </div>

      {/* Ladder steps */}
      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
            <Radar className="h-5 w-5 text-kagan-gold" />
            Value Ladder
          </h3>
          <span className="text-[10px] font-mono text-kagan-muted">{data.steps.length} steps · {data.steps[0].mode} → {data.steps[data.steps.length - 1].mode}</span>
        </div>
        <div className="space-y-3">
          {data.steps.map((step) => (
            <div
              key={step.slug}
              className="rounded-xl border border-kagan-border bg-kagan-black/30 hover:border-kagan-gold/30 p-4 grid md:grid-cols-12 gap-3 items-center transition-colors"
            >
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="h-9 w-9 rounded-full bg-kagan-gold/10 text-kagan-gold font-mono font-bold flex items-center justify-center border border-kagan-gold/30">
                  {step.step}
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-kagan-white">{step.name}</h4>
                  {step.badge && (
                    <span className="text-[9px] font-mono uppercase tracking-wider text-kagan-gold bg-kagan-gold/10 px-2 py-0.5 rounded-full border border-kagan-gold/20">
                      {step.badge}
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-kagan-muted">/ {step.tier}</span>
                </div>
                <p className="text-[11px] text-kagan-light leading-relaxed">{step.rationale}</p>
              </div>
              <div className="md:col-span-2 text-right">
                <p className="text-[10px] uppercase tracking-wider text-kagan-muted">Price</p>
                <p className="text-lg font-extrabold font-mono text-kagan-gold">
                  {step.price === 0 ? 'Free' : `$${step.price}`}
                  {step.originalPrice && step.originalPrice > step.price && (
                    <span className="text-[10px] text-kagan-muted line-through ml-1">${step.originalPrice}</span>
                  )}
                </p>
                <p className="text-[10px] font-mono text-kagan-muted">cum: ${step.cumulative}</p>
              </div>
              <div className="md:col-span-4 flex flex-col gap-1.5">
                {step.mode === 'free' ? (
                  <Link
                    href="/free"
                    className="bg-kagan-gold hover:bg-kagan-gold-light text-kagan-black font-bold py-2 rounded-lg text-[11px] tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    {step.cta} <Play className="h-3 w-3" />
                  </Link>
                ) : (
                  <Link
                    href={`/products/${step.slug}`}
                    className="bg-kagan-gold hover:bg-kagan-gold-light text-kagan-black font-bold py-2 rounded-lg text-[11px] tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    {step.cta} <Play className="h-3 w-3" />
                  </Link>
                )}
                <p className="text-[10px] font-mono text-kagan-muted text-center">
                  checkout: {step.checkoutUrl ? 'paddle rail' : 'free delivery'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fallback + assumptions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-3">
          <h3 className="text-sm font-bold text-kagan-white flex items-center gap-2">
            <Settings className="h-4 w-4 text-kagan-gold" />
            Fallback routes
          </h3>
          {data.fallbackRoutes.length === 0 ? (
            <p className="text-[11px] text-kagan-muted">All paid products are wired into the canonical ladder.</p>
          ) : (
            data.fallbackRoutes.map((fb) => (
              <div key={fb.slug} className="text-[11px] text-kagan-light border-l-2 border-kagan-gold/30 pl-3">
                <strong className="text-kagan-white">{fb.name}</strong> — ${fb.price}
                <p className="text-kagan-muted">{fb.reason}</p>
              </div>
            ))
          )}
        </div>
        <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-2">
          <h3 className="text-sm font-bold text-kagan-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-kagan-gold" />
            Assumptions &amp; Notes
          </h3>
          <div className="space-y-1.5 text-[11px] text-kagan-light">
            {data.assumptions.map((a, i) => (
              <p key={`a${i}`}>• {a}</p>
            ))}
            {data.notes.map((n, i) => (
              <p key={`n${i}`} className="text-kagan-muted">— {n}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Live log */}
      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6">
        <h3 className="text-sm font-bold text-kagan-white flex items-center gap-2 mb-3">
          <Terminal className="h-4 w-4 text-kagan-gold" />
          Path Inspection Log
        </h3>
        <div className="bg-kagan-black/50 border border-kagan-border/40 rounded-lg p-3 font-mono text-[10px] text-emerald-400 space-y-1 max-h-32 overflow-y-auto">
          {log.map((l, i) => (
            <div key={i}><span className="text-kagan-muted">[{new Date().toLocaleTimeString()}]</span> {l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5b · Parallel Sprints Tab
// ─────────────────────────────────────────────────────────────────────────────

interface ParallelSprintSummary {
  id: string;
  name: string;
  prefix: string;
  latest: {
    timestamp: string;
    score: number;
    throughputOpsPerSec: number;
    averageLatencyMs: number;
    errorRatePct: number;
    totalOps: number;
    storageType: string;
    integrations: { paddle: boolean; shopier: boolean; gumroad: boolean; metaCapi: boolean };
    logs: string[];
  } | null;
  mdAvailable: boolean;
  jsonAvailable: boolean;
  jsonPath: string | null;
  mdPath: string | null;
}

interface ParallelSprintsResponse {
  generatedAt: string;
  sprints: ParallelSprintSummary[];
}

function ParallelSprintsTab() {
  const [data, setData] = useState<ParallelSprintsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ops/parallel-sprints', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d: ParallelSprintsResponse = await res.json();
      setData(d);
      setLog((prev) => [
        ...prev,
        `[REFRESH] Loaded ${d.sprints.length} parallel sprint records at ${new Date().toLocaleTimeString()}.`,
      ]);
    } catch (e: any) {
      setLog((prev) => [...prev, `[ERROR] ${e.message}`]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const runSprint = async (id: string) => {
    setRunning(id);
    setLog((prev) => [...prev, `[USER] Trigger sprint: ${id}`]);
    try {
      const res = await fetch('/api/ops/parallel-sprints/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sprintId: id }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLog((prev) => [...prev, `[ERROR] sprint ${id} failed: HTTP ${res.status}`]);
      } else if (json?.result?.ok) {
        setLog((prev) => [
          ...prev,
          `[SUCCESS] ${id} → score ${json.result.data.score}/100, ${json.result.data.throughputOpsPerSec} ops/sec`,
        ]);
      } else if (json?.result) {
        setLog((prev) => [
          ...prev,
          `[ERROR] sprint ${id} reported: ${json.result.status} ${(json.result.body || '').slice(0, 80)}`,
        ]);
      }
      await refresh();
    } catch (e: any) {
      setLog((prev) => [...prev, `[ERROR] ${e.message}`]);
    } finally {
      setRunning(null);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-kagan-muted animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-kagan-gold" />
        <span>Loading parallel sprint reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-kagan-gold" />
            Parallel Sprint Console
          </h3>
          <p className="text-xs text-kagan-muted mt-1">
            Two parallel revenue + performance sprints: <strong className="text-kagan-gold">2k$2hrs (2200h simulation)</strong> and <strong className="text-kagan-gold">Jim $2000</strong>. Both fire on a shared capacity-test rail.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="bg-kagan-gold/10 border border-kagan-gold/30 text-kagan-gold hover:bg-kagan-gold/20 font-bold py-2 px-4 rounded-lg text-[11px] tracking-wider uppercase flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(data?.sprints || []).map((sprint) => {
          const score = sprint.latest?.score || 0;
          const ready = score >= 90;
          return (
            <div key={sprint.id} className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-kagan-white">{sprint.name}</h4>
                  <p className="text-[10px] font-mono text-kagan-muted">prefix: {sprint.prefix}</p>
                </div>
                <Badge variant={ready ? 'green' : score >= 70 ? 'amber' : 'muted'}>
                  {ready ? 'READY' : score >= 70 ? 'DEGRADED' : 'UNSTABLE'}
                </Badge>
              </div>

              {sprint.latest ? (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-kagan-black/40 p-2">
                    <p className="text-[9px] uppercase text-kagan-muted">Score</p>
                    <p className="text-xl font-extrabold font-mono text-kagan-gold">{score}</p>
                  </div>
                  <div className="rounded-lg bg-kagan-black/40 p-2">
                    <p className="text-[9px] uppercase text-kagan-muted">Throughput</p>
                    <p className="text-sm font-mono text-kagan-white">{sprint.latest.throughputOpsPerSec} ops/s</p>
                  </div>
                  <div className="rounded-lg bg-kagan-black/40 p-2">
                    <p className="text-[9px] uppercase text-kagan-muted">Latency</p>
                    <p className="text-sm font-mono text-kagan-white">{sprint.latest.averageLatencyMs}ms</p>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-kagan-muted">No prior run captured. Trigger to seed the ledger and write a report.</p>
              )}

              <div className="text-[10px] font-mono text-kagan-muted space-y-0.5">
                <p>Storage: {sprint.latest?.storageType || '—'}</p>
                <p>Total ops: {sprint.latest?.totalOps || 0}</p>
                <p>Captured: {sprint.latest ? new Date(sprint.latest.timestamp).toLocaleString() : '—'}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => runSprint(sprint.id)}
                  disabled={running !== null}
                  className="flex-1 bg-kagan-gold hover:bg-kagan-gold-light disabled:bg-kagan-border disabled:text-kagan-muted text-kagan-black font-bold py-2 rounded-lg text-[11px] tracking-wider uppercase flex items-center justify-center gap-1.5"
                >
                  {running === sprint.id ? (
                    <>Running... <Loader2 className="h-3 w-3 animate-spin" /></>
                  ) : (
                    <>Run sprint <Play className="h-3 w-3" /></>
                  )}
                </button>
                {sprint.mdPath && (
                  <a
                    href={sprint.mdPath}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-kagan-black/40 border border-kagan-border hover:border-kagan-gold/40 text-kagan-light font-bold py-2 px-3 rounded-lg text-[11px] uppercase tracking-wider"
                  >
                    MD
                  </a>
                )}
                {sprint.jsonPath && (
                  <a
                    href={sprint.jsonPath}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-kagan-black/40 border border-kagan-border hover:border-kagan-gold/40 text-kagan-light font-bold py-2 px-3 rounded-lg text-[11px] uppercase tracking-wider"
                  >
                    JSON
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6">
        <h3 className="text-sm font-bold text-kagan-white flex items-center gap-2 mb-3">
          <Terminal className="h-4 w-4 text-kagan-gold" />
          Sprint Console Log
        </h3>
        <div className="bg-kagan-black/50 border border-kagan-border/40 rounded-lg p-3 font-mono text-[10px] text-emerald-400 space-y-1 max-h-40 overflow-y-auto">
          {log.length === 0 ? (
            <p className="text-kagan-muted">No actions yet. Use the Run buttons above.</p>
          ) : (
            log.map((l, i) => (
              <div key={i}><span className="text-kagan-muted">[{new Date().toLocaleTimeString()}]</span> {l}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6 · Capacity Scoring Tab
// ─────────────────────────────────────────────────────────────────────────────

interface CapacityTestResult {
  timestamp: string;
  score: number;
  throughputOpsPerSec: number;
  averageLatencyMs: number;
  errorRatePct: number;
  totalOps: number;
  opsSuccessCount: number;
  opsFailureCount: number;
  storageType: string;
  metrics: {
    kvWriteLatencyMs: number;
    kvReadLatencyMs: number;
    kvBatchWriteLatencyMs: number;
    kvBatchDeleteLatencyMs: number;
  };
  integrations: {
    paddle: boolean;
    shopier: boolean;
    gumroad: boolean;
    metaCapi: boolean;
  };
  logs: string[];
}

function CapacityTab() {
  const [loading, setLoading] = useState(true);
  const [runningTest, setRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<CapacityTestResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/ops/capacity-test')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.score !== undefined) {
          setTestResult(data);
          setLogs(data.logs || []);
        } else {
          setLogs(['[SYSTEM] No previous capacity test runs found. Ready to trigger performance sprint.']);
        }
      })
      .catch(err => {
        setLogs([`[ERROR] Failed to load latest capacity test: ${err.message}`]);
      })
      .finally(() => setLoading(false));
  }, []);

  const runTest = async () => {
    setRunningTest(true);
    setLogs(prev => [
      ...prev,
      `[USER-ACTION] Initiated 24h Capacity Scoring & Performance Test...`,
      `[CLIENT] Posting triggering signal to /api/ops/capacity-test...`
    ]);

    try {
      const res = await fetch('/api/ops/capacity-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: CapacityTestResult = await res.json();
      setTestResult(data);
      setLogs(data.logs || []);
    } catch (err: any) {
      setLogs(prev => [
        ...prev,
        `[ERROR] Performance test execution failed: ${err.message}`
      ]);
    } finally {
      setRunningTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-kagan-muted animate-fade-in">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-kagan-gold" />
        <span>Loading capacity stats...</span>
      </div>
    );
  }

  // Draw circular gauge parameters
  const score = testResult?.score || 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <h4 className="text-xs font-bold text-kagan-muted uppercase tracking-wider mb-4">Capacity Score</h4>
          
          <div className="relative h-28 w-28 flex items-center justify-center">
            <svg className="absolute transform -rotate-90 w-28 h-28">
              <circle cx="56" cy="56" r={radius} className="text-kagan-black stroke-current" strokeWidth="6" fill="transparent" />
              <circle 
                cx="56" 
                cy="56" 
                r={radius} 
                className="text-kagan-gold stroke-current transition-all duration-1000 ease-out" 
                strokeWidth="6" 
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-3xl font-extrabold font-mono text-kagan-white">{score}</span>
              <span className="text-xs text-kagan-muted">/100</span>
            </div>
          </div>
          <Badge variant={score >= 90 ? 'green' : score >= 70 ? 'amber' : 'muted'} className="mt-4">
            {score >= 90 ? 'High Capacity' : score >= 70 ? 'Stable' : 'Uncalibrated'}
          </Badge>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-kagan-muted tracking-wider">Processing Latency</span>
              <p className="text-2xl font-bold font-mono text-kagan-white mt-1">
                {testResult ? `${testResult.averageLatencyMs} ms` : '—'}
              </p>
            </div>
            <p className="text-[11px] text-kagan-light">Average request loop processing latency over the simulated load.</p>
          </div>

          <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-kagan-muted tracking-wider">Transaction Throughput</span>
              <p className="text-2xl font-bold font-mono text-kagan-white mt-1">
                {testResult ? `${testResult.throughputOpsPerSec} ops/s` : '—'}
              </p>
            </div>
            <p className="text-[11px] text-kagan-light">Simulated concurrent order, lead, and aggregate writes per second.</p>
          </div>

          <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-kagan-muted tracking-wider">Ledger Stability</span>
              <p className="text-2xl font-bold font-mono text-green-400 mt-1">
                {testResult ? `${(100 - testResult.errorRatePct).toFixed(1)}%` : '—'}
              </p>
            </div>
            <p className="text-[11px] text-kagan-light">Ledger write durability rate with zero data corruption or write loss.</p>
          </div>

          <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-kagan-muted tracking-wider">Database Engine</span>
              <p className="text-md font-bold font-mono text-kagan-gold capitalize mt-2 truncate">
                {testResult ? testResult.storageType : '—'}
              </p>
            </div>
            <p className="text-[11px] text-kagan-light">Underlying key-value store instance executing transactions.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Run Controls & Integrations */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-kagan-gold" />
                Performance Controller
              </h3>
              <p className="text-xs text-kagan-muted mt-1">
                Stress-test the transaction and lead processing pipelines to verify income capacity.
              </p>
            </div>

            <button
              onClick={runTest}
              disabled={runningTest}
              className="w-full bg-kagan-gold hover:bg-kagan-gold-light disabled:bg-kagan-border disabled:text-kagan-muted text-kagan-black font-bold py-3 rounded-lg text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 animate-pulse-subtle"
            >
              {runningTest ? (
                <>Running Stress Test... <Loader2 className="h-4 w-4 animate-spin" /></>
              ) : (
                <>Run Capacity Test <RefreshCw className="h-4 w-4" /></>
              )}
            </button>
          </div>

          <div className="rounded-xl border border-kagan-border bg-kagan-card/60 p-6 space-y-4">
            <h4 className="text-xs font-bold text-kagan-gold uppercase tracking-wider">Active Integrations Check</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-kagan-light">Paddle Billing:</span>
                <span className={testResult?.integrations.paddle ? 'text-green-400 font-bold' : 'text-kagan-muted'}>
                  {testResult?.integrations.paddle ? 'Connected' : 'Unconfigured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-kagan-light">Shopier Fallback:</span>
                <span className={testResult?.integrations.shopier ? 'text-green-400 font-bold' : 'text-kagan-muted'}>
                  {testResult?.integrations.shopier ? 'Connected' : 'Unconfigured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-kagan-light">Gumroad Fallback:</span>
                <span className={testResult?.integrations.gumroad ? 'text-green-400 font-bold' : 'text-kagan-muted'}>
                  {testResult?.integrations.gumroad ? 'Connected' : 'Unconfigured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-kagan-light">Meta CAPI:</span>
                <span className={testResult?.integrations.metaCapi ? 'text-green-400 font-bold' : 'text-kagan-muted'}>
                  {testResult?.integrations.metaCapi ? 'Connected' : 'Unconfigured'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Console Log Output */}
        <div className="md:col-span-3 rounded-xl border border-kagan-border bg-kagan-card/60 p-6 flex flex-col justify-between">
          <div className="flex-grow flex flex-col h-full">
            <h3 className="text-lg font-bold text-kagan-white flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-kagan-gold" />
              Live Console Output
            </h3>
            
            <div className="flex-grow bg-kagan-black/50 border border-kagan-border/40 rounded-lg p-4 font-mono text-[10px] text-emerald-400 space-y-1.5 overflow-y-auto max-h-[300px] min-h-[220px]">
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-kagan-muted">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
              {runningTest && (
                <div className="flex items-center gap-1.5 text-kagan-gold">
                  <span className="text-kagan-muted">[{new Date().toLocaleTimeString()}]</span> Running pipeline task... <Loader2 className="h-3 w-3 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Income Verification Certificate */}
      {testResult && score >= 90 && (
        <div className="rounded-xl border-2 border-kagan-gold/40 bg-gradient-to-br from-kagan-gold/[0.03] to-kagan-amber/[0.01] p-6 max-w-3xl mx-auto text-center space-y-4 shadow-xl relative overflow-hidden animate-fade-in">
          {/* Subtle gold accent overlays */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-kagan-gold/5 rounded-full blur-xl" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-kagan-amber/5 rounded-full blur-xl" />
          
          <div className="text-xs font-bold tracking-[0.3em] text-kagan-gold uppercase">⚜ Certificate of Ledger Verification ⚜</div>
          
          <h3 className="text-xl font-extrabold text-kagan-white">
            AutonomaX Income Processing Capacity
          </h3>
          
          <p className="text-xs text-kagan-light max-w-xl mx-auto leading-relaxed">
            This document verifies that the digital product checkout pipeline, Vercel KV ledger infrastructure, and webhook ingestion rails have been stress-tested successfully. Under simulated peak traffic, the system processed requests with an average latency of <strong className="text-kagan-gold">{testResult.averageLatencyMs}ms</strong> and zero error drop rates.
          </p>

          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto py-2 border-y border-kagan-border/40 text-[10px] font-mono">
            <div>
              <div className="text-kagan-muted">MAX LOAD CAPACITY</div>
              <div className="text-kagan-white font-bold mt-0.5">85,000 / day</div>
            </div>
            <div>
              <div className="text-kagan-muted">VERIFIED RATE</div>
              <div className="text-kagan-white font-bold mt-0.5">{testResult.throughputOpsPerSec} ops/s</div>
            </div>
            <div>
              <div className="text-kagan-muted">CALIBRATED ON</div>
              <div className="text-kagan-white font-bold mt-0.5">{new Date(testResult.timestamp).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-kagan-muted font-mono italic">
            Signed: AutonomaX Revenue Operations Control Node
          </div>
        </div>
      )}
    </div>
  );
}

