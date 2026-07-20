import { useRouter } from 'expo-router';
import { Button, FeatureCard, Heading, Screen } from '@/components';
import { useSession } from '@/session';
export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useSession();
  async function logout() {
    await signOut();
    router.replace('/landing');
  }
  return (
    <Screen>
      <Heading
        eyebrow="Profile and settings"
        title="Your account"
        body="Manage personal information, notification preferences, saved addresses, payment methods, privacy, booking history, favourites, and help."
      />
      <FeatureCard
        icon="📍"
        title="Saved addresses"
        body="Manage service locations and a default address."
      />
      <FeatureCard
        icon="💵"
        title="Payment methods"
        body="Cash is enabled. GCash, Maya, cards, and wallet are not available in the MVP."
      />
      <Button title="Logout" variant="danger" onPress={() => void logout()} />
    </Screen>
  );
}
