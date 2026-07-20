import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, DataState, FeatureCard, Field, Heading, Screen, StatusBadge } from '@/components';
import {
  getWorkerOnboarding,
  saveWorkerAvailability,
  saveWorkerProfile,
  saveWorkerSkill,
  setWorkerServiceArea,
  submitWorkerVerification,
  uploadPrivateObject,
} from '@/repository';
import { useSession } from '@/session';
import { useAsyncData } from '@/useAsyncData';

export default function WorkerOnboardingPage() {
  const { account } = useSession();
  const load = useCallback(
    () =>
      account
        ? getWorkerOnboarding(account.id)
        : Promise.reject(new Error('Authentication is required.')),
    [account],
  );
  const { data, error, loading, refresh } = useAsyncData(load);
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [years, setYears] = useState('0');
  const [day, setDay] = useState('1');
  const [start, setStart] = useState('08:00');
  const [end, setEnd] = useState('17:00');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('5000');
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [documentPath, setDocumentPath] = useState<string>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data?.profile) return;
    setBio(data.profile.bio ?? '');
    setExperience(data.profile.experience ?? '');
    setServiceArea(data.profile.service_area ?? '');
  }, [data]);

  const save = async () => {
    if (!account) return;
    setBusy(true);
    try {
      await saveWorkerProfile(account.id, {
        bio,
        experience,
        service_area: serviceArea,
        is_available: data?.profile?.approval_status === 'APPROVED',
      });
      if (categoryId) await saveWorkerSkill(account.id, categoryId, Number(years));
      await saveWorkerAvailability(account.id, Number(day), start, end);
      await setWorkerServiceArea(
        { latitude: Number(latitude), longitude: Number(longitude) },
        Number(radius),
      );
      await refresh();
      Alert.alert('Profile saved', 'Professional information and availability were updated.');
    } catch (caught) {
      Alert.alert(
        'Save failed',
        caught instanceof Error ? caught.message : 'Check the form and try again.',
      );
    } finally {
      setBusy(false);
    }
  };

  const pickDocument = async () => {
    if (!account) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      return Alert.alert(
        'Permission denied',
        'Photo access is required only for the ID image you select.',
      );
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    setBusy(true);
    try {
      const response = await fetch(asset.uri);
      const path = await uploadPrivateObject(
        'verification-documents',
        account.id,
        'identity',
        asset.fileName ?? 'identity.jpg',
        await response.arrayBuffer(),
        asset.mimeType ?? 'image/jpeg',
      );
      setDocumentPath(path);
    } catch (caught) {
      Alert.alert('Upload failed', caught instanceof Error ? caught.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitVerification = async () => {
    if (!account || !documentPath) return;
    setBusy(true);
    try {
      await submitWorkerVerification(
        account.id,
        { idType: idType.trim(), idNumber: idNumber.trim() },
        [documentPath],
      );
      await refresh();
      Alert.alert(
        'Submitted for review',
        'An administrator can now approve, reject, or request clearer documents.',
      );
    } catch (caught) {
      Alert.alert('Submission failed', caught instanceof Error ? caught.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 40 }}>
        <Heading
          eyebrow="Professional onboarding"
          title="Complete your worker profile"
          body="Only verified persisted fields are collected. Pricing and portfolio controls are excluded because no backend contract exists."
        />
        <DataState loading={loading} error={error} />
        {data ? (
          <StatusBadge
            label={data.profile?.approval_status ?? 'PENDING'}
            tone={data.profile?.approval_status === 'APPROVED' ? 'success' : 'warning'}
          />
        ) : null}
        <Field
          label="Professional bio"
          value={bio}
          onChangeText={setBio}
          multiline
          maxLength={2000}
        />
        <Field
          label="Work experience"
          value={experience}
          onChangeText={setExperience}
          multiline
          maxLength={4000}
        />
        <Field
          label="Service area label"
          value={serviceArea}
          onChangeText={setServiceArea}
          maxLength={255}
        />
        {data?.categories.map((category) => (
          <FeatureCard
            key={category.id}
            icon={categoryId === category.id ? '✓' : '○'}
            title={category.name}
            body={category.description ?? 'Service category'}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
        <Field
          label="Years in selected category"
          value={years}
          onChangeText={setYears}
          keyboardType="number-pad"
        />
        <Field
          label="Available day (0 Sunday–6 Saturday)"
          value={day}
          onChangeText={setDay}
          keyboardType="number-pad"
        />
        <Field label="Start time (HH:MM)" value={start} onChangeText={setStart} />
        <Field label="End time (HH:MM)" value={end} onChangeText={setEnd} />
        <Field
          label="Service origin latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="decimal-pad"
        />
        <Field
          label="Service origin longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="decimal-pad"
        />
        <Field
          label="Service radius (meters)"
          value={radius}
          onChangeText={setRadius}
          keyboardType="number-pad"
        />
        <Button
          title={busy ? 'Saving…' : 'Save professional details'}
          disabled={busy || !categoryId || !serviceArea || Number(radius) < 100}
          onPress={() => void save()}
        />
        <Heading
          eyebrow="Identity review"
          title="Submit verification"
          body={
            data?.verification?.requested_notes ??
            'Identity images remain private to you and authorized administrators.'
          }
        />
        <Field label="ID type" value={idType} onChangeText={setIdType} maxLength={80} />
        <Field
          label="ID number"
          value={idNumber}
          onChangeText={setIdNumber}
          maxLength={120}
          secureTextEntry
        />
        <Button
          title={documentPath ? 'ID image selected ✓' : 'Choose ID image'}
          variant="secondary"
          disabled={busy}
          onPress={() => void pickDocument()}
        />
        <Button
          title={busy ? 'Submitting…' : 'Submit for administrator review'}
          disabled={busy || !idType.trim() || !idNumber.trim() || !documentPath}
          onPress={() => void submitVerification()}
        />
      </ScrollView>
    </Screen>
  );
}
