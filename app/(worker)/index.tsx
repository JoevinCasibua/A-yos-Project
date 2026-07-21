import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { IncomingJobAlert } from '@/components/IncomingJobAlert';
import { QuickActionsGrid } from '@/components/QuickActionsGrid';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
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
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + theme.spacing.sm }]}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={[theme.typography.body2, { color: 'rgba(255,255,255,0.8)' }]}>Good morning,</Text>
            <Text style={[theme.typography.h3, { color: theme.colors.surface }]}>{workerProfile.name.split(' ')[0]} 👋</Text>
          </View>
        </View>
        <View style={styles.headerTopRow}>
          <View style={styles.searchBar}>
            <Search color={theme.colors.textSecondary} size={20} style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search for everything"
              style={styles.searchInput}
              placeholderTextColor={theme.colors.textTertiary}
              editable={false}
            />
          </View>
          <Pressable style={styles.iconButton} onPress={() => router.push('/notifications')}>
            <Bell color={theme.colors.surface} size={24} />
            <View style={styles.badge} />
          </Pressable>
          <Pressable style={styles.avatarButton} onPress={() => router.push('/(worker)/profile')}>
            <Image
              source={workerProfile.avatarUri}
              style={styles.headerAvatar}
              contentFit="cover"
            />
          </Pressable>
        </View>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          {todayStats.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItemHeader}>
                <Text style={[theme.typography.h3, { color: theme.colors.surface }]}>{stat.value}</Text>
                <Text style={[theme.typography.caption, { color: 'rgba(255,255,255,0.7)' }]}>{stat.label}</Text>
              </View>
              {index < todayStats.length - 1 && <View style={styles.statDividerHeader} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
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
              onPress={() => router.push(`/(worker)/booking-request/${booking.id}`)}
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  topNav: { backgroundColor: '#1e3a8a', paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.md },
  greetingRow: { marginBottom: theme.spacing.md },
  headerTopRow: { flexDirection: 'row', alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.full, paddingHorizontal: theme.spacing.md, height: 44, marginRight: theme.spacing.sm },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.textPrimary },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.sm },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.error, borderWidth: 1, borderColor: '#1e3a8a' },
  avatarButton: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.surface },
  headerAvatar: { width: '100%', height: '100%' },
  content: { flex: 1, zIndex: 5 },
  contentContainer: { paddingBottom: theme.spacing.xxxl, paddingTop: theme.spacing.lg },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: theme.spacing.md, paddingBottom: theme.spacing.xs },
  statItemHeader: { alignItems: 'center', flex: 1 },
  statDividerHeader: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: { marginBottom: theme.spacing.xl, paddingHorizontal: theme.layout.screenPadding },
  bookingCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: theme.spacing.md, marginBottom: theme.spacing.md, ...theme.shadows.sm },
  bookingHeader: { flexDirection: 'row', alignItems: 'center' },
  bookingInfo: { flex: 1, marginLeft: theme.spacing.sm },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
});
