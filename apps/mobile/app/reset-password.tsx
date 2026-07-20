import { passwordSchema } from '@ayos/contracts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { Button, Field, Heading, Screen } from '@/components';
import { errorMessage, supabase } from '@/supabase';
import { colors } from '@/theme';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; verified?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const verified = params.verified === 'true';
  async function requestCode() {
    setPending(true);
    setError(undefined);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;
      router.push({ pathname: '/verify', params: { email, mode: 'recovery' } });
    } catch (caught) {
      setError(errorMessage(caught, 'Reset request failed.'));
    } finally {
      setPending(false);
    }
  }
  async function confirm() {
    setPending(true);
    setError(undefined);
    try {
      const password = passwordSchema.parse(newPassword);
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut({ scope: 'others' });
      router.replace('/sign-in');
    } catch (caught) {
      setError(errorMessage(caught, 'Password reset failed.'));
    } finally {
      setPending(false);
    }
  }
  return (
    <Screen>
      <Heading
        eyebrow="Account recovery"
        title={verified ? 'Set a new password' : 'Reset your password'}
        body="A-YOS sends a six-digit recovery code to the registered email."
      />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      {verified ? (
        <>
          <Field
            label="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Button
            title={pending ? 'Resetting…' : 'Set new password'}
            disabled={pending}
            onPress={() => void confirm()}
          />
        </>
      ) : (
        <>
          <Field
            label="Registered email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title={pending ? 'Sending…' : 'Send reset code'}
            disabled={pending}
            onPress={() => void requestCode()}
          />
        </>
      )}
    </Screen>
  );
}
