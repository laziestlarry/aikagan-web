import { AlexandriaKnowledgeEngine } from '@/lib/alexandria/knowledge-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const docs = await AlexandriaKnowledgeEngine.getAllDocuments();

  const sections = [
    { title: 'AIKAGAN / AutonomaX Profit OS — Full Knowledge Context', blurb: 'Complete operating context for LLMs and AI agents. Every SOP, framework, prompt template, and case study in the Alexandria Knowledge Core.' },
    { title: 'Company', blurb: 'AIKAGAN builds premium AI operating systems and revenue infrastructure. Core products: AutonomaX Profit OS (mission control), OutcomeOS (intake), Creator Hub (campaign board), and Alexandria (knowledge core).', items: ['https://aikagan.com/', 'https://app.aikagan.com/dashboard', 'https://outcome.aikagan.com/'] },
  ];

  const docSections = docs.map((d) => ({
    title: d.title,
    blurb: d.content,
    items: [`https://aikagan.com/knowledge/${d.id}`],
  }));

  const output = [...sections, ...docSections]
    .map((s) => `# ${s.title}\n\n${s.blurb}\n\n${s.items.map((i) => `- [${i}](${i})`).join('\n')}\n`)
    .join('\n');

  return new Response(output, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}