import React from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { ArrowLeft, Flag, Calendar, Clock, MapPin, User, Banknote } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { getBackRoute } from '@/constants/backRoutes';
import { workerBookings } from '@/constants/workerMockData';

export default function ReportedBookingScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();

  const booking = workerBookings.find((b) => b.id === id);

  const handleBack = () => {
    const route = getBackRoute(from);
    route ? router.push(route) : router.back();
  };

  if (!booking) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack} hitSlop={12}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </Pressable>
          <AppText variant="h4" weight="bold" color={Colors.textPrimary}>
            Reported Booking
          </AppText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <AppText variant="body" color={Colors.textSecondary}>Booking not found.</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack} hitSlop={12}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold" color={Colors.textPrimary}>
          Reported Booking
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reported Banner */}
        <View style={styles.reportedBanner}>
          <View style={styles.bannerIcon}>
            <Flag size={24} color={Colors.error} />
          </View>
          <View style={styles.bannerText}>
            <AppText variant="body" weight="bold" color={Colors.error}>
              This booking has been reported
            </AppText>
            <AppText variant="caption" color={Colors.error}>
              {booking.reportedReason || 'No reason specified'}
            </AppText>
          </View>
        </View>

        {/* Booking Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Avatar uri={booking.customerAvatar} size={44} />
            <View style={styles.cardHeaderText}>
              <AppText variant="body" weight="bold">{booking.customerName}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>{booking.service}</AppText>
            </View>
            <Badge label={`#${booking.id.padStart(4, '0')}`} variant="neutral" size="sm" />
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Calendar size={14} color={Colors.textTertiary} />
            <AppText variant="body" color={Colors.textSecondary}>{booking.date}</AppText>
          </View>

          <View style={styles.infoRow}>
            <Clock size={14} color={Colors.textTertiary} />
            <AppText variant="body" color={Colors.textSecondary}>{booking.time}</AppText>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={14} color={Colors.textTertiary} />
            <AppText variant="body" color={Colors.textSecondary}>{booking.address}</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <User size={14} color={Colors.textTertiary} />
              <AppText variant="body" color={Colors.textSecondary}>Client</AppText>
            </View>
            <AppText variant="body" weight="semiBold">{booking.customerName}</AppText>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Banknote size={14} color={Colors.textTertiary} />
              <AppText variant="body" color={Colors.textSecondary}>Payment</AppText>
            </View>
            <AppText variant="body" weight="semiBold">
              {booking.paymentMethod === 'cash' ? 'Cash' : 'Online'} · {booking.price}
            </AppText>
          </View>

          {booking.duration && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Clock size={14} color={Colors.textTertiary} />
                <AppText variant="body" color={Colors.textSecondary}>Duration</AppText>
              </View>
              <AppText variant="body" weight="semiBold">{booking.duration}</AppText>
            </View>
          )}
        </View>

        {/* Report Details Card */}
        <View style={styles.card}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Report Details</AppText>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <AppText variant="body" color={Colors.textSecondary}>Reason</AppText>
            <AppText variant="body" weight="semiBold" color={Colors.error}>
              {booking.reportedReason || 'No reason specified'}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" color={Colors.textSecondary}>Reported</AppText>
            <AppText variant="body" weight="semiBold">Jul 13, 2024</AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" color={Colors.textSecondary}>Status</AppText>
            <Badge label="Under Review" variant="warning" size="sm" />
          </View>

          <View style={styles.divider} />

          <AppText variant="body" color={Colors.textSecondary} style={styles.statusText}>
            Our team is investigating this report. You will be notified once a resolution is reached.
          </AppText>
        </View>

        {/* View Full Report Link */}
        <Pressable
          style={({ pressed }) => [styles.viewReportLink, pressed && { opacity: 0.6 }]}
          onPress={() => Alert.alert('Coming Soon', 'Full report details will be available soon.')}
          hitSlop={12}
        >
          <AppText variant="button" weight="semiBold" color={Colors.cta}>
            View Full Report
          </AppText>
        </Pressable>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.screenPadding,
  },
  reportedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    borderWidth: 1,
    borderColor: Colors.error,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    gap: Spacing['1'],
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Layout.cardPadding,
    gap: Spacing['3'],
    ...Elevation.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  cardHeaderText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['1'],
  },
  sectionTitle: {
    marginBottom: Spacing['1'],
  },
  statusText: {
    lineHeight: 22,
  },
  viewReportLink: {
    alignSelf: 'center',
    paddingVertical: Spacing['2'],
  },
});
