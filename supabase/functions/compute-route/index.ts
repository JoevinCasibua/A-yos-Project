import { corsHeaders, json } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';

function estimate(origin: [number, number], destination: [number, number]) {
  const rad = (n: number) => n * Math.PI / 180;
  const dLat = rad(destination[1] - origin[1]); const dLon = rad(destination[0] - origin[0]);
  const a = Math.sin(dLat/2) ** 2 + Math.cos(rad(origin[1])) * Math.cos(rad(destination[1])) * Math.sin(dLon/2) ** 2;
  const distance = Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  return { origin, destination, distanceMeters: distance, durationSeconds: Math.round(distance / 8.33), geometry: { type: 'LineString', coordinates: [origin, destination] }, provider: 'straight-line', status: 'estimated' };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    await requireUser(request);
    const { origin, destination } = await request.json() as { origin: [number,number], destination: [number,number] };
    if (!Array.isArray(origin) || !Array.isArray(destination)) return json({ code: 'VALIDATION_FAILED' }, 400);
    const key = Deno.env.get('OPENROUTESERVICE_API_KEY');
    if (!key) return json({ data: estimate(origin,destination), warning: 'ROUTE_PROVIDER_UNAVAILABLE' });
    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST', headers: { Authorization: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ coordinates: [origin,destination] }),
    });
    if (!response.ok) return json({ data: estimate(origin,destination), warning: response.status === 429 ? 'PROVIDER_QUOTA_EXCEEDED' : 'ROUTE_UNAVAILABLE' });
    const payload = await response.json(); const feature = payload.features?.[0]; const summary = feature?.properties?.summary;
    return json({ data: { origin, destination, distanceMeters: Math.round(summary.distance), durationSeconds: Math.round(summary.duration), geometry: feature.geometry, provider: 'openrouteservice', status: 'complete' } });
  } catch (error) { return json({ code: error instanceof Error ? error.message : 'ROUTE_UNAVAILABLE' }, 401); }
});

