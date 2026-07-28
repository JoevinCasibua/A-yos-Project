import React, { useState } from 'react';
import { View, Modal, StyleSheet, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { X, Star, Camera, CheckCircle2, Plus, Video, Play } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';

const MAX_PHOTOS = 5;

const MOCK_PHOTOS = [
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const MOCK_VIDEO_THUMBNAIL = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400';

interface JobCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { completionImages: string[]; completionVideo: string | null; workerRating: number; workerReview: string }) => void;
  customerName: string;
}

export function JobCompletionModal({ visible, onClose, onSubmit, customerName }: JobCompletionModalProps) {
  const [completionImages, setCompletionImages] = useState<string[]>([]);
  const [completionVideo, setCompletionVideo] = useState<string | null>(null);
  const [workerRating, setWorkerRating] = useState(0);
  const [workerReview, setWorkerReview] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [ratingError, setRatingError] = useState('');

  const canSubmit = completionImages.length > 0 && workerRating > 0;

  const handleAddPhoto = () => {
    const nextIndex = completionImages.length % MOCK_PHOTOS.length;
    setCompletionImages((prev) => [...prev, MOCK_PHOTOS[nextIndex]]);
    setMediaError('');
  };

  const handleRemovePhoto = (index: number) => {
    setCompletionImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVideo = () => {
    setCompletionVideo(MOCK_VIDEO_THUMBNAIL);
  };

  const handleRemoveVideo = () => {
    setCompletionVideo(null);
  };

  const handleSubmit = () => {
    let valid = true;

    if (completionImages.length === 0) {
      setMediaError('Please upload at least one photo of the completed job');
      valid = false;
    } else {
      setMediaError('');
    }

    if (workerRating === 0) {
      setRatingError('Please select a rating');
      valid = false;
    } else {
      setRatingError('');
    }

    if (valid) {
      onSubmit({
        completionImages,
        completionVideo,
        workerRating,
        workerReview: workerReview.trim(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCompletionImages([]);
    setCompletionVideo(null);
    setWorkerRating(0);
    setWorkerReview('');
    setMediaError('');
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

            {/* ─── Job Photos ─── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Camera size={18} color={Colors.cta} />
                <AppText variant="body" weight="semiBold">
                  Job Photos <AppText variant="body" color={Colors.error}>*</AppText>
                </AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  ({completionImages.length}/{MAX_PHOTOS})
                </AppText>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionDescription}>
                Upload photos of the completed work as proof of completion.
              </AppText>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photoRow}
              >
                {completionImages.map((uri, index) => (
                  <View key={index} style={styles.photoThumb}>
                    <Image source={{ uri }} style={styles.photoThumbImage} />
                    <Pressable style={styles.photoRemoveBtn} onPress={() => handleRemovePhoto(index)}>
                      <X size={14} color={Colors.white} />
                    </Pressable>
                    <View style={styles.photoIndex}>
                      <AppText variant="caption" weight="bold" color={Colors.white}>{index + 1}</AppText>
                    </View>
                  </View>
                ))}

                {completionImages.length < MAX_PHOTOS && (
                  <Pressable style={styles.addPhotoBtn} onPress={handleAddPhoto}>
                    <Plus size={24} color={Colors.cta} />
                    <AppText variant="caption" weight="semiBold" color={Colors.cta}>Add Photo</AppText>
                  </Pressable>
                )}
              </ScrollView>

              {mediaError !== '' && (
                <AppText variant="caption" color={Colors.error} style={styles.errorText}>
                  {mediaError}
                </AppText>
              )}
            </View>

            {/* ─── Job Video ─── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Video size={18} color={Colors.cta} />
                <AppText variant="body" weight="semiBold">
                  Job Video <AppText variant="caption" color={Colors.textSecondary}>(Optional)</AppText>
                </AppText>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionDescription}>
                Record a short video of the completed work.
              </AppText>

              {completionVideo ? (
                <View style={styles.videoThumb}>
                  <Image source={{ uri: completionVideo }} style={styles.videoThumbImage} />
                  <View style={styles.videoPlayIcon}>
                    <Play size={24} color={Colors.white} fill={Colors.white} />
                  </View>
                  <Pressable style={styles.videoRemoveBtn} onPress={handleRemoveVideo}>
                    <X size={14} color={Colors.white} />
                  </Pressable>
                </View>
              ) : (
                <Pressable style={styles.addVideoBtn} onPress={handleAddVideo}>
                  <Video size={24} color={Colors.cta} />
                  <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>Add Video</AppText>
                  <AppText variant="caption" color={Colors.textTertiary}>MP4, MOV up to 50MB</AppText>
                </Pressable>
              )}
            </View>

            {/* ─── Rating ─── */}
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

            {/* ─── Review ─── */}
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
    flex: 1,
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

  // Photo grid
  photoRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    paddingVertical: Spacing['1'],
  },
  photoThumb: {
    width: 100,
    height: 100,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: Radius.full,
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
  addPhotoBtn: {
    width: 100,
    height: 100,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.cta,
    borderStyle: 'dashed',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['1'],
  },

  // Video
  videoThumb: {
    width: '100%',
    height: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  videoThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoPlayIcon: {
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
  videoRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: Radius.full,
  },
  addVideoBtn: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing['4'],
    backgroundColor: Colors.white,
    alignItems: 'center',
    gap: Spacing['1'],
  },

  // Rating
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

  // Review
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

  // Footer
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
