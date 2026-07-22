import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `When you use A-yos, we collect information that you provide directly, such as when you create an account, update your profile, or communicate with other users. This includes:

• Name, email address, and phone number
• Profile photo and professional credentials
• Location data for service matching
• Payment information for transactions
• Communications between you and other users`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Match workers with customers based on location and skills
• Process payments and manage transactions
• Send you service-related communications
• Ensure safety and prevent fraud
• Comply with legal obligations`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell your personal information. We may share your information with:

• Other users as necessary to facilitate services (e.g., sharing your name and location with a customer you're matched with)
• Payment processors to handle transactions
• Law enforcement when required by law
• Service providers who assist in operating our platform`,
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your personal information, including:

• Encryption of data in transit and at rest
• Regular security audits
• Access controls and authentication
• Secure data storage practices`,
  },
  {
    title: '5. Your Rights',
    content: `You have the right to:

• Access your personal information
• Correct inaccurate data
• Request deletion of your account
• Opt out of non-essential communications
• Export your data in a portable format`,
  },
  {
    title: '6. Contact Us',
    content: `If you have questions about this Privacy Policy, please contact us at:

Email: privacy@ayos.com
Phone: +63 917 123 4567
Address: 123 Ayos Lane, Makati City, Philippines`,
  },
];

export default function PrivacyPolicyScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();

  return (
    <Screen safeArea scrollable header={<PageHeader title="Privacy Policy" from={from} />}>

      <View style={styles.headerSection}>
        <AppText variant="h3" weight="bold">Privacy Policy</AppText>
        <AppText variant="caption" color={Colors.textTertiary}>Last updated: July 20, 2026</AppText>
      </View>

      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>{section.title}</AppText>
          <AppText variant="bodySm" color={Colors.textSecondary} style={styles.sectionContent}>
            {section.content}
          </AppText>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: 'center',
    paddingVertical: Spacing['5'],
    paddingHorizontal: theme.layout.screenPadding,
    gap: Spacing['1'],
  },

  section: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing['2'],
  },
  sectionContent: {
    lineHeight: 22,
  },
});
