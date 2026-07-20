import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MfaSettings } from './mfa-settings';
export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from('accounts')
    .select('mfa_enabled')
    .eq('id', user!.id)
    .single();
  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">System settings</span>
          <h2>Security and configuration</h2>
          <p className="lede">
            Sensitive administrator commands require an AAL2 session after TOTP is enabled.
          </p>
        </div>
      </header>
      <MfaSettings enabled={Boolean(data?.mfa_enabled)} />
    </>
  );
}
