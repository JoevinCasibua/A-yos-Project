import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/layout/EmptyState';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Booking Confirmed', message: 'Mario Rossi has confirmed your plumbing request.', time: '10 mins ago', unread: true },
  { id: '2', title: 'Payment Successful', message: 'Your payment of ₱1,250 has been received.', time: '2 hours ago', unread: false },
  { id: '3', title: 'Promo Alert', message: 'Get 20% off on all electrical repairs this weekend!', time: '1 day ago', unread: false },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen safeArea>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <EmptyState 
            icon={Bell} 
            title="No Notifications Yet" 
            description="You don't have any notifications at the moment." 
          />
        ) : (
          MOCK_NOTIFICATIONS.map((notif, index) => (
            <View key={notif.id} style={[styles.notificationCard, index !== MOCK_NOTIFICATIONS.length - 1 && styles.borderBottom, notif.unread && styles.unreadBackground]}>
              <View style={styles.iconContainer}>
                <Bell color={theme.colors.primary} size={20} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[theme.typography.body1, { fontWeight: notif.unread ? '700' : '500' }]}>{notif.title}</Text>
                <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: 4 }]}>{notif.message}</Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginTop: 8 }]}>{notif.time}</Text>
              </View>
              {notif.unread && <View style={styles.unreadDot} />}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1 },
  notificationCard: { flexDirection: 'row', padding: theme.spacing.lg },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  unreadBackground: { backgroundColor: `${theme.colors.primary}05` },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${theme.colors.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  textContainer: { flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, marginLeft: theme.spacing.sm, marginTop: theme.spacing.xs },
});
