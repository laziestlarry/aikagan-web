import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { adminUnauthorizedResponse, isAdminRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;

  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorizedResponse();

  const { idea, niche, tier } = await req.json();
  if (!idea || !niche) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const fallbackMarkdown = `# AI Venture Launch Blueprint: ${idea.toUpperCase()}

## Executive Summary
Deployment strategy for an autonomous AI venture in the **${niche}** niche. Leveraging **AIKAGAN's Premium Operating Systems**, we translate the concept of "${idea}" into a scalable commercial asset engine.

## Monetization Tier: ${tier === 'premium' ? '$299 Pro Growth OS' : '$49 Launch Starter'}
- Month 1: ${tier === 'premium' ? '2,450' : '1,200'} USD
- Month 2: ${tier === 'premium' ? '5,800' : '3,400'} USD
- Month 3: ${tier === 'premium' ? '12,400' : '7,800'} USD
`;

  const ai = await getAI();
  if (!ai) {
    return NextResponse.json({
      success: true,
      rawMarkdown: fallbackMarkdown,
      estimatedRevenues: {
        month1: tier === 'premium' ? 2450 : 1200,
        month2: tier === 'premium' ? 5800 : 3400,
        month3: tier === 'premium' ? 12400 : 7800,
        conversionRate: tier === 'premium' ? 3.4 : 2.1,
      },
      simulated: true,
    });
  }

  try {
    const prompt = `You are the AIKAGAN AI Venture Director.
Generate a professional "AI Venture Launch Blueprint" for concept: "${idea}" in niche: "${niche}".
Respond strictly in JSON: { "rawMarkdown": "...", "month1": number, "month2": number, "month3": number, "conversionRate": number }`;

    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    const responseText =
      (typeof result?.text === 'string' && result.text) ||
      result?.candidates
        ?.map((candidate: any) =>
          candidate?.content?.parts
            ?.map((part: any) => part?.text ?? '')
            .join('') ?? ''
        )
        .join('') ||
      '{}';

    const data = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      rawMarkdown: data.rawMarkdown,
      estimatedRevenues: {
        month1: data.month1 || 1200,
        month2: data.month2 || 3400,
        month3: data.month3 || 7800,
        conversionRate: data.conversionRate || 2.1,
      },
      simulated: false,
    });
  } catch {
    return NextResponse.json({
      success: true,
      rawMarkdown: fallbackMarkdown,
      estimatedRevenues: {
        month1: 1200,
        month2: 3400,
        month3: 7800,
        conversionRate: 2.1,
      },
      simulated: true,
    });
  }
}
