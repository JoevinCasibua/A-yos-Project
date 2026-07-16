import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, IconSize, AvatarSize, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { IncomingJobAlert } from '@/components/IncomingJobAlert';
import { QuickActionsGrid } from '@/components/QuickActionsGrid';
import { workerProfile } from '@/constants/workerData';
import { workerBookings, workerJobs, statusConfig } from '@/constants/workerMockData';

const todayStats = [
  { label: 'Active', value: workerBookings.filter((b) => b.status === 'in_progress').length.toString() },
  { label: 'Pending', value: workerBookings.filter((b) => b.status === 'upcoming').length.toString() },
  { label: 'Completed', value: workerBookings.filter((b) => b.status === 'completed').length.toString() },
  { label: 'Earnings', value: '$180' },
];

const activeBookings = workerBookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
const incomingJob = workerJobs[0];

export default function WorkerDashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <AppText variant="caption" color={Colors.textSecondary}>
                Welcome back
              </AppText>
              <AppText variant="h3" weight="bold" style={{ marginTop: 2 }}>
                {workerProfile.name.split(' ')[0]}
              </AppText>
            </View>
            <Pressable style={styles.bell} hitSlop={12}>
              <Bell size={IconSize.lg} color={Colors.textPrimary} strokeWidth={2} />
              <View style={styles.bellDot} />
            </Pressable>
          </View>
          <View style={styles.statusRow}>
            <Badge label={workerProfile.category} variant="verified" size="md" />
            <Badge label={`${workerProfile.yearsExperience} yrs exp`} variant="neutral" size="md" />
          </View>

          {/* Stats inside header */}
          <View style={styles.statsRow}>
            {todayStats.map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <AppText variant="h4" weight="bold" color={Colors.textPrimary}>
                  {stat.value}
                </AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {stat.label}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Incoming Job Alert */}
        <View style={styles.section}>
          <IncomingJobAlert
            service={incomingJob.service}
            location={incomingJob.location}
            distance={incomingJob.distance}
            postedTime={incomingJob.postedTime}
            onMoreDetails={() => router.push(`/(worker)/booking-request/${incomingJob.id}`)}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold">Quick Actions</AppText>
          <View style={{ marginTop: Spacing['3'] }}>
            <QuickActionsGrid />
          </View>
        </View>

        {/* Active Bookings */}
        <View style={[styles.section, { paddingBottom: Spacing['8'] }]}>
          <AppText variant="h4" weight="bold">Active Bookings</AppText>
          {activeBookings.map((booking) => (
            <Pressable
              key={booking.id}
              style={({ pressed }) => [styles.bookingCard, { opacity: pressed ? 0.95 : 1 }]}
              onPress={() => router.push(`/(worker)/booking-request/${booking.id}`)}
            >
              <View style={styles.bookingHeader}>
                <Avatar uri={booking.customerAvatar} size={AvatarSize.small} />
                <View style={styles.bookingInfo}>
                  <AppText variant="body" weight="semiBold">{booking.customerName}</AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>{booking.service}</AppText>
                </View>
                <Badge label={statusConfig[booking.status].label} variant={statusConfig[booking.status].variant} />
              </View>
              <View style={styles.bookingMeta}>
                <AppText variant="caption" color={Colors.textTertiary}>{booking.time}</AppText>
                <AppText variant="caption" color={Colors.textTertiary}>·</AppText>
                <AppText variant="caption" color={Colors.textTertiary}>{booking.address}</AppText>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing['16'],
    paddingBottom: Spacing['5'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bell: {
    position: 'relative',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.full,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    marginTop: Spacing['3'],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing['4'],
    paddingTop: Spacing['4'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  section: {
    marginTop: Spacing['6'],
    paddingHorizontal: Layout.screenPadding,
  },
  bookingCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    marginTop: Spacing['3'],
    ...Elevation.sm,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  bookingInfo: { flex: 1 },
  bookingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    marginTop: Spacing['3'],
    paddingTop: Spacing['3'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
