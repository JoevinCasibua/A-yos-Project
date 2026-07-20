import { useCallback, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { DataState, EmptyState, FeatureCard, Heading, Screen, StatusBadge } from '@/components';
import { listNotifications, markNotificationRead, subscribeToNotifications } from '@/repository';
import { useSession } from '@/session';
import { useAsyncData } from '@/useAsyncData';

export default function AlertsPage() {
  const { account } = useSession();
  const load = useCallback(() => listNotifications(), []);
  const { data = [], error, loading, refresh } = useAsyncData(load);
  useEffect(() => {
    if (!account) return;
    return subscribeToNotifications(account.id, () => void refresh());
  }, [account, refresh]);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 30 }}>
        <Heading
          eyebrow="Alerts"
          title="Updates and notifications"
          body="Booking, payment, message, promotion, and system notices from the platform."
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data.length ? (
          <EmptyState title="No alerts" body="New notifications will appear after delivery." />
        ) : null}
        {data.map((notification) => (
          <FeatureCard
            key={notification.id}
            icon={notification.read_at ? '✓' : '🔔'}
            title={notification.title}
            body={`${notification.body}\n${new Date(notification.created_at).toLocaleString()}`}
            onPress={
              notification.read_at
                ? undefined
                : () => void markNotificationRead(notification.id).then(refresh)
            }
          />
        ))}
        {data.some((item) => !item.read_at) ? (
          <StatusBadge label="Tap an unread alert to mark it read" />
        ) : null}
      </ScrollView>
    </Screen>
  );
}
