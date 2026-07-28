import React from 'react';
import { View, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { CheckCircle2, Receipt, Star, Play } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';

interface CompletedSummaryProps {
  bookingId: string;
  duration: string;
  earnings: string;
  completionImages?: string[];
  completionVideo?: string;
  workerRating?: number;
  workerReview?: string;
  onViewReceipt?: () => void;
}

export const CompletedSummary = React.memo(function CompletedSummary({
  bookingId,
  duration,
  earnings,
  completionImages,
  completionVideo,
  workerRating,
  workerReview,
  onViewReceipt,
}: CompletedSummaryProps) {
  const transactionId = `TXN-2026-${bookingId.padStart(4, '0')}`;
  const hasReview = workerRating !== undefined && workerRating > 0;
  const hasMedia = (completionImages && completionImages.length > 0) || completionVideo;

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

      {hasReview && (
        <View style={styles.reviewCard}>
          <AppText variant="body" weight="semiBold" style={styles.reviewTitle}>
            Your Review
          </AppText>

          {hasMedia && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaRow}
            >
              {completionImages && completionImages.map((uri, index) => (
                <View key={index} style={styles.photoThumb}>
                  <Image source={{ uri }} style={styles.photoThumbImage} />
                  <View style={styles.photoIndex}>
                    <AppText variant="caption" weight="bold" color={Colors.white}>{index + 1}</AppText>
                  </View>
                </View>
              ))}

              {completionVideo && (
                <View style={styles.photoThumb}>
                  <Image source={{ uri: completionVideo }} style={styles.photoThumbImage} />
                  <View style={styles.videoPlayIcon}>
                    <Play size={20} color={Colors.white} fill={Colors.white} />
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                color={star <= workerRating! ? Colors.warning : Colors.border}
                fill={star <= workerRating! ? Colors.warning : 'transparent'}
              />
            ))}
            <AppText variant="caption" color={Colors.textSecondary} style={styles.ratingText}>
              {workerRating}/5
            </AppText>
          </View>

          {workerReview !== undefined && workerReview.length > 0 && (
            <AppText variant="body" color={Colors.textSecondary} style={styles.reviewText}>
              "{workerReview}"
            </AppText>
          )}
        </View>
      )}

      <View style={styles.actions}>
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
  reviewCard: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing['4'],
    gap: Spacing['2'],
    marginTop: Spacing['2'],
  },
  reviewTitle: {
    marginBottom: Spacing['1'],
  },
  mediaRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    paddingVertical: Spacing['1'],
  },
  photoThumb: {
    width: 120,
    height: 90,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoIndex: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  videoPlayIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -14,
    marginLeft: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['1'],
  },
  ratingText: {
    marginLeft: Spacing['2'],
  },
  reviewText: {
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: Spacing['3'],
    marginTop: Spacing['2'],
  },
});
