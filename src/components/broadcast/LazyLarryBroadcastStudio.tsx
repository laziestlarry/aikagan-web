'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  CircleStop,
  Download,
  Mic2,
  Play,
  Radio,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  DEFAULT_LAZY_LARRY_SCRIPT,
  EMPTY_BROADCAST_METRICS,
  INTELLIGENCE_LAYERS,
  LAZY_LARRY_SCENES,
} from '@/lib/broadcast/lazyLarry';

type RenderJob = {
  id: string;
  createdAt: string;
  status: string;
  script: string;
};

const accentMap = {
  gold: 'from-amber-300/35 via-amber-300/10 to-transparent border-amber-300/35 text-amber-200',
  emerald: 'from-emerald-300/30 via-emerald-300/10 to-transparent border-emerald-300/30 text-emerald-200',
  cyan: 'from-cyan-300/30 via-cyan-300/10 to-transparent border-cyan-300/30 text-cyan-200',
  violet: 'from-violet-300/30 via-violet-300/10 to-transparent border-violet-300/30 text-violet-200',
};

export default function LazyLarryBroadcastStudio() {
  const [script, setScript] = useState(DEFAULT_LAZY_LARRY_SCRIPT);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState('');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playerMode, setPlayerMode] = useState(false);
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scene = LAZY_LARRY_SCENES[sceneIndex];
  const words = useMemo(() => script.trim().split(/\s+/).filter(Boolean).length, [script]);
  const estimatedSeconds = useMemo(() => Math.max(7, Math.round(words / 3.0)), [words]);

  useEffect(() => {
    setPlayerMode(new URLSearchParams(window.location.search).get('mode') === 'player');
    try {
      const stored = localStorage.getItem('aikagan-lazy-larry-render-jobs');
      if (stored) setJobs(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const next = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
      setVoices(next);
      if (!voiceName && next.length) {
        const preferred = next.find((v) => /male|daniel|alex|fred|guy|david|mark/i.test(v.name)) ?? next[0];
        setVoiceName(preferred.name);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceName]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSceneIndex(0);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = useCallback(() => {
    stop();
    if (!script.trim() || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(script.trim());
    utterance.rate = 1.12;
    utterance.pitch = 0.92;
    const selected = voices.find((v) => v.name === voiceName);
    if (selected) utterance.voice = selected;
    utterance.onend = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setSceneIndex(LAZY_LARRY_SCENES.length - 1);
      setIsSpeaking(false);
    };
    utterance.onerror = () => setIsSpeaking(false);

    setSceneIndex(0);
    setIsSpeaking(true);
    const perScene = Math.max(900, (estimatedSeconds * 1000) / LAZY_LARRY_SCENES.length);
    timerRef.current = setInterval(() => {
      setSceneIndex((current) => Math.min(current + 1, LAZY_LARRY_SCENES.length - 1));
    }, perScene);
    window.speechSynthesis.speak(utterance);
  }, [estimatedSeconds, script, stop, voiceName, voices]);

  const persistJobs = (next: RenderJob[]) => {
    setJobs(next);
    try {
      localStorage.setItem('aikagan-lazy-larry-render-jobs', JSON.stringify(next));
    } catch {}
  };

  const createManifest = async () => {
    const response = await fetch('/api/broadcast/manifest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character: 'lazy-larry',
        format: '2d',
        aspectRatio: '16:9',
        script,
        voice: voiceName || 'browser-default',
        scenes: LAZY_LARRY_SCENES.map(({ id, title }) => ({ id, title })),
      }),
    });
    const payload = await response.json();
    const nextJob: RenderJob = {
      id: payload.jobId,
      createdAt: payload.createdAt,
      status: payload.status,
      script,
    };
    persistJobs([nextJob, ...jobs].slice(0, 8));
  };

  const downloadManifest = () => {
    const manifest = {
      version: 1,
      brand: 'AIKAGAN',
      character: 'Lazy Larry',
      renderer: 'unassigned',
      publish: 'unassigned',
      source: 'browser-studio',
      script,
      voice: voiceName || 'browser-default',
      scenes: LAZY_LARRY_SCENES,
      intelligenceLayers: INTELLIGENCE_LAYERS,
      metricsPolicy: 'verified-sources-only',
      createdAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lazy-larry-broadcast-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stage = (
    <div className="relative isolate aspect-video w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#050b18] shadow-2xl shadow-black/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_35%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_76%_24%,rgba(245,197,66,0.18),transparent_30%),linear-gradient(145deg,#07101f_0%,#091426_48%,#050810_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/50 px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-amber-200 sm:left-7 sm:top-7 sm:text-xs">
        <span className={`h-2 w-2 rounded-full ${isSpeaking ? 'animate-pulse bg-emerald-300' : 'bg-neutral-500'}`} />
        AIKAGAN 2D {isSpeaking ? 'ON AIR' : 'READY'}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-black via-black/65 to-transparent" />

      <div className="absolute bottom-0 left-[3%] z-10 h-[88%] w-[48%] max-w-[690px] transition-all duration-700 sm:left-[5%]">
        <div className={`absolute inset-12 rounded-full bg-gradient-to-br ${accentMap[scene.accent]} blur-3xl`} />
        <Image
          src="/media/lazy-larry-2d.jpg"
          alt="Lazy Larry, AIKAGAN 2D brand ambassador"
          fill
          priority
          sizes="(max-width: 768px) 55vw, 45vw"
          className={`object-contain object-bottom drop-shadow-[0_30px_45px_rgba(0,0,0,.55)] transition duration-700 ${scene.id === 'final' ? 'scale-[1.04]' : 'scale-100'}`}
        />
      </div>

      <div className="absolute right-[4%] top-[18%] z-10 w-[48%] sm:right-[6%] sm:w-[44%]">
        <div className={`rounded-2xl border bg-gradient-to-br p-4 backdrop-blur-md transition-all duration-500 sm:p-6 ${accentMap[scene.accent]}`}>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] opacity-90 sm:text-xs">{scene.eyebrow}</p>
          <h2 className="mt-2 text-xl font-black leading-tight text-white sm:text-3xl lg:text-5xl">{scene.title}</h2>
          <p className="mt-2 hidden text-sm leading-6 text-neutral-200 sm:block lg:text-base">{scene.subtitle}</p>
        </div>

        {scene.id === 'intelligence' && (
          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:mt-4 sm:grid-cols-7 sm:gap-2">
            {INTELLIGENCE_LAYERS.map(([code, label]) => (
              <div key={code} className="rounded-lg border border-white/10 bg-black/45 p-2 text-center backdrop-blur sm:p-3">
                <div className="text-sm font-black text-white sm:text-xl">{code}</div>
                <div className="mt-1 hidden text-[9px] uppercase tracking-wide text-neutral-400 lg:block">{label}</div>
              </div>
            ))}
          </div>
        )}

        {scene.id === 'progress' && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
            {EMPTY_BROADCAST_METRICS.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{metric.label}</p>
                <p className="mt-1 text-lg font-black text-white sm:text-2xl">{metric.value}</p>
                <p className="mt-1 hidden text-[10px] text-emerald-200 sm:block">{metric.detail}</p>
              </div>
            ))}
          </div>
        )}

        {scene.id === 'roadmap' && (
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {['Discover', 'Automate', 'Execute', 'Scale'].map((item, index) => (
              <span key={item} className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-100 sm:text-xs">
                {index + 1}. {item}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-5 z-20 text-right sm:bottom-6 sm:right-7">
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-neutral-500 sm:text-xs">Intelligence • Automation • Freedom</p>
      </div>
    </div>
  );

  if (playerMode) {
    return (
      <main className="min-h-screen bg-black p-2 sm:p-4">
        <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1920px] items-center">{stage}</div>
        <button onClick={isSpeaking ? stop : start} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-black shadow-xl">
          {isSpeaking ? 'Stop' : 'Start broadcast'}
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06080d] text-white">
      <section className="border-b border-white/5 bg-[radial-gradient(circle_at_70%_0%,rgba(245,197,66,.10),transparent_35%),#06080d]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
            <Radio className="h-4 w-4" /> Lazy Larry Broadcast Engine v0.1
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">A reusable 2D broadcast surface for AIKAGAN.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-400">Run a browser-native live briefing now, generate a deterministic render manifest for async production, and keep all business metrics on a verified-source-only policy.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 xl:grid-cols-[1.35fr_.65fr]">
        <div>
          {stage}
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={isSpeaking ? stop : start} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-black text-black hover:bg-amber-200">
              {isSpeaking ? <CircleStop className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isSpeaking ? 'Stop live briefing' : 'Start live briefing'}
            </button>
            <a href="/broadcast/lazy-larry/?mode=player" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white hover:border-white/30">
              <Radio className="h-4 w-4" /> Open clean player
            </a>
            <button onClick={downloadManifest} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white hover:border-white/30">
              <Download className="h-4 w-4" /> Download render manifest
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-sm font-black text-white"><Mic2 className="h-4 w-4 text-amber-300" /> Broadcast script</div>
            <textarea value={script} onChange={(e) => setScript(e.target.value)} rows={7} className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm leading-6 text-neutral-200 outline-none focus:border-amber-300/50" />
            <div className="mt-3 flex justify-between text-xs text-neutral-500"><span>{words} words</span><span>~{estimatedSeconds}s browser estimate</span></div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm font-black">Local live voice</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">Uses the browser speech engine. No provider API key or server cost.</p>
            <select value={voiceName} onChange={(e) => setVoiceName(e.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-[#0a0d13] p-3 text-sm text-neutral-200 outline-none">
              {voices.length === 0 && <option value="">Browser default</option>}
              {voices.map((voice) => <option key={`${voice.name}-${voice.lang}`} value={voice.name}>{voice.name} — {voice.lang}</option>)}
            </select>
          </div>

          <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5">
            <div className="flex items-center gap-2 text-sm font-black text-emerald-200"><Send className="h-4 w-4" /> Async production contract</div>
            <p className="mt-2 text-xs leading-5 text-neutral-400">This creates a server-validated manifest only. It deliberately does not claim a renderer or publisher is connected yet.</p>
            <button onClick={createManifest} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100 hover:bg-emerald-300/15">
              <Sparkles className="h-4 w-4" /> Create production manifest
            </button>
          </div>

          {jobs.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between"><p className="text-sm font-black">Recent manifests</p><RefreshCw className="h-4 w-4 text-neutral-500" /></div>
              <div className="mt-3 space-y-2">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="rounded-xl border border-white/8 bg-black/25 p-3">
                    <div className="flex items-center justify-between gap-3 text-xs"><span className="font-mono text-neutral-300">{job.id.slice(0, 12)}</span><span className="text-amber-200">{job.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.03] p-5 text-xs leading-6 text-neutral-400">
            <div className="flex items-center gap-2 font-black text-cyan-200"><Activity className="h-4 w-4" /> Next connector boundary</div>
            <p className="mt-2">Attach a deterministic TTS provider, 2D renderer, metric adapters and publish destinations behind the manifest endpoint. The public player can remain unchanged.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
