import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { Bell, Search, ChevronRight, Briefcase } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { IncomingJobAlert } from '@/components/IncomingJobAlert';
import { QuickActionsGrid } from '@/components/QuickActionsGrid';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { workerProfile } from '@/constants/workerData';
import { workerBookings, workerJobs, statusConfig, walletPerformance } from '@/constants/workerMockData';
import { useWorkerBookingStore } from '@/store/useWorkerBookingStore';

const todayStats = [
  { label: 'Active', value: workerBookings.filter((b) => b.status === 'in_progress' || b.status === 'en_route').length.toString() },
  { label: 'Pending', value: workerBookings.filter((b) => b.status === 'hired' || b.status === 'accepted').length.toString() },
  { label: 'Completed', value: workerBookings.filter((b) => b.status === 'completed').length.toString() },
  { label: 'Earnings', value: '$180' },
];

const activeBookings = workerBookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled' && b.status !== 'pending_review');
const incomingJob = workerJobs[0];

export default function WorkerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const isCurrentlyWorking = useWorkerBookingStore((s) => s.isCurrentlyWorking);
  const currentBookingId = useWorkerBookingStore((s) => s.currentBookingId);

  return (
    <View style={styles.container}>
      {isCurrentlyWorking && (
        <Pressable
          style={[styles.workingBanner, { paddingTop: insets.top + theme.spacing.sm }]}
          onPress={() => router.push(`/(worker)/booking-request/${currentBookingId}?from=dashboard`)}
        >
          <Briefcase size={16} color={theme.colors.surface} />
          <Text style={[theme.typography.caption, { color: theme.colors.surface, fontWeight: '600' }]}>
            You are currently working on a job — Tap to view
          </Text>
        </Pressable>
      )}
      <View style={[styles.topNav, { paddingTop: (isCurrentlyWorking ? 0 : insets.top) + theme.spacing.sm }]}>
        <View style={styles.headerTopRow}>
          <Pressable style={styles.avatarButton} onPress={() => router.push('/(worker)/profile')}>
            <Image
              source={workerProfile.avatarUri}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          </Pressable>
          <Pressable style={styles.searchBar} onPress={() => router.push('/(worker)/universal-search?from=dashboard')}>
            <Search color={theme.colors.textSecondary} size={20} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search for everything"
              style={styles.searchInput}
              placeholderTextColor={theme.colors.textTertiary}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => router.push('/notifications')}>
            <Bell color={theme.colors.surface} size={24} />
            <View style={styles.badge} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {/* Today Stats */}
        <View style={styles.section}>
          <View style={styles.statsCard}>
            {todayStats.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <View style={styles.statItem}>
                  <Text style={theme.typography.h3}>{stat.value}</Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
                </View>
                {index < todayStats.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
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
            onAccept={() => {
              Alert.alert(
                'Accept Booking',
                'Are you sure you want to accept this booking request?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Accept', onPress: () => router.push(`/(worker)/booking-request/${incomingJob.id}?autoAccept=true&from=dashboard`) },
                ]
              );
            }}
            onMoreDetails={() => router.push(`/(worker)/booking-request/${incomingJob.id}?from=dashboard`)}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[theme.typography.h4, { marginBottom: theme.spacing.md }]}>Quick Actions</Text>
          <QuickActionsGrid />
        </View>

        {/* Active Bookings */}
        <View style={styles.section}>
          <Text style={[theme.typography.h4, { marginBottom: theme.spacing.md }]}>Active Bookings</Text>
          {activeBookings.map((booking) => (
            <Pressable
              key={booking.id}
              style={({ pressed }) => [styles.bookingCard, { opacity: pressed ? 0.95 : 1 }]}
              onPress={() => router.push(`/(worker)/booking-request/${booking.id}?from=dashboard`)}
            >
              <View style={styles.bookingHeader}>
                <Avatar uri={booking.customerAvatar} size={40} />
                <View style={styles.bookingInfo}>
                  <Text style={theme.typography.body1}>{booking.customerName}</Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{booking.service}</Text>
                </View>
                <Badge label={statusConfig[booking.status].label} variant={statusConfig[booking.status].variant} />
              </View>
              <View style={styles.bookingMeta}>
                <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>{booking.time}</Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>·</Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>{booking.address}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable style={styles.seeAllBtn} onPress={() => router.push('/(worker)/bookings')}>
            <Text style={[theme.typography.button, { color: theme.colors.primary }]}>See All Bookings</Text>
            <ChevronRight size={18} color={theme.colors.primary} />
          </Pressable>
        </View>

        {/* Worker Profile Card */}
        <View style={styles.section}>
          <View style={styles.perfCard}>
            <View style={styles.perfHeader}>
              <View style={styles.perfAvatar}>
                <Text style={[theme.typography.h4, { color: theme.colors.surface }]}>CM</Text>
              </View>
              <View style={styles.perfInfo}>
                <Text style={theme.typography.h4}>Carlos Mendez</Text>
                <Badge label="TOP WORKER" variant="warning" size="sm" />
              </View>
            </View>
            <View style={styles.perfStats}>
              {[
                { label: 'Completion Rate', val: walletPerformance.completionRate, color: theme.colors.success },
                { label: 'On-Time Arrival', val: walletPerformance.onTimeArrival, color: theme.colors.info },
                { label: 'Repeat Clients', val: walletPerformance.repeatClients, color: theme.colors.warning },
              ].map((s) => (
                <View key={s.label} style={styles.perfRow}>
                  <View style={styles.perfRowTop}>
                    <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{s.label}</Text>
                    <Text style={[theme.typography.caption, { fontWeight: '600', color: s.color }]}>{s.val}%</Text>
                  </View>
                  <View style={styles.perfTrack}>
                    <View style={[styles.perfFill, { width: `${s.val}%`, backgroundColor: s.color }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  topNav: { backgroundColor: '#1e3a8a', paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.md },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.full, paddingHorizontal: theme.spacing.md, height: 44 },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.textPrimary },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.error, borderWidth: 1, borderColor: '#1e3a8a' },
  avatarButton: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.surface },
  headerAvatar: { width: '100%', height: '100%' },
  content: { flex: 1, zIndex: 5 },
  contentContainer: { paddingBottom: theme.spacing.xxxl, paddingTop: theme.spacing.lg },
  statsCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: theme.spacing.md, ...theme.shadows.sm },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, height: 28, backgroundColor: theme.colors.borderLight },
  section: { marginBottom: theme.spacing.xl, paddingHorizontal: theme.layout.screenPadding },
  bookingCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: theme.spacing.md, marginBottom: theme.spacing.md, ...theme.shadows.sm },
  bookingHeader: { flexDirection: 'row', alignItems: 'center' },
  bookingInfo: { flex: 1, marginLeft: theme.spacing.sm },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.lg, backgroundColor: theme.colors.surface },
  perfCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: theme.spacing.lg, ...theme.shadows.sm },
  perfHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  perfAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.info, alignItems: 'center', justifyContent: 'center' },
  perfInfo: { flex: 1, gap: 2 },
  perfStats: { gap: theme.spacing.md },
  perfRow: { gap: theme.spacing.xs },
  perfRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  perfTrack: { height: 6, backgroundColor: theme.colors.borderLight, borderRadius: theme.radius.full, overflow: 'hidden' },
  perfFill: { height: '100%', borderRadius: theme.radius.full },
  workingBanner: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});
