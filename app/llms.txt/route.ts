import { AlexandriaKnowledgeEngine } from '@/lib/alexandria/knowledge-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const docs = await AlexandriaKnowledgeEngine.getAllDocuments();

  const lines = [
    '# AIKAGAN / AutonomaX Profit OS',
    '',
    '> AI revenue operations and operating system documentation for LLMs and AI agents.',
    '',
    '## Core pages',
    '- [Home](https://aikagan.com/)',
    '- [Products](https://aikagan.com/products)',
    '- [Free Tools](https://aikagan.com/tools)',
    '- [OutcomeOS](https://outcome.aikagan.com/)',
    '- [Knowledge Base](https://aikagan.com/knowledge)',
    '',
    '## Knowledge documents',
    ...docs.map((d) => `- [${d.title}](https://aikagan.com/knowledge/${d.id}) (${d.category})`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}