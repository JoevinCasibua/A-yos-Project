import type { Database } from '@ayos/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseConfiguration } from './config';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, key } = supabaseConfiguration();
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* Server Components cannot write; proxy performs refresh writes. */
        }
      },
    },
  });
}
