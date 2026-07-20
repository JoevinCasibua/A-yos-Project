import { ProviderChainFailure, runProviderChain } from './ai.ts';

const validResult = {
  detectedIssue: 'Leaking supply pipe',
  severity: 'MEDIUM',
  possibleCause: 'Loose pipe coupling',
  suggestedCategory: 'Plumbing',
  estimatedCostMinimum: 500,
  estimatedCostMaximum: 1500,
  safetyAdvice: 'Turn off the local water supply.',
  requestDraft: 'Inspect and repair the leaking pipe below the kitchen sink.',
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

Deno.test('falls back from retryable OpenAI failure to Gemini', async () => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];
  Deno.env.set('OPENAI_API_KEY', 'test-openai');
  Deno.env.set('GEMINI_API_KEY', 'test-gemini');
  Deno.env.set('OPENROUTER_API_KEY', 'test-openrouter');
  globalThis.fetch = ((input: string | URL | Request) => {
    const url = input.toString();
    calls.push(url);
    if (url.includes('openai.com/v1/responses'))
      return Promise.resolve(new Response('{}', { status: 503 }));
    return Promise.resolve(
      Response.json({
        responseId: 'gemini-test',
        candidates: [{ content: { parts: [{ text: JSON.stringify(validResult) }] } }],
      }),
    );
  }) as typeof fetch;
  try {
    const response = await runProviderChain({ text: 'Water is leaking below the kitchen sink.' });
    assert(response.provider === 'GEMINI', 'Gemini should handle the retryable fallback.');
    assert(calls.length === 2, 'Only OpenAI and Gemini should be called.');
    assert(response.attempts[0]?.retryable === true, 'The OpenAI failure must be retryable.');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test('does not fall back after a permanent provider rejection', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  Deno.env.set('OPENAI_API_KEY', 'test-openai');
  globalThis.fetch = (() => {
    calls += 1;
    return Promise.resolve(new Response('{}', { status: 400 }));
  }) as typeof fetch;
  try {
    let failure: unknown;
    try {
      await runProviderChain({ text: 'Water is leaking below the kitchen sink.' });
    } catch (error) {
      failure = error;
    }
    assert(failure instanceof ProviderChainFailure, 'A permanent rejection must fail the chain.');
    assert(calls === 1, 'Fallback providers must not run after a permanent rejection.');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
