import type { AiAnalysisResult, AiInputType } from '@ayos/contracts';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { Button, FeatureCard, Field, Heading } from '@/components';
import { analyzeIssue, saveAiAnalysis, uploadPrivateObject } from '@/repository';
import { useSession } from '@/session';
import { colors } from '@/theme';

export default function AiAssistantPage() {
  const router = useRouter();
  const { account } = useSession();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [description, setDescription] = useState('');
  const [draft, setDraft] = useState('');
  const [result, setResult] = useState<AiAnalysisResult>();
  const [analysisId, setAnalysisId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async (inputType: AiInputType, text?: string, storagePath?: string) => {
    setBusy(true);
    try {
      const response = await analyzeIssue({
        inputType,
        idempotencyKey: crypto.randomUUID(),
        ...(text ? { text } : {}),
        ...(storagePath ? { storagePath } : {}),
      });
      setResult(response.result);
      setAnalysisId(response.analysisId);
      setSaved(false);
      setDraft(response.result.requestDraft);
    } catch (error) {
      Alert.alert(
        'Analysis unavailable',
        error instanceof Error ? error.message : 'The issue could not be analyzed.',
      );
    } finally {
      setBusy(false);
    }
  };

  const analyzeImage = async () => {
    if (!account) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      return Alert.alert(
        'Permission denied',
        'Photo access is required only for the image you choose.',
      );
    const selected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });
    const asset = selected.assets?.[0];
    if (selected.canceled || !asset) return;
    setBusy(true);
    try {
      const response = await fetch(asset.uri);
      const contentType = asset.mimeType ?? response.headers.get('content-type') ?? 'image/jpeg';
      const path = await uploadPrivateObject(
        'request-media',
        account.id,
        crypto.randomUUID(),
        asset.fileName ?? 'issue.jpg',
        await response.arrayBuffer(),
        contentType,
      );
      await submit('IMAGE', description.trim() || undefined, path);
    } catch (error) {
      setBusy(false);
      Alert.alert(
        'Image unavailable',
        error instanceof Error ? error.message : 'The image could not be uploaded.',
      );
    }
  };

  const recordVoice = async () => {
    if (!account) return;
    if (!recorderState.isRecording) {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted)
        return Alert.alert(
          'Permission denied',
          'Microphone access is required only while recording your description.',
        );
      await recorder.prepareToRecordAsync();
      recorder.record({ forDuration: 120 });
      return;
    }
    await recorder.stop();
    if (!recorder.uri)
      return Alert.alert('Recording unavailable', 'No voice recording was produced.');
    setBusy(true);
    try {
      const response = await fetch(recorder.uri);
      const path = await uploadPrivateObject(
        'message-attachments',
        account.id,
        crypto.randomUUID(),
        'issue-voice.m4a',
        await response.arrayBuffer(),
        response.headers.get('content-type') ?? 'audio/mp4',
      );
      await submit('VOICE', undefined, path);
    } catch (error) {
      setBusy(false);
      Alert.alert(
        'Recording unavailable',
        error instanceof Error ? error.message : 'The recording could not be uploaded.',
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 22, gap: 14 }}
    >
      <Heading
        eyebrow="Optional assistant"
        title="Analyze an issue"
        body="Use text, an image, or a voice description. AI output is a draft and must be reviewed before creating a request."
      />
      <Field
        label="Describe the issue"
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="What do you see, hear, or need fixed?"
      />
      <Button
        title={busy ? 'Analyzing…' : 'Analyze description'}
        disabled={busy || description.trim().length < 10}
        onPress={() => void submit('TEXT', description.trim())}
      />
      <FeatureCard
        icon="📷"
        title="Analyze issue image"
        body="Upload one private image after granting photo access."
        onPress={() => {
          if (!busy) void analyzeImage();
        }}
      />
      <FeatureCard
        icon="🎙️"
        title={
          recorderState.isRecording ? 'Stop and analyze recording' : 'Record spoken description'
        }
        body={
          recorderState.isRecording
            ? `Recording: ${Math.round(recorderState.durationMillis / 1000)} seconds`
            : 'Microphone access is requested only when recording begins.'
        }
        onPress={() => {
          if (!busy) void recordVoice();
        }}
      />
      {result ? (
        <>
          <FeatureCard
            icon="🔎"
            title={result.detectedIssue}
            body={`${result.severity} severity · Possible cause: ${result.possibleCause}`}
          />
          <FeatureCard
            icon="🧰"
            title={result.suggestedCategory}
            body={`Estimated ₱${result.estimatedCostMinimum.toLocaleString()}–₱${result.estimatedCostMaximum.toLocaleString()}`}
          />
          <FeatureCard icon="🛡️" title="Safety advice" body={result.safetyAdvice} />
          <Text style={{ color: colors.muted, fontSize: 12 }}>Editable request draft</Text>
          <Field label="Review and edit" multiline value={draft} onChangeText={setDraft} />
          <Button
            title={saved ? 'Analysis saved ✓' : 'Save analysis'}
            variant="secondary"
            disabled={busy || saved || !analysisId}
            onPress={() => {
              if (!analysisId) return;
              setBusy(true);
              void saveAiAnalysis(analysisId)
                .then(() => setSaved(true))
                .catch((error: unknown) =>
                  Alert.alert(
                    'Save unavailable',
                    error instanceof Error ? error.message : 'The analysis could not be saved.',
                  ),
                )
                .finally(() => setBusy(false));
            }}
          />
          <Button
            title="Use draft in request"
            disabled={draft.trim().length < 10}
            onPress={() =>
              router.push({
                pathname: '/(user)/request',
                params: { draft, aiAnalysisId: analysisId },
              })
            }
          />
        </>
      ) : null}
    </ScrollView>
  );
}
