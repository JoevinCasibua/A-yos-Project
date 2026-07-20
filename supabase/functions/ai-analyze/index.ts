import { z } from 'npm:zod@4.4.3';
import { adminClient, requireAccount } from '../_shared/auth.ts';
import {
  ProviderChainFailure,
  ProviderFailure,
  runProviderChain,
  transcribeVoice,
} from '../_shared/ai.ts';
import { json, options } from '../_shared/http.ts';

const requestSchema = z
  .object({
    inputType: z.enum(['TEXT', 'IMAGE', 'VOICE']),
    text: z.string().trim().min(10).max(8_000).optional(),
    storagePath: z.string().trim().min(3).max(1_024).optional(),
    idempotencyKey: z.string().min(16).max(128),
  })
  .superRefine((value, context) => {
    if (value.inputType === 'TEXT' && !value.text)
      context.addIssue({ code: 'custom', path: ['text'], message: 'Text input is required.' });
    if (value.inputType !== 'TEXT' && !value.storagePath)
      context.addIssue({
        code: 'custom',
        path: ['storagePath'],
        message: 'A private storage path is required.',
      });
  });

function dataUrl(blob: Blob, bytes: Uint8Array): string {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return `data:${blob.type};base64,${btoa(binary)}`;
}

Deno.serve(async (request) => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST')
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST required.' } }, 405);

  let identity: Awaited<ReturnType<typeof requireAccount>>;
  try {
    identity = await requireAccount(request, 'USER');
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNAUTHENTICATED';
    return json(
      { error: { code, message: 'Authentication is required.' } },
      code === 'UNAUTHENTICATED' ? 401 : 403,
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return json(
      { error: { code: 'VALIDATION_FAILED', message: 'Invalid analysis request.' } },
      400,
    );
  const input = parsed.data;
  const service = adminClient();
  const existing = await service
    .from('ai_analyses')
    .select('*')
    .eq('account_id', identity.account.id)
    .eq('idempotency_key', input.idempotencyKey)
    .maybeSingle();
  if (existing.data)
    return json({
      analysisId: existing.data.id,
      provider: existing.data.provider,
      model: existing.data.provider_model,
      result: {
        detectedIssue: existing.data.detected_issue,
        severity: existing.data.severity,
        possibleCause: existing.data.possible_cause,
        suggestedCategory: existing.data.suggested_category_name,
        estimatedCostMinimum: existing.data.estimated_cost_minimum,
        estimatedCostMaximum: existing.data.estimated_cost_maximum,
        safetyAdvice: existing.data.safety_advice,
        requestDraft: existing.data.request_draft,
      },
      idempotentReplay: true,
    });

  let text =
    input.text ?? 'Analyze the supplied issue media and prepare an editable service-request draft.';
  let imageDataUrl: string | undefined;
  let transcript: string | undefined;
  try {
    if (input.inputType !== 'TEXT') {
      const storagePath = input.storagePath!;
      if (!storagePath.startsWith(`${identity.account.id}/`))
        throw new ProviderFailure(
          'FORBIDDEN',
          'The media path is not owned by this account.',
          false,
          403,
        );
      const bucket = input.inputType === 'IMAGE' ? 'request-media' : 'message-attachments';
      const downloaded = await service.storage.from(bucket).download(storagePath);
      if (downloaded.error || !downloaded.data)
        throw new ProviderFailure(
          'AI_INPUT_UNSUPPORTED',
          'The private media could not be read.',
          false,
          400,
        );
      const blob = downloaded.data;
      if (blob.size < 1 || blob.size > 15_728_640)
        throw new ProviderFailure(
          'AI_INPUT_UNSUPPORTED',
          'The media size is unsupported.',
          false,
          400,
        );
      if (input.inputType === 'IMAGE') {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(blob.type))
          throw new ProviderFailure(
            'AI_INPUT_UNSUPPORTED',
            'The image type is unsupported.',
            false,
            400,
          );
        imageDataUrl = dataUrl(blob, new Uint8Array(await blob.arrayBuffer()));
      } else {
        if (!['audio/mpeg', 'audio/mp4', 'audio/wav'].includes(blob.type))
          throw new ProviderFailure(
            'AI_INPUT_UNSUPPORTED',
            'The audio type is unsupported.',
            false,
            400,
          );
        transcript = await transcribeVoice(blob);
        text = transcript;
      }
    }

    const success = await runProviderChain({ text, ...(imageDataUrl ? { imageDataUrl } : {}) });
    const inserted = await service.rpc('persist_ai_analysis', {
      p_account_id: identity.account.id,
      p_input_type: input.inputType,
      p_input_storage_path: input.storagePath ?? null,
      p_transcript: transcript ?? null,
      p_idempotency_key: input.idempotencyKey,
      p_provider: success.provider,
      p_model: success.model,
      p_provider_reference: success.reference ?? null,
      p_result: success.result,
      p_attempts: success.attempts.map((attempt) => ({
        provider: attempt.provider,
        model: attempt.model,
        outcome: attempt.outcome,
        retryable: attempt.retryable,
        latency_ms: attempt.latencyMs,
        error_code: attempt.errorCode ?? null,
      })),
    });
    if (inserted.error || !inserted.data)
      throw new ProviderFailure('INTERNAL_ERROR', 'The analysis could not be saved.', false, 500);
    const analysis = inserted.data as { id: string };
    return json({
      analysisId: analysis.id,
      provider: success.provider,
      model: success.model,
      result: success.result,
    });
  } catch (error) {
    const chain = error instanceof ProviderChainFailure ? error : undefined;
    const failure =
      chain?.failure ??
      (error instanceof ProviderFailure
        ? error
        : new ProviderFailure('INTERNAL_ERROR', 'AI analysis failed.', false, 500));
    if (chain?.attempts.length)
      await service.from('ai_analysis_attempts').insert(
        chain.attempts.map((attempt) => ({
          account_id: identity.account.id,
          idempotency_key: input.idempotencyKey,
          provider: attempt.provider,
          model: attempt.model,
          outcome: attempt.outcome,
          retryable: attempt.retryable,
          latency_ms: attempt.latencyMs,
          error_code: attempt.errorCode ?? null,
        })),
      );
    return json({ error: { code: failure.code, message: failure.message } }, failure.status);
  }
});
