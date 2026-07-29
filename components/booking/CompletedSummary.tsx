import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2, Receipt, Star, Play, X, AlertTriangle, MoreVertical, Pencil } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';

interface CompletedSummaryProps {
  bookingId: string;
  duration: string;
  earnings: string;
  description?: string;
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
  description,
  completionImages,
  completionVideo,
  workerRating,
  workerReview,
  onViewReceipt,
}: CompletedSummaryProps) {
  const [showReviewDetail, setShowReviewDetail] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(workerRating || 0);
  const [editedReview, setEditedReview] = useState(workerReview || '');
  const [hasEdited, setHasEdited] = useState(false);

  const openInEditMode = () => {
    setShowMenu(false);
    setEditedRating(workerRating || 0);
    setEditedReview(workerReview || '');
    setIsEditing(true);
    setShowReviewDetail(true);
  };

  const openInReadOnly = () => {
    setIsEditing(false);
    setShowReviewDetail(true);
  };

  const handleSaveEdit = () => {
    setHasEdited(true);
    setIsEditing(false);
    setShowReviewDetail(false);
  };

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
        {description && (
          <>
            <View style={styles.divider} />
            <View style={styles.descriptionRow}>
              <AppText variant="body" color={Colors.textTertiary}>Description</AppText>
              <AppText variant="bodySm" weight="medium" numberOfLines={2} style={styles.descriptionValue}>
                {description}
              </AppText>
            </View>
          </>
        )}
      </View>

      {hasReview && (
        <View style={styles.reviewCard}>
          <View style={styles.reviewCardHeader}>
            <AppText variant="body" weight="semiBold">
              Your Review
            </AppText>
            {!hasEdited && (
              <Pressable onPress={() => setShowMenu(!showMenu)} hitSlop={8}>
                <MoreVertical size={18} color={Colors.textTertiary} />
              </Pressable>
            )}
          </View>

          {showMenu && !hasEdited && (
            <>
              <Pressable style={styles.menuBackdrop} onPress={() => setShowMenu(false)} />
              <Pressable style={styles.menuDropdown} onPress={openInEditMode}>
                <View style={styles.menuDropdownItem}>
                  <Pencil size={18} color={Colors.textSecondary} />
                  <AppText variant="body" color={Colors.textPrimary}>Edit Review</AppText>
                </View>
              </Pressable>
            </>
          )}

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
            <AppText variant="body" color={Colors.textSecondary} numberOfLines={2} style={styles.reviewText}>
              &quot;{workerReview}&quot;
            </AppText>
          )}

          <Pressable style={styles.viewReviewBtn} onPress={openInReadOnly}>
            <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>
              View Full Review →
            </AppText>
          </Pressable>
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

      {/* ─── Review Detail Modal ─── */}
      <Modal visible={showReviewDetail} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText variant="h4" weight="bold">
                {isEditing ? 'Edit Review' : 'Your Review'}
              </AppText>
              <Pressable onPress={() => setShowReviewDetail(false)} hitSlop={12}>
                <X color={Colors.textSecondary} size={24} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
              {isEditing && (
                <View style={styles.warningBanner}>
                  <AlertTriangle size={16} color={Colors.warning} />
                  <AppText variant="caption" color={Colors.warning} style={{ flex: 1 }}>
                    You can only edit your review once. This action cannot be undone.
                  </AppText>
                </View>
              )}

              {hasMedia && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.modalMediaRow}
                >
                  {completionImages && completionImages.map((uri, index) => (
                    <View key={index} style={styles.modalPhotoThumb}>
                      <Image source={{ uri }} style={styles.modalPhotoImage} />
                      <View style={styles.modalPhotoIndex}>
                        <AppText variant="caption" weight="bold" color={Colors.white}>{index + 1}</AppText>
                      </View>
                    </View>
                  ))}

                  {completionVideo && (
                    <View style={styles.modalPhotoThumb}>
                      <Image source={{ uri: completionVideo }} style={styles.modalPhotoImage} />
                      <View style={styles.modalVideoPlayIcon}>
                        <Play size={24} color={Colors.white} fill={Colors.white} />
                      </View>
                    </View>
                  )}
                </ScrollView>
              )}

              <View style={styles.modalRatingSection}>
                <AppText variant="body" weight="semiBold">Rating</AppText>
                <View style={styles.modalStarsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => isEditing && setEditedRating(star)}
                      hitSlop={8}
                      disabled={!isEditing}
                    >
                      <Star
                        size={24}
                        color={star <= (isEditing ? editedRating : workerRating!) ? Colors.warning : Colors.border}
                        fill={star <= (isEditing ? editedRating : workerRating!) ? Colors.warning : 'transparent'}
                      />
                    </Pressable>
                  ))}
                  <AppText variant="body" weight="semiBold" color={Colors.textSecondary} style={styles.modalRatingText}>
                    {isEditing ? editedRating : workerRating}/5
                  </AppText>
                </View>
                {isEditing && editedRating > 0 && (
                  <AppText variant="caption" color={Colors.textSecondary} style={{ fontStyle: 'italic' }}>
                    {editedRating === 1 && 'Poor experience'}
                    {editedRating === 2 && 'Below average'}
                    {editedRating === 3 && 'Average'}
                    {editedRating === 4 && 'Good experience'}
                    {editedRating === 5 && 'Excellent experience'}
                  </AppText>
                )}
              </View>

              {workerReview !== undefined && workerReview.length > 0 && (
                <View style={styles.modalReviewSection}>
                  <AppText variant="body" weight="semiBold">Review</AppText>
                  {!isEditing ? (
                    <AppText variant="body" color={Colors.textSecondary} style={styles.reviewReadOnlyText}>
                      &quot;{workerReview}&quot;
                    </AppText>
                  ) : (
                    <TextInput
                      style={styles.reviewInput}
                      value={editedReview}
                      onChangeText={setEditedReview}
                      multiline
                      textAlignVertical="top"
                      placeholder="Write your review..."
                      placeholderTextColor={Colors.textTertiary}
                    />
                  )}
                </View>
              )}
            </ScrollView>

            {isEditing && (
              <View style={styles.modalFooter}>
                <AppButton
                  label="Save Changes"
                  variant="primary"
                  fullWidth
                  onPress={handleSaveEdit}
                  disabled={editedRating === 0}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  descriptionRow: {
    gap: Spacing['1'],
  },
  descriptionValue: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  reviewCard: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing['4'],
    gap: Spacing['2'],
    marginTop: Spacing['2'],
    position: 'relative',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuDropdown: {
    position: 'absolute',
    top: Spacing['10'],
    right: Spacing['2'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['2'],
    minWidth: 160,
    ...Elevation.lg,
    zIndex: 10,
  },
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
  menuDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    paddingVertical: Spacing['3'],
    paddingHorizontal: Spacing['4'],
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
  viewReviewBtn: {
    alignSelf: 'flex-start',
    marginTop: Spacing['1'],
  },
  actions: {
    width: '100%',
    gap: Spacing['3'],
    marginTop: Spacing['2'],
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['5'],
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    maxHeight: '75%',
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalBody: {
  },
  modalBodyContent: {
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['4'],
    gap: Spacing['3'],
  },
  modalMediaRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
  },
  modalPhotoThumb: {
    width: 160,
    height: 120,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  modalPhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalPhotoIndex: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  modalVideoPlayIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRatingSection: {
    gap: Spacing['2'],
  },
  modalStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  modalRatingText: {
    marginLeft: Spacing['2'],
  },
  modalReviewSection: {
    gap: Spacing['2'],
  },
  reviewReadOnlyText: {
    fontStyle: 'italic',
    lineHeight: 22,
  },
  reviewInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['3'],
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    minHeight: 100,
    lineHeight: 22,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    backgroundColor: '#FEF3C7',
    borderRadius: Radius.lg,
    padding: Spacing['3'],
  },
  modalFooter: {
    padding: Spacing['3'],
    paddingHorizontal: Spacing['4'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
