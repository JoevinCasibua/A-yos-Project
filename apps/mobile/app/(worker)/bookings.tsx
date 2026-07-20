import type { BookingStatus } from '@ayos/contracts';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
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
import { confirmCashPayment, listBookings, transitionBooking } from '@/repository';
import { useAsyncData } from '@/useAsyncData';

const nextStatus: Partial<Record<BookingStatus, BookingStatus>> = {
  ACCEPTED: 'WORKER_PREPARING',
  WORKER_PREPARING: 'WORKER_EN_ROUTE',
  WORKER_EN_ROUTE: 'WORKER_ARRIVED',
  WORKER_ARRIVED: 'SERVICE_STARTED',
  SERVICE_STARTED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
};

export default function WorkerBookings() {
  const router = useRouter();
  const [busy, setBusy] = useState<string>();
  const load = useCallback(() => listBookings(), []);
  const { data = [], error, loading, refresh } = useAsyncData(load);
  const advance = async (id: string, version: number, status: BookingStatus) => {
    setBusy(id);
    try {
      await transitionBooking(id, status, version);
      await refresh();
    } catch (caught) {
      Alert.alert(
        'Status update failed',
        caught instanceof Error ? caught.message : 'Reload and try again.',
      );
    } finally {
      setBusy(undefined);
    }
  };
  const confirm = async (id: string) => {
    setBusy(id);
    try {
      const payment = await confirmCashPayment(id, crypto.randomUUID());
      Alert.alert(
        'Cash receipt recorded',
        payment.status === 'SUCCESSFUL'
          ? 'Both confirmations are complete.'
          : 'Waiting for customer confirmation.',
      );
      await refresh();
    } catch (caught) {
      Alert.alert('Confirmation failed', caught instanceof Error ? caught.message : 'Try again.');
    } finally {
      setBusy(undefined);
    }
  };
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 30 }}>
        <Heading
          eyebrow="Bookings"
          title="Prepare, travel, serve, complete"
          body="Only the next canonical lifecycle action is shown for each assigned booking."
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data.length ? (
          <EmptyState
            title="No worker bookings"
            body="Selected requests appear here after acceptance."
          />
        ) : null}
        {data.map((booking) => {
          const next = nextStatus[booking.status];
          return (
            <View key={booking.id} style={{ gap: 8 }}>
              <FeatureCard
                icon="🧰"
                title={booking.request?.description ?? `Booking ${booking.id.slice(0, 8)}`}
                body={`${booking.status.replaceAll('_', ' ')} · version ${booking.version}`}
              />
              <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
                <StatusBadge
                  label={booking.status}
                  tone={
                    booking.status === 'COMPLETED'
                      ? 'success'
                      : booking.status === 'CANCELLED'
                        ? 'danger'
                        : 'info'
                  }
                />
                {next ? (
                  <Button
                    title={busy === booking.id ? 'Updating…' : `Set ${next.replaceAll('_', ' ')}`}
                    disabled={Boolean(busy)}
                    onPress={() => void advance(booking.id, booking.version, next)}
                  />
                ) : null}
                {['WORKER_EN_ROUTE', 'WORKER_ARRIVED', 'SERVICE_STARTED', 'IN_PROGRESS'].includes(
                  booking.status,
                ) ? (
                  <Button
                    title="Tracking"
                    variant="secondary"
                    onPress={() =>
                      router.push({
                        pathname: '/(worker)/tracking',
                        params: { bookingId: booking.id },
                      })
                    }
                  />
                ) : null}
                {booking.status === 'COMPLETED' ? (
                  <Button
                    title="Confirm cash received"
                    disabled={Boolean(busy)}
                    onPress={() => void confirm(booking.id)}
                  />
                ) : null}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
