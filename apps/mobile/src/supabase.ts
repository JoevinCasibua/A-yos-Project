import 'react-native-url-polyfill/auto';
import type { Database } from '@ayos/supabase';
import { createClient } from '@supabase/supabase-js';
import { sessionPersistence } from './auth-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !publishableKey) throw new Error('Supabase mobile configuration is missing.');

const authStorageKey = `sb-${new URL(url).hostname.split('.')[0]}-auth-token`;

export async function setSessionPersistence(enabled: boolean) {
  await sessionPersistence.setPersistence(enabled, authStorageKey);
}
export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    storage: sessionPersistence.storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: { params: { eventsPerSecond: 10 } },
});
