import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, DataState, EmptyState, Field, Heading, Screen } from '@/components';
import {
  attachMessageMedia,
  listMessages,
  sendMessage,
  subscribeToConversation,
  uploadPrivateObject,
} from '@/repository';
import { useSession } from '@/session';
import { colors } from '@/theme';
import { useAsyncData } from '@/useAsyncData';

export default function ConversationPage() {
  const { conversationId } = useLocalSearchParams<{ conversationId?: string }>();
  const { account } = useSession();
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset>();
  const load = useCallback(
    () => (conversationId ? listMessages(conversationId) : Promise.resolve([])),
    [conversationId],
  );
  const { data = [], error, loading, refresh } = useAsyncData(load);
  useEffect(() => {
    if (!conversationId) return;
    return subscribeToConversation(conversationId, () => void refresh());
  }, [conversationId, refresh]);
  const submit = async () => {
    if (!conversationId || !account || body.trim().length < 1) return;
    setSending(true);
    try {
      const message = await sendMessage(conversationId, account.id, body);
      if (photo) {
        const response = await fetch(photo.uri);
        const contentType = photo.mimeType ?? response.headers.get('content-type') ?? 'image/jpeg';
        const bytes = await response.arrayBuffer();
        const path = await uploadPrivateObject(
          'message-attachments',
          account.id,
          message.id,
          photo.fileName ?? 'message.jpg',
          bytes,
          contentType,
        );
        await attachMessageMedia({
          message_id: message.id,
          kind: 'IMAGE',
          storage_path: path,
          content_type: contentType,
          byte_size: bytes.byteLength,
        });
      }
      setBody('');
      setPhoto(undefined);
      await refresh();
    } catch (caught) {
      Alert.alert('Message failed', caught instanceof Error ? caught.message : 'Try again.');
    } finally {
      setSending(false);
    }
  };
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        <Heading
          eyebrow="Private chat"
          title="Conversation"
          body="Original messages are retained. Translation is unavailable until its provider is configured."
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data.length ? (
          <EmptyState title="No messages" body="Send the first message below." />
        ) : null}
        {data.map((message) => (
          <Text
            key={message.id}
            style={{
              alignSelf: message.sender_id === account?.id ? 'flex-end' : 'flex-start',
              maxWidth: '82%',
              color: colors.text,
              backgroundColor: message.sender_id === account?.id ? colors.panelSoft : colors.panel,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 14,
              padding: 12,
            }}
          >
            {message.body}
          </Text>
        ))}
        <Field
          label="Message"
          value={body}
          onChangeText={setBody}
          maxLength={4000}
          multiline
          placeholder="Type a message…"
        />
        <Button
          title={photo ? `Photo selected: ${photo.fileName ?? 'image'}` : 'Attach image'}
          variant="secondary"
          disabled={sending}
          onPress={() =>
            void ImagePicker.requestMediaLibraryPermissionsAsync().then(async (permission) => {
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
            })
          }
        />
        <Button
          title={sending ? 'Sending…' : 'Send'}
          disabled={sending || !body.trim()}
          onPress={() => void submit()}
        />
      </ScrollView>
    </Screen>
  );
}
import * as ImagePicker from 'expo-image-picker';
