import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Pressable, Alert } from 'react-native';
import { CalendarDays, Clock, MapPin, Phone } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Chip } from '@/components/Chip';
import { workerBookings, statusConfig } from '@/constants/workerMockData';
import type { WorkerBooking } from '@/constants/workerMockData';

const filterTabs = ['Upcoming', 'In Progress', 'Completed', 'Cancelled'];

export default function WorkerBookingsScreen() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState<WorkerBooking[]>(workerBookings);

  const filteredBookings = useMemo(() => {
    const statusMap: Record<string, WorkerBooking['status']> = {
      'Upcoming': 'upcoming',
      'In Progress': 'in_progress',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
    };
    return bookings.filter((b) => b.status === statusMap[activeTab]);
  }, [activeTab, bookings]);

  const handleStartJob = useCallback((bookingId: string) => {
    Alert.alert('Start Job', 'Mark this job as in progress?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start',
        onPress: () => setBookings((prev) =>
          prev.map((b) => b.id === bookingId ? { ...b, status: 'in_progress' as const } : b),
        ),
      },
    ]);
  }, []);

  const handleCompleteJob = useCallback((bookingId: string) => {
    Alert.alert('Complete Job', 'Mark this job as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: () => setBookings((prev) =>
          prev.map((b) => b.id === bookingId ? { ...b, status: 'completed' as const } : b),
        ),
      },
    ]);
  }, []);

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
                <Pressable
                  style={({ pressed }) => [styles.actionBtn, styles.primaryBtn, { opacity: pressed ? 0.8 : 1 }]}
                  onPress={() => handleStartJob(item.id)}
                >
                  <AppText variant="caption" weight="semiBold" color={Colors.white}>Start Job</AppText>
                </Pressable>
              </>
            )}
            {item.status === 'in_progress' && (
              <Pressable
                style={({ pressed }) => [styles.actionBtn, styles.primaryBtn, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => handleCompleteJob(item.id)}
              >
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
    [handleStartJob, handleCompleteJob],
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
