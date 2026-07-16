import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Bell, Clock, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, IconSize, AvatarSize, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import type { WorkerProfile } from '@/constants/workerData';
import { statusConfig, type WorkerBooking } from '@/constants/workerMockData';
import { fetchWorkerBookings, fetchWorkerProfile } from '@/services/api';

export default function WorkerDashboardScreen() {
  const [workerProfile,setWorkerProfile]=useState<WorkerProfile|null>(null);const [workerBookings,setWorkerBookings]=useState<WorkerBooking[]>([]);
  useEffect(()=>{void Promise.all([fetchWorkerProfile(),fetchWorkerBookings()]).then(([profile,bookings])=>{setWorkerProfile(profile.data);setWorkerBookings(bookings.data);});},[]);
  const activeBookings=useMemo(()=>workerBookings.filter(b=>b.status!=='completed'&&b.status!=='cancelled'),[workerBookings]);
  const todayStats=[{label:'Active Jobs',value:String(activeBookings.length),icon:Clock,color:Colors.cta,bg:Colors.primarySurface},{label:'Pending',value:String(workerBookings.filter(b=>b.status==='upcoming').length),icon:TrendingUp,color:Colors.warning,bg:Colors.warningBg},{label:'Completed',value:String(workerBookings.filter(b=>b.status==='completed').length),icon:CheckCircle2,color:Colors.success,bg:Colors.successBg},{label:'Cash Records',value:'Recorded',icon:DollarSign,color:Colors.info,bg:Colors.infoBg}];
  if(!workerProfile)return <View style={styles.container}/>;
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
        </View>

        {/* Today's Stats */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold">Today&apos;s Overview</AppText>
          <View style={styles.statsGrid}>
            {todayStats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                  <stat.icon size={IconSize.md} color={stat.color} strokeWidth={2} />
                </View>
                <AppText variant="h3" weight="bold" color={stat.color}>{stat.value}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{stat.label}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Active Bookings */}
        <View style={[styles.section, { paddingBottom: Spacing['8'] }]}>
          <AppText variant="h4" weight="bold">Active Bookings</AppText>
          {activeBookings.map((booking) => (
            <Pressable
              key={booking.id}
              style={({ pressed }) => [styles.bookingCard, { opacity: pressed ? 0.95 : 1 }]}
              onPress={() => router.push('/(worker)/bookings')}
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
  section: {
    marginTop: Spacing['6'],
    paddingHorizontal: Layout.screenPadding,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Spacing['3'],
    gap: Spacing['3'],
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    alignItems: 'center',
    gap: Spacing['2'],
    ...Elevation.sm,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
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
