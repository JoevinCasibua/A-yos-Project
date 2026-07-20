import type { Database } from '@ayos/supabase';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, type NextResponse } from 'next/server';
import { supabaseConfiguration } from './config';

type PendingCookie = { name: string; value: string; options: CookieOptions };

export function createSupabaseRouteClient(request: NextRequest) {
  const pendingCookies: PendingCookie[] = [];
  const { url, key } = supabaseConfiguration();
  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        pendingCookies.push(...values);
      },
    },
  });

  function applyCookies<T extends NextResponse>(response: T) {
    pendingCookies.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options),
    );
    return response;
  }

  return { supabase, applyCookies };
}
