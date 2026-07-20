import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: account } = await supabase
    .from('accounts')
    .select('role,status,mfa_enabled')
    .eq('id', user.id)
    .single();
  if (!account || account.role !== 'ADMIN' || account.status !== 'ACTIVE') {
    await supabase.auth.signOut();
    redirect('/login');
  }
  if (account.mfa_enabled) {
    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== 'aal2') redirect('/login?mfa=required');
  }
  return <AdminShell>{children}</AdminShell>;
}
