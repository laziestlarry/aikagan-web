'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Send, CheckCircle, Clock, Sparkles, Layers } from 'lucide-react';

interface CampaignItem {
  id: string;
  wave: number;
  platform: string;
  copy: string;
  ctaUrl: string;
  status: 'draft' | 'approved' | 'scheduled' | 'published';
}

export default function CreatorHubDashboard() {
  const [items, setItems] = useState<CampaignItem[]>([]);
  const [activeWave, setActiveWave] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchWave() {
      setLoading(true);
      try {
        const res = await fetch(`/api/creator-hub/campaigns?wave=${activeWave}`);
        const data = await res.json();
        if (data.ok) setItems(data.items);
      } catch (err) {
        console.error('Failed to load wave', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWave();
  }, [activeWave]);

  const updateStatus = async (id: string, status: CampaignItem['status']) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    await fetch('/api/creator-hub/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, wave: activeWave, status })
    });
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-white p-6 sm:p-10">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" /> Creator Hub • AlexandriaBoard Engine
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1">Autonomous Campaign Command</h1>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(w => (
            <button
              key={w}
              onClick={() => setActiveWave(w)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeWave === w ? 'bg-amber-300 text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
            >
              Wave {w}
            </button>
          ))}
        </div>
      </header>

      <section className="max-w-7xl mx-auto mt-8">
        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading campaign wave queue...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <div key={item.id} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {item.platform}
                    </span>
                    <span className={`text-xs font-semibold ${item.status === 'approved' ? 'text-emerald-400' : 'text-neutral-400'}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-200 mb-4">{item.copy}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => updateStatus(item.id, 'approved')}
                    className="flex-1 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 flex justify-center items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'scheduled')}
                    className="flex-1 py-2 rounded-lg bg-white/5 text-neutral-300 border border-white/10 text-xs font-bold hover:bg-white/10 flex justify-center items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" /> Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}