import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Button, Field, Heading, Screen } from '@/components';
import { useSession } from '@/session';
import { colors } from '@/theme';

export default function SignInPage() {
  const router = useRouter();
  const session = useSession();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  async function submit() {
    setPending(true);
    setError(undefined);
    try {
      const role = await session.signIn(identifier, password, rememberMe);
      router.replace(role === 'WORKER' ? '/(worker)' : '/(user)');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed.');
    } finally {
      setPending(false);
    }
  }
  return (
    <Screen>
      <Heading
        eyebrow="Account access"
        title="Sign in"
        body="Use your registered email or mobile number and password."
      />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <Field
        label="Email or mobile"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        autoComplete="username"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
      />
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Switch value={rememberMe} onValueChange={setRememberMe} />
        <Text style={{ color: colors.text }}>Remember me</Text>
      </View>
      <Button
        title={pending ? 'Signing in…' : 'Sign in'}
        disabled={pending}
        onPress={() => void submit()}
      />
      <Button
        title="Forgot password?"
        variant="secondary"
        onPress={() => router.push('/reset-password')}
      />
    </Screen>
  );
}
