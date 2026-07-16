import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function requireUser(request: Request) {
  const authorization = request.headers.get('Authorization');
  if (!authorization) throw new Error('AUTHENTICATION_REQUIRED');
  const client = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authorization } } },
  );
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('AUTHENTICATION_REQUIRED');
  return { client, user: data.user };
}

