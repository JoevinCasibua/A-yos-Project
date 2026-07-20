import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseRouteClient } from '@/lib/supabase/route';
export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createSupabaseRouteClient(request);
  const json = (body: unknown, init?: ResponseInit) => applyCookies(NextResponse.json(body, init));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json({ error: 'Authentication is required.' }, { status: 401 });
  const { data: account } = await supabase
    .from('accounts')
    .select('role,status')
    .eq('id', user.id)
    .single();
  if (!account || account.role !== 'ADMIN' || account.status !== 'ACTIVE')
    return json({ error: 'Administrator access is required.' }, { status: 403 });
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'A-YOS Administrator',
  });
  if (error) return json({ error: error.message }, { status: 400 });
  return json({
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  });
}
