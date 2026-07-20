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

export default function BookingsPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<string>();
  const load = useCallback(() => listBookings(), []);
  const { data = [], error, loading, refresh } = useAsyncData(load);
  const cancel = async (id: string, version: number) => {
    setBusy(id);
    try {
      await transitionBooking(id, 'CANCELLED', version, 'Cancelled by customer');
      await refresh();
    } catch (caught) {
      Alert.alert('Cancellation failed', caught instanceof Error ? caught.message : 'Try again.');
    } finally {
      setBusy(undefined);
    }
  };
  const pay = async (id: string) => {
    setBusy(id);
    try {
      const result = await confirmCashPayment(id, crypto.randomUUID());
      Alert.alert(
        result.status === 'SUCCESSFUL' ? 'Payment complete' : 'Confirmation recorded',
        result.status === 'SUCCESSFUL'
          ? 'Your receipt is now available.'
          : 'Waiting for the worker to confirm cash received.',
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
          title="Your service activity"
          body="Upcoming, ongoing, completed, and cancelled bookings use the backend lifecycle."
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data.length ? (
          <EmptyState
            title="No bookings"
            body="Bookings appear after you select an eligible worker."
          />
        ) : null}
        {data.map((booking) => (
          <View key={booking.id} style={{ gap: 8 }}>
            <FeatureCard
              icon="🗓️"
              title={booking.request?.description ?? `Booking ${booking.id.slice(0, 8)}`}
              body={`${booking.status.replaceAll('_', ' ')} · ${new Date(booking.created_at).toLocaleString()}`}
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
              {!['COMPLETED', 'CANCELLED'].includes(booking.status) ? (
                <Button
                  title={busy === booking.id ? 'Cancelling…' : 'Cancel'}
                  variant="secondary"
                  disabled={Boolean(busy)}
                  onPress={() => void cancel(booking.id, booking.version)}
                />
              ) : null}
              {['WORKER_EN_ROUTE', 'WORKER_ARRIVED', 'SERVICE_STARTED', 'IN_PROGRESS'].includes(
                booking.status,
              ) ? (
                <Button
                  title="Track service"
                  variant="secondary"
                  onPress={() =>
                    router.push({ pathname: '/(user)/tracking', params: { bookingId: booking.id } })
                  }
                />
              ) : null}
              {booking.status === 'COMPLETED' ? (
                <Button
                  title={busy === booking.id ? 'Recording…' : 'Confirm cash paid'}
                  disabled={Boolean(busy)}
                  onPress={() => void pay(booking.id)}
                />
              ) : null}
              {booking.status === 'COMPLETED' ? (
                <Button
                  title="Rate service"
                  variant="secondary"
                  onPress={() =>
                    router.push({
                      pathname: '/(user)/review' as never,
                      params: { bookingId: booking.id },
                    })
                  }
                />
              ) : null}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
