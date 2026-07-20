import type { AccountRole } from '@ayos/contracts';
import { AppState } from 'react-native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setSessionPersistence, supabase } from './supabase';

export interface SessionAccount {
  id: string;
  email: string;
  role: AccountRole;
  status: string;
}
interface SessionContextValue {
  loading: boolean;
  account: SessionAccount | undefined;
  accessToken: string | undefined;
  signIn: (identifier: string, password: string, rememberMe: boolean) => Promise<AccountRole>;
  refreshAccount: () => Promise<AccountRole>;
  signOut: () => Promise<void>;
}
const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>();
  const [account, setAccount] = useState<SessionAccount>();

  const loadAccount = useCallback(async (): Promise<AccountRole> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication is required.');
    const { data, error } = await supabase
      .from('accounts')
      .select('id,email,role,status')
      .eq('id', session.user.id)
      .single();
    if (error || !data || data.status !== 'ACTIVE') throw new Error('The account is not active.');
    const next = data as unknown as SessionAccount;
    setAccessToken(session.access_token);
    setAccount(next);
    return next.role;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.startAutoRefresh();
    void supabase.auth.getSession().then(async ({ data }) => {
      if (data.session && !cancelled) await loadAccount().catch(() => supabase.auth.signOut());
      if (!cancelled) setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setAccessToken(session?.access_token);
    });
    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') void supabase.auth.startAutoRefresh();
      else void supabase.auth.stopAutoRefresh();
    });
    return () => {
      cancelled = true;
      void supabase.auth.stopAutoRefresh();
      listener.subscription.unsubscribe();
      appState.remove();
    };
  }, [loadAccount]);

  const signIn = useCallback(
    async (identifier: string, password: string, rememberMe: boolean): Promise<AccountRole> => {
      await setSessionPersistence(rememberMe);
      if (identifier.includes('@')) {
        const { error } = await supabase.auth.signInWithPassword({
          email: identifier.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
      } else {
        const invocation = await supabase.functions.invoke('auth-sign-in', {
          body: { identifier: identifier.trim(), password },
        });
        const data = invocation.data as unknown as {
          access_token?: string;
          refresh_token?: string;
          error?: { message?: string };
        };
        if (invocation.error || !data.access_token || !data.refresh_token)
          throw new Error(data.error?.message ?? 'The credentials are incorrect.');
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        if (sessionError) throw sessionError;
      }
      return loadAccount();
    },
    [loadAccount],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut({ scope: 'local' });
    setAccessToken(undefined);
    setAccount(undefined);
  }, []);
  const value = useMemo(
    () => ({ loading, account, accessToken, signIn, refreshAccount: loadAccount, signOut }),
    [loading, account, accessToken, loadAccount, signIn, signOut],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider.');
  return value;
}
