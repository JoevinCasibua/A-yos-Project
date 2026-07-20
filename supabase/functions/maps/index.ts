import { z } from 'npm:zod@4.4.3';
import { requireAccount } from '../_shared/auth.ts';
import { json, options } from '../_shared/http.ts';

const coordinate = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
const properties = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));
const pointFeatureCollection = z.object({
  type: z.literal('FeatureCollection'),
  features: z
    .array(
      z.object({
        type: z.literal('Feature'),
        geometry: z.object({
          type: z.literal('Point'),
          coordinates: z.tuple([z.number(), z.number()]),
        }),
        properties,
      }),
    )
    .max(50),
});
const routeEstimate = z.object({
  distanceMeters: z.number().nonnegative(),
  durationSeconds: z.number().nonnegative(),
  route: z.object({
    type: z.literal('Feature'),
    geometry: z.object({
      type: z.literal('LineString'),
      coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
    }),
    properties,
  }),
});
const requestSchema = z.discriminatedUnion('operation', [
  z.object({ operation: z.literal('GEOCODE'), query: z.string().trim().min(3).max(500) }),
  z.object({ operation: z.literal('REVERSE_GEOCODE'), coordinate }),
  z.object({
    operation: z.literal('ROUTE'),
    bookingId: z.string().uuid(),
    origin: coordinate,
    destination: coordinate,
  }),
]);

Deno.serve(async (request) => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST')
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST required.' } }, 405);
  let identity: Awaited<ReturnType<typeof requireAccount>>;
  try {
    identity = await requireAccount(request);
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNAUTHENTICATED';
    return json(
      { error: { code, message: 'Authentication is required.' } },
      code === 'UNAUTHENTICATED' ? 401 : 403,
    );
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return json({ error: { code: 'VALIDATION_FAILED', message: 'Invalid map request.' } }, 400);
  if (parsed.data.operation === 'ROUTE') {
    const visible = await identity.client
      .from('bookings')
      .select('id')
      .eq('id', parsed.data.bookingId)
      .maybeSingle();
    if (visible.error || !visible.data)
      return json({ error: { code: 'FORBIDDEN', message: 'Booking route is unavailable.' } }, 403);
  }
  const providerUrl = Deno.env.get('MAPS_PROVIDER_URL');
  const providerKey = Deno.env.get('MAPS_PROVIDER_API_KEY');
  if (
    !providerUrl ||
    !providerKey ||
    (Deno.env.get('MAPS_PROVIDER') ?? 'local-test-only') === 'local-test-only'
  ) {
    const code =
      parsed.data.operation === 'ROUTE' ? 'ROUTE_UNAVAILABLE' : 'MAP_PROVIDER_UNAVAILABLE';
    return json({ error: { code, message: 'The configured map provider is unavailable.' } }, 503);
  }
  try {
    const providerResponse = await fetch(providerUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: { 'content-type': 'application/json', 'x-api-key': providerKey },
      body: JSON.stringify(parsed.data),
    });
    if (!providerResponse.ok) {
      const retryable =
        providerResponse.status === 408 ||
        providerResponse.status === 429 ||
        providerResponse.status >= 500;
      return json(
        {
          error: {
            code:
              parsed.data.operation === 'ROUTE' ? 'ROUTE_UNAVAILABLE' : 'MAP_PROVIDER_UNAVAILABLE',
            message: 'The map provider rejected the request.',
            retryable,
          },
        },
        retryable ? 503 : 422,
      );
    }
    const payload: unknown = await providerResponse.json();
    const normalized =
      parsed.data.operation === 'ROUTE'
        ? routeEstimate.safeParse(payload)
        : pointFeatureCollection.safeParse(payload);
    if (!normalized.success)
      return json(
        {
          error: {
            code:
              parsed.data.operation === 'ROUTE' ? 'ROUTE_UNAVAILABLE' : 'MAP_PROVIDER_UNAVAILABLE',
            message: 'The map provider returned an invalid response.',
          },
        },
        502,
      );
    return json({ provider: Deno.env.get('MAPS_PROVIDER'), data: normalized.data });
  } catch {
    return json(
      {
        error: {
          code:
            parsed.data.operation === 'ROUTE' ? 'ROUTE_UNAVAILABLE' : 'MAP_PROVIDER_UNAVAILABLE',
          message: 'The map provider could not be reached.',
          retryable: true,
        },
      },
      503,
    );
  }
});
