import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Alert } from 'react-native';
import { CalendarDays, Clock, MapPin, Phone, Wrench } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/layout/EmptyState';
import { Avatar } from '@/components/Avatar';
import { workerBookings, statusConfig } from '@/constants/workerMockData';
import type { WorkerBooking } from '@/constants/workerMockData';

const variantColors: Record<string, { bg: string; color: string }> = {
  info: { bg: theme.colors.infoBackground, color: theme.colors.info },
  warning: { bg: theme.colors.warningBackground, color: theme.colors.warning },
  success: { bg: theme.colors.successBackground, color: theme.colors.success },
  error: { bg: theme.colors.errorBackground, color: theme.colors.error },
};

const BOOKING_TABS = ['Upcoming', 'In Progress', 'Completed', 'Cancelled'];

export default function WorkerBookingsScreen() {
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [activeTab, setActiveTab] = useState(
    filter === 'Cancelled' ? 'Cancelled' : 'Upcoming',
  );
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

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>My Bookings</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {BOOKING_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[theme.typography.button, { color: activeTab === tab ? theme.colors.primary : theme.colors.textSecondary }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={`No ${activeTab} Bookings`}
            description={`You don't have any ${activeTab.toLowerCase()} bookings at the moment.`}
          />
        ) : (
          filteredBookings.map(booking => (
            <Pressable
              key={booking.id}
              style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
              onPress={() => router.push(`/(worker)/booking-request/${booking.id}`)}
            >
              <View style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.customerRow}>
                    <Avatar uri={booking.customerAvatar} size={40} />
                    <View>
                      <Text style={theme.typography.h4}>{booking.customerName}</Text>
                      <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{booking.service}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: variantColors[statusConfig[booking.status].variant].bg }]}>
                    <Text style={[theme.typography.caption, { color: variantColors[statusConfig[booking.status].variant].color, fontWeight: '600' }]}>
                      {statusConfig[booking.status].label}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <CalendarDays color={theme.colors.textTertiary} size={16} />
                    <Text style={[theme.typography.caption, styles.detailText]}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock color={theme.colors.textTertiary} size={16} />
                    <Text style={[theme.typography.caption, styles.detailText]}>{booking.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin color={theme.colors.textTertiary} size={16} />
                    <Text style={[theme.typography.caption, styles.detailText]}>{booking.address}</Text>
                  </View>
                </View>

                {booking.hasParts !== undefined && (
                  <View style={[styles.partsRow, { borderTopWidth: 1, borderTopColor: theme.colors.borderLight }]}>
                    <Wrench size={14} color={booking.hasParts ? theme.colors.success : theme.colors.warning} />
                    <Text style={[theme.typography.caption, { color: booking.hasParts ? theme.colors.success : theme.colors.warning, fontWeight: '500' }]}>
                      {booking.hasParts ? 'Customer Has Parts' : 'Needs Parts'}
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>{booking.price}</Text>
                  <View style={styles.actionRow}>
                    {booking.status === 'upcoming' && (
                      <>
                        <TouchableOpacity style={styles.contactBtn}>
                          <Phone size={16} color={theme.colors.primary} />
                          <Text style={[theme.typography.caption, { color: theme.colors.primary, fontWeight: '600' }]}>Contact</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => handleStartJob(booking.id)}>
                          <Text style={[theme.typography.caption, { color: theme.colors.surface, fontWeight: '600' }]}>Start Job</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {booking.status === 'in_progress' && (
                      <TouchableOpacity style={styles.primaryBtn} onPress={() => handleCompleteJob(booking.id)}>
                        <Text style={[theme.typography.caption, { color: theme.colors.surface, fontWeight: '600' }]}>Complete</Text>
                      </TouchableOpacity>
                    )}
                    {booking.status === 'completed' && (
                      <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>Paid · {booking.price}</Text>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  tabsContainer: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tabsScroll: { paddingHorizontal: theme.layout.screenPadding },
  tabButton: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, marginRight: theme.spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabButtonActive: { borderBottomColor: theme.colors.primary },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.xxxl },
  bookingCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, ...theme.shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.md },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flex: 1 },
  statusBadge: { paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xxs, borderRadius: theme.radius.md, marginLeft: theme.spacing.sm },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: theme.colors.textSecondary, marginLeft: 4 },
  partsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.md, marginTop: theme.spacing.md },
  actionRow: { flexDirection: 'row', gap: theme.spacing.sm },
  contactBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1.5, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.lg },
  primaryBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.lg },
});
