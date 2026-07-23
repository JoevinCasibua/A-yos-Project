import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { theme } from '../../theme';
import { ArrowLeft, Shield } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.contentPad}>
              <View style={[styles.iconContainer, { backgroundColor: '#fef3c7', alignSelf: 'center', marginBottom: theme.spacing.lg }]}>
                <Shield color="#f59e0b" size={32} />
              </View>
              
              <Text style={[theme.typography.h4, styles.heading]}>1. Introduction</Text>
              <Text style={theme.typography.body1}>
                This Privacy Policy explains how we collect, use, and protect your information when you use the A-yos platform.
              </Text>

              <Text style={[theme.typography.h4, styles.heading, { marginTop: theme.spacing.xl }]}>2. Information We Collect</Text>
              <Text style={theme.typography.body1}>
                We collect personal information that you provide to us, such as name, address, contact information, and passwords.
              </Text>
              
              <Text style={[theme.typography.h4, styles.heading, { marginTop: theme.spacing.xl }]}>3. How We Use Your Data</Text>
              <Text style={theme.typography.body1}>
                We use personal information collected via our app for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.md },
  
  section: { marginBottom: theme.spacing.xl },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  
  contentPad: { padding: theme.spacing.xl },
  iconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  heading: { marginBottom: theme.spacing.xs },
});
