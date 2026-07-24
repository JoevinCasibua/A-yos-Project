import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, TextInput, ScrollView, Pressable,
  KeyboardAvoidingView, Platform, Modal, Image,
} from 'react-native';
import {
  Send, Mic, MicOff, MapPin, Image as ImageIcon, X,
  Play, Pause, Globe, ChevronDown, Square,
} from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { AnimatedWaveform } from '@/components/AnimatedWaveform';

interface Message {
  id: string;
  text?: string;
  sender: 'worker' | 'customer';
  timestamp: string;
  type: 'text' | 'voice' | 'image' | 'location';
  voiceDuration?: number;
  imageUrl?: string;
  location?: { lat: number; lng: number; address: string };
  translatedText?: string;
}

interface BookingChatProps {
  customerName: string;
  customerAvatar: string;
}

const MOCK_IMAGES = [
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/164338/pexels-photo-164338.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg?auto=compress&cs=tinysrgb&w=300',
];

const TRANSLATIONS: Record<string, string> = {
  'Hello!': 'Kamusta!',
  'How are you?': 'Kamusta ka?',
  'I will be there soon': 'Dadalhin ko soon',
  'Thank you': 'Salamat',
  'Okay': 'Sige',
  'See you': 'Kita tayo',
  'What time?': 'Anong oras?',
  'Where are you?': 'Saan ka na?',
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fil', label: 'Filipino' },
];

function translateText(text: string, targetLang: string): string {
  if (targetLang === 'en') return text;
  return TRANSLATIONS[text] || text;
}

export const BookingChat = React.memo(function BookingChat({
  customerName,
  customerAvatar,
}: BookingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Hi! I'm on my way to your location. Let me know if there's anything specific you need me to check.`,
      sender: 'worker',
      timestamp: 'Just now',
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voicePreviewDuration, setVoicePreviewDuration] = useState<number | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Image state
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Location state
  const [showLocationConfirm, setShowLocationConfirm] = useState(false);

  // Translation state
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [targetLang, setTargetLang] = useState('fil');
  const [autoTranslate, setAutoTranslate] = useState(true);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length]);

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
      setRecordingDuration(0);
    }
    return () => {
      if (recordingInterval.current) clearInterval(recordingInterval.current);
    };
  }, [isRecording]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendText = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const translated = autoTranslate && targetLang !== 'en'
      ? translateText(trimmed, targetLang)
      : undefined;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: trimmed,
      sender: 'worker',
      timestamp: 'Just now',
      type: 'text',
      translatedText: translated,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleStopRecording = () => {
    if (recordingInterval.current) clearInterval(recordingInterval.current);
    const duration = recordingDuration;
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    if (duration >= 1) {
      setVoicePreviewDuration(duration);
    }
  };

  const handlePauseRecording = () => {
    if (recordingInterval.current) clearInterval(recordingInterval.current);
    setIsPaused(true);
  };

  const handleResumeRecording = () => {
    setIsPaused(false);
    recordingInterval.current = setInterval(() => {
      setRecordingDuration((d) => d + 1);
    }, 1000);
  };

  const handleSendVoice = () => {
    const duration = voicePreviewDuration;
    if (!duration || duration < 1) return;

    const newMsg: Message = {
      id: `voice-${Date.now()}`,
      sender: 'worker',
      timestamp: 'Just now',
      type: 'voice',
      voiceDuration: duration,
    };

    setMessages((prev) => [...prev, newMsg]);
    setVoicePreviewDuration(null);
  };

  const handleCancelVoicePreview = () => {
    setVoicePreviewDuration(null);
  };

  const handleSendImage = (uri: string) => {
    setShowImagePicker(false);
    setSelectedImage(null);

    const newMsg: Message = {
      id: `img-${Date.now()}`,
      sender: 'worker',
      timestamp: 'Just now',
      type: 'image',
      imageUrl: uri,
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendLocation = () => {
    setShowLocationConfirm(false);

    const newMsg: Message = {
      id: `loc-${Date.now()}`,
      sender: 'worker',
      timestamp: 'Just now',
      type: 'location',
      location: {
        lat: 14.5995,
        lng: 120.9842,
        address: 'Customer Location, Quezon City',
      },
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const toggleVoicePlayback = (msgId: string) => {
    setPlayingVoiceId(playingVoiceId === msgId ? null : msgId);
  };

  const sentCount = messages.filter((m) => m.sender === 'worker').length;
  const canConfirm = sentCount >= 1;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <Avatar uri={customerAvatar} size={32} />
        <View style={styles.chatHeaderInfo}>
          <AppText variant="bodySm" weight="semiBold">{customerName}</AppText>
          <AppText variant="caption" color={Colors.textTertiary}>Messaging</AppText>
        </View>
        <Pressable
          style={styles.langBtn}
          onPress={() => setShowLangPicker(!showLangPicker)}
        >
          <Globe size={16} color={Colors.cta} />
          <AppText variant="caption" weight="semiBold" color={Colors.cta}>
            {LANGUAGES.find((l) => l.code === targetLang)?.label}
          </AppText>
          <ChevronDown size={12} color={Colors.cta} />
        </Pressable>
      </View>

      {/* Language Picker Dropdown */}
      {showLangPicker && (
        <View style={styles.langDropdown}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              style={[styles.langOption, targetLang === lang.code && styles.langOptionActive]}
              onPress={() => { setTargetLang(lang.code); setShowLangPicker(false); }}
            >
              <AppText variant="bodySm" color={targetLang === lang.code ? Colors.cta : Colors.textPrimary}>
                {lang.label}
              </AppText>
            </Pressable>
          ))}
          <Pressable
            style={styles.langOption}
            onPress={() => setAutoTranslate(!autoTranslate)}
          >
            <AppText variant="bodySm" color={autoTranslate ? Colors.verified : Colors.textPrimary}>
              Auto-translate: {autoTranslate ? 'ON' : 'OFF'}
            </AppText>
          </Pressable>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'worker' ? styles.workerBubble : styles.customerBubble,
            ]}
          >
            {/* Text Message */}
            {msg.type === 'text' && (
              <>
                <AppText
                  variant="bodySm"
                  color={msg.sender === 'worker' ? Colors.white : Colors.textPrimary}
                >
                  {msg.text}
                </AppText>
                {msg.translatedText && msg.translatedText !== msg.text && (
                  <AppText
                    variant="caption"
                    color={msg.sender === 'worker' ? 'rgba(255,255,255,0.7)' : Colors.textTertiary}
                    style={styles.translatedText}
                  >
                    {msg.translatedText}
                  </AppText>
                )}
              </>
            )}

            {/* Voice Message */}
            {msg.type === 'voice' && (
              <Pressable
                style={styles.voiceBubble}
                onPress={() => toggleVoicePlayback(msg.id)}
              >
                {playingVoiceId === msg.id ? (
                  <Pause size={16} color={Colors.white} />
                ) : (
                  <Play size={16} color={Colors.white} />
                )}
                <AnimatedWaveform
                  barCount={12}
                  color={Colors.white}
                  active={playingVoiceId === msg.id}
                  maxHeight={18}
                  style={{ flex: 1 }}
                />
                <AppText variant="caption" color={Colors.white}>
                  {formatDuration(msg.voiceDuration || 0)}
                </AppText>
              </Pressable>
            )}

            {/* Image Message */}
            {msg.type === 'image' && msg.imageUrl && (
              <Pressable onPress={() => {}}>
                <Image source={{ uri: msg.imageUrl }} style={styles.chatImage} />
              </Pressable>
            )}

            {/* Location Message */}
            {msg.type === 'location' && msg.location && (
              <View style={styles.locationBubble}>
                <View style={styles.locationPreview}>
                  <MapPin size={24} color={Colors.error} />
                </View>
                <AppText variant="caption" weight="semiBold" color={Colors.textPrimary}>
                  {msg.location.address}
                </AppText>
                <AppText variant="caption" color={Colors.textTertiary}>
                  {msg.location.lat.toFixed(4)}, {msg.location.lng.toFixed(4)}
                </AppText>
              </View>
            )}

            <AppText
              variant="caption"
              color={msg.sender === 'worker' ? 'rgba(255,255,255,0.7)' : Colors.textTertiary}
              style={styles.msgTime}
            >
              {msg.timestamp}
            </AppText>
          </View>
        ))}
      </ScrollView>

      {/* Input Row */}
      <View style={styles.inputRow}>
        {/* Image Button */}
        <Pressable style={styles.actionBtn} onPress={() => setShowImagePicker(true)}>
          <ImageIcon size={20} color={Colors.cta} />
        </Pressable>

        {/* Location Button */}
        <Pressable style={styles.actionBtn} onPress={() => setShowLocationConfirm(true)}>
          <MapPin size={20} color={Colors.cta} />
        </Pressable>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        {/* Mic/Send Button */}
        {inputText.trim() || voicePreviewDuration ? (
          <Pressable
            style={styles.sendBtn}
            onPress={voicePreviewDuration ? handleSendVoice : handleSendText}
          >
            <Send size={18} color={Colors.white} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.micBtn, isRecording && styles.micBtnActive]}
            onPress={() => {
              if (isRecording) {
                handleStopRecording();
              } else {
                setIsRecording(true);
              }
            }}
          >
            {isRecording ? (
              <MicOff size={18} color={Colors.white} />
            ) : (
              <Mic size={18} color={Colors.white} />
            )}
          </Pressable>
        )}
      </View>

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
          <AppText variant="caption" weight="semiBold" color={Colors.error}>
            {formatDuration(recordingDuration)}
          </AppText>
          <Pressable style={styles.recordingActionBtn} onPress={isPaused ? handleResumeRecording : handlePauseRecording}>
            {isPaused ? (
              <Play size={14} color={Colors.cta} />
            ) : (
              <Pause size={14} color={Colors.cta} />
            )}
          </Pressable>
          <Pressable style={[styles.recordingActionBtn, { backgroundColor: Colors.errorBg }]} onPress={handleStopRecording}>
            <Square size={12} color={Colors.error} />
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

      {/* Image Picker Modal */}
      <Modal visible={showImagePicker} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.imagePickerSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <AppText variant="h4" weight="bold">Select Photo</AppText>
              <Pressable onPress={() => setShowImagePicker(false)}>
                <X size={20} color={Colors.textTertiary} />
              </Pressable>
            </View>
            <View style={styles.imageGrid}>
              {MOCK_IMAGES.map((uri) => (
                <Pressable
                  key={uri}
                  style={[styles.imageOption, selectedImage === uri && styles.imageOptionActive]}
                  onPress={() => setSelectedImage(uri)}
                >
                  <Image source={{ uri }} style={styles.imageThumbnail} />
                </Pressable>
              ))}
            </View>
            <AppButton
              label="Send Photo"
              variant="primary"
              fullWidth
              disabled={!selectedImage}
              onPress={() => selectedImage && handleSendImage(selectedImage)}
            />
          </View>
        </View>
      </Modal>

      {/* Location Confirm Modal */}
      <Modal visible={showLocationConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.confirmSheet}>
            <View style={styles.sheetHandle} />
            <MapPin size={32} color={Colors.cta} />
            <AppText variant="h4" weight="bold">Share Location?</AppText>
            <AppText variant="bodySm" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
              Your current location will be shared with {customerName}.
            </AppText>
            <View style={styles.confirmActions}>
              <AppButton label="Cancel" variant="outline" onPress={() => setShowLocationConfirm(false)} style={{ flex: 1 }} />
              <AppButton label="Share" variant="primary" onPress={handleSendLocation} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Elevation.sm,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    padding: Spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  chatHeaderInfo: { flex: 1, gap: 2 },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing['2'],
    paddingVertical: Spacing['1'],
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full,
  },
  langDropdown: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingHorizontal: Spacing['3'],
    paddingBottom: Spacing['2'],
  },
  langOption: {
    paddingVertical: Spacing['2'],
    paddingHorizontal: Spacing['3'],
    borderRadius: Radius.md,
  },
  langOptionActive: {
    backgroundColor: Colors.primarySurface,
  },

  messageList: { maxHeight: 200 },
  messageListContent: { padding: Spacing['3'], gap: Spacing['2'] },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.lg,
  },
  workerBubble: {
    backgroundColor: Colors.cta,
    alignSelf: 'flex-end',
    borderBottomRightRadius: Radius.xs,
  },
  customerBubble: {
    backgroundColor: Colors.surfaceLight,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Radius.xs,
  },
  translatedText: {
    marginTop: 4,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  msgTime: { marginTop: 2 },

  // Voice
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    minWidth: 140,
  },

  // Image
  chatImage: {
    width: 160,
    height: 120,
    borderRadius: Radius.md,
  },

  // Location
  locationBubble: {
    gap: 4,
  },
  locationPreview: {
    width: 160,
    height: 80,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing['2'],
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 80,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: Colors.error,
  },

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
    width: 28,
    height: 28,
    borderRadius: 14,
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

  // Overlays
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  imagePickerSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing['5'],
    gap: Spacing['4'],
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing['2'],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageGrid: {
    flexDirection: 'row',
    gap: Spacing['2'],
  },
  imageOption: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  imageOptionActive: {
    borderColor: Colors.cta,
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },

  confirmSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing['5'],
    alignItems: 'center',
    gap: Spacing['3'],
  },
  confirmActions: {
    flexDirection: 'row',
    gap: Spacing['3'],
    width: '100%',
  },
});
