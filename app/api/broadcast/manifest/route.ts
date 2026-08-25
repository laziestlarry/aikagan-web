import { NextResponse } from 'next/server';

const MAX_SCRIPT_CHARS = 2400;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const script = typeof body.script === 'string' ? body.script.trim() : '';
  const character = body.character === 'lazy-larry' ? 'lazy-larry' : null;
  const format = body.format === '2d' ? '2d' : null;

  if (!character || !format || !script) {
    return NextResponse.json(
      { error: 'invalid_manifest', message: 'character=lazy-larry, format=2d and a non-empty script are required.' },
      { status: 422 },
    );
  }

  if (script.length > MAX_SCRIPT_CHARS) {
    return NextResponse.json(
      { error: 'script_too_long', maxCharacters: MAX_SCRIPT_CHARS },
      { status: 422 },
    );
  }

  const createdAt = new Date().toISOString();
  const jobId = `ll-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;

  return NextResponse.json({
    jobId,
    createdAt,
    status: 'manifest-created',
    queued: false,
    renderer: null,
    publisher: null,
    note: 'Manifest validated. No asynchronous renderer or publisher is connected to this endpoint yet.',
  });
}
