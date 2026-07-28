export type ChatSender = 'user' | 'worker' | 'customer';
export type ChatMessageType = 'text' | 'voice' | 'image' | 'location';

export interface ChatMessage {
  id: string;
  text?: string;
  translation?: string;
  sender: ChatSender;
  timestamp: string;
  type: ChatMessageType;
  voiceDuration?: number;
  imageUrl?: string;
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
  };
}

export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}
