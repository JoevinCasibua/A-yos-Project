import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, Field, Heading, Screen } from '@/components';
import { attachReviewMedia, createReview, uploadPrivateObject } from '@/repository';
import { useSession } from '@/session';

export default function ReviewPage() {
  const router = useRouter();
  const { account } = useSession();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const [stars, setStars] = useState('5');
  const [body, setBody] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      return Alert.alert(
        'Permission denied',
        'Photo access is required only for the image you choose.',
      );
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    if (!result.canceled) setPhoto(result.assets[0]);
  };
  const submit = async () => {
    if (!bookingId) return;
    setBusy(true);
    try {
      const review = await createReview(bookingId, Number(stars), body, recommend);
      if (photo && account) {
        const response = await fetch(photo.uri);
        const contentType = photo.mimeType ?? response.headers.get('content-type') ?? 'image/jpeg';
        const bytes = await response.arrayBuffer();
        const path = await uploadPrivateObject(
          'review-media',
          account.id,
          review.id,
          photo.fileName ?? 'review.jpg',
          bytes,
          contentType,
        );
        await attachReviewMedia(review.id, path, contentType, bytes.byteLength);
      }
      Alert.alert('Feedback submitted', 'Your review is pending administrator moderation.');
      router.replace('/(user)/bookings');
    } catch (caught) {
      Alert.alert('Review unavailable', caught instanceof Error ? caught.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 30 }}>
        <Heading
          eyebrow="Rate and review"
          title="Share your experience"
          body="Reviews are allowed only after completed and successfully confirmed Cash payment."
        />
        <Field
          label="Stars (1–5)"
          value={stars}
          onChangeText={setStars}
          keyboardType="number-pad"
          maxLength={1}
        />
        <Field
          label="Review"
          value={body}
          onChangeText={setBody}
          multiline
          maxLength={4000}
          placeholder="Describe the completed service…"
        />
        <Button
          title={recommend ? 'Recommended ✓' : 'Recommend this worker'}
          variant="secondary"
          onPress={() => setRecommend((value) => !value)}
        />
        <Button
          title={photo ? `Photo selected: ${photo.fileName ?? 'image'}` : 'Add review photo'}
          variant="secondary"
          disabled={busy}
          onPress={() => void choosePhoto()}
        />
        <Button
          title={busy ? 'Submitting…' : 'Submit feedback'}
          disabled={busy || Number(stars) < 1 || Number(stars) > 5 || body.trim().length < 3}
          onPress={() => void submit()}
        />
      </ScrollView>
    </Screen>
  );
}
