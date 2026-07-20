import { registerSchema } from '@ayos/contracts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Button, Field, Heading } from '@/components';
import { errorMessage } from '@/errors';
import { supabase } from '@/supabase';
import { colors } from '@/theme';

export default function RegisterPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: 'USER' | 'WORKER' }>();
  const role = params.role === 'WORKER' ? 'WORKER' : 'USER';
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit() {
    setPending(true);
    setError(undefined);
    try {
      const input = registerSchema.parse({ ...form, role, acceptedTerms });
      const { error: signUpError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: { data: { role, name: input.name, mobile: input.mobile } },
      });
      if (signUpError) throw signUpError;
      router.push({ pathname: '/verify', params: { email: input.email, mode: 'signup' } });
    } catch (caught) {
      setError(errorMessage(caught, 'Registration failed.'));
    } finally {
      setPending(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 22, gap: 15 }}
    >
      <Heading
        eyebrow={role === 'WORKER' ? 'Professional onboarding' : 'New account'}
        title={role === 'WORKER' ? 'Register as a worker' : 'Create your account'}
        body={
          role === 'WORKER'
            ? 'After verification, complete your categories, experience, availability, and identity submission for administrator approval.'
            : 'Verify your email to activate and sign in automatically.'
        }
      />
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <Field label="Full name" value={form.name} onChangeText={set('name')} />
      <Field
        label="Mobile number (+63…)"
        value={form.mobile}
        onChangeText={set('mobile')}
        keyboardType="phone-pad"
      />
      <Field
        label="Email"
        value={form.email}
        onChangeText={set('email')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field
        label="Password (12+ characters, mixed case and number)"
        value={form.password}
        onChangeText={set('password')}
        secureTextEntry
      />
      <Field
        label="Confirm password"
        value={form.confirmPassword}
        onChangeText={set('confirmPassword')}
        secureTextEntry
      />
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Switch
          value={acceptedTerms}
          onValueChange={setAcceptedTerms}
          trackColor={{ true: colors.accent }}
        />
        <Text style={{ color: colors.text, flex: 1 }}>
          I accept the published Terms and acknowledge the Privacy Policy.
        </Text>
      </View>
      <Button
        title={pending ? 'Submitting…' : 'Send email code'}
        disabled={pending || !acceptedTerms}
        onPress={() => void submit()}
      />
    </ScrollView>
  );
}
