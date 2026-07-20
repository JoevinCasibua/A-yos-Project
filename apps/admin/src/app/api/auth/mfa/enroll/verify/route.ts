import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseRouteClient } from '@/lib/supabase/route';
export async function POST(request: NextRequest) {
  const { factorId, code } = (await request.json()) as { factorId?: string; code?: string };
  if (!factorId || !code?.match(/^\d{6}$/))
    return NextResponse.json({ error: 'A valid authenticator code is required.' }, { status: 400 });
  const { supabase, applyCookies } = createSupabaseRouteClient(request);
  const json = (body: unknown, init?: ResponseInit) => applyCookies(NextResponse.json(body, init));
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) return json({ error: 'The authenticator code is invalid.' }, { status: 400 });
  const { error: accountError } = await supabase.rpc('set_admin_mfa_enabled', { enabled: true });
  if (accountError) return json({ error: accountError.message }, { status: 403 });
  return json({ enabled: true });
}
