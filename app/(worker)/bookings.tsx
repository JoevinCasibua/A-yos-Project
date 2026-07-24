import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { CalendarDays, Clock, MapPin, Phone, CheckCircle2, XCircle, Receipt, Flag } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/layout/EmptyState';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { workerBookings, statusConfig } from '@/constants/workerMockData';
import { JobTimer } from '@/components/booking/JobTimer';
import { useWorkerBookingStore } from '@/store/useWorkerBookingStore';
import type { WorkerBooking } from '@/constants/workerMockData';

const BOOKING_TABS = ['Upcoming', 'In Progress', 'Pending', 'Completed', 'Cancelled', 'Reported'];

const TAB_FILTERS: Record<string, WorkerBooking['status'][]> = {
  'Upcoming': ['hired', 'accepted'],
  'In Progress': ['en_route', 'arrived', 'in_progress'],
  'Pending': ['pending_review'],
  'Completed': ['completed'],
  'Cancelled': ['cancelled'],
};

export default function WorkerBookingsScreen() {
  const { filter } = useLocalSearchParams<{ filter?: string }>();
  const [activeTab, setActiveTab] = useState(
    filter === 'Cancelled' ? 'Cancelled' : filter === 'Reported' ? 'Reported' : 'Upcoming',
  );
  const [bookings, setBookings] = useState<WorkerBooking[]>(workerBookings);
  const isCurrentlyWorking = useWorkerBookingStore((s) => s.isCurrentlyWorking);
  const elapsedSeconds = useWorkerBookingStore((s) => s.elapsedSeconds);
  const timerStart = useWorkerBookingStore((s) => s.timerStart);
  const tick = useWorkerBookingStore((s) => s.tick);

  useEffect(() => {
    if (!timerStart) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerStart, tick]);

  function formatTimer(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  const filteredBookings = useMemo(() => {
    if (activeTab === 'Reported') {
      return bookings.filter((b) => b.isReported === true);
    }
    const statuses = TAB_FILTERS[activeTab] || [];
    return bookings.filter((b) => statuses.includes(b.status));
  }, [activeTab, bookings]);

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
              onPress={() => router.push(activeTab === 'Reported' ? `/(worker)/reported-booking/${booking.id}?from=bookings-reported` : `/(worker)/booking-request/${booking.id}?from=bookings`)}
            >
              {/* ─── UPCOMING CARD ─── */}
              {activeTab === 'Upcoming' && (
                <View style={styles.bookingCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.customerRow}>
                      <Avatar uri={booking.customerAvatar} size={40} />
                      <View>
                        <Text style={theme.typography.h4}>{booking.customerName}</Text>
                        <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{booking.service}</Text>
                      </View>
                    </View>
                    <Badge
                      label={statusConfig[booking.status].label}
                      variant={(statusConfig[booking.status].variant as any) || 'info'}
                      size="sm"
                    />
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
                      <Text style={[theme.typography.caption, { color: booking.hasParts ? theme.colors.success : theme.colors.warning, fontWeight: '500' }]}>
                        {booking.hasParts ? 'Customer Has Parts' : 'Needs Parts'}
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>{booking.price}</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>Tap to view</Text>
                  </View>
                </View>
              )}

              {/* ─── IN PROGRESS CARD ─── */}
              {activeTab === 'In Progress' && (
                <View style={styles.bookingCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.customerRow}>
                      <Avatar uri={booking.customerAvatar} size={40} />
                      <View>
                        <Text style={theme.typography.h4}>{booking.customerName}</Text>
                        <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{booking.service}</Text>
                      </View>
                    </View>
                    <Badge
                      label={statusConfig[booking.status].label}
                      variant={(statusConfig[booking.status].variant as any) || 'warning'}
                      size="sm"
                    />
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

                  {booking.status === 'in_progress' && (
                    <View style={[styles.timerRow, { borderTopWidth: 1, borderTopColor: theme.colors.borderLight }]}>
                      {booking.pricingType === 'hourly' ? (
                        <JobTimer hourlyRate={booking.hourlyRate} />
                      ) : (
                        <JobTimer />
                      )}
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>{booking.price}</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>
                      {isCurrentlyWorking ? 'Working...' : 'Tap to view'}
                    </Text>
                  </View>
                </View>
              )}

              {/* ─── PENDING REVIEW CARD ─── */}
              {activeTab === 'Pending' && (
                <View style={styles.bookingCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.customerRow}>
                      <Avatar uri={booking.customerAvatar} size={40} />
                      <View>
                        <Text style={theme.typography.h4}>{booking.customerName}</Text>
                        <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{booking.service}</Text>
                      </View>
                    </View>
                    <Badge
                      label={statusConfig[booking.status].label}
                      variant={(statusConfig[booking.status].variant as any) || 'neutral'}
                      size="sm"
                    />
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

                  <View style={styles.cardFooter}>
                    <Text style={[theme.typography.caption, { color: theme.colors.warning }]}>Awaiting confirmation</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>Tap to view</Text>
                  </View>
                </View>
              )}

              {/* ─── COMPLETED CARD ─── */}
              {activeTab === 'Completed' && (
                <View style={[styles.bookingCard, styles.completedCard]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.customerRow}>
                      <CheckCircle2 size={20} color={theme.colors.success} />
                      <View>
                        <Text style={theme.typography.h4}>{booking.customerName}</Text>
                        <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{booking.service}</Text>
                      </View>
                    </View>
                    <Badge
                      label={statusConfig[booking.status].label}
                      variant={(statusConfig[booking.status].variant as any) || 'success'}
                      size="sm"
                    />
                  </View>

                  <View style={[styles.completedInfo, { borderTopWidth: 1, borderTopColor: theme.colors.borderLight }]}>
                    <View style={styles.completedRow}>
                      <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>Earnings</Text>
                      <Text style={[theme.typography.body1, { color: theme.colors.success, fontWeight: '700' }]}>{booking.price}</Text>
                    </View>
                    {booking.duration && (
                      <View style={styles.completedRow}>
                        <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>Duration</Text>
                        <Text style={[theme.typography.body1, { fontWeight: '600' }]}>{booking.duration}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>
                      {booking.status === 'pending_review' ? 'Awaiting confirmation' : 'Paid'}
                    </Text>
                    <TouchableOpacity
                      style={styles.primaryBtn}
                      onPress={() => router.push(`/(worker)/earnings-receipt?bookingId=${booking.id}&duration=${encodeURIComponent(booking.duration || '')}&earnings=${encodeURIComponent(booking.price)}&from=bookings`)}
                    >
                      <Receipt size={12} color={theme.colors.surface} />
                      <Text style={[theme.typography.caption, { color: theme.colors.surface, fontWeight: '600' }]}>Receipt</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ─── CANCELLED CARD ─── */}
              {activeTab === 'Cancelled' && (
                <View style={[styles.bookingCard, styles.cancelledCard]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.customerRow}>
                      {booking.cancelledBy === 'worker' ? (
                        <XCircle size={20} color={theme.colors.warning} />
                      ) : (
                        <XCircle size={20} color={theme.colors.error} />
                      )}
                      <View>
                        <Text style={[theme.typography.h4, { color: theme.colors.textTertiary }]}>{booking.customerName}</Text>
                        <Text style={[theme.typography.body2, { color: theme.colors.textTertiary }]}>{booking.service}</Text>
                      </View>
                    </View>
                    <Badge
                      label={statusConfig[booking.status].label}
                      variant={(statusConfig[booking.status].variant as any) || 'error'}
                      size="sm"
                    />
                  </View>

                  <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                      <CalendarDays color={theme.colors.textTertiary} size={16} />
                      <Text style={[theme.typography.caption, styles.detailText, { color: theme.colors.textTertiary }]}>{booking.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Clock color={theme.colors.textTertiary} size={16} />
                      <Text style={[theme.typography.caption, styles.detailText, { color: theme.colors.textTertiary }]}>{booking.time}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin color={theme.colors.textTertiary} size={16} />
                      <Text style={[theme.typography.caption, styles.detailText, { color: theme.colors.textTertiary }]}>{booking.address}</Text>
                    </View>
                  </View>

                  {booking.cancelledReason && (
                    <View style={[styles.cancelledReason, { borderTopWidth: 1, borderTopColor: theme.colors.borderLight }]}>
                      <Text style={[theme.typography.caption, { color: booking.cancelledBy === 'worker' ? theme.colors.warning : theme.colors.error, fontStyle: 'italic' }]}>
                        {booking.cancelledBy === 'worker' ? `You cancelled: ${booking.cancelledReason}` : booking.cancelledReason}
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={[theme.typography.h4, { color: theme.colors.textTertiary }]}>{booking.price}</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>Tap to view</Text>
                  </View>
                </View>
              )}

              {/* ─── REPORTED CARD ─── */}
              {activeTab === 'Reported' && (
                <View style={[styles.bookingCard, styles.reportedCard]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.customerRow}>
                      <Flag size={20} color={theme.colors.error} />
                      <View>
                        <Text style={theme.typography.h4}>{booking.customerName}</Text>
                        <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{booking.service}</Text>
                      </View>
                    </View>
                    <Badge
                      label="Reported"
                      variant="error"
                      size="sm"
                    />
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

                  {booking.reportedReason && (
                    <View style={[styles.reportedReason, { borderTopWidth: 1, borderTopColor: theme.colors.borderLight }]}>
                      <Text style={[theme.typography.caption, { color: theme.colors.error, fontStyle: 'italic' }]}>
                        {booking.reportedReason}
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>{booking.price}</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>Tap to view</Text>
                  </View>
                </View>
              )}
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
  tabButton: {
    paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabButtonActive: { borderBottomColor: theme.colors.primary },
  content: { flex: 1 },
  contentInner: {
    paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  bookingCard: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg,
    padding: theme.spacing.lg, marginBottom: theme.spacing.md, ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flex: 1 },
  cardDetails: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.sm,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: theme.colors.textSecondary, marginLeft: 4 },
  partsRow: { paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm },
  cardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: theme.colors.borderLight,
    paddingTop: theme.spacing.md, marginTop: theme.spacing.md,
  },
  actionRow: { flexDirection: 'row', gap: theme.spacing.sm },
  primaryBtn: {
    backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm, borderRadius: theme.radius.lg,
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs,
  },
  timerRow: {
    alignItems: 'center', gap: theme.spacing.xs,
    paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm,
  },
  completedCard: {
    borderLeftWidth: 3, borderLeftColor: theme.colors.success,
  },
  completedInfo: {
    paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm, gap: theme.spacing.xs,
  },
  completedRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cancelledCard: {
    opacity: 0.6, backgroundColor: '#F8F8F8',
  },
  cancelledReason: {
    paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm,
  },
  reportedCard: {
    borderLeftWidth: 3, borderLeftColor: theme.colors.error,
  },
  reportedReason: {
    paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm,
  },
});
