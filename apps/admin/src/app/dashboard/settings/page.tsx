import { createSupabaseServerClient } from '@/lib/supabase/server';
import { saveSetting, upsertContent } from '../actions';
import { MfaSettings } from './mfa-settings';

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ data: account }, { data: content }, { data: settings }] = await Promise.all([
    supabase.from('accounts').select('mfa_enabled').eq('id', user!.id).single(),
    supabase.from('content_pages').select('*').order('key'),
    supabase.from('system_settings').select('*').order('key'),
  ]);
  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">System settings</span>
          <h2>Security and configuration</h2>
          <p className="lede">
            Sensitive commands require an AAL2 session after TOTP is enabled. Changes are committed
            only after a successful protected RPC.
          </p>
        </div>
      </header>
      <MfaSettings enabled={Boolean(account?.mfa_enabled)} />
      <section className="card form-card">
        <div>
          <span className="eyebrow">Legal and help content</span>
          <h3>Publish a content page</h3>
          <p className="lede">
            Saving with Publish disabled creates a draft and may make registration unavailable when
            editing Terms.
          </p>
        </div>
        <form action={upsertContent} className="form-grid">
          <label>
            Content
            <select name="contentKey" defaultValue="TERMS">
              <option>TERMS</option>
              <option>PRIVACY</option>
              <option>REFUND_POLICY</option>
              <option>HELP_CENTER</option>
            </select>
          </label>
          <label>
            Version
            <input name="version" required placeholder="2026-07" />
          </label>
          <label className="wide">
            Title
            <input name="title" required maxLength={200} />
          </label>
          <label className="wide">
            Body
            <textarea name="body" required rows={8} />
          </label>
          <label className="check">
            <input name="publish" type="checkbox" /> Publish now
          </label>
          <button className="button">Save content</button>
        </form>
      </section>
      <section className="card form-card">
        <div>
          <span className="eyebrow">Platform configuration</span>
          <h3>Set a typed JSON value</h3>
          <p className="lede">
            Only documented settings should be stored. Unknown provider bindings remain unavailable.
          </p>
        </div>
        <form action={saveSetting} className="form-grid">
          <label>
            Key
            <input name="key" required maxLength={120} />
          </label>
          <label className="wide">
            JSON value
            <textarea name="value" required rows={5} defaultValue="{}" />
          </label>
          <button className="button">Save setting</button>
        </form>
      </section>
      <section className="card table-card">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Content</th>
                <th>Version</th>
                <th>Published</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {(content ?? []).map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.key}
                    <small>{item.title}</small>
                  </td>
                  <td>{item.version}</td>
                  <td>{item.published_at ? 'Published' : 'Draft'}</td>
                  <td>{item.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <span className="eyebrow">Saved settings</span>
        <pre className="settings-json">{JSON.stringify(settings ?? [], null, 2)}</pre>
      </section>
    </>
  );
}
