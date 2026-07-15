import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { ChevronLeft, Star, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { providers } from '@/constants/mockData';

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const provider = providers.find((p) => p.id === id) || providers[0];

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleClose = useCallback(() => router.back(), []);
  const handleSubmit = useCallback(() => {
    // Navigate forward to Payment Received/Confirmation
    router.replace('/payment-received');
  }, []);

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleClose} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Rate & Review</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Provider Card */}
        <View style={styles.providerCard}>
          <Avatar uri={provider.avatarUri} size={64} />
          <View style={styles.providerInfo}>
            <AppText variant="h4" weight="bold">{provider.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{provider.category}</AppText>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.ratingSection}>
          <AppText variant="body" weight="semiBold" align="center">How was your experience?</AppText>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                onHoverIn={() => setHoverRating(star)}
                onHoverOut={() => setHoverRating(0)}
                style={styles.starBtn}
                accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
                accessibilityRole="button"
              >
                <Star
                  size={40}
                  color={Colors.star}
                  fill={(hoverRating || rating) >= star ? Colors.star : 'transparent'}
                  strokeWidth={2}
                />
              </Pressable>
            ))}
          </View>
          {rating > 0 && (
            <AppText variant="body" weight="semiBold" color={Colors.cta} align="center" style={{ marginTop: Spacing['2'] }}>
              {ratingLabels[rating]}
            </AppText>
          )}
        </View>

        {/* Review Text */}
        <View style={styles.reviewSection}>
          <AppText variant="body" weight="semiBold">Write a Review</AppText>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Share details about the service quality, professionalism, and your overall experience..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <AppText variant="caption" color={Colors.textTertiary} style={styles.charCount}>
              {reviewText.length}/500
            </AppText>
          </View>
        </View>

        {/* Quick Tags */}
        <View style={styles.tagsSection}>
          <AppText variant="body" weight="semiBold">Quick Feedback</AppText>
          <View style={styles.tagsGrid}>
            {['Punctual', 'Professional', 'Fair Price', 'Clean Work', 'Friendly', 'Knowledgeable'].map((tag) => (
              <Pressable
                key={tag}
                style={({ pressed }) => [
                  styles.tag,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <AppText variant="caption" weight="medium" color={Colors.cta}>{tag}</AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit */}
        <View style={styles.submitSection}>
          <AppButton
            label="Submit Review"
            size="lg"
            fullWidth
            onPress={handleSubmit}
            disabled={rating === 0}
            leftIcon={<Star size={18} color={Colors.white} strokeWidth={2} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60,
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing['4'],
    marginHorizontal: Spacing['4'], marginTop: Spacing['5'],
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    ...Elevation.sm,
  },
  providerInfo: { flex: 1 },
  ratingSection: { marginTop: Spacing['8'], paddingHorizontal: Spacing['4'] },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing['3'], marginTop: Spacing['4'] },
  starBtn: { padding: Spacing['1'] },
  reviewSection: { marginTop: Spacing['8'], paddingHorizontal: Spacing['4'] },
  textAreaContainer: {
    backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1.5,
    borderColor: Colors.border, padding: Spacing['4'], marginTop: Spacing['3'],
  },
  textArea: {
    fontSize: 15, color: Colors.textPrimary, minHeight: 120,
    padding: 0, textAlignVertical: 'top',
  },
  charCount: { alignSelf: 'flex-end', marginTop: Spacing['2'] },
  tagsSection: { marginTop: Spacing['6'], paddingHorizontal: Spacing['4'] },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing['2'], marginTop: Spacing['3'] },
  tag: {
    backgroundColor: Colors.primarySurface, paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['2'], borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.primaryBorder,
  },
  submitSection: { marginTop: Spacing['8'], paddingHorizontal: Spacing['4'] },
});
