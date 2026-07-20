import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  if (!body.email || !body.password)
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email.trim().toLowerCase(),
    password: body.password,
  });
  if (error || !data.user)
    return NextResponse.json({ error: 'The credentials are incorrect.' }, { status: 401 });
  const { data: account } = await supabase
    .from('accounts')
    .select('role,status,mfa_enabled')
    .eq('id', data.user.id)
    .single();
  if (!account || account.role !== 'ADMIN' || account.status !== 'ACTIVE') {
    await supabase.auth.signOut();
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
  }
  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (account.mfa_enabled && assurance?.currentLevel !== 'aal2') {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp.find((candidate) => candidate.status === 'verified');
    if (!factor)
      return NextResponse.json(
        { error: 'Administrator MFA is enabled but has no verified factor.' },
        { status: 403 },
      );
    return NextResponse.json({ mfaRequired: true, factorId: factor.id });
  }
  return NextResponse.json({ authenticated: true });
}
