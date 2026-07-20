import { useRouter } from 'expo-router';
import { Button, FeatureCard, Heading, Screen } from '@/components';
import { useSession } from '@/session';

export default function WorkerProfile() {
  const router = useRouter();
  const { signOut } = useSession();
  return (
    <Screen>
      <Heading
        eyebrow="Worker profile"
        title="Professional settings"
        body="Manage supported identity, categories, experience, service area, availability, notification, and security information."
      />
      <FeatureCard
        icon="✅"
        title="Approval and documents"
        body="Review status or provide documents requested by an administrator."
        onPress={() => router.push('/(worker)/onboarding' as never)}
      />
      <FeatureCard
        icon="🗓️"
        title="Skills and availability"
        body="Update categories, years of experience, schedule, and service radius."
        onPress={() => router.push('/(worker)/onboarding' as never)}
      />
      <Button
        title="Logout"
        variant="danger"
        onPress={() => void signOut().then(() => router.replace('/landing'))}
      />
    </Screen>
  );
}
