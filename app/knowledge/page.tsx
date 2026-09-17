import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, FileText, GitBranch, HelpCircle, Layers, Sparkles } from 'lucide-react';
import { AlexandriaKnowledgeEngine } from '@/lib/alexandria/knowledge-engine';

export const metadata: Metadata = {
  title: 'Knowledge Base & Operating Docs',
  description: 'AIKAGAN / AutonomaX operating documentation: SOPs, frameworks, prompt templates, and case studies powering the autonomous AI agency pipeline.',
  alternates: { canonical: 'https://aikagan.com/knowledge' },
  openGraph: {
    title: 'Knowledge Base & Operating Docs | AIKAGAN',
    description: 'SOPs, frameworks, and agent prompt templates from the Alexandria Knowledge Core.',
    url: 'https://aikagan.com/knowledge',
    type: 'website',
  },
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  SOP: FileText,
  Framework: Layers,
  PromptTemplate: Sparkles,
  CaseStudy: GitBranch,
};

export const dynamic = 'force-dynamic';

export default async function KnowledgePage() {
  const docs = await AlexandriaKnowledgeEngine.getAllDocuments();

  const categoryMeta: { key: string; label: string; blurb: string }[] = [
    { key: 'SOP', label: 'Standard Operating Procedures', blurb: 'Step-by-step runbooks for fulfillment, delivery, routing, and health.' },
    { key: 'Framework', label: 'Frameworks', blurb: 'Diagnostic and operating frameworks used across the platform.' },
    { key: 'PromptTemplate', label: 'Agent Prompt Templates', blurb: 'Production prompts that drive the AI Commander layer.' },
    { key: 'CaseStudy', label: 'Case Studies', blurb: 'Recorded patterns from real campaigns and workflows.' },
  ];

  return (
    <main className="min-h-screen bg-[#08080a] px-5 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold text-amber-300">Alexandria Knowledge Core</p>
          <h1 className="mt-3 text-5xl font-extrabold md:text-6xl">Operating knowledge, engineered.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-300">
            The knowledge layer that powers AIKAGAN&apos;s autonomous AI agency pipeline — every SOP, framework,
            and agent prompt is versioned, bundleable, and injected as context on demand.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categoryMeta.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.key] ?? HelpCircle;
            const count = docs.filter((d) => d.category === cat.key).length;
            return (
              <div key={cat.key} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-6 w-6 text-amber-300" />
                <h2 className="mt-4 text-lg font-bold">{cat.label}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{cat.blurb}</p>
                <p className="mt-4 text-xs font-semibold text-neutral-500">{count} document{count === 1 ? '' : 's'}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <BookOpen className="h-5 w-5 text-amber-300" />
            <h2 className="text-2xl font-bold">Document Library</h2>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {docs.map((doc) => {
              const Icon = CATEGORY_ICONS[doc.category] ?? HelpCircle;
              return (
                <Link
                  key={doc.id}
                  href={`/knowledge/${doc.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:border-amber-300/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                        <Icon className="h-3 w-3" /> {doc.category}
                      </span>
                      <span className="text-[11px] text-neutral-500">{doc.updatedAt}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold group-hover:text-amber-200">{doc.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-400">{doc.content}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {doc.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-neutral-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}