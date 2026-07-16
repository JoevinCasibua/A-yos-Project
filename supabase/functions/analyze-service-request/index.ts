import { corsHeaders, json } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';

const fallback = (description: string) => {
  const text = description.toLowerCase();
  const category = text.match(/leak|pipe|faucet|drain/) ? 'plumbing'
    : text.match(/wire|socket|power|electri/) ? 'electrical'
    : text.match(/aircon|air condition/) ? 'aircon'
    : text.match(/wood|door|cabinet/) ? 'carpentry' : 'cleaning';
  return { summary: description.trim(), suggestedCategory: category, requiredSkills: [category], visibleRisks: [], confidence: 0.45, provider: 'local-rules', model: null, isFallback: true };
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    await requireUser(request);
    const { description, imageBase64, consent } = await request.json();
    if (typeof description !== 'string' || description.trim().length < 10) return json({ code: 'VALIDATION_FAILED' }, 400);
    const key = Deno.env.get('GEMINI_API_KEY');
    if (!key || !consent) return json({ data: fallback(description) });
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.1-flash-lite';
    const parts: Record<string, unknown>[] = [{ text: `Analyze this home-service issue. Return JSON only with summary, suggestedCategory (plumbing, electrical, cleaning, carpentry, aircon), requiredSkills string array, visibleRisks string array, and confidence 0..1. Description: ${description}` }];
    if (imageBase64) parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } });
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: 'application/json' } }),
    });
    if (!response.ok) return json({ data: fallback(description), warning: 'AI_PROVIDER_UNAVAILABLE' });
    const payload = await response.json();
    const parsed = JSON.parse(payload.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
    return json({ data: { ...parsed, provider: 'gemini', model, isFallback: false } });
  } catch (error) {
    return json({ code: error instanceof Error ? error.message : 'VALIDATION_FAILED' }, 401);
  }
});

