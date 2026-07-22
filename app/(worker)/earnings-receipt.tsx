import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Download, Share2 } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';

export default function EarningsReceiptScreen() {
  const params = useLocalSearchParams<{ bookingId?: string; duration?: string; earnings?: string; from?: string }>();

  const bookingId = params.bookingId || '0042';
  const duration = params.duration || '2h 45m';
  const earnings = params.earnings || '₱1,350.00';
  const serviceType = 'Plumbing Repair';
  const customerName = 'Alex Johnson';
  const address = '123 Sampaguita St., Quezon City';
  const date = 'July 22, 2026';
  const time = '2:00 PM - 4:45 PM';
  const baseAmount = '₱1,500.00';
  const platformFee = '₱150.00';
  const netEarnings = earnings;
  const paymentMethod = 'GCash (Escrow)';
  const transactionId = `TXN-2026-${bookingId.padStart(4, '0')}`;

  const handleDownload = () => {
    Alert.alert('Download', 'Receipt saved to your device downloads folder.');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Receipt ready to share via your preferred app.');
  };

  return (
    <Screen safeArea scrollable header={<PageHeader title="Earnings Receipt" from={params.from} />}>

      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <CheckCircle2 size={48} color={Colors.verified} />
        </View>
        <AppText variant="h3" weight="bold" color={Colors.verified}>Payment Received</AppText>
        <AppText variant="h1" weight="bold">{earnings}</AppText>
      </View>

      {/* Receipt Card */}
      <View style={styles.receiptCard}>
        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Transaction ID</AppText>
          <AppText variant="bodySm" weight="semiBold">{transactionId}</AppText>
        </View>
        <View style={styles.divider} />

        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Date</AppText>
          <AppText variant="bodySm" weight="semiBold">{date}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Time</AppText>
          <AppText variant="bodySm" weight="semiBold">{time}</AppText>
        </View>
        <View style={styles.divider} />

        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Service</AppText>
          <AppText variant="bodySm" weight="semiBold">{serviceType}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Customer</AppText>
          <AppText variant="bodySm" weight="semiBold">{customerName}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Location</AppText>
          <AppText variant="bodySm" weight="semiBold" style={{ textAlign: 'right', flex: 1 }}>{address}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Duration</AppText>
          <AppText variant="bodySm" weight="semiBold">{duration}</AppText>
        </View>

        {/* Earnings Breakdown */}
        <View style={styles.breakdownSection}>
          <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.breakdownLabel}>
            EARNINGS BREAKDOWN
          </AppText>
          <View style={styles.receiptRow}>
            <AppText variant="bodySm" color={Colors.textSecondary}>Base Amount</AppText>
            <AppText variant="bodySm" weight="semiBold">{baseAmount}</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText variant="bodySm" color={Colors.textSecondary}>Platform Fee (10%)</AppText>
            <AppText variant="bodySm" weight="semiBold" color={Colors.error}>-{platformFee}</AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <AppText variant="body" weight="bold">Net Earnings</AppText>
            <AppText variant="h4" weight="bold" color={Colors.verified}>{netEarnings}</AppText>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.receiptRow}>
          <AppText variant="caption" color={Colors.textTertiary}>Payment Method</AppText>
          <AppText variant="bodySm" weight="semiBold">{paymentMethod}</AppText>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <AppButton
          label="Download Receipt"
          variant="primary"
          fullWidth
          leftIcon={<Download size={14} color={Colors.white} />}
          onPress={handleDownload}
        />
        <AppButton
          label="Share Receipt"
          variant="outline"
          fullWidth
          leftIcon={<Share2 size={14} color={Colors.cta} />}
          onPress={handleShare}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  successHeader: {
    alignItems: 'center',
    paddingVertical: Spacing['5'],
    gap: Spacing['2'],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.verifiedBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2'],
  },

  receiptCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['5'],
    marginHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
    ...Elevation.sm,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing['2'],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  breakdownSection: {
    marginTop: Spacing['2'],
  },
  breakdownLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing['2'],
  },

  actions: {
    gap: Spacing['3'],
    paddingHorizontal: theme.layout.screenPadding,
  },
});
