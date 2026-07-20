import { z } from 'npm:zod@4.4.3';

export type AiProvider = 'OPENAI' | 'GEMINI' | 'OPENROUTER';
export interface AnalysisResult {
  detectedIssue: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  possibleCause: string;
  suggestedCategory: string;
  estimatedCostMinimum: number;
  estimatedCostMaximum: number;
  safetyAdvice: string;
  requestDraft: string;
}
export interface AnalysisInput {
  text: string;
  imageDataUrl?: string;
}
export interface ProviderAttempt {
  provider: AiProvider;
  model: string;
  outcome: 'SUCCEEDED' | 'FAILED' | 'SKIPPED';
  retryable: boolean;
  latencyMs: number;
  errorCode?: string;
}
export interface ProviderSuccess {
  provider: AiProvider;
  model: string;
  result: AnalysisResult;
  reference?: string;
  attempts: ProviderAttempt[];
}

const resultSchema = z
  .object({
    detectedIssue: z.string().trim().min(3).max(500),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    possibleCause: z.string().trim().min(3).max(1_000),
    suggestedCategory: z.string().trim().min(2).max(120),
    estimatedCostMinimum: z.number().nonnegative().max(10_000_000),
    estimatedCostMaximum: z.number().nonnegative().max(10_000_000),
    safetyAdvice: z.string().trim().min(3).max(2_000),
    requestDraft: z.string().trim().min(10).max(4_000),
  })
  .refine((value) => value.estimatedCostMinimum <= value.estimatedCostMaximum);

export const analysisJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'detectedIssue',
    'severity',
    'possibleCause',
    'suggestedCategory',
    'estimatedCostMinimum',
    'estimatedCostMaximum',
    'safetyAdvice',
    'requestDraft',
  ],
  properties: {
    detectedIssue: { type: 'string', minLength: 3, maxLength: 500 },
    severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
    possibleCause: { type: 'string', minLength: 3, maxLength: 1000 },
    suggestedCategory: { type: 'string', minLength: 2, maxLength: 120 },
    estimatedCostMinimum: { type: 'number', minimum: 0, maximum: 10000000 },
    estimatedCostMaximum: { type: 'number', minimum: 0, maximum: 10000000 },
    safetyAdvice: { type: 'string', minLength: 3, maxLength: 2000 },
    requestDraft: { type: 'string', minLength: 10, maxLength: 4000 },
  },
} as const;

const systemPrompt = `You prepare service-request drafts for A-YOS, a Philippine local-service marketplace.
Analyze only the information supplied by the user. Do not claim certainty, professional inspection, or a guaranteed price.
Use Philippine pesos for estimates. Provide immediate safety advice when applicable.
Return exactly the required JSON schema and no additional fields.`;

export class ProviderFailure extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly retryable: boolean,
    public readonly status = 503,
  ) {
    super(message);
  }
}

export class ProviderChainFailure extends Error {
  constructor(
    public readonly failure: ProviderFailure,
    public readonly attempts: ProviderAttempt[],
  ) {
    super(failure.message);
  }
}

function requiredKey(name: string): string {
  const value = Deno.env.get(name);
  if (!value)
    throw new ProviderFailure('AI_PROVIDER_UNAVAILABLE', `${name} is not configured.`, false);
  return value;
}

function classifyHttpFailure(provider: AiProvider, response: Response): ProviderFailure {
  const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
  return new ProviderFailure(
    retryable ? 'AI_PROVIDER_UNAVAILABLE' : 'AI_PROVIDER_REJECTED',
    `${provider} returned HTTP ${response.status}.`,
    retryable,
    retryable ? 503 : 422,
  );
}

async function providerFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(30_000) });
  } catch (error) {
    throw new ProviderFailure(
      'AI_PROVIDER_UNAVAILABLE',
      error instanceof Error && error.name === 'TimeoutError'
        ? 'The AI provider timed out.'
        : 'The AI provider could not be reached.',
      true,
    );
  }
}

function parseResult(value: unknown): AnalysisResult {
  let decoded = value;
  if (typeof value === 'string') {
    try {
      decoded = JSON.parse(value);
    } catch {
      throw new ProviderFailure(
        'AI_OUTPUT_INVALID',
        'The AI provider returned invalid JSON.',
        false,
        502,
      );
    }
  }
  const parsed = resultSchema.safeParse(decoded);
  if (!parsed.success)
    throw new ProviderFailure(
      'AI_OUTPUT_INVALID',
      'The AI provider response failed validation.',
      false,
      502,
    );
  return parsed.data;
}

async function openAi(input: AnalysisInput): Promise<Omit<ProviderSuccess, 'attempts'>> {
  const model = Deno.env.get('OPENAI_ANALYSIS_MODEL') ?? 'gpt-5.6-sol';
  const content: Record<string, unknown>[] = [{ type: 'input_text', text: input.text }];
  if (input.imageDataUrl)
    content.push({ type: 'input_image', image_url: input.imageDataUrl, detail: 'high' });
  const response = await providerFetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${requiredKey('OPENAI_API_KEY')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: 'low' },
      input: [
        { role: 'developer', content: [{ type: 'input_text', text: systemPrompt }] },
        { role: 'user', content },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'service_request_analysis',
          strict: true,
          schema: analysisJsonSchema,
        },
      },
      store: false,
    }),
  });
  if (!response.ok) throw classifyHttpFailure('OPENAI', response);
  const payload = (await response.json()) as Record<string, unknown>;
  const output = Array.isArray(payload.output) ? payload.output : [];
  const outputText = output
    .flatMap((item) => {
      if (
        !item ||
        typeof item !== 'object' ||
        !Array.isArray((item as { content?: unknown[] }).content)
      )
        return [];
      return (item as { content: Record<string, unknown>[] }).content
        .filter((part) => part.type === 'output_text' && typeof part.text === 'string')
        .map((part) => part.text as string);
    })
    .join('');
  return {
    provider: 'OPENAI',
    model,
    result: parseResult(outputText),
    reference: typeof payload.id === 'string' ? payload.id : undefined,
  };
}

async function gemini(input: AnalysisInput): Promise<Omit<ProviderSuccess, 'attempts'>> {
  const model = Deno.env.get('GEMINI_ANALYSIS_MODEL') ?? 'gemini-3.5-flash';
  const parts: Record<string, unknown>[] = [
    { text: `${systemPrompt}\n\nUser input:\n${input.text}` },
  ];
  if (input.imageDataUrl) {
    const match = /^data:([^;]+);base64,(.+)$/.exec(input.imageDataUrl);
    if (!match)
      throw new ProviderFailure('AI_INPUT_UNSUPPORTED', 'Invalid image data.', false, 400);
    parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
  }
  const response = await providerFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(requiredKey('GEMINI_API_KEY'))}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: analysisJsonSchema,
        },
      }),
    },
  );
  if (!response.ok) throw classifyHttpFailure('GEMINI', response);
  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    responseId?: string;
  };
  const text =
    payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
  return { provider: 'GEMINI', model, result: parseResult(text), reference: payload.responseId };
}

async function openRouter(input: AnalysisInput): Promise<Omit<ProviderSuccess, 'attempts'>> {
  const model = Deno.env.get('OPENROUTER_ANALYSIS_MODEL') ?? 'openai/gpt-5.6-sol';
  const userContent: Record<string, unknown>[] = [{ type: 'text', text: input.text }];
  if (input.imageDataUrl)
    userContent.push({ type: 'image_url', image_url: { url: input.imageDataUrl } });
  const response = await providerFetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${requiredKey('OPENROUTER_API_KEY')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'service_request_analysis', strict: true, schema: analysisJsonSchema },
      },
    }),
  });
  if (!response.ok) throw classifyHttpFailure('OPENROUTER', response);
  const payload = (await response.json()) as {
    id?: string;
    choices?: { message?: { content?: string } }[];
  };
  return {
    provider: 'OPENROUTER',
    model,
    result: parseResult(payload.choices?.[0]?.message?.content ?? ''),
    reference: payload.id,
  };
}

const providers = [openAi, gemini, openRouter] as const;

export async function runProviderChain(input: AnalysisInput): Promise<ProviderSuccess> {
  const attempts: ProviderAttempt[] = [];
  for (const operation of providers) {
    const started = performance.now();
    try {
      const success = await operation(input);
      attempts.push({
        provider: success.provider,
        model: success.model,
        outcome: 'SUCCEEDED',
        retryable: false,
        latencyMs: Math.round(performance.now() - started),
      });
      return { ...success, attempts };
    } catch (error) {
      const failure =
        error instanceof ProviderFailure
          ? error
          : new ProviderFailure('AI_PROVIDER_UNAVAILABLE', 'The AI provider failed.', true);
      const provider: AiProvider =
        operation === openAi ? 'OPENAI' : operation === gemini ? 'GEMINI' : 'OPENROUTER';
      const model =
        provider === 'OPENAI'
          ? (Deno.env.get('OPENAI_ANALYSIS_MODEL') ?? 'gpt-5.6-sol')
          : provider === 'GEMINI'
            ? (Deno.env.get('GEMINI_ANALYSIS_MODEL') ?? 'gemini-3.5-flash')
            : (Deno.env.get('OPENROUTER_ANALYSIS_MODEL') ?? 'openai/gpt-5.6-sol');
      attempts.push({
        provider,
        model,
        outcome: 'FAILED',
        retryable: failure.retryable,
        latencyMs: Math.round(performance.now() - started),
        errorCode: failure.code,
      });
      if (!failure.retryable || provider === 'OPENROUTER')
        throw new ProviderChainFailure(failure, attempts);
    }
  }
  throw new ProviderChainFailure(
    new ProviderFailure('AI_PROVIDER_UNAVAILABLE', 'No AI provider is available.', true),
    attempts,
  );
}

export async function transcribeVoice(blob: Blob): Promise<string> {
  const form = new FormData();
  form.set('model', Deno.env.get('OPENAI_TRANSCRIPTION_MODEL') ?? 'gpt-4o-transcribe');
  form.set('response_format', 'json');
  form.set('file', blob, 'voice-input');
  const response = await providerFetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { authorization: `Bearer ${requiredKey('OPENAI_API_KEY')}` },
    body: form,
  });
  if (!response.ok) throw classifyHttpFailure('OPENAI', response);
  const payload = (await response.json()) as { text?: string };
  if (!payload.text?.trim())
    throw new ProviderFailure('AI_OUTPUT_INVALID', 'Voice transcription was empty.', false, 502);
  return payload.text.trim();
}
