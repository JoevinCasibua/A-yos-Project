import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMessages,
  sendMessage,
  getConversations,
} from '@/services/chat.service';
import type { SendMessagePayload } from '@/services/chat.service';

export function useChat(userId: string, workerId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['chat', 'messages', userId, workerId],
    queryFn: () => getMessages(userId, workerId),
    enabled: !!userId && !!workerId,
  });

  const mutation = useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat', 'messages', userId, workerId],
      });
    },
  });

  return { ...query, sendMessage: mutation };
}

export function useConversations(userId: string) {
  return useQuery({
    queryKey: ['chat', 'conversations', userId],
    queryFn: () => getConversations(userId),
    enabled: !!userId,
  });
}
