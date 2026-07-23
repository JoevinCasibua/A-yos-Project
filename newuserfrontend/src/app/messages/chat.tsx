import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, FlatList, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../../theme';
import { ArrowLeft, Send, MapPin, Mic, Image as ImageIcon, Languages, Play, Square, Activity, Paperclip, Camera, Globe } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useWorkerStore } from '../../store/useWorkerStore';

type MessageType = 'text' | 'image' | 'location' | 'voice';

interface Message {
  id: string;
  type: MessageType;
  sender: 'user' | 'worker';
  text?: string;
  translation?: string; // Mock translation for Filipino
  imageUrl?: string;
  locationLabel?: string;
  duration?: string; // For voice message
  timestamp: string;
}

const MOCK_MESSAGES: Message[] = [
  { id: '1', type: 'text', sender: 'user', text: 'Hi, are you available today?', timestamp: '10:00 AM' },
  { id: '2', type: 'text', sender: 'worker', text: 'Opo sir, available po ako ngayon. Ano po ang kailangan ayusin?', translation: 'Yes sir, I am available today. What needs to be fixed?', timestamp: '10:02 AM' },
];

const QUICK_REPLIES = [
  "Can you come today?",
  "Do you bring your own tools?",
  "How much will the repair cost?",
  "Do I need to buy replacement parts?",
];

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const worker = useWorkerStore(state => state.getWorkerById(id as string)) || {
    id: 'mock',
    name: 'Mario Rossi',
    skill: 'Master Plumber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  };

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const handleHire = () => {
    setShowConfirm(false);
    router.push(`/tracking/${worker.id}` as any);
  };

  const toggleTranslation = (id: string) => {
    setTranslatedMessages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const togglePlayVoice = (id: string) => {
    setIsPlaying(prev => prev === id ? null : id);
  };

  const sendMessage = (newMsg: Omit<Message, 'id' | 'timestamp'>) => {
    const msg: Message = {
      ...newMsg,
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, msg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSendText = (text: string) => {
    if (!text.trim()) return;
    sendMessage({ type: 'text', sender: 'user', text: text.trim() });
    setInputText('');
  };

  const handleSendImageMock = () => {
    sendMessage({ 
      type: 'image', 
      sender: 'user', 
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop' 
    });
  };

  const handleSendLocationMock = () => {
    sendMessage({ 
      type: 'location', 
      sender: 'user', 
      locationLabel: 'My Current Location (123 Main St)' 
    });
  };

  const handleSendVoiceMock = () => {
    sendMessage({ 
      type: 'voice', 
      sender: 'user', 
      duration: '0:12' 
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    const showTranslation = translatedMessages[item.id];

    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowWorker]}>
        
        <View style={[styles.messageBubble, isUser ? styles.bubbleUser : styles.bubbleWorker]}>
          
          {/* TEXT */}
          {item.type === 'text' && (
            <>
              <Text style={[styles.messageText, isUser ? { color: theme.colors.surface } : { color: theme.colors.textPrimary }]}>
                {item.text}
              </Text>
              {item.translation && showTranslation && (
                <View style={styles.translationContainer}>
                  <Text style={[styles.messageText, { color: theme.colors.primary, fontStyle: 'italic' }]}>
                    English: {item.translation}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* IMAGE */}
          {item.type === 'image' && (
            <Image source={item.imageUrl} style={styles.attachmentImage} contentFit="cover" />
          )}

          {/* LOCATION */}
          {item.type === 'location' && (
            <View style={styles.locationContainer}>
              <View style={styles.mockMapSnippet}>
                 <Image source={require('../../../assets/map-bg.png')} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                 <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' }]}>
                   <MapPin color={theme.colors.error} size={24} />
                 </View>
              </View>
              <Text style={[styles.messageText, isUser ? { color: theme.colors.surface } : { color: theme.colors.textPrimary }, { marginTop: 8 }]}>
                {item.locationLabel}
              </Text>
            </View>
          )}

          {/* VOICE */}
          {item.type === 'voice' && (
            <View style={styles.voiceContainer}>
              <TouchableOpacity style={styles.playBtn} onPress={() => togglePlayVoice(item.id)}>
                {isPlaying === item.id ? (
                  <Square color={theme.colors.surface} size={14} fill={theme.colors.surface} />
                ) : (
                  <Play color={theme.colors.surface} size={16} fill={theme.colors.surface} />
                )}
              </TouchableOpacity>
              <View style={styles.audioWave}>
                <Activity color={isUser ? theme.colors.surface : theme.colors.primary} size={24} />
                <Activity color={isUser ? theme.colors.surface : theme.colors.primary} size={24} />
                <Activity color={isUser ? theme.colors.surface : theme.colors.primary} size={24} />
              </View>
              <Text style={[styles.messageText, isUser ? { color: theme.colors.surface } : { color: theme.colors.primary }, { marginLeft: 8 }]}>
                {item.duration}
              </Text>
            </View>
          )}

          <Text style={[styles.timestamp, isUser ? { color: 'rgba(255,255,255,0.7)' } : { color: theme.colors.textTertiary }]}>
            {item.timestamp}
          </Text>
          
          {/* Translation Button */}
          {item.translation && (
            <TouchableOpacity style={styles.translateBtn} onPress={() => toggleTranslation(item.id)}>
              <Languages color={isUser ? theme.colors.surface : theme.colors.primary} size={14} />
              <Text style={[styles.translateBtnText, { color: isUser ? theme.colors.surface : theme.colors.primary }]}>
                {showTranslation ? 'Hide Translation' : 'See Translation'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header layout matching provided design */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Image source={worker.avatar} style={styles.headerAvatar} contentFit="cover" />
          <View style={styles.headerInfo}>
            <Text style={[theme.typography.body1, { fontWeight: '700' }]}>{worker.name}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.success || '#10b981' }]}>Online</Text>
          </View>
        </View>
        
        {/* Hire Button moved to Header */}
        <TouchableOpacity style={styles.hireBtn} onPress={() => setShowConfirm(true)}>
          <Text style={[theme.typography.button, { color: theme.colors.surface, fontSize: 13 }]}>Hire Worker</Text>
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Replies matching provided design */}
      <View style={styles.quickRepliesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesList}>
          {QUICK_REPLIES.map((reply, idx) => (
            <Pressable key={idx} style={styles.quickReplyChip} onPress={() => handleSendText(reply)}>
              <Text style={{ fontSize: 13, color: theme.colors.primary }}>{reply}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Floating Attachments Menu */}
      {showAttachments && (
        <View style={styles.popupMenu}>
          {/* Triangle Tail */}
          <View style={styles.popupTail} />
          
          <Pressable style={styles.popupItem} onPress={() => { handleSendImageMock(); setShowAttachments(false); }}>
            <View style={[styles.popupIconBg, { backgroundColor: '#e0f2fe' }]}>
              <Camera size={20} color="#0284c7" />
            </View>
            <Text style={styles.popupItemText}>Camera</Text>
          </Pressable>

          <Pressable style={styles.popupItem} onPress={() => { handleSendImageMock(); setShowAttachments(false); }}>
            <View style={[styles.popupIconBg, { backgroundColor: '#dcfce7' }]}>
              <ImageIcon size={20} color="#16a34a" />
            </View>
            <Text style={styles.popupItemText}>Gallery</Text>
          </Pressable>

          <Pressable style={styles.popupItem} onPress={() => { handleSendLocationMock(); setShowAttachments(false); }}>
            <View style={[styles.popupIconBg, { backgroundColor: '#fee2e2' }]}>
              <MapPin size={20} color="#dc2626" />
            </View>
            <Text style={styles.popupItemText}>Location</Text>
          </Pressable>

          <Pressable style={styles.popupItem} onPress={() => { handleSendVoiceMock(); setShowAttachments(false); }}>
            <View style={[styles.popupIconBg, { backgroundColor: '#fef3c7' }]}>
              <Mic size={20} color="#d97706" />
            </View>
            <Text style={styles.popupItemText}>Voice Message</Text>
          </Pressable>

          <Pressable style={styles.popupItem} onPress={() => setShowAttachments(false)}>
            <View style={[styles.popupIconBg, { backgroundColor: '#f3f4f6' }]}>
              <Globe size={20} color="#4b5563" />
            </View>
            <Text style={styles.popupItemText}>Translate</Text>
          </Pressable>
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom || theme.spacing.md }]}>
        <Pressable style={styles.attachMenuBtn} onPress={() => setShowAttachments(!showAttachments)}>
          <Paperclip size={24} color={theme.colors.textSecondary} />
        </Pressable>
        
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
        </View>
        <Pressable 
          style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} 
          onPress={() => handleSendText(inputText)}
          disabled={!inputText.trim()}
        >
          <Send size={24} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {/* Hire Confirm Modal */}
      {showConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[theme.typography.h3, { marginBottom: theme.spacing.sm }]}>Confirm Hiring</Text>
            <Text style={[theme.typography.body1, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xl, textAlign: 'center' }]}>
              Are you sure you want to hire {worker.name} for this job?
            </Text>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleHire}
            >
              <Text style={[theme.typography.button, { color: theme.colors.surface }]}>Yes, Hire Worker</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.colors.background, marginTop: theme.spacing.sm }]}
              onPress={() => setShowConfirm(false)}
            >
              <Text style={[theme.typography.button, { color: theme.colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: theme.spacing.md,
  },
  hireBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
  },
  chatContent: {
    padding: theme.layout.screenPadding,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowWorker: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleWorker: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  quickRepliesContainer: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
  },
  quickRepliesList: {
    paddingHorizontal: theme.layout.screenPadding,
    gap: theme.spacing.sm,
  },
  quickReplyChip: {
    backgroundColor: `${theme.colors.primary}10`, // primarySurface equivalent
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}30`, // primaryLight equivalent
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  attachMenuBtn: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    marginBottom: 8,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupMenu: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 200,
    ...theme.shadows.md,
    zIndex: 10,
  },
  popupTail: {
    position: 'absolute',
    bottom: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.surface,
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  popupIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  popupItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.md : 4,
    minHeight: 44,
    maxHeight: 120,
    justifyContent: 'center',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    marginBottom: 8,
  },

  /* Translation and Media Specific Styles */
  translationContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' },
  translateBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  translateBtnText: { fontSize: 12, marginLeft: 4, fontWeight: '500' },
  attachmentImage: { width: 200, height: 150, borderRadius: 8 },
  locationContainer: { width: 200 },
  mockMapSnippet: { width: '100%', height: 100, borderRadius: 8, overflow: 'hidden', backgroundColor: '#e5e7eb' },
  voiceContainer: { flexDirection: 'row', alignItems: 'center', width: 200 },
  playBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  audioWave: { flex: 1, flexDirection: 'row', height: 24, marginLeft: 8, alignItems: 'center', overflow: 'hidden' },

  /* Modal Specific Styles */
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalContent: { backgroundColor: theme.colors.surface, width: '85%', padding: theme.spacing.xl, borderRadius: theme.radius.lg, alignItems: 'center' },
  modalButton: { width: '100%', paddingVertical: theme.spacing.md, borderRadius: theme.radius.md, alignItems: 'center' },
});
