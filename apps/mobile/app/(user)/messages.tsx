import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DataState, EmptyState, FeatureCard, Heading, Screen } from '@/components';
import { listConversations } from '@/repository';
import { useAsyncData } from '@/useAsyncData';

export default function MessagesPage() {
  const router = useRouter();
  const load = useCallback(() => listConversations(), []);
  const { data = [], error, loading } = useAsyncData(load);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 30 }}>
        <Heading
          eyebrow="Messages"
          title="Conversations"
          body="Only booking participants and eligible pre-selection contacts can open these chats."
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data.length ? (
          <EmptyState
            title="No conversations"
            body="Start a conversation from an eligible match or booking."
          />
        ) : null}
        {data.map((conversation) => (
          <FeatureCard
            key={conversation.id}
            icon="💬"
            title={`Conversation ${conversation.id.slice(0, 8)}`}
            body={`Updated ${new Date(conversation.updated_at).toLocaleString()}`}
            onPress={() =>
              router.push({
                pathname: '/(user)/conversation' as never,
                params: { conversationId: conversation.id },
              })
            }
          />
        ))}
      </ScrollView>
    </Screen>
  );
}
