import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
  const { data: account } = await supabase
    .from('accounts')
    .select('role,status')
    .eq('id', user.id)
    .single();
  if (!account || account.role !== 'ADMIN' || account.status !== 'ACTIVE')
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 });
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'A-YOS Administrator',
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  });
}
