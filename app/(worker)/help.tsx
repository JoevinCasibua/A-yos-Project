import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MessageSquare,
  Phone, Mail, Send,
} from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { PageHeader } from '@/components/layout/PageHeader';

const FAQ_ITEMS = [
  {
    q: 'How do I accept a booking request?',
    a: 'When a customer selects you, you\'ll receive an "Incoming Job Alert" on your dashboard. Tap to view details, then tap "Accept Booking" to start the conversation with the customer.',
  },
  {
    q: 'How do I decline a booking request?',
    a: 'On the booking detail screen, tap "Decline". You\'ll be asked to select a reason. Declining won\'t affect your ranking if done respectfully.',
  },
  {
    q: 'How do I update my availability?',
    a: 'Go to Profile → Availability. Toggle each day on/off and set your start and end times. Your availability helps the AI match you with the right customers.',
  },
  {
    q: 'How do I add skills to my profile?',
    a: 'Go to Profile → Industry & Skills. Select your industry, then choose your skills from the list or add custom ones. More skills mean more job opportunities.',
  },
  {
    q: 'How do I request a payout?',
    a: 'Go to Wallet → Payout. Enter the amount, select your payout method (GCash, BPI, or PayPal), and confirm. Payouts are processed within 1–2 business days.',
  },
  {
    q: 'What happens if a customer cancels?',
    a: 'If a customer cancels before you arrive, the booking is marked as cancelled and no charge applies. If they cancel after you\'ve started, you\'ll receive partial compensation.',
  },
  {
    q: 'How do I verify my account?',
    a: 'Go to Profile → Verification. Upload your government ID, NBI clearance, and skill certificate. Verification takes 1–2 business days after all documents are submitted.',
  },
  {
    q: 'How is my rating calculated?',
    a: 'Your rating is the average of all customer reviews after completed jobs. Higher ratings lead to more booking requests and better visibility in search results.',
  },
];

export default function HelpCenterScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const toggleFaq = (q: string) => {
    setExpandedFaq(expandedFaq === q ? null : q);
  };

  const handleSubmitIssue = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing Fields', 'Please fill in both subject and message.');
      return;
    }
    Alert.alert('Issue Submitted', 'Our support team will get back to you within 24 hours.', [
      { text: 'OK', onPress: () => { setSubject(''); setMessage(''); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Help Center"
        from={from}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Contact */}
        <View style={styles.contactRow}>
          <Pressable style={styles.contactCard} onPress={() => Alert.alert('Call Support', 'Calling +63 917 123 4567...')}>
            <View style={[styles.contactIcon, { backgroundColor: `${Colors.cta}15` }]}>
              <Phone size={20} color={Colors.cta} />
            </View>
            <AppText variant="bodySm" weight="semiBold">Call Us</AppText>
            <AppText variant="caption" color={Colors.textTertiary}>+63 917 123 4567</AppText>
          </Pressable>
          <Pressable style={styles.contactCard} onPress={() => Alert.alert('Email Support', 'Opening email client...')}>
            <View style={[styles.contactIcon, { backgroundColor: `${Colors.verified}15` }]}>
              <Mail size={20} color={Colors.verified} />
            </View>
            <AppText variant="bodySm" weight="semiBold">Email Us</AppText>
            <AppText variant="caption" color={Colors.textTertiary}>support@ayos.com</AppText>
          </Pressable>
          <Pressable style={styles.contactCard} onPress={() => Alert.alert('Live Chat', 'Connecting to support agent...')}>
            <View style={[styles.contactIcon, { backgroundColor: `${Colors.info}15` }]}>
              <MessageSquare size={20} color={Colors.info} />
            </View>
            <AppText variant="bodySm" weight="semiBold">Live Chat</AppText>
            <AppText variant="caption" color={Colors.textTertiary}>Chat Now</AppText>
          </Pressable>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Frequently Asked Questions</AppText>
          <View style={styles.faqList}>
            {FAQ_ITEMS.map((item) => {
              const isExpanded = expandedFaq === item.q;
              return (
                <View key={item.q} style={styles.faqItem}>
                  <Pressable
                    style={styles.faqQuestion}
                    onPress={() => toggleFaq(item.q)}
                  >
                    <AppText variant="bodySm" weight="semiBold" style={{ flex: 1 }}>{item.q}</AppText>
                    {isExpanded ? (
                      <ChevronUp size={18} color={Colors.textTertiary} />
                    ) : (
                      <ChevronDown size={18} color={Colors.textTertiary} />
                    )}
                  </Pressable>
                  {isExpanded && (
                    <View style={styles.faqAnswer}>
                      <AppText variant="bodySm" color={Colors.textSecondary}>{item.a}</AppText>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Report Issue Form */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Report an Issue</AppText>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.inputLabel}>SUBJECT</AppText>
              <TextInput
                style={styles.textInput}
                placeholder="Brief description of the issue"
                placeholderTextColor={Colors.textTertiary}
                value={subject}
                onChangeText={setSubject}
              />
            </View>
            <View style={styles.inputGroup}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.inputLabel}>MESSAGE</AppText>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe what happened in detail..."
                placeholderTextColor={Colors.textTertiary}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <AppButton
              label="Submit Issue"
              variant="primary"
              fullWidth
              leftIcon={<Send size={14} color={Colors.white} />}
              onPress={handleSubmitIssue}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },

  contactRow: {
    flexDirection: 'row',
    gap: Spacing['3'],
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  contactCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['3'],
    alignItems: 'center',
    gap: Spacing['1'],
    ...Elevation.sm,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['1'],
  },

  section: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },

  faqList: {
    gap: Spacing['2'],
  },
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Elevation.sm,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing['3'],
    gap: Spacing['2'],
  },
  faqAnswer: {
    paddingHorizontal: Spacing['3'],
    paddingBottom: Spacing['3'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing['3'],
  },

  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    gap: Spacing['3'],
    ...Elevation.sm,
  },
  inputGroup: {
    gap: Spacing['1'],
  },
  inputLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing['2'],
  },
});
