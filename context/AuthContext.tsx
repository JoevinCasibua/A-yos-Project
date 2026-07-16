import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AccountStatus, VerificationStatus } from '@/services/contracts';

interface AuthState {
  session: Session | null; user: User | null; loading: boolean;
  accountStatus: AccountStatus | null; verificationStatus: VerificationStatus | null;
  roles: Array<'customer' | 'worker' | 'admin'>; refreshProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [roles, setRoles] = useState<Array<'customer' | 'worker' | 'admin'>>([]);

  const refreshProfile = async () => {
    const userId = session?.user.id;
    if (!userId) { setAccountStatus(null); setVerificationStatus(null); setRoles([]); return; }
    const [{ data: profile }, { data: verification }, { data: roleRows }] = await Promise.all([
      supabase.from('profiles').select('account_status').eq('id', userId).maybeSingle(),
      supabase.from('identity_verifications').select('status').eq('user_id', userId).order('version', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
    ]);
    setAccountStatus((profile?.account_status as AccountStatus) || null);
    setVerificationStatus((verification?.status as VerificationStatus) || null);
    setRoles((roleRows || []).map((row) => row.role as 'customer' | 'worker' | 'admin'));
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => { setSession(next); setLoading(false); });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { void refreshProfile(); }, [session?.user.id]);
  const value = useMemo(() => ({ session, user: session?.user || null, loading, accountStatus, verificationStatus, roles, refreshProfile }), [session, loading, accountStatus, verificationStatus, roles]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }

