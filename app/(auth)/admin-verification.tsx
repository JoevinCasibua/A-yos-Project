import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldCheck, CheckCircle2 } from 'lucide-react-native';

export default function AdminVerificationScreen() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [status, setStatus] = useState<'verifying' | 'success'>('verifying');

  useEffect(() => {
    // Wait for 3 seconds to simulate admin verification
    const verifyTimer = setTimeout(() => {
      setStatus('success');
      
      // Wait 2 seconds on success screen before redirecting
      const redirectTimer = setTimeout(() => {
        login({
          id: '1',
          name: 'Juan Dela Cruz',
          email: 'juan@example.com',
          phone: '09171234567'
        });
        router.replace('/(tabs)/home');
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }, 3000);

    return () => clearTimeout(verifyTimer);
  }, [login, router]);

  return (
    <Screen safeArea>
      <View style={styles.container}>
        {status === 'verifying' ? (
          <>
            <ShieldCheck color={theme.colors.primary} size={80} style={{ marginBottom: theme.spacing.xl }} />
            <Text style={[theme.typography.h2, styles.title]}>Verifying Account</Text>
            <Text style={[theme.typography.body1, styles.subtitle]}>
              Please wait while an admin reviews your Government ID and Selfie.
            </Text>
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: theme.spacing.xl }} />
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.md }]}>
              This usually takes just a few seconds...
            </Text>
          </>
        ) : (
          <>
            <CheckCircle2 color={theme.colors.success} size={80} style={{ marginBottom: theme.spacing.xl }} />
            <Text style={[theme.typography.h2, styles.title, { color: theme.colors.success }]}>Verification Successful</Text>
            <Text style={[theme.typography.body1, styles.subtitle]}>
              Your account has been successfully verified by the admin!
            </Text>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
});
