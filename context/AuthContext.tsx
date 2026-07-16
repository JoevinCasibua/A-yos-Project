import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AccountStatus, VerificationStatus } from '@/services/contracts';

interface AuthState {
  session: Session | null; user: User | null; loading: boolean;
  accountStatus: AccountStatus | null; verificationStatus: VerificationStatus | null;
  roles: Array<'customer' | 'worker' | 'admin'>; profileError: string | null; refreshProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [roles, setRoles] = useState<Array<'customer' | 'worker' | 'admin'>>([]);
  const [profileError, setProfileError] = useState<string | null>(null);
  const hydrationSequence = useRef(0);

  const clearProfile = useCallback(() => {
    setAccountStatus(null);
    setVerificationStatus(null);
    setRoles([]);
  }, []);

  const loadProfile = useCallback(async (userId: string) => {
    const [profileResult, verificationResult, rolesResult] = await Promise.all([
      supabase.from('profiles').select('account_status').eq('id', userId).maybeSingle(),
      supabase.from('identity_verifications').select('status').eq('user_id', userId).order('version', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', userId),
    ]);
    const queryError = profileResult.error || verificationResult.error || rolesResult.error;
    if (queryError) throw queryError;
    setAccountStatus((profileResult.data?.account_status as AccountStatus) || null);
    setVerificationStatus((verificationResult.data?.status as VerificationStatus) || null);
    setRoles((rolesResult.data || []).map((row) => row.role as 'customer' | 'worker' | 'admin'));
  }, []);

  const refreshProfile = useCallback(async () => {
    const userId = session?.user.id;
    if (!userId) { clearProfile(); setProfileError(null); return; }
    try {
      setProfileError(null);
      await loadProfile(userId);
    } catch (error) {
      clearProfile();
      setProfileError(error instanceof Error ? error.message : 'PROFILE_LOAD_FAILED');
    }
  }, [clearProfile, loadProfile, session?.user.id]);

  useEffect(() => {
    let active = true;
    const hydrate = async (next: Session | null) => {
      const sequence = ++hydrationSequence.current;
      setLoading(true);
      setSession(next);
      setProfileError(null);
      if (!next) {
        clearProfile();
        if (active && sequence === hydrationSequence.current) setLoading(false);
        return;
      }
      try {
        await loadProfile(next.user.id);
      } catch (error) {
        clearProfile();
        if (active && sequence === hydrationSequence.current) {
          setProfileError(error instanceof Error ? error.message : 'PROFILE_LOAD_FAILED');
        }
      } finally {
        if (active && sequence === hydrationSequence.current) setLoading(false);
      }
    };

    void supabase.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      // Defer database reads until the Auth callback has released its internal lock.
      setTimeout(() => { void hydrate(next); }, 0);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [clearProfile, loadProfile]);
  const value = useMemo(() => ({ session, user: session?.user || null, loading, accountStatus, verificationStatus, roles, profileError, refreshProfile }), [session, loading, accountStatus, verificationStatus, roles, profileError, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
