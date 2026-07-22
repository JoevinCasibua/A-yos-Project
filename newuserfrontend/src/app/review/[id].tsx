import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { TextInput } from '../../components/inputs/TextInput';
import { theme } from '../../theme';
import { ArrowLeft, Star, UploadCloud, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to Home or Bookings
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleMockUpload = () => {
    if (photos.length < 3) {
      setPhotos([...photos, `review_photo_${photos.length + 1}`]);
    }
  };

  return (
    <Screen safeArea scrollable>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Rate Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.workerInfo}>
          <View style={styles.avatarPlaceholder} />
          <Text style={[theme.typography.h3, { marginBottom: theme.spacing.xs }]}>Mario Rossi</Text>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Plumbing Service • Oct 24</Text>
        </View>

        <Text style={[theme.typography.h4, styles.sectionTitle]}>How was the service?</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
              <Star 
                color={star <= rating ? theme.colors.warning : theme.colors.border} 
                size={40} 
                fill={star <= rating ? theme.colors.warning : 'transparent'} 
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[theme.typography.h4, styles.sectionTitle]}>Write a Review</Text>
        <TextInput
          placeholder="Share your experience (optional)"
          multiline
          numberOfLines={4}
          value={review}
          onChangeText={setReview}
          style={styles.textArea}
          textAlignVertical="top"
        />

        <Text style={[theme.typography.h4, styles.sectionTitle]}>Add Photos (Optional)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
          {photos.length < 3 && (
            <TouchableOpacity style={styles.uploadBtn} onPress={handleMockUpload}>
              <UploadCloud color={theme.colors.primary} size={32} />
            </TouchableOpacity>
          )}
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoPreview}>
              <View style={styles.mockImg} />
              <TouchableOpacity style={styles.removePhotoBtn} onPress={() => setPhotos(photos.filter((_, i) => i !== index))}>
                <X color={theme.colors.surface} size={14} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.recommendContainer}>
          <View style={{ flex: 1, paddingRight: theme.spacing.md }}>
            <Text style={theme.typography.h4}>Recommend Worker</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
              Would you recommend this professional to others?
            </Text>
          </View>
          <Switch 
            value={recommend}
            onValueChange={setRecommend}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.surface}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Submit Review" 
          onPress={handleSubmit} 
          disabled={rating === 0}
          loading={loading}
          fullWidth 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingVertical: theme.spacing.lg },
  workerInfo: { alignItems: 'center', marginBottom: theme.spacing.xxxl },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.border, marginBottom: theme.spacing.md },
  sectionTitle: { marginBottom: theme.spacing.sm },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: theme.spacing.xxxl },
  starBtn: { padding: theme.spacing.xs, marginHorizontal: theme.spacing.xs },
  textArea: { minHeight: 100, backgroundColor: theme.colors.surface, marginBottom: theme.spacing.xl },
  photoScroll: { flexDirection: 'row', marginBottom: theme.spacing.xl, flexGrow: 0 },
  uploadBtn: { width: 80, height: 80, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.infoBackground, marginRight: theme.spacing.md },
  photoPreview: { width: 80, height: 80, borderRadius: theme.radius.md, marginRight: theme.spacing.md, position: 'relative' },
  mockImg: { flex: 1, borderRadius: theme.radius.md, backgroundColor: theme.colors.border },
  removePhotoBtn: { position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.error, justifyContent: 'center', alignItems: 'center' },
  recommendContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.lg, backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, marginBottom: theme.spacing.xxxl, ...theme.shadows.sm },
  footer: { paddingVertical: theme.spacing.md },
});
