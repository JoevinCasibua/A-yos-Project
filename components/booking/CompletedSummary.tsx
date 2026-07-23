import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckCircle2, Receipt, Wrench, Clock, AlertTriangle, Lightbulb } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';

interface CompletedSummaryProps {
  bookingId: string;
  duration: string;
  earnings: string;
  serviceType?: string;
  issueIdentified?: string;
  estimatedRepairTime?: string;
  recommendedAction?: string;
  onLeaveFeedback: () => void;
  onViewReceipt?: () => void;
}

export const CompletedSummary = React.memo(function CompletedSummary({
  bookingId,
  duration,
  earnings,
  serviceType,
  issueIdentified,
  estimatedRepairTime,
  recommendedAction,
  onLeaveFeedback,
  onViewReceipt,
}: CompletedSummaryProps) {
  const transactionId = `TXN-2026-${bookingId.padStart(4, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        <CheckCircle2 size={48} color={Colors.success} />
      </View>

      <AppText variant="h3" weight="bold" color={Colors.success} style={styles.title}>
        Job Completed!
      </AppText>

      <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
        Your payment has been released.
      </AppText>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <AppText variant="body" color={Colors.textTertiary}>Booking ID</AppText>
          <AppText variant="body" weight="semiBold">#{bookingId.padStart(4, '0')}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <AppText variant="body" color={Colors.textTertiary}>Transaction ID</AppText>
          <AppText variant="body" weight="semiBold">{transactionId}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <AppText variant="body" color={Colors.textTertiary}>Duration</AppText>
          <AppText variant="body" weight="semiBold">{duration}</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <AppText variant="body" color={Colors.textTertiary}>Earnings</AppText>
          <AppText variant="body" weight="bold" color={Colors.success}>{earnings}</AppText>
        </View>
      </View>

      {(serviceType || issueIdentified || estimatedRepairTime || recommendedAction) && (
        <View style={styles.analysisCard}>
          <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.analysisLabel}>
            SERVICE ANALYSIS
          </AppText>

          {serviceType && (
            <View style={styles.analysisRow}>
              <View style={styles.analysisIcon}>
                <Wrench size={14} color={Colors.cta} />
              </View>
              <View style={styles.analysisContent}>
                <AppText variant="caption" color={Colors.textTertiary}>Service Type</AppText>
                <AppText variant="body" weight="semiBold">{serviceType}</AppText>
              </View>
            </View>
          )}

          {issueIdentified && (
            <View style={styles.analysisRow}>
              <View style={styles.analysisIcon}>
                <AlertTriangle size={14} color={Colors.warning} />
              </View>
              <View style={styles.analysisContent}>
                <AppText variant="caption" color={Colors.textTertiary}>Issue Identified</AppText>
                <AppText variant="bodySm">{issueIdentified}</AppText>
              </View>
            </View>
          )}

          {estimatedRepairTime && (
            <View style={styles.analysisRow}>
              <View style={styles.analysisIcon}>
                <Clock size={14} color={Colors.info} />
              </View>
              <View style={styles.analysisContent}>
                <AppText variant="caption" color={Colors.textTertiary}>Estimated Repair Time</AppText>
                <AppText variant="body" weight="semiBold">{estimatedRepairTime}</AppText>
              </View>
            </View>
          )}

          {recommendedAction && (
            <View style={styles.analysisRow}>
              <View style={styles.analysisIcon}>
                <Lightbulb size={14} color={Colors.verified} />
              </View>
              <View style={styles.analysisContent}>
                <AppText variant="caption" color={Colors.textTertiary}>Recommended Action</AppText>
                <AppText variant="bodySm">{recommendedAction}</AppText>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.actions}>
        <AppButton
          label="Leave Feedback"
          variant="outline"
          fullWidth
          onPress={onLeaveFeedback}
        />
        {onViewReceipt && (
          <AppButton
            label="View Receipt"
            variant="primary"
            fullWidth
            leftIcon={<Receipt size={14} color={Colors.white} />}
            onPress={onViewReceipt}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['6'],
    alignItems: 'center',
    gap: Spacing['2'],
    ...Elevation.sm,
  },
  iconRow: {
    marginBottom: Spacing['1'],
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing['3'],
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing['4'],
    gap: Spacing['2'],
    marginBottom: Spacing['2'],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  actions: {
    width: '100%',
    gap: Spacing['3'],
  },
  analysisCard: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing['4'],
    gap: Spacing['3'],
    marginBottom: Spacing['2'],
  },
  analysisLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  analysisRow: {
    flexDirection: 'row',
    gap: Spacing['3'],
  },
  analysisIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisContent: {
    flex: 1,
    gap: 2,
  },
});
