import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  DataState,
  EmptyState,
  FeatureCard,
  Heading,
  Screen,
  StatusBadge,
} from '@/components';
import { listAddresses } from '@/repository';
import { useSession } from '@/session';
import { useAsyncData } from '@/useAsyncData';

export default function ProfilePage() {
  const router = useRouter();
  const { account, signOut } = useSession();
  const load = useCallback(
    () => (account ? listAddresses(account.id) : Promise.resolve([])),
    [account],
  );
  const { data = [], error, loading } = useAsyncData(load);
  const logout = async () => {
    await signOut();
    router.replace('/landing');
  };
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 30 }}>
        <Heading
          eyebrow="Profile and settings"
          title={account?.email ?? 'Your account'}
          body="Only persisted account, address, and notification information is shown."
        />
        <StatusBadge
          label={account?.status ?? 'Loading'}
          tone={account?.status === 'ACTIVE' ? 'success' : 'warning'}
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data.length ? (
          <EmptyState
            title="No saved addresses"
            body="A service address is saved when you submit a request."
          />
        ) : null}
        {data.map((address) => (
          <FeatureCard
            key={address.id}
            icon="📍"
            title={address.label}
            body={`${address.line1}, ${address.barangay}, ${address.city}, ${address.province}`}
          />
        ))}
        <FeatureCard
          icon="💵"
          title="Payment method"
          body="Cash is the only enabled MVP payment method. GCash, Maya, cards, and wallet are excluded."
        />
        <FeatureCard
          icon="🛡️"
          title="Privacy"
          body="Profile, request, booking, payment, message, and location records are protected by backend RLS."
        />
        <Button title="Logout" variant="danger" onPress={() => void logout()} />
      </ScrollView>
    </Screen>
  );
}
