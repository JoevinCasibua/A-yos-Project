import React from 'react';
import { WorkerMessagesList, WorkerChatItem } from '@/components/worker/WorkerMessagesList';

const MOCK_CHATS: WorkerChatItem[] = [
  { id: '1', name: 'Maria Santos', lastMessage: 'Thank you for the service!', time: '9:45 AM', unread: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Juan Dela Cruz', lastMessage: 'See you tomorrow at 10am', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Ana Gonzales', lastMessage: 'Can you come earlier?', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' },
];

export default function WorkerMessagesScreen() {
  return (
    <WorkerMessagesList
      chats={MOCK_CHATS}
      emptyDescription="When a customer contacts you, the conversation will appear here."
    />
  );
}
