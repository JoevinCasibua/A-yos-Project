import { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import {
  Button,
  DataState,
  EmptyState,
  FeatureCard,
  Heading,
  Screen,
  StatusBadge,
} from '@/components';
import { listBookings, listWorkerJobRequests, transitionBooking } from '@/repository';
import { useAsyncData } from '@/useAsyncData';

export default function JobPosts() {
  const [busy, setBusy] = useState<string>();
  const load = useCallback(
    async () => ({
      requests: await listWorkerJobRequests(),
      bookings: (await listBookings()).filter((booking) => booking.status === 'PENDING'),
    }),
    [],
  );
  const { data, error, loading, refresh } = useAsyncData(load);
  const decide = async (id: string, version: number, accept: boolean) => {
    setBusy(id);
    try {
      await transitionBooking(
        id,
        accept ? 'ACCEPTED' : 'CANCELLED',
        version,
        accept ? undefined : 'Declined by worker',
      );
      await refresh();
    } catch (caught) {
      Alert.alert('Request update failed', caught instanceof Error ? caught.message : 'Try again.');
    } finally {
      setBusy(undefined);
    }
  };
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 30 }}>
        <Heading
          eyebrow="Job Posts"
          title="Matching service requests"
          body="Matching details are private to eligible workers. Only a selected pending booking can be accepted or declined."
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data?.requests.length && !data?.bookings.length ? (
          <EmptyState
            title="No matching jobs"
            body="Eligible requests appear when category, schedule, service area, and availability match."
          />
        ) : null}
        {data?.requests.map((request) => (
          <FeatureCard
            key={request.id}
            icon="📌"
            title={request.description}
            body={`Scheduled ${new Date(request.scheduled_at).toLocaleString()} · Budget ₱${request.budget.toLocaleString()}`}
          />
        ))}
        {data?.requests.length ? (
          <StatusBadge label="Awaiting customer selection" tone="info" />
        ) : null}
        {data?.bookings.map((booking) => (
          <View key={booking.id} style={{ gap: 8 }}>
            <FeatureCard
              icon="📨"
              title={`Incoming booking ${booking.id.slice(0, 8)}`}
              body={`Respond before ${new Date(booking.response_due_at).toLocaleString()}`}
            />
            <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
              <Button
                title={busy === booking.id ? 'Updating…' : 'Accept'}
                disabled={Boolean(busy)}
                onPress={() => void decide(booking.id, booking.version, true)}
              />
              <Button
                title="Decline"
                variant="secondary"
                disabled={Boolean(busy)}
                onPress={() => void decide(booking.id, booking.version, false)}
              />
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
