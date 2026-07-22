import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput as RNTextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Paperclip,
  MapPin,
  Globe,
  Pause,
  Play,
  CheckCheck,
  X,
  Image as ImageIcon,
  Phone,
  Camera,
  Square,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { Image } from 'expo-image';
import { AnimatedWaveform } from '@/components/AnimatedWaveform';

interface ChatMessage {
  id: string;
  text?: string;
  sender: 'worker' | 'customer';
  timestamp: string;
  type: 'text' | 'voice' | 'image' | 'location';
  voiceDuration?: number;
  imageUrl?: string;
  location?: { address: string; latitude: number; longitude: number };
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', text: 'Hi, I am available for the plumbing job!', sender: 'customer', timestamp: '10:12 AM', type: 'text' },
  { id: '2', text: 'Great, what is your estimated arrival time?', sender: 'worker', timestamp: '10:13 AM', type: 'text' },
  { id: '3', text: 'I can be there in 15 minutes.', sender: 'customer', timestamp: '10:14 AM', type: 'text' },
  { id: '4', type: 'voice', sender: 'customer', timestamp: '10:15 AM', voiceDuration: 8 },
  { id: '5', type: 'image', sender: 'customer', timestamp: '10:16 AM', imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop' },
];

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voicePreviewDuration, setVoicePreviewDuration] = useState<number | null>(null);
  const [showLocationConfirm, setShowLocationConfirm] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState<string | null>(null);
  const [translateMode, setTranslateMode] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString(), timestamp }]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage({ text: inputText.trim(), sender: 'worker', type: 'text' });
    setInputText('');
  };

  const handleStartRecording = () => {
    setShowAttachMenu(false);
    setIsRecording(true);
    setIsPaused(false);
    setRecordingSeconds(0);
    recordingTimer.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handlePauseRecording = () => {
    if (recordingTimer.current) clearInterval(recordingTimer.current);
    setIsPaused(true);
  };

  const handleResumeRecording = () => {
    setIsPaused(false);
    recordingTimer.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    if (recordingTimer.current) clearInterval(recordingTimer.current);
    const duration = recordingSeconds;
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    if (duration >= 1) {
      setVoicePreviewDuration(duration);
    }
  };

  const handleCancelRecording = () => {
    if (recordingTimer.current) clearInterval(recordingTimer.current);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
  };

  const handleSendVoice = () => {
    const duration = voicePreviewDuration;
    if (!duration || duration < 1) return;
    addMessage({ sender: 'worker', type: 'voice', voiceDuration: duration });
    setVoicePreviewDuration(null);
  };

  const handleCancelVoicePreview = () => {
    setVoicePreviewDuration(null);
  };

  const handleImageAttach = (source: 'camera' | 'gallery') => {
    setShowAttachMenu(false);
    const url = source === 'camera'
      ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop';
    addMessage({ sender: 'worker', type: 'image', imageUrl: url });
  };

  const handleLocationShare = () => {
    setShowAttachMenu(false);
    setShowLocationConfirm(true);
  };

  const confirmLocationShare = () => {
    setShowLocationConfirm(false);
    addMessage({
      sender: 'worker',
      type: 'location',
      location: { address: 'Current Location — 123 Main St, Quezon City', latitude: 14.5995, longitude: 120.9842 },
    });
  };

  const handleToggleTranslate = () => {
    setTranslateMode((prev) => !prev);
    setShowAttachMenu(false);
  };

  const handleVoicePlay = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
      setTimeout(() => setPlayingVoiceId(null), 3000);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderMessage = (msg: ChatMessage) => {
    const isWorker = msg.sender === 'worker';

    if (msg.type === 'voice') {
      return (
        <View key={msg.id} style={[styles.bubble, isWorker ? styles.bubbleWorker : styles.bubbleCustomer]}>
          <Pressable
            style={styles.voiceRow}
            onPress={() => handleVoicePlay(msg.id)}
          >
            {playingVoiceId === msg.id ? (
              <Pause size={16} color={isWorker ? Colors.white : Colors.cta} />
            ) : (
              <Play size={16} color={isWorker ? Colors.white : Colors.cta} />
            )}
            <AnimatedWaveform
              barCount={12}
              color={isWorker ? 'rgba(255,255,255,0.6)' : `${Colors.cta}60`}
              active={playingVoiceId === msg.id}
              maxHeight={16}
              style={{ flex: 1 }}
            />
            <AppText variant="caption" color={isWorker ? Colors.white : Colors.textSecondary}>
              {formatDuration(msg.voiceDuration || 0)}
            </AppText>
          </Pressable>
          <AppText variant="caption" style={[styles.timestamp, isWorker && { color: 'rgba(255,255,255,0.7)' }]}>
            {msg.timestamp}
          </AppText>
        </View>
      );
    }

    if (msg.type === 'image') {
      return (
        <View key={msg.id} style={[styles.bubble, isWorker ? styles.bubbleWorker : styles.bubbleCustomer, { padding: Spacing['1'] }]}>
          <Pressable onPress={() => setShowImagePreview(msg.imageUrl || null)}>
            <Image source={msg.imageUrl} style={styles.chatImage} contentFit="cover" />
          </Pressable>
          <AppText variant="caption" style={[styles.timestamp, isWorker && { color: 'rgba(255,255,255,0.7)' }]}>
            {msg.timestamp}
          </AppText>
        </View>
      );
    }

    if (msg.type === 'location') {
      return (
        <View key={msg.id} style={[styles.bubble, isWorker ? styles.bubbleWorker : styles.bubbleCustomer]}>
          <View style={styles.locationPreview}>
            <View style={styles.locationMapPlaceholder}>
              <MapPin size={24} color={Colors.cta} />
            </View>
            <View style={styles.locationInfo}>
              <AppText variant="bodySm" weight="semiBold" color={isWorker ? Colors.white : Colors.textPrimary}>
                Shared Location
              </AppText>
              <AppText variant="caption" color={isWorker ? 'rgba(255,255,255,0.7)' : Colors.textSecondary}>
                {msg.location?.address}
              </AppText>
            </View>
          </View>
          <AppText variant="caption" style={[styles.timestamp, isWorker && { color: 'rgba(255,255,255,0.7)' }]}>
            {msg.timestamp}
          </AppText>
        </View>
      );
    }

    return (
      <View key={msg.id} style={[styles.bubble, isWorker ? styles.bubbleWorker : styles.bubbleCustomer]}>
        <AppText variant="body" color={isWorker ? Colors.white : Colors.textPrimary}>
          {msg.text}
        </AppText>
        {translateMode && !isWorker && msg.text && (
          <View style={styles.translationRow}>
            <Globe size={10} color={Colors.textTertiary} />
            <AppText variant="caption" color={Colors.textTertiary} style={{ fontStyle: 'italic' }}>
              {msg.text === 'Hi, I am available for the plumbing job!'
                ? 'Kamusta, available ako para sa plumbing job!'
                : msg.text === 'I can be there in 15 minutes.'
                  ? 'Andoon ako sa loob ng 15 minuto.'
                  : `[Filipino translation]`}
            </AppText>
          </View>
        )}
        <View style={styles.msgFooter}>
          <AppText variant="caption" style={[styles.timestamp, isWorker && { color: 'rgba(255,255,255,0.7)' }]}>
            {msg.timestamp}
          </AppText>
          {isWorker && <CheckCheck size={12} color="rgba(255,255,255,0.7)" />}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing['2'] }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Avatar uri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" size={36} />
          <View style={styles.headerInfo}>
            <AppText variant="body" weight="semiBold">Mario Rossi</AppText>
            <AppText variant="caption" color={Colors.verified}>Online</AppText>
          </View>
        </View>
        <Pressable style={styles.headerAction} onPress={() => Alert.alert('Call', 'Calling customer...')}>
          <View style={styles.actionCircle}>
            <Phone size={18} color={Colors.cta} />
          </View>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      {/* Chat Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Recording Bar */}
      {isRecording && (
        <View style={styles.recordingBar}>
          <AnimatedWaveform
            barCount={16}
            color={Colors.error}
            active={!isPaused}
            maxHeight={18}
            style={{ flex: 1 }}
          />
          <AppText variant="bodySm" weight="semiBold" color={Colors.error}>
            {formatDuration(recordingSeconds)}
          </AppText>
          <Pressable style={styles.recordingActionBtn} onPress={isPaused ? handleResumeRecording : handlePauseRecording}>
            {isPaused ? (
              <Play size={16} color={Colors.cta} />
            ) : (
              <Pause size={16} color={Colors.cta} />
            )}
          </Pressable>
          <Pressable style={[styles.recordingActionBtn, { backgroundColor: Colors.errorBg }]} onPress={handleStopRecording}>
            <Square size={14} color={Colors.error} />
          </Pressable>
        </View>
      )}

      {/* Voice Preview */}
      {voicePreviewDuration !== null && (
        <View style={styles.voicePreviewBar}>
          <Pressable
            style={styles.voicePreviewPlay}
            onPress={() => setPlayingVoiceId(playingVoiceId === 'preview' ? null : 'preview')}
          >
            {playingVoiceId === 'preview' ? (
              <Pause size={16} color={Colors.cta} />
            ) : (
              <Play size={16} color={Colors.cta} />
            )}
          </Pressable>
          <AnimatedWaveform
            barCount={16}
            color={Colors.cta}
            active={playingVoiceId === 'preview'}
            maxHeight={18}
            style={{ flex: 1 }}
          />
          <AppText variant="caption" color={Colors.textSecondary}>
            {formatDuration(voicePreviewDuration)}
          </AppText>
          <Pressable style={styles.voicePreviewCancel} onPress={handleCancelVoicePreview}>
            <X size={16} color={Colors.error} />
          </Pressable>
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom || Spacing['3'] }]}>
        <View style={styles.inputRow}>
          {/* Attach Button */}
          <Pressable style={styles.attachBtn} onPress={() => setShowAttachMenu((prev) => !prev)}>
            <Paperclip size={20} color={Colors.textSecondary} />
          </Pressable>

          {/* Text Input */}
          <View style={styles.textInputWrap}>
            <RNTextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={Colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>

          {/* Send Button */}
          <Pressable
            style={[styles.sendBtn, !inputText.trim() && !voicePreviewDuration && styles.sendBtnDisabled]}
            onPress={voicePreviewDuration ? handleSendVoice : inputText.trim() ? handleSend : undefined}
            disabled={!inputText.trim() && !voicePreviewDuration}
          >
            <Send size={20} color={inputText.trim() || voicePreviewDuration ? Colors.white : Colors.textTertiary} />
          </Pressable>
        </View>
      </View>

      {/* Attach Menu Popup */}
      {showAttachMenu && (
        <>
          <Pressable style={styles.attachOverlay} onPress={() => setShowAttachMenu(false)} />
          <View style={styles.attachBubble}>
            <View style={styles.attachBubbleArrow} />
            <Pressable style={styles.attachOption} onPress={() => handleImageAttach('camera')}>
              <View style={[styles.attachOptionIcon, { backgroundColor: Colors.infoBg }]}>
                <Camera size={18} color={Colors.info} />
              </View>
              <AppText variant="bodySm" weight="semiBold">Camera</AppText>
            </Pressable>
            <Pressable style={styles.attachOption} onPress={() => handleImageAttach('gallery')}>
              <View style={[styles.attachOptionIcon, { backgroundColor: Colors.successBg }]}>
                <ImageIcon size={18} color={Colors.verified} />
              </View>
              <AppText variant="bodySm" weight="semiBold">Gallery</AppText>
            </Pressable>
            <Pressable style={styles.attachOption} onPress={handleLocationShare}>
              <View style={[styles.attachOptionIcon, { backgroundColor: Colors.errorBg }]}>
                <MapPin size={18} color={Colors.error} />
              </View>
              <AppText variant="bodySm" weight="semiBold">Location</AppText>
            </Pressable>
            <Pressable
              style={styles.attachOption}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            >
              <View style={[styles.attachOptionIcon, { backgroundColor: isRecording ? Colors.errorBg : Colors.warningBg }]}>
                {isRecording ? <MicOff size={18} color={Colors.error} /> : <Mic size={18} color={Colors.warning} />}
              </View>
              <AppText variant="bodySm" weight="semiBold">{isRecording ? 'Stop Recording' : 'Voice Message'}</AppText>
            </Pressable>
            <Pressable style={styles.attachOption} onPress={handleToggleTranslate}>
              <View style={[styles.attachOptionIcon, { backgroundColor: translateMode ? Colors.primarySurface : Colors.surfaceLight }]}>
                <Globe size={18} color={translateMode ? Colors.cta : Colors.textTertiary} />
              </View>
              <AppText variant="bodySm" weight="semiBold">{translateMode ? 'Translate: ON' : 'Translate'}</AppText>
            </Pressable>
          </View>
        </>
      )}

      </KeyboardAvoidingView>

      {/* Location Confirm Dialog */}
      <Modal visible={showLocationConfirm} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setShowLocationConfirm(false)}>
          <Pressable style={styles.confirmDialog} onPress={() => {}}>
            <AppText variant="h4" weight="bold">Share Location</AppText>
            <AppText variant="bodySm" color={Colors.textSecondary} align="center">
              Share your current location with Mario Rossi?
            </AppText>
            <View style={styles.confirmActions}>
              <AppButton label="Cancel" variant="outline" onPress={() => setShowLocationConfirm(false)} style={{ flex: 1 }} />
              <AppButton label="Share" variant="primary" onPress={confirmLocationShare} style={{ flex: 1 }} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Image Preview Modal */}
      <Modal visible={!!showImagePreview} transparent animationType="fade">
        <Pressable style={styles.previewOverlay} onPress={() => setShowImagePreview(null)}>
          <Pressable style={styles.previewContainer} onPress={() => {}}>
            <Pressable style={styles.previewClose} onPress={() => setShowImagePreview(null)}>
              <X size={24} color={Colors.white} />
            </Pressable>
            {showImagePreview && (
              <Image source={showImagePreview} style={styles.previewImage} contentFit="contain" />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing['4'],
    paddingBottom: Spacing['3'],
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing['3'] },
  headerInfo: { gap: 1 },
  headerAction: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  actionCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },

  chatArea: { flex: 1 },
  chatContent: { padding: Spacing['4'], gap: Spacing['3'] },

  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.xl,
    padding: Spacing['3'],
    gap: Spacing['1'],
  },
  bubbleWorker: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.cta,
    borderBottomRightRadius: Radius.xs,
  },
  bubbleCustomer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Radius.xs,
    ...Elevation.sm,
  },
  msgFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing['1'], alignSelf: 'flex-end' },
  timestamp: { fontSize: 10, alignSelf: 'flex-end' },

  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['1'],
    marginTop: Spacing['1'],
    paddingTop: Spacing['1'],
    borderTopWidth: 1,
    borderTopColor: `${Colors.textTertiary}30`,
  },

  // Voice
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] },

  // Image
  chatImage: { width: 200, height: 150, borderRadius: Radius.lg },

  // Location
  locationPreview: { gap: Spacing['2'] },
  locationMapPlaceholder: {
    width: '100%', height: 80, borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center', justifyContent: 'center',
  },
  locationInfo: { gap: 2 },

  // Recording
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    backgroundColor: Colors.errorBg,
  },
  recordingActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Voice Preview
  voicePreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    backgroundColor: Colors.primarySurface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  voicePreviewPlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voicePreviewCancel: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input
  inputBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing['3'],
    paddingTop: Spacing['2'],
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing['2'] },
  attachBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center', justifyContent: 'center',
  },
  textInputWrap: {
    flex: 1, backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.xl, paddingHorizontal: Spacing['3'],
    minHeight: 40, justifyContent: 'center',
  },
  textInput: {
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.cta,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surfaceLight,
  },

  // Attach Menu
  attachOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 50,
  },
  attachBubble: {
    position: 'absolute',
    bottom: 80,
    left: Spacing['3'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['2'],
    gap: Spacing['1'],
    zIndex: 51,
    ...Elevation.lg,
    minWidth: 200,
  },
  attachBubbleArrow: {
    position: 'absolute',
    bottom: -6,
    left: 14,
    width: 12,
    height: 12,
    backgroundColor: Colors.white,
    transform: [{ rotate: '45deg' }],
    zIndex: -1,
  },
  attachOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    paddingVertical: Spacing['2'],
    paddingHorizontal: Spacing['3'],
    borderRadius: Radius.lg,
  },
  attachOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modals
  overlay: {
    flex: 1, backgroundColor: Colors.overlay,
    justifyContent: 'center', alignItems: 'center', padding: Spacing['5'],
  },
  confirmDialog: {
    backgroundColor: Colors.white, borderRadius: Radius.xxl,
    padding: Spacing['5'], width: '100%', maxWidth: 340,
    alignItems: 'center', gap: Spacing['4'], ...Elevation.lg,
  },
  confirmActions: { flexDirection: 'row', gap: Spacing['3'], width: '100%' },

  previewOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  previewContainer: { width: '90%', height: '70%', position: 'relative' },
  previewClose: {
    position: 'absolute', top: -40, right: 0,
    zIndex: 10, padding: Spacing['2'],
  },
  previewImage: { width: '100%', height: '100%', borderRadius: Radius.lg },
});
