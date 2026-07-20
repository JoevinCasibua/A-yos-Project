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
        body="Manage identity details, categories, experience, availability, portfolio, pricing, notification preferences, and security."
      />
      <FeatureCard
        icon="✅"
        title="Approval and documents"
        body="Review the current status or provide documents requested by an administrator."
      />
      <FeatureCard
        icon="⭐"
        title="Recommendation priority"
        body="This status is administrator-managed and cannot override suitability."
      />
      <Button
        title="Logout"
        variant="danger"
        onPress={() => void signOut().then(() => router.replace('/landing'))}
      />
    </Screen>
  );
}
