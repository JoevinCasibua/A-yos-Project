import { corsHeaders, json } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';

const glossary: Record<string, string> = { leak: 'tagas', pipe: 'tubo', repair: 'kumpuni', electrical: 'elektrikal', cleaning: 'paglilinis', arrived: 'dumating', completed: 'tapos na' };
function localTranslate(text: string) {
  let translated = text;
  let matches = 0;
  for (const [source, target] of Object.entries(glossary)) {
    const next = translated.replace(new RegExp(`\\b${source}\\b`, 'gi'), target);
    if (next !== translated) matches++;
    translated = next;
  }
  return { translatedText: matches ? translated : null, status: matches ? 'partial' : 'failed', provider: 'local-glossary', model: null };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    await requireUser(request);
    const { text, sourceLanguage, targetLanguage } = await request.json();
    if (!['en','fil'].includes(sourceLanguage) || !['en','fil'].includes(targetLanguage) || typeof text !== 'string') return json({ code: 'VALIDATION_FAILED' }, 400);
    if (sourceLanguage === targetLanguage) return json({ data: { translatedText: text, status: 'complete', provider: 'identity', model: null } });
    const key = Deno.env.get('GEMINI_API_KEY');
    if (!key) return json({ data: localTranslate(text) });
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-3.1-flash-lite';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Translate from ${sourceLanguage} to ${targetLanguage}. Return only the translation. Preserve names, numbers, and technical terms. Text: ${text}` }] }] }),
    });
    if (!response.ok) return json({ data: localTranslate(text), warning: 'AI_PROVIDER_UNAVAILABLE' });
    const payload = await response.json();
    return json({ data: { translatedText: payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim(), status: 'complete', provider: 'gemini', model } });
  } catch (error) { return json({ code: error instanceof Error ? error.message : 'VALIDATION_FAILED' }, 401); }
});

