import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DataState, FeatureCard, Heading, Screen, StatusBadge } from '@/components';
import { getWorkerOnboarding } from '@/repository';
import { useSession } from '@/session';
import { useAsyncData } from '@/useAsyncData';

export default function WorkerDashboard() {
  const router = useRouter();
  const { account } = useSession();
  const load = useCallback(
    () =>
      account
        ? getWorkerOnboarding(account.id)
        : Promise.reject(new Error('Authentication is required.')),
    [account],
  );
  const { data, error, loading } = useAsyncData(load);
  const status = data?.profile?.approval_status ?? 'PENDING';
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 30 }}>
        <Heading
          eyebrow="Worker dashboard"
          title="Your service workspace"
          body="Approval and suitability remain authoritative before any job can be accepted."
        />
        <DataState loading={loading} error={error} />
        {data ? (
          <StatusBadge
            label={status}
            tone={status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : 'warning'}
          />
        ) : null}
        <FeatureCard
          icon="🪪"
          title="Professional onboarding"
          body={
            data?.verification?.requested_notes ??
            'Maintain categories, experience, availability, service area, and identity information.'
          }
          onPress={() => router.push('/(worker)/onboarding' as never)}
        />
        <FeatureCard
          icon="🗓️"
          title="Availability"
          body={`${data?.skills.length ?? 0} categories · ${data?.availability.length ?? 0} schedule windows`}
          onPress={() => router.push('/(worker)/onboarding' as never)}
        />
        <FeatureCard
          icon="📍"
          title="Private service tracking"
          body="Share location only for an assigned booking in an eligible active state."
        />
      </ScrollView>
    </Screen>
  );
}
