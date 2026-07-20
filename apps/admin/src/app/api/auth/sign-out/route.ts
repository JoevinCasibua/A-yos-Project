import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseRouteClient } from '@/lib/supabase/route';
export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createSupabaseRouteClient(request);
  await supabase.auth.signOut();
  return applyCookies(NextResponse.redirect(new URL('/login', request.url), 303));
}
