import { EmptyState, Heading, Screen } from '@/components';
export default function MessagesPage() {
  return (
    <Screen>
      <Heading
        eyebrow="Messages"
        title="Conversations"
        body="Authorized chats may contain images, location shares, optional voice messages, and Filipino-English translations that preserve the original."
      />
      <EmptyState
        title="No conversations"
        body="Start a conversation from an eligible worker profile or active booking."
      />
    </Screen>
  );
}
