import React, { useState } from 'react';
import { View, Modal, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { X, Star, Camera, CheckCircle2 } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { ImageUploadCard } from '@/components/ImageUploadCard';

interface JobCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { completionImage: string; workerRating: number; workerReview: string }) => void;
  customerName: string;
}

export function JobCompletionModal({ visible, onClose, onSubmit, customerName }: JobCompletionModalProps) {
  const [completionImage, setCompletionImage] = useState<string | null>(null);
  const [workerRating, setWorkerRating] = useState(0);
  const [workerReview, setWorkerReview] = useState('');
  const [imageError, setImageError] = useState('');
  const [ratingError, setRatingError] = useState('');

  const canSubmit = completionImage !== null && workerRating > 0;

  const handleSubmit = () => {
    let valid = true;

    if (!completionImage) {
      setImageError('Please upload a photo of the completed job');
      valid = false;
    } else {
      setImageError('');
    }

    if (workerRating === 0) {
      setRatingError('Please select a rating');
      valid = false;
    } else {
      setRatingError('');
    }

    if (valid && completionImage) {
      onSubmit({
        completionImage,
        workerRating,
        workerReview: workerReview.trim(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCompletionImage(null);
    setWorkerRating(0);
    setWorkerReview('');
    setImageError('');
    setRatingError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <CheckCircle2 color={Colors.success} size={24} style={{ marginRight: 8 }} />
              <AppText variant="h4" weight="bold">Complete Job</AppText>
            </View>
            <Pressable onPress={handleClose} hitSlop={12}>
              <X color={Colors.textSecondary} size={24} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            <View style={styles.contextBanner}>
              <AppText variant="body" weight="medium" color={Colors.textPrimary}>
                Submit job completion details for {customerName}'s booking.
              </AppText>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Camera size={18} color={Colors.cta} />
                <AppText variant="body" weight="semiBold">
                  Job Photo <AppText variant="body" color={Colors.error}>*</AppText>
                </AppText>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionDescription}>
                Upload a photo of the completed work as proof of completion.
              </AppText>
              <ImageUploadCard
                label=""
                description="Photo of completed job (JPG, PNG)"
                onImageSelected={setCompletionImage}
                error={imageError}
              />
            </View>

            <View style={styles.section}>
              <AppText variant="body" weight="semiBold" style={styles.sectionTitle}>
                Rate the Customer <AppText variant="body" color={Colors.error}>*</AppText>
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionDescription}>
                How was your experience with this customer?
              </AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() => { setWorkerRating(star); setRatingError(''); }}
                    hitSlop={8}
                    style={styles.starButton}
                  >
                    <Star
                      size={36}
                      color={star <= workerRating ? Colors.warning : Colors.border}
                      fill={star <= workerRating ? Colors.warning : 'transparent'}
                    />
                  </Pressable>
                ))}
              </View>
              {workerRating > 0 && (
                <AppText variant="caption" color={Colors.textSecondary} style={styles.ratingLabel}>
                  {workerRating === 1 && 'Poor experience'}
                  {workerRating === 2 && 'Below average'}
                  {workerRating === 3 && 'Average'}
                  {workerRating === 4 && 'Good experience'}
                  {workerRating === 5 && 'Excellent experience'}
                </AppText>
              )}
              {ratingError !== '' && (
                <AppText variant="caption" color={Colors.error} style={styles.errorText}>
                  {ratingError}
                </AppText>
              )}
            </View>

            <View style={styles.section}>
              <AppText variant="body" weight="semiBold" style={styles.sectionTitle}>
                Review (Optional)
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionDescription}>
                Share feedback about your experience working with this customer.
              </AppText>
              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review here..."
                placeholderTextColor={Colors.textTertiary}
                value={workerReview}
                onChangeText={setWorkerReview}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <AppText variant="caption" color={Colors.textTertiary} style={styles.charCount}>
                {workerReview.length}/500
              </AppText>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <AppButton
              label="Cancel"
              variant="ghost"
              onPress={handleClose}
              style={styles.cancelBtn}
            />
            <AppButton
              label="Submit & Complete"
              variant="primary"
              onPress={handleSubmit}
              disabled={!canSubmit}
              leftIcon={<CheckCircle2 size={16} color={Colors.white} />}
              style={styles.submitBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: Spacing['4'],
    gap: Spacing['4'],
  },
  contextBanner: {
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.lg,
    padding: Spacing['3'],
  },
  section: {
    gap: Spacing['2'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  sectionTitle: {
    marginBottom: 0,
  },
  sectionDescription: {
    marginBottom: Spacing['1'],
  },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    alignItems: 'center',
  },
  starButton: {
    padding: Spacing['1'],
  },
  ratingLabel: {
    marginTop: Spacing['1'],
    fontStyle: 'italic',
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
  },
  charCount: {
    textAlign: 'right',
  },
  errorText: {
    marginTop: Spacing['1'],
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing['4'],
    gap: Spacing['3'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
});
