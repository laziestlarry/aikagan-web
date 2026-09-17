import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Tag } from 'lucide-react';
import { AlexandriaKnowledgeEngine } from '@/lib/alexandria/knowledge-engine';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const docs = await AlexandriaKnowledgeEngine.getByIds([id]);
  const doc = docs[0];
  if (!doc) return { title: 'Document not found | AIKAGAN' };
  return {
    title: doc.title,
    description: doc.content.slice(0, 160),
    alternates: { canonical: `https://aikagan.com/knowledge/${doc.id}` },
  };
}

export default async function KnowledgeDocPage({ params }: Props) {
  const { id } = await params;
  const docs = await AlexandriaKnowledgeEngine.getByIds([id]);
  const doc = docs[0];
  if (!doc) notFound();

  const lines = doc.content.split('\n').filter((l) => l.trim().length > 0);

  return (
    <main className="min-h-screen bg-[#08080a] px-5 py-16 text-white">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 transition hover:text-amber-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Knowledge Base
        </Link>

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
              <BookOpen className="h-3.5 w-3.5" /> {doc.category}
            </span>
            <span className="text-xs text-neutral-500">Updated {doc.updatedAt}</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{doc.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {doc.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-neutral-400">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        </div>

        <article className="prose prose-invert mt-10 max-w-none">
          {lines.map((line, i) => {
            if (line.startsWith('# ')) return <h2 key={i} className="mt-6 text-2xl font-bold">{line.slice(2)}</h2>;
            if (line.startsWith('## ')) return <h3 key={i} className="mt-5 text-xl font-bold">{line.slice(3)}</h3>;
            if (/^[0-9]+\.\s/.test(line)) return <p key={i} className="mt-2 pl-1 text-neutral-300">{line}</p>;
            return <p key={i} className="mt-3 leading-7 text-neutral-300">{line}</p>;
          })}
        </article>
      </section>
    </main>
  );
}