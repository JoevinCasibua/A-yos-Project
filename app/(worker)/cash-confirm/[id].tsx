import React, { useState } from 'react';
import { View, StyleSheet, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Banknote, CheckCircle2, Clock, MapPin, Flag } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Badge } from '@/components/Badge';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { workerBookings } from '@/constants/workerMockData';

export default function CashConfirmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [confirmed, setConfirmed] = useState(false);

  const booking = workerBookings.find((b) => b.id === id);

  const handleReportPayment = () => {
    router.push(`/(worker)/report-payment/${id}`);
  };

  if (!booking) {
    return (
      <Screen safeArea header={<PageHeader title="Cash Payment" />}>
        <View style={styles.centered}>
          <AppText variant="body" color={Colors.textSecondary}>Booking not found.</AppText>
        </View>
      </Screen>
    );
  }

  const handleConfirmPayment = () => {
    Alert.alert(
      'Confirm Cash Payment',
      `I confirm that I have received ${booking.price} in cash from ${booking.customerName}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setConfirmed(true);
            setTimeout(() => {
              router.replace(
                `/(worker)/earnings-receipt?bookingId=${booking.id}&duration=${encodeURIComponent(booking.duration || '1h 15m')}&earnings=${encodeURIComponent(booking.price)}&from=cash-confirm/${booking.id}&type=earning`
              );
            }, 1500);
          },
        },
      ]
    );
  };

  if (confirmed) {
    return (
      <Screen safeArea header={<PageHeader title="Cash Payment" />}>
        <View style={styles.centered}>
          <View style={styles.successIcon}>
            <CheckCircle2 size={64} color={Colors.success} />
          </View>
          <AppText variant="h3" weight="bold" color={Colors.success}>Payment Confirmed</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
            Cash payment of {booking.price} has been recorded.
          </AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea scrollable header={<PageHeader title="Cash Payment" />}>
      <View style={styles.container}>
        {/* Payment Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountIcon}>
            <Banknote size={32} color={Colors.warning} />
          </View>
          <AppText variant="caption" color={Colors.textSecondary}>Amount to Collect</AppText>
          <AppText variant="h1" weight="bold">{booking.price}</AppText>
          <Badge label="Cash Payment" variant="warning" size="sm" />
        </View>

        {/* Booking Details Card */}
        <View style={styles.detailsCard}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Booking Details</AppText>

          <View style={styles.detailRow}>
            <AppText variant="body" color={Colors.textSecondary}>Service</AppText>
            <AppText variant="body" weight="semiBold">{booking.service}</AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" color={Colors.textSecondary}>Customer</AppText>
            <AppText variant="body" weight="semiBold">{booking.customerName}</AppText>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <MapPin size={14} color={Colors.textSecondary} />
              <AppText variant="body" color={Colors.textSecondary}>Address</AppText>
            </View>
            <AppText variant="body" weight="semiBold" style={{ textAlign: 'right', flex: 1 }}>
              {booking.address}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" color={Colors.textSecondary}>Date & Time</AppText>
            <AppText variant="body" weight="semiBold">{booking.date}, {booking.time}</AppText>
          </View>

          {booking.duration && (
            <View style={styles.detailRow}>
              <View style={styles.detailLabel}>
                <Clock size={14} color={Colors.textSecondary} />
                <AppText variant="body" color={Colors.textSecondary}>Duration</AppText>
              </View>
              <AppText variant="body" weight="semiBold">{booking.duration}</AppText>
            </View>
          )}
        </View>

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Before You Confirm</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.instructionText}>
            1. Collect {booking.price} in cash from {booking.customerName}.
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.instructionText}>
            2. Verify the correct amount before confirming.
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={styles.instructionText}>
            3. Once confirmed, this transaction will be recorded as completed.
          </AppText>
        </View>

        {/* Report Payment Issue Button */}
        <Pressable
          style={({ pressed }) => [
            styles.reportButton,
            pressed && styles.reportButtonPressed,
          ]}
          onPress={handleReportPayment}
        >
          <Flag size={18} color={Colors.error} />
          <AppText variant="button" weight="semiBold" color={Colors.error}>
            Report Payment Issue
          </AppText>
        </Pressable>

        {/* Confirm Button */}
        <AppButton
          label={`Confirm Receipt of ${booking.price}`}
          variant="primary"
          leftIcon={<CheckCircle2 size={18} color={Colors.white} />}
          fullWidth
          onPress={handleConfirmPayment}
        />

        <AppButton
          label="Cancel"
          variant="ghost"
          fullWidth
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing['4'],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing['3'],
    padding: Layout.screenPadding,
  },
  successIcon: {
    marginBottom: Spacing['2'],
  },
  amountCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['6'],
    alignItems: 'center',
    gap: Spacing['2'],
    ...Elevation.sm,
  },
  amountIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['1'],
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Layout.cardPadding,
    gap: Spacing['3'],
    ...Elevation.sm,
  },
  instructionsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Layout.cardPadding,
    gap: Spacing['2'],
    ...Elevation.sm,
  },
  sectionTitle: {
    marginBottom: Spacing['1'],
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
  instructionText: {
    lineHeight: 22,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2'],
    height: 44,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.error,
    backgroundColor: Colors.white,
  },
  reportButtonPressed: {
    opacity: 0.6,
  },
});
