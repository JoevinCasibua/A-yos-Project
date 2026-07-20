import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Heading, Screen } from '@/components';
import { colors } from '@/theme';

export default function LandingPage() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: 22 }}>
        <Text style={{ fontSize: 54 }}>🛠️</Text>
        <Heading
          eyebrow="Local help, matched well"
          title="Book trusted service nearby."
          body="Describe the job, compare approved workers, follow the service, confirm cash payment, and leave verified feedback."
        />
        <Button
          title="Create user account"
          onPress={() => router.push({ pathname: '/register', params: { role: 'USER' } })}
        />
        <Button
          title="Register as a worker"
          variant="secondary"
          onPress={() => router.push({ pathname: '/register', params: { role: 'WORKER' } })}
        />
        <Button
          title="Already registered? Sign in"
          variant="secondary"
          onPress={() => router.push('/sign-in')}
        />
      </View>
      <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 11 }}>
        Accounts have one fixed production role. Worker-to-user switching is not supported.
      </Text>
    </Screen>
  );
}
