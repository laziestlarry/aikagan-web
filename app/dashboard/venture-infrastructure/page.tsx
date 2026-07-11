'use client';

import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import Section from '@/components/ui/Section';
import Badge from '@/components/ui/Badge';

// ── TABS ──
type TabID = 'bizop' | 'genesis' | 'alexandria' | 'commander';

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
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'bizop' && <BizOpTab />}
          {activeTab === 'genesis' && <GenesisTab />}
          {activeTab === 'alexandria' && <AlexandriaTab />}
          {activeTab === 'commander' && <CommanderTab />}
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
    { id: 4, text: 'Register automated omnichannel outreach content wave', done: false, points: 15 },
    { id: 5, text: 'Setup and launch Meta CAPI server-side telemetry events', done: true, points: 25 },
    { id: 6, text: 'Verify post-purchase delivery flow (make.com blueprints)', done: false, points: 20 },
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
