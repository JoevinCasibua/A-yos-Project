import { json, options, unavailable } from '../_shared/http.ts';
import { requireAccount } from '../_shared/auth.ts';

const providers = new Map([
  ['maps', 'MAPS_PROVIDER'],
  ['speech', 'SPEECH_PROVIDER'],
  ['translation', 'TRANSLATION_PROVIDER'],
  ['push', 'PUSH_PROVIDER'],
]);

Deno.serve(async (request) => {
  const preflight = options(request);
  if (preflight) return preflight;
  try {
    await requireAccount(request);
  } catch {
    return json(
      { error: { code: 'UNAUTHENTICATED', message: 'Authentication is required.' } },
      401,
    );
  }
  const operation = new URL(request.url).searchParams.get('operation') ?? '';
  const variable = providers.get(operation);
  if (!variable)
    return json(
      { error: { code: 'VALIDATION_FAILED', message: 'Unsupported provider operation.' } },
      400,
    );
  if ((Deno.env.get(variable) ?? 'local-test-only') === 'local-test-only')
    return unavailable(operation);
  return unavailable(`${operation} provider adapter`);
});
