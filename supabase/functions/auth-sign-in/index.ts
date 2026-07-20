import { createClient } from 'npm:@supabase/supabase-js@2.110.7';
import { adminClient } from '../_shared/auth.ts';
import { json, options } from '../_shared/http.ts';

Deno.serve(async (request) => {
  const preflight = options(request);
  if (preflight) return preflight;
  if (request.method !== 'POST')
    return json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'POST required.' } }, 405);
  const body = (await request.json().catch(() => ({}))) as {
    identifier?: string;
    password?: string;
  };
  if (!body.identifier || !body.password)
    return json(
      { error: { code: 'VALIDATION_FAILED', message: 'Identifier and password are required.' } },
      400,
    );
  let email = body.identifier.trim().toLowerCase();
  if (!email.includes('@')) {
    const { data } = await adminClient()
      .from('accounts')
      .select('email')
      .eq('mobile', body.identifier.trim())
      .eq('status', 'ACTIVE')
      .is('deleted_at', null)
      .maybeSingle();
    if (!data?.email)
      return json(
        { error: { code: 'UNAUTHENTICATED', message: 'The credentials are incorrect.' } },
        401,
      );
    email = data.email;
  }
  const client = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
    { auth: { persistSession: false } },
  );
  const { data, error } = await client.auth.signInWithPassword({ email, password: body.password });
  if (error || !data.session)
    return json(
      { error: { code: 'UNAUTHENTICATED', message: 'The credentials are incorrect.' } },
      401,
    );
  return json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});
