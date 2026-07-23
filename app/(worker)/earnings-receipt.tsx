import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Download, Share2, AlertCircle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';

type ReceiptType = 'earning' | 'commission' | 'payout' | 'topup';

const receiptConfig: Record<ReceiptType, { icon: typeof CheckCircle2; color: string; bgColor: string; title: string }> = {
  earning: { icon: CheckCircle2, color: Colors.verified, bgColor: Colors.verifiedBg, title: 'Payment Received' },
  commission: { icon: AlertCircle, color: Colors.error, bgColor: Colors.errorBg, title: 'Commission Deduction' },
  payout: { icon: ArrowDownToLine, color: Colors.info, bgColor: Colors.infoBg, title: 'Payout Processed' },
  topup: { icon: ArrowUpFromLine, color: Colors.verified, bgColor: Colors.verifiedBg, title: 'Top-Up Received' },
};

export default function EarningsReceiptScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string;
    transactionId?: string;
    duration?: string;
    earnings?: string;
    from?: string;
    type?: ReceiptType;
  }>();

  const receiptType: ReceiptType = params.type || 'earning';
  const config = receiptConfig[receiptType];

  const transactionId = params.transactionId || `TXN-2026-${(params.bookingId || '0042').padStart(4, '0')}`;
  const date = 'July 22, 2026';
  const time = '2:00 PM - 4:45 PM';
  const serviceType = 'Plumbing Repair';
  const customerName = 'Alex Johnson';
  const address = '123 Sampaguita St., Quezon City';
  const duration = params.duration || '2h 45m';
  const earnings = params.earnings || '₱1,350.00';
  const baseAmount = '₱1,500.00';
  const platformFee = '₱150.00';
  const netEarnings = earnings;
  const paymentMethod = 'GCash (Escrow)';
  const commissionRate = '10%';
  const payoutMethod = 'GCash';
  const processingTime = '1-2 business days';
  const topUpMethod = 'GCash';
  const newBalance = '₱23,450.00';

  const handleDownload = () => {
    Alert.alert('Download', 'Receipt saved to your device downloads folder.');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Receipt ready to share via your preferred app.');
  };

  const Icon = config.icon;

  return (
    <Screen safeArea scrollable header={<PageHeader title="Receipt" from={params.from} />}>

      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={[styles.successIcon, { backgroundColor: config.bgColor }]}>
          <Icon size={48} color={config.color} />
        </View>
        <AppText variant="h3" weight="bold" color={config.color}>{config.title}</AppText>
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

        {receiptType === 'earning' && (
          <>
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
                <AppText variant="bodySm" color={Colors.textSecondary}>Platform Fee ({commissionRate})</AppText>
                <AppText variant="bodySm" weight="semiBold" color={Colors.error}>-{platformFee}</AppText>
              </View>
              <View style={styles.divider} />
              <View style={styles.receiptRow}>
                <AppText variant="body" weight="bold">Net Earnings</AppText>
                <AppText variant="h4" weight="bold" color={Colors.verified}>{netEarnings}</AppText>
              </View>
            </View>
          </>
        )}

        {receiptType === 'commission' && (
          <>
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

            <View style={styles.breakdownSection}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.breakdownLabel}>
                COMMISSION BREAKDOWN
              </AppText>
              <View style={styles.receiptRow}>
                <AppText variant="bodySm" color={Colors.textSecondary}>Service Amount</AppText>
                <AppText variant="bodySm" weight="semiBold">{baseAmount}</AppText>
              </View>
              <View style={styles.receiptRow}>
                <AppText variant="bodySm" color={Colors.textSecondary}>Commission Rate ({commissionRate})</AppText>
                <AppText variant="bodySm" weight="semiBold" color={Colors.error}>-{platformFee}</AppText>
              </View>
              <View style={styles.divider} />
              <View style={styles.receiptRow}>
                <AppText variant="body" weight="bold">Deduction</AppText>
                <AppText variant="h4" weight="bold" color={Colors.error}>{platformFee}</AppText>
              </View>
            </View>
          </>
        )}

        {receiptType === 'payout' && (
          <>
            <View style={styles.receiptRow}>
              <AppText variant="caption" color={Colors.textTertiary}>Payout Method</AppText>
              <AppText variant="bodySm" weight="semiBold">{payoutMethod}</AppText>
            </View>
            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <AppText variant="caption" color={Colors.textTertiary}>Processing Time</AppText>
              <AppText variant="bodySm" weight="semiBold">{processingTime}</AppText>
            </View>
            <View style={styles.divider} />

            <View style={styles.breakdownSection}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.breakdownLabel}>
                PAYOUT DETAILS
              </AppText>
              <View style={styles.receiptRow}>
                <AppText variant="bodySm" color={Colors.textSecondary}>Amount Requested</AppText>
                <AppText variant="bodySm" weight="semiBold">{earnings}</AppText>
              </View>
              <View style={styles.receiptRow}>
                <AppText variant="bodySm" color={Colors.textSecondary}>Method</AppText>
                <AppText variant="bodySm" weight="semiBold">{payoutMethod}</AppText>
              </View>
              <View style={styles.divider} />
              <View style={styles.receiptRow}>
                <AppText variant="body" weight="bold">Status</AppText>
                <AppText variant="h4" weight="bold" color={Colors.info}>Processing</AppText>
              </View>
            </View>
          </>
        )}

        {receiptType === 'topup' && (
          <>
            <View style={styles.receiptRow}>
              <AppText variant="caption" color={Colors.textTertiary}>Source Method</AppText>
              <AppText variant="bodySm" weight="semiBold">{topUpMethod}</AppText>
            </View>
            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <AppText variant="caption" color={Colors.textTertiary}>Status</AppText>
              <AppText variant="bodySm" weight="semiBold" color={Colors.verified}>Completed</AppText>
            </View>
            <View style={styles.divider} />

            <View style={styles.breakdownSection}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.breakdownLabel}>
                TOP-UP DETAILS
              </AppText>
              <View style={styles.receiptRow}>
                <AppText variant="bodySm" color={Colors.textSecondary}>Amount Added</AppText>
                <AppText variant="bodySm" weight="semiBold" color={Colors.verified}>{earnings}</AppText>
              </View>
              <View style={styles.receiptRow}>
                <AppText variant="bodySm" color={Colors.textSecondary}>Source</AppText>
                <AppText variant="bodySm" weight="semiBold">{topUpMethod}</AppText>
              </View>
              <View style={styles.divider} />
              <View style={styles.receiptRow}>
                <AppText variant="body" weight="bold">New Balance</AppText>
                <AppText variant="h4" weight="bold" color={Colors.verified}>{newBalance}</AppText>
              </View>
            </View>
          </>
        )}

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
