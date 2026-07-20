import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const { factorId, code } = (await request.json()) as { factorId?: string; code?: string };
  if (!factorId || !code?.match(/^\d{6}$/))
    return NextResponse.json({ error: 'A valid authenticator code is required.' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error)
    return NextResponse.json(
      { error: 'The authenticator code is invalid or expired.' },
      { status: 401 },
    );
  return NextResponse.json({ authenticated: true });
}
