import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { ArrowLeft, Send, Paperclip, MapPin, Phone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image } from 'expo-image';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleHire = () => {
    setShowConfirm(false);
    router.push(`/tracking/${id || 'mock-job-id'}`);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image 
            source="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
            style={styles.headerAvatar} 
            contentFit="cover" 
          />
          <View>
            <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Mario Rossi</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Phone color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.hireBanner}>
        <Text style={[theme.typography.body2, { flex: 1 }]}>Ready to start the job?</Text>
        <TouchableOpacity 
          style={styles.hireButton}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={[theme.typography.button, { color: theme.colors.surface, fontSize: 14 }]}>Hire Worker</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatScrollContent}>
        <View style={styles.messageBubbleReceiver}>
          <Text style={theme.typography.body1}>Hi, I am available for the plumbing job!</Text>
          <Text style={styles.messageTime}>10:12 AM</Text>
        </View>
        <View style={styles.messageBubbleSender}>
          <Text style={[theme.typography.body1, { color: theme.colors.surface }]}>Great, what is your estimated arrival time?</Text>
          <Text style={[styles.messageTime, { color: theme.colors.borderLight }]}>10:13 AM</Text>
        </View>
        <View style={styles.messageBubbleReceiver}>
          <Text style={theme.typography.body1}>I can be there in 15 minutes.</Text>
          <Text style={styles.messageTime}>10:14 AM</Text>
        </View>
      </ScrollView>

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || theme.spacing.md }]}>
        <TouchableOpacity style={styles.attachBtn}>
          <Paperclip color={theme.colors.textSecondary} size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.attachBtn}>
          <MapPin color={theme.colors.textSecondary} size={20} />
        </TouchableOpacity>
        <View style={styles.textInputWrapper}>
          <RNTextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
        <TouchableOpacity style={styles.sendBtn} disabled={!message.trim()}>
          <Send color={message.trim() ? theme.colors.primary : theme.colors.border} size={20} />
        </TouchableOpacity>
      </View>

      {showConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[theme.typography.h3, { marginBottom: theme.spacing.sm }]}>Confirm Hiring</Text>
            <Text style={[theme.typography.body1, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xl, textAlign: 'center' }]}>
              Are you sure you want to hire Mario Rossi for this job?
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
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: theme.spacing.md, paddingHorizontal: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitleContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: theme.spacing.sm },
  callButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  chatArea: { flex: 1 },
  chatScrollContent: { padding: theme.spacing.md },
  messageBubbleReceiver: { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', padding: theme.spacing.md, borderRadius: theme.radius.lg, borderBottomLeftRadius: 4, maxWidth: '80%', marginBottom: theme.spacing.sm, ...theme.shadows.sm },
  messageBubbleSender: { backgroundColor: theme.colors.primary, alignSelf: 'flex-end', padding: theme.spacing.md, borderRadius: theme.radius.lg, borderBottomRightRadius: 4, maxWidth: '80%', marginBottom: theme.spacing.sm, ...theme.shadows.sm },
  messageTime: { fontSize: 10, color: theme.colors.textSecondary, alignSelf: 'flex-end', marginTop: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  attachBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  textInputWrapper: { flex: 1, backgroundColor: theme.colors.background, borderRadius: 20, paddingHorizontal: theme.spacing.md, marginHorizontal: theme.spacing.xs, minHeight: 40, justifyContent: 'center' },
  textInput: { maxHeight: 100, paddingTop: Platform.OS === 'ios' ? 10 : 8, paddingBottom: Platform.OS === 'ios' ? 10 : 8 },
  sendBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  hireBanner: { backgroundColor: theme.colors.infoBackground, flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  hireButton: { backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.md, paddingVertical: 8, borderRadius: theme.radius.md },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modalContent: { backgroundColor: theme.colors.surface, width: '85%', padding: theme.spacing.xl, borderRadius: theme.radius.lg, alignItems: 'center' },
  modalButton: { width: '100%', paddingVertical: theme.spacing.md, borderRadius: theme.radius.md, alignItems: 'center' },
});
