import React from 'react';
import { MessagesList, ChatItem } from '@/components/MessagesList';

const MOCK_CHATS: ChatItem[] = [
  { id: '1', name: 'Mario Rossi', lastMessage: 'I am on my way!', time: '10:12 AM', unread: 1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Luigi Verdi', lastMessage: 'Thank you for booking.', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
];

export default function MessagesListScreen() {
  return (
    <MessagesList
      chats={MOCK_CHATS}
      emptyDescription="When you contact a service professional, your conversation will appear here."
    />
  );
}
