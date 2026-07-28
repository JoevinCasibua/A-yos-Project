import type { ChatMessage, ChatItem } from '@/types';

export interface SendMessagePayload {
  conversationId: string;
  text?: string;
  sender: 'user' | 'worker' | 'customer';
  type?: 'text' | 'voice' | 'image' | 'location';
}

const mockChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    text: 'Hello! I saw your booking request for pipe repair. I can come by this afternoon.',
    sender: 'worker',
    timestamp: '2024-07-14T10:00:00Z',
    type: 'text',
  },
  {
    id: 'm2',
    text: 'That sounds great! What time works for you?',
    sender: 'customer',
    timestamp: '2024-07-14T10:05:00Z',
    type: 'text',
  },
  {
    id: 'm3',
    text: 'How about 2:00 PM? I can be there in about 30 minutes once we confirm.',
    sender: 'worker',
    timestamp: '2024-07-14T10:07:00Z',
    type: 'text',
  },
  {
    id: 'm4',
    text: 'Perfect, 2 PM works. The address is 123 Oak Street, Apt 4B.',
    sender: 'customer',
    timestamp: '2024-07-14T10:10:00Z',
    type: 'text',
  },
  {
    id: 'm5',
    text: 'Got it! I will head over now. Please make sure the water supply valve under the sink is turned off before I arrive.',
    sender: 'worker',
    timestamp: '2024-07-14T10:12:00Z',
    type: 'text',
  },
];

const mockConversations: ChatItem[] = [
  {
    id: 'conv-1',
    name: 'Carlos Méndez',
    lastMessage: 'I will head over now.',
    time: '10:12 AM',
    unread: 0,
    avatar: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 'conv-2',
    name: 'Sofía Ramírez',
    lastMessage: 'The wiring looks good. I will send the report tomorrow.',
    time: 'Yesterday',
    unread: 2,
    avatar: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 'conv-3',
    name: 'Diego Torres',
    lastMessage: 'Thanks for the booking!',
    time: 'Jul 10',
    unread: 0,
    avatar: 'https://images.pexels.com/photos/8961087/pexels-photo-8961087.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export async function getMessages(
  userId: string,
  workerId: string,
): Promise<ChatMessage[]> {
  // TODO: GET /chat/messages?userId=...&workerId=...
  console.log('[chat] getMessages placeholder', userId, workerId);
  return mockChatMessages;
}

export async function sendMessage(
  message: SendMessagePayload,
): Promise<ChatMessage> {
  // TODO: POST /chat/messages
  console.log('[chat] sendMessage placeholder', message);
  return {
    id: `msg-${Date.now()}`,
    text: message.text,
    sender: message.sender,
    timestamp: new Date().toISOString(),
    type: message.type ?? 'text',
  };
}

export async function getConversations(userId: string): Promise<ChatItem[]> {
  // TODO: GET /chat/conversations?userId=...
  console.log('[chat] getConversations placeholder for', userId);
  return mockConversations;
}
