import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';
import { ChevronLeft, MapPin, Clock, DollarSign, Calendar } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Layout, AvatarSize } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { ThreeDotMenu } from '@/components/ThreeDotMenu';
import { workerJobs, workerBookings } from '@/constants/workerMockData';

export default function BookingRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const job = workerJobs.find((j) => j.id === id) || workerJobs[0];
  const booking = workerBookings.find((b) => b.id === id) || workerBookings[0];

  const handleAccept = () => {
    Alert.alert(
      'Booking Accepted',
      `You have accepted the booking for ${job.service}.`,
      [{ text: 'OK' }]
    );
  };

  const handleReschedule = () => {
    Alert.alert(
      'Coming Soon',
      'Reschedule feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleReportUser = () => {
    Alert.alert(
      'Coming Soon',
      'Report user feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleCancelService = () => {
    router.push(`/(worker)/cancel-service/${job.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <ChevronLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold" color={Colors.textPrimary}>
          Booking Request
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Job Card */}
        <View style={styles.jobCard}>
          {/* Service Name + ThreeDotMenu */}
          <View style={styles.cardTopRow}>
            <AppText variant="h3" weight="bold" style={{ flex: 1 }}>
              {job.service}
            </AppText>
            <ThreeDotMenu
              onReportUser={handleReportUser}
              onCancelService={handleCancelService}
            />
          </View>

          {/* Booking ID */}
          <AppText variant="caption" color={Colors.textTertiary}>
            Booking #{job.id.padStart(4, '0')}
          </AppText>

          {/* Urgency Badge */}
          {job.urgency === 'urgent' && (
            <Badge label="URGENT" variant="error" size="md" />
          )}

          {/* Job Image */}
          {job.imageUrl && (
            <Image
              source={{ uri: job.imageUrl }}
              style={styles.jobImage}
              resizeMode="cover"
            />
          )}

          {/* Description */}
          <AppText variant="body" color={Colors.textSecondary} style={styles.description}>
            "{job.description}"
          </AppText>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Client */}
          <View style={styles.detailRow}>
            <AppText variant="label" color={Colors.textTertiary}>
              Client
            </AppText>
            <AppText variant="body" weight="semiBold">
              {job.customerName}
            </AppText>
          </View>

          {/* Location */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <MapPin size={14} color={Colors.textTertiary} />
              <AppText variant="label" color={Colors.textTertiary}>
                Location
              </AppText>
            </View>
            <AppText variant="body" weight="semiBold">
              {job.location}
            </AppText>
          </View>

          {/* Schedule */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Clock size={14} color={Colors.textTertiary} />
              <AppText variant="label" color={Colors.textTertiary}>
                Schedule
              </AppText>
            </View>
            <AppText variant="body" weight="semiBold">
              Today, Jul 10 · 2:00 PM
            </AppText>
          </View>

          {/* Est. Earnings */}
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <DollarSign size={14} color={Colors.textTertiary} />
              <AppText variant="label" color={Colors.textTertiary}>
                Est. Earnings
              </AppText>
            </View>
            <AppText variant="body" weight="semiBold" color={Colors.cta}>
              {job.offeredPrice}
            </AppText>
          </View>
        </View>

        {/* Client Summary Card */}
        <View style={styles.clientCard}>
          <View style={styles.clientHeader}>
            <Avatar uri={job.customerAvatar} size={AvatarSize.medium} />
            <View style={styles.clientInfo}>
              <AppText variant="body" weight="semiBold">
                {job.customerName}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                4 bookings · No cancellations
              </AppText>
            </View>
          </View>
          <Badge label="Good client" variant="success" size="sm" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <AppButton
            label="Accept Booking"
            variant="primary"
            leftIcon={<Calendar size={18} color={Colors.white} />}
            fullWidth
            onPress={handleAccept}
          />
          <AppButton
            label="Reschedule"
            variant="outline"
            leftIcon={<Calendar size={18} color={Colors.cta} />}
            fullWidth
            onPress={handleReschedule}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing['16'],
    paddingBottom: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing['10'],
    gap: Spacing['4'],
  },
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Layout.cardPadding,
    gap: Spacing['3'],
    ...Elevation.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  jobImage: {
    width: '100%',
    height: 180,
    borderRadius: Radius.lg,
  },
  description: {
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing['1'],
  },
  detailRow: {
    gap: Spacing['1'],
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['1'],
  },
  clientCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Layout.cardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Elevation.sm,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  clientInfo: {
    gap: Spacing['1'],
  },
  actions: {
    gap: Spacing['3'],
  },
});
