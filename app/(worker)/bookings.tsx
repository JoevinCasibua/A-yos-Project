import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Pressable, Alert } from 'react-native';
import { CalendarDays, Clock, MapPin, Phone, Wrench } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Chip } from '@/components/Chip';
import { ScreenHeader } from '@/components/ScreenHeader';
import { statusConfig } from '@/constants/workerMockData';
import type { WorkerBooking } from '@/constants/workerMockData';
import { completeJob, fetchWorkerBookings, startJob } from '@/services/api';

const filterTabs = ['Upcoming', 'In Progress', 'Completed', 'Cancelled'];

export default function WorkerBookingsScreen() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState<WorkerBooking[]>([]);
  const load=useCallback(async()=>{const result=await fetchWorkerBookings();setBookings(result.data);},[]);
  useEffect(()=>{void load();},[load]);

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
        onPress: async () => { const result=await startJob(bookingId); if(result.error) Alert.alert('Unable to start job',result.error.message); else void load(); },
      },
    ]);
  }, [load]);

  const handleCompleteJob = useCallback((bookingId: string) => {
    Alert.alert('Complete Job', 'Mark this job as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: async () => { const result=await completeJob(bookingId); if(result.error) Alert.alert('Unable to complete job',result.error.message); else void load(); },
      },
    ]);
  }, [load]);

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
          {item.hasParts !== undefined && (
            <View style={styles.detailRow}>
              <Wrench size={14} color={item.hasParts ? Colors.success : Colors.warning} />
              <AppText variant="caption" style={{ color: item.hasParts ? Colors.success : Colors.warning }}>
                {item.hasParts ? 'Customer Has Parts' : 'Needs Parts'}
              </AppText>
            </View>
          )}
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
      <ScreenHeader title="My Bookings" />
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
