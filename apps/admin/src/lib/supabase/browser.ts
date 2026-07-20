'use client';

import type { Database } from '@ayos/supabase';
import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase administrator configuration is missing.');
  client ??= createBrowserClient<Database>(url, key);
  return client;
}
