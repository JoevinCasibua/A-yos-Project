import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../../theme';
import { ArrowLeft, Send, Paperclip, MapPin, Phone, Mic, Image as ImageIcon, Languages, Play, Square, Activity } from 'lucide-react-native';
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
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({}); // track which messages have translation shown
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

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
    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    sendMessage({ type: 'text', sender: 'user', text: inputText.trim() });
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
        {!isUser && (
          <Image source={worker.avatar} style={styles.chatAvatar} contentFit="cover" />
        )}
        
        <View style={styles.bubbleWrapper}>
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

          </View>

          {/* Translation Button */}
          {item.translation && (
            <TouchableOpacity style={styles.translateBtn} onPress={() => toggleTranslation(item.id)}>
              <Languages color={theme.colors.primary} size={14} />
              <Text style={styles.translateBtnText}>{showTranslation ? 'Hide Translation' : 'See Translation'}</Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.timestamp, isUser ? { alignSelf: 'flex-end', marginRight: 4 } : { alignSelf: 'flex-start', marginLeft: 4 }]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image 
            source={worker.avatar} 
            style={styles.headerAvatar} 
            contentFit="cover" 
          />
          <View>
            <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>{worker.name}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Phone color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Bar */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || theme.spacing.md }]}>
        <View style={styles.attachmentRow}>
          <TouchableOpacity style={styles.attachBtn} onPress={handleSendImageMock}>
            <ImageIcon color={theme.colors.textSecondary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachBtn} onPress={handleSendLocationMock}>
            <MapPin color={theme.colors.textSecondary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachBtn} onPress={handleSendVoiceMock}>
            <Mic color={theme.colors.textSecondary} size={22} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]} 
            onPress={handleSendText}
            disabled={!inputText.trim()}
          >
            <Send color={theme.colors.surface} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.md, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitleContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  
  listContainer: { paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.md },
  
  messageRow: { flexDirection: 'row', marginBottom: theme.spacing.lg },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowWorker: { justifyContent: 'flex-start' },
  chatAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8, alignSelf: 'flex-end' },
  
  bubbleWrapper: { maxWidth: '75%' },
  messageBubble: { padding: 12, borderRadius: 16 },
  bubbleUser: { backgroundColor: theme.colors.primary, borderBottomRightRadius: 4 },
  bubbleWorker: { backgroundColor: theme.colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.colors.borderLight },
  messageText: { fontSize: 15, lineHeight: 22 },
  
  translationContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' },
  translateBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginLeft: 4 },
  translateBtnText: { fontSize: 12, color: theme.colors.primary, marginLeft: 4, fontWeight: '500' },
  
  timestamp: { fontSize: 11, color: theme.colors.textTertiary, marginTop: 4 },

  attachmentImage: { width: 200, height: 150, borderRadius: 8 },
  
  locationContainer: { width: 200 },
  mockMapSnippet: { width: '100%', height: 100, borderRadius: 8, overflow: 'hidden', backgroundColor: '#e5e7eb' },

  voiceContainer: { flexDirection: 'row', alignItems: 'center', width: 200 },
  playBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  audioWave: { flex: 1, flexDirection: 'row', height: 24, marginLeft: 8, alignItems: 'center', overflow: 'hidden' },

  inputContainer: { paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.sm, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  attachmentRow: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4 },
  attachBtn: { marginRight: 20, padding: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  textInput: { flex: 1, backgroundColor: theme.colors.background, borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, minHeight: 44, maxHeight: 100, fontSize: 15, color: theme.colors.textPrimary },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
});
