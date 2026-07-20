import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseRouteClient } from '@/lib/supabase/route';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, applyCookies } = createSupabaseRouteClient(request);
  const json = (body: unknown, init?: ResponseInit) => applyCookies(NextResponse.json(body, init));
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json({ error: 'Authentication is required.' }, { status: 401 });
  const { data: account } = await supabase
    .from('accounts')
    .select('role,status')
    .eq('id', userData.user.id)
    .single();
  if (!account || account.role !== 'ADMIN' || account.status !== 'ACTIVE')
    return json({ error: 'Administrator access is required.' }, { status: 403 });
  const { data: report } = await supabase
    .from('report_exports')
    .select('storage_path,status')
    .eq('id', id)
    .single();
  if (!report?.storage_path || report.status !== 'COMPLETED')
    return json({ error: 'Report is unavailable.' }, { status: 404 });
  const { data, error } = await supabase.storage
    .from('report-exports')
    .createSignedUrl(report.storage_path, 60);
  if (error || !data) return json({ error: 'Report download failed.' }, { status: 500 });
  return applyCookies(NextResponse.redirect(data.signedUrl));
}
