/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Sparkles, 
  Send, 
  FileText, 
  TrendingUp, 
  Settings, 
  Download, 
  Copy, 
  Check, 
  AlertCircle,
  Clock,
  Briefcase,
  DollarSign,
  Rocket
} from "lucide-react";
import { BlueprintResponse } from "@/types/commander";
import { MICRO_SAAS_BLUEPRINTS } from "@/lib/commander-blueprints";

interface BlueprintGeneratorProps {
  onBlueprintGenerated: (data: BlueprintResponse) => void;
}

export const BlueprintGenerator: React.FC<BlueprintGeneratorProps> = ({ onBlueprintGenerated }) => {
  const [idea, setIdea] = useState<string>("");
  const [niche, setNiche] = useState<string>("");
  const [tier, setTier] = useState<'basic' | 'premium'>("premium");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>("");
  const [blueprint, setBlueprint] = useState<BlueprintResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'document' | 'monetization'>('document');
  const [deploying, setDeploying] = useState<boolean>(false);
  const [deployResult, setDeployResult] = useState<{url: string, id: string} | null>(null);

  const handleSelectPreset = (presetId: string) => {
    const found = MICRO_SAAS_BLUEPRINTS.find(b => b.id === presetId);
    if (found) {
      setIdea(found.description);
      setNiche(found.niche);
    }
  };

  const generateBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea || !niche) return;

    setLoading(true);
    setBlueprint(null);
    setDeployResult(null);
    
    const phases = [
      "BizOp Navigator deep-diving competitor landscapes...",
      "Growth Architect aligning tiered monetization matrices...",
      "Automation Lead drafting Make.com scenario routes...",
      "Copywriting Bot phrasing viral social syndication loops...",
      "Commander-1 executing SLA gatekeeping & finalizing blueprint report..."
    ];

    let phaseIndex = 0;
    setLoadingPhase(phases[0]);
    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      setLoadingPhase(phases[phaseIndex]);
    }, 2800);

    try {
      const res = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, niche, tier })
      });

      const data: BlueprintResponse = await res.json();
      clearInterval(interval);
      setBlueprint(data);
      onBlueprintGenerated(data);
    } catch (err) {
      console.error("Failed to generate blueprint:", err);
      clearInterval(interval);
    } finally {
      setLoading(false);
    }
  };

  const promoteToProduction = async () => {
    if (!blueprint) return;
    setDeploying(true);
    try {
      const res = await fetch("/api/promote-to-production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          blueprint, 
          tenantId: "tenant-autonomax-01",
          pricing: tier === 'premium' ? 299 : 49
        })
      });
      const data = await res.json();
      setDeployResult({ url: data.checkoutUrl, id: data.deploymentId });
    } catch (err) {
      console.error("Deployment failed:", err);
    } finally {
      setDeploying(false);
    }
  };

  const copyToClipboard = () => {
    if (!blueprint) return;
    navigator.clipboard.writeText(blueprint.rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!blueprint) return;
    const element = document.createElement("a");
    const file = new Blob([blueprint.rawMarkdown], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AIKAGAN_Blueprint_\${niche.replace(/\\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="generator-container">
      <div className="xl:col-span-4 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl h-fit" id="input-card">
        <h2 className="text-base font-light tracking-wide text-white uppercase flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
          <span className="w-1.5 h-1.5 bg-cyan-500"></span>
          Venture Launch Blueprint Engine
        </h2>
        <p className="text-xs text-white/40 mb-4 leading-relaxed">
          Submit your startup concept or choose from 5 pre-configured micro-SaaS blueprints:
        </p>

        <div className="mb-6 space-y-1.5">
          <span className="text-[9px] uppercase tracking-widest text-cyan-500/80 font-mono font-bold block">
            Pluggable Micro-SaaS Catalog:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MICRO_SAAS_BLUEPRINTS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectPreset(b.id)}
                className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-[10px] text-white/80 hover:text-cyan-400 rounded-sm font-mono transition-all cursor-pointer"
              >
                + {b.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={generateBlueprint} className="space-y-5">
          <div>
            <label className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">Startup Idea</label>
            <textarea
              required rows={4} value={idea} onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g., Automated client onboarding..."
              className="w-full bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 rounded-sm p-3 text-xs text-white/90 placeholder-white/20 transition-all outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1.5">Niche Industry</label>
            <input
              type="text" required value={niche} onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., Marketing Agencies"
              className="w-full bg-[#0A0A0C] border border-white/10 focus:border-cyan-500 rounded-sm p-3 text-xs text-white/90 placeholder-white/20 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">Blueprint Service Tier</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button" onClick={() => setTier("basic")}
                className={`p-3 rounded-sm border text-left transition-all cursor-pointer \${tier === "basic" ? "bg-white/[0.04] border-cyan-500" : "bg-transparent border-white/10 hover:border-white/20"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/95">Basic Plan</span>
                  <span className="text-[10px] font-mono text-cyan-500 font-bold">$49</span>
                </div>
                <p className="text-[10px] text-white/40 mt-1">14-day blueprint</p>
              </button>
              <button
                type="button" onClick={() => setTier("premium")}
                className={`p-3 rounded-sm border text-left transition-all cursor-pointer \${tier === "premium" ? "bg-white/[0.04] border-cyan-500" : "bg-transparent border-white/10 hover:border-white/20"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/95">Premium OS</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">$299</span>
                </div>
                <p className="text-[10px] text-white/40 mt-1">30-day operating system</p>
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-white/5 disabled:text-white/20 disabled:border-transparent text-black font-bold uppercase py-3 px-4 rounded-sm text-xs transition-all flex items-center justify-center gap-2 border border-cyan-400 mt-2 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            {loading ? "Generating Blueprint..." : "Deploy & Generate Blueprint"}
          </button>
        </form>
      </div>

      <div className="xl:col-span-8 bg-[#0F0F12] border border-white/10 rounded-sm p-6 shadow-2xl min-h-[480px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-0 rounded-full border border-t-cyan-500 border-r-transparent animate-spin" />
              <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
            </div>
            <h3 className="text-sm font-light uppercase tracking-widest text-white">AI Command Organization Operating</h3>
            <p className="text-[10px] text-cyan-500 font-mono mt-2 animate-pulse">{loadingPhase}</p>
          </div>
        ) : blueprint ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('document')}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer \${activeTab === 'document' ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/30' : 'text-white/40 border-transparent hover:text-white'}`}
                >
                  Blueprint Document
                </button>
                <button
                  onClick={() => setActiveTab('monetization')}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all cursor-pointer \${activeTab === 'monetization' ? 'bg-white/[0.04] text-cyan-400 border-cyan-500/30' : 'text-white/40 border-transparent hover:text-white'}`}
                >
                  Revenue Impact Model
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={promoteToProduction}
                  disabled={deploying || !!deployResult}
                  className="px-3 py-1.5 bg-green-500 hover:bg-green-400 disabled:bg-white/5 disabled:text-white/20 text-black font-bold text-xs rounded-sm border border-green-400 transition-all cursor-pointer flex items-center gap-1.5"
                  id="btn-promote-prod"
                >
                  <Rocket className="h-3.5 w-3.5" />
                  {deploying ? "Promoting..." : deployResult ? "Promoted ✓" : "Promote to Live"}
                </button>
                <button onClick={copyToClipboard} className="p-2 bg-transparent border border-white/10 hover:bg-white/5 text-white/60 rounded-sm transition-all cursor-pointer">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button onClick={downloadText} className="p-2 bg-transparent border border-white/10 hover:bg-white/5 text-white/60 rounded-sm transition-all cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {activeTab === 'document' && (
              <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin">
                <div className="prose prose-invert prose-sm max-w-none text-white/70 space-y-4">
                  <ReactMarkdown>{blueprint.rawMarkdown}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'monetization' && (
              <div className="flex-1 space-y-8 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-[10px] uppercase text-white/30 tracking-widest font-bold">Month 1 Target</span>
                    <div className="text-2xl font-mono mt-1 text-white/90">${blueprint.estimatedRevenues.month1.toLocaleString()}</div>
                  </div>
                  <div className="border-t border-cyan-500/50 pt-4">
                    <span className="text-[10px] uppercase text-cyan-500 tracking-widest font-bold">Month 2 Target</span>
                    <div className="text-2xl font-mono mt-1 text-cyan-400 font-bold">${blueprint.estimatedRevenues.month2.toLocaleString()}</div>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-[10px] uppercase text-white/30 tracking-widest font-bold">Month 3 Target</span>
                    <div className="text-2xl font-mono mt-1 text-green-400">${blueprint.estimatedRevenues.month3.toLocaleString()}</div>
                  </div>
                </div>
                {deployResult && (
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-xs text-green-400 flex items-center justify-between">
                    <div>
                      <p className="font-bold uppercase tracking-wider">Deployment Active</p>
                      <p className="text-white/60">ID: {deployResult.id} · Status: Live Production Stream</p>
                    </div>
                    <a href={deployResult.url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-green-500 text-black font-bold rounded-sm hover:bg-green-400 transition-all">
                      View Checkout →
                    </a>
                  </div>
                )}
                <div className="bg-[#0A0A0C] border border-white/10 p-5 rounded-sm space-y-4">
                  <h4 className="text-xs font-light uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    Target Conversion Dynamics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/50">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Target Conversion Rate:</span>
                        <span className="font-mono text-cyan-400 font-semibold">{blueprint.estimatedRevenues.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Customer Acquisition Cost (CAC):</span>
                        <span className="font-mono text-white/80">$35.00</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Core Offer Model:</span>
                        <span className="font-mono text-white/80">E-Commerce OS Downloads</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Estimated LTV:</span>
                        <span className="font-mono text-green-400 font-semibold">${tier === 'premium' ? '540.00' : '150.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center text-white/20">
            <Briefcase className="h-10 w-10 text-white/10 mb-4" />
            <h3 className="text-sm font-light uppercase tracking-wider text-white/40">Launch Blueprint Pending</h3>
            <p className="text-xs text-white/30 mt-1 max-w-xs leading-relaxed">
              Fill in your startup concept in the left panel to execute strategic planning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
