import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { Button, Field, Heading, Screen } from '@/components';
import { useSession } from '@/session';
import { errorMessage } from '@/errors';
import { supabase } from '@/supabase';
import { colors } from '@/theme';

export default function VerifyPage() {
  const router = useRouter();
  const { email, mode = 'signup' } = useLocalSearchParams<{
    email: string;
    mode?: 'signup' | 'recovery';
  }>();
  const session = useSession();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  async function submit() {
    setPending(true);
    setError(undefined);
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: mode,
      });
      if (verifyError) throw verifyError;
      if (mode === 'recovery') {
        router.replace({ pathname: '/reset-password', params: { email, verified: 'true' } });
        return;
      }
      const role = await session.refreshAccount();
      router.replace(role === 'WORKER' ? '/(worker)' : '/(user)');
    } catch (caught) {
      setError(errorMessage(caught, 'Verification failed.'));
    } finally {
      setPending(false);
    }
  }
  async function resend() {
    setError(undefined);
    const { error: resendError } =
      mode === 'recovery'
        ? await supabase.auth.resetPasswordForEmail(email)
        : await supabase.auth.resend({ type: 'signup', email });
    if (resendError) setError(resendError.message);
  }
  return (
    <Screen>
      <Heading
        eyebrow="Email verification"
        title="Enter the 6-digit code"
        body="The code expires after 10 minutes and stops working after successful use."
      />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <Field
        label="Verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
      />
      <Button
        title={pending ? 'Verifying…' : 'Verify and continue'}
        disabled={pending}
        onPress={() => void submit()}
      />
      <Button title="Resend code" variant="secondary" onPress={() => void resend()} />
    </Screen>
  );
}
