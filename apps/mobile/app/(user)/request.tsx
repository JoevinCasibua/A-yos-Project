import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button, DataState, FeatureCard, Field, Heading, Screen, StatusBadge } from '@/components';
import {
  attachRequestMedia,
  createAddress,
  createServiceRequest,
  generateMatches,
  listCategories,
  selectWorker,
  setAddressLocation,
  startWorkerConversation,
  uploadPrivateObject,
} from '@/repository';
import { useSession } from '@/session';
import { colors } from '@/theme';
import { useAsyncData } from '@/useAsyncData';

interface SelectedImage {
  uri: string;
  name: string;
  contentType: string;
  byteSize: number;
}

export default function RequestPage() {
  const router = useRouter();
  const { draft, aiAnalysisId } = useLocalSearchParams<{ draft?: string; aiAnalysisId?: string }>();
  const { account } = useSession();
  const load = useCallback(() => listCategories(), []);
  const { data: categories = [], error, loading } = useAsyncData(load);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState(draft ?? '');
  const [schedule, setSchedule] = useState(new Date(Date.now() + 86_400_000).toISOString());
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [line1, setLine1] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState<SelectedImage>();
  const [matches, setMatches] = useState<Awaited<ReturnType<typeof generateMatches>>>([]);
  const [requestId, setRequestId] = useState<string>();
  const [busy, setBusy] = useState(false);

  const pickImage = async () => {
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
    const asset = result.assets?.[0];
    if (!result.canceled && asset)
      setImage({
        uri: asset.uri,
        name: asset.fileName ?? 'request.jpg',
        contentType: asset.mimeType ?? 'image/jpeg',
        byteSize: asset.fileSize ?? 1,
      });
  };

  const submit = async () => {
    if (!account) return;
    setBusy(true);
    try {
      const coordinate = { latitude: Number(latitude), longitude: Number(longitude) };
      if (!Number.isFinite(coordinate.latitude) || !Number.isFinite(coordinate.longitude))
        throw new Error('Valid latitude and longitude are required.');
      const address = await createAddress({
        account_id: account.id,
        label: 'Service address',
        line1: line1.trim(),
        barangay: barangay.trim(),
        city: city.trim(),
        province: province.trim(),
        is_default: false,
      });
      if (!address) throw new Error('The address could not be created.');
      await setAddressLocation(address.id, coordinate);
      const request = await createServiceRequest({
        categoryId,
        addressId: address.id,
        description,
        scheduledAt: new Date(schedule).toISOString(),
        budget: Number(budget),
        notes,
        ...(aiAnalysisId ? { aiAnalysisId } : {}),
        notifyOnMatch: Boolean(aiAnalysisId),
      });
      setRequestId(request.id);
      if (image) {
        const response = await fetch(image.uri);
        const path = await uploadPrivateObject(
          'request-media',
          account.id,
          request.id,
          image.name,
          await response.arrayBuffer(),
          image.contentType,
        );
        await attachRequestMedia(request.id, path, image.contentType, image.byteSize);
      }
      setMatches(await generateMatches(request.id));
    } catch (caught) {
      Alert.alert(
        'Request not submitted',
        caught instanceof Error ? caught.message : 'Check the form and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const choose = async (workerId: string) => {
    if (!requestId) return;
    setBusy(true);
    try {
      await selectWorker(requestId, workerId);
      router.replace('/(user)/bookings');
    } catch (caught) {
      Alert.alert(
        'Worker unavailable',
        caught instanceof Error ? caught.message : 'Choose another worker.',
      );
    } finally {
      setBusy(false);
    }
  };

  const message = async (workerId: string) => {
    if (!requestId) return;
    try {
      const conversation = await startWorkerConversation(requestId, workerId);
      router.push({
        pathname: '/(user)/conversation' as never,
        params: { conversationId: conversation.id },
      });
    } catch (caught) {
      Alert.alert(
        'Conversation unavailable',
        caught instanceof Error ? caught.message : 'Try again.',
      );
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 40 }}>
        <Heading
          eyebrow="Send request"
          title="Describe the service"
          body="All required values are validated again by the backend before an open request is created."
        />
        <DataState loading={loading} error={error} />
        <Text style={{ color: colors.muted, fontWeight: '700' }}>Service category</Text>
        {categories.map((category) => (
          <FeatureCard
            key={category.id}
            icon={categoryId === category.id ? '✓' : '○'}
            title={category.name}
            body={category.description ?? 'Available service'}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
        <Field
          label="Issue description"
          multiline
          value={description}
          onChangeText={setDescription}
          maxLength={4000}
          placeholder="Describe the service needed"
        />
        <Button
          title={image ? `Photo selected: ${image.name}` : 'Add optional issue photo'}
          variant="secondary"
          onPress={() => void pickImage()}
        />
        <Field label="Service address" value={line1} onChangeText={setLine1} maxLength={255} />
        <Field label="Barangay" value={barangay} onChangeText={setBarangay} maxLength={120} />
        <Field label="City" value={city} onChangeText={setCity} maxLength={120} />
        <Field label="Province" value={province} onChangeText={setProvince} maxLength={120} />
        <Field
          label="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="decimal-pad"
          placeholder="14.5995"
        />
        <Field
          label="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="decimal-pad"
          placeholder="120.9842"
        />
        <Field
          label="Schedule (ISO date/time)"
          value={schedule}
          onChangeText={setSchedule}
          autoCapitalize="none"
        />
        <Field
          label="Budget (PHP)"
          value={budget}
          onChangeText={setBudget}
          keyboardType="decimal-pad"
        />
        <Field
          label="Notes (optional)"
          multiline
          value={notes}
          onChangeText={setNotes}
          maxLength={2000}
        />
        {!requestId ? (
          <Button
            title={busy ? 'Submitting…' : 'Submit and find workers'}
            disabled={
              busy ||
              !categoryId ||
              description.trim().length < 10 ||
              !line1 ||
              !barangay ||
              !city ||
              !province ||
              Number(budget) <= 0
            }
            onPress={() => void submit()}
          />
        ) : null}
        {requestId && !matches.length ? (
          <StatusBadge label="No eligible workers yet · request remains open" tone="warning" />
        ) : null}
        {matches.map((match) => (
          <View key={match.worker_id} style={{ gap: 8 }}>
            <FeatureCard
              icon={`#${match.rank}`}
              title={`Worker ${match.worker_id.slice(0, 8)}`}
              body={`Suitability ${match.score} · ${JSON.stringify(match.factors)}`}
            />
            <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
              <Button
                title="Message"
                variant="secondary"
                onPress={() => void message(match.worker_id)}
              />
              <Button
                title="Select worker"
                disabled={busy}
                onPress={() => void choose(match.worker_id)}
              />
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
