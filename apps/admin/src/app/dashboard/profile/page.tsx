import { createSupabaseServerClient } from '@/lib/supabase/server';
import { updateAdminCredentials } from '../actions';

export default async function AdminProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('display_name,created_at')
    .eq('account_id', userData.user!.id)
    .single();
  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">Administrator account</span>
          <h2>{profile?.display_name ?? 'Administrator'}</h2>
          <p className="lede">
            Update Supabase Auth credentials. Email changes may require confirmation under the
            configured Auth policy.
          </p>
        </div>
        <span className="status">Protected account</span>
      </header>
      <section className="card form-card">
        <div>
          <h3>Account security</h3>
          <p className="lede">
            Created {profile?.created_at ? new Date(profile.created_at).toLocaleString() : '—'}.
            Authenticator MFA is managed under Settings.
          </p>
        </div>
        <form action={updateAdminCredentials} className="form-grid">
          <label>
            New email
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            New password
            <input name="password" type="password" minLength={12} autoComplete="new-password" />
          </label>
          <button className="button">Update credentials</button>
        </form>
      </section>
      <section className="card">
        <span className="eyebrow">Login history</span>
        <h3>Unavailable</h3>
        <p className="lede">
          No verified login-history persistence contract exists.{' '}
          <strong>INSUFFICIENT DATA TO VERIFY.</strong>
        </p>
      </section>
    </>
  );
}
