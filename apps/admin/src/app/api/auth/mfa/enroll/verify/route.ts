import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
export async function POST(request: Request) {
  const { factorId, code } = (await request.json()) as { factorId?: string; code?: string };
  if (!factorId || !code?.match(/^\d{6}$/))
    return NextResponse.json({ error: 'A valid authenticator code is required.' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error)
    return NextResponse.json({ error: 'The authenticator code is invalid.' }, { status: 400 });
  const { error: accountError } = await supabase.rpc('set_admin_mfa_enabled', { enabled: true });
  if (accountError) return NextResponse.json({ error: accountError.message }, { status: 403 });
  return NextResponse.json({ enabled: true });
}
