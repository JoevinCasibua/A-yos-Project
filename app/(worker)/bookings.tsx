import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Pressable } from 'react-native';
import { CalendarDays, Clock, MapPin, Phone } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Chip } from '@/components/Chip';

interface WorkerBooking {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  date: string;
  time: string;
  address: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  price: string;
}

const mockWorkerBookings: WorkerBooking[] = [
  {
    id: '1',
    customerName: 'Alex Johnson',
    customerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Pipe Repair',
    date: 'Today, Jul 14',
    time: '2:00 PM',
    address: '123 Oak Street',
    status: 'upcoming',
    price: '$60',
  },
  {
    id: '2',
    customerName: 'Sarah Williams',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Drain Cleaning',
    date: 'Today, Jul 14',
    time: '4:30 PM',
    address: '456 Pine Avenue',
    status: 'in_progress',
    price: '$75',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Water Heater Install',
    date: 'Tomorrow, Jul 15',
    time: '9:00 AM',
    address: '789 Elm Drive',
    status: 'upcoming',
    price: '$450',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Faucet Replacement',
    date: 'Jul 12, 2024',
    time: '11:00 AM',
    address: '321 Maple Court',
    status: 'completed',
    price: '$85',
  },
  {
    id: '5',
    customerName: 'Robert Wilson',
    customerAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Emergency Pipe Repair',
    date: 'Jul 10, 2024',
    time: '3:00 PM',
    address: '654 Cedar Lane',
    status: 'completed',
    price: '$60',
  },
];

const filterTabs = ['Upcoming', 'In Progress', 'Completed', 'Cancelled'];

const statusConfig = {
  upcoming: { label: 'Upcoming', variant: 'info' as const },
  in_progress: { label: 'In Progress', variant: 'warning' as const },
  completed: { label: 'Completed', variant: 'success' as const },
  cancelled: { label: 'Cancelled', variant: 'error' as const },
};

export default function WorkerBookingsScreen() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const filteredBookings = useMemo(() => {
    const statusMap: Record<string, WorkerBooking['status']> = {
      'Upcoming': 'upcoming',
      'In Progress': 'in_progress',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
    };
    return mockWorkerBookings.filter((b) => b.status === statusMap[activeTab]);
  }, [activeTab]);

  const renderItem: ListRenderItem<WorkerBooking> = useCallback(
    ({ item }) => (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Avatar uri={item.customerAvatar} size={44} />
          <View style={styles.bookingInfo}>
            <AppText variant="body" weight="semiBold">{item.customerName}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{item.service}</AppText>
          </View>
          <Badge label={statusConfig[item.status].label} variant={statusConfig[item.status].variant} />
        </View>
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <CalendarDays size={14} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary}>{item.date}</AppText>
          </View>
          <View style={styles.detailRow}>
            <Clock size={14} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary}>{item.time}</AppText>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={14} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary}>{item.address}</AppText>
          </View>
        </View>
        <View style={styles.bookingFooter}>
          <AppText variant="body" weight="bold" color={Colors.cta}>{item.price}</AppText>
          <View style={styles.actionRow}>
            {item.status === 'upcoming' && (
              <>
                <Pressable style={({ pressed }) => [styles.actionBtn, styles.messageBtn, { opacity: pressed ? 0.8 : 1 }]}>
                  <Phone size={16} color={Colors.cta} />
                  <AppText variant="caption" weight="semiBold" color={Colors.cta}>Contact</AppText>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.actionBtn, styles.primaryBtn, { opacity: pressed ? 0.8 : 1 }]}>
                  <AppText variant="caption" weight="semiBold" color={Colors.white}>Start Job</AppText>
                </Pressable>
              </>
            )}
            {item.status === 'in_progress' && (
              <Pressable style={({ pressed }) => [styles.actionBtn, styles.primaryBtn, { opacity: pressed ? 0.8 : 1 }]}>
                <AppText variant="caption" weight="semiBold" color={Colors.white}>Complete</AppText>
              </Pressable>
            )}
            {item.status === 'completed' && (
              <AppText variant="caption" color={Colors.textTertiary}>Paid · {item.price}</AppText>
            )}
          </View>
        </View>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: WorkerBooking) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h2" weight="bold">My Bookings</AppText>
      </View>
      <FlatList
        data={filteredBookings}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing['3'] }} />}
        ListHeaderComponent={
          <View style={styles.tabRow}>
            {filterTabs.map((tab) => (
              <Chip
                key={tab}
                label={tab}
                selected={activeTab === tab}
                onPress={() => setActiveTab(tab)}
                size="sm"
              />
            ))}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText variant="body" color={Colors.textSecondary} align="center">
              No {activeTab.toLowerCase()} bookings
            </AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white, paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['16'], paddingBottom: Spacing['3'],
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tabRow: { flexDirection: 'row', gap: Spacing['2'], marginTop: Spacing['3'], marginBottom: Spacing['3'] },
  listContent: { padding: Spacing['4'], paddingBottom: 100 },
  bookingCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    ...Elevation.sm,
  },
  bookingHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing['3'] },
  bookingInfo: { flex: 1 },
  bookingDetails: {
    marginTop: Spacing['3'], paddingTop: Spacing['3'],
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
    gap: Spacing['2'],
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] },
  bookingFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing['3'], paddingTop: Spacing['3'],
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  actionRow: { flexDirection: 'row', gap: Spacing['2'] },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing['3'], paddingVertical: Spacing['2'],
    borderRadius: Radius.lg,
  },
  messageBtn: { borderWidth: 1.5, borderColor: Colors.primaryBorder },
  primaryBtn: { backgroundColor: Colors.cta },
  emptyState: { paddingVertical: Spacing['10'], alignItems: 'center' },
});
