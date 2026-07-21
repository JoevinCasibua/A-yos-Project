import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { EmptyState } from '@/components/layout/EmptyState';
import { MessageSquare } from 'lucide-react-native';
import { Image } from 'expo-image';

const MOCK_CHATS = [
  { id: '1', name: 'Maria Santos', lastMessage: 'Thank you for the service!', time: '9:45 AM', unread: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Juan Dela Cruz', lastMessage: 'See you tomorrow at 10am', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Ana Gonzales', lastMessage: 'Can you come earlier?', time: 'Yesterday', unread: 0, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop' },
];

export default function WorkerMessagesScreen() {
  const router = useRouter();

  return (
    <Screen safeArea>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>Messages</Text>
      </View>
      <ScrollView style={styles.content}>
        {MOCK_CHATS.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Messages Yet"
            description="When a customer contacts you, the conversation will appear here."
          />
        ) : (
          MOCK_CHATS.map(chat => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatRow}
              onPress={() => router.push(`/messages/chat?id=${chat.id}`)}
            >
              <Image source={chat.avatar} style={styles.avatar} contentFit="cover" />
              <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                  <Text style={theme.typography.h4}>{chat.name}</Text>
                  <Text style={[theme.typography.caption, { color: chat.unread > 0 ? theme.colors.primary : theme.colors.textSecondary }]}>
                    {chat.time}
                  </Text>
                </View>
                <View style={styles.chatFooter}>
                  <Text
                    style={[theme.typography.body2, { color: chat.unread > 0 ? theme.colors.textPrimary : theme.colors.textSecondary, flex: 1 }]}
                    numberOfLines={1}
                  >
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={{ color: theme.colors.surface, fontSize: 10, fontWeight: '700' }}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.border, marginRight: theme.spacing.md },
  chatDetails: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unreadBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: theme.spacing.sm },
});
