import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldCheck } from 'lucide-react-native';

export default function AdminVerificationScreen() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);

  useEffect(() => {
    // Wait for 5 seconds to simulate admin verification
    const timer = setTimeout(() => {
      login({
        id: '1',
        name: 'Juan Dela Cruz',
        email: 'juan@example.com',
        phone: '09171234567'
      });
      router.replace('/(tabs)');
    }, 5000);

    return () => clearTimeout(timer);
  }, [login, router]);

  return (
    <Screen safeArea>
      <View style={styles.container}>
        <ShieldCheck color={theme.colors.primary} size={80} style={{ marginBottom: theme.spacing.xl }} />
        
        <Text style={[theme.typography.h2, styles.title]}>Verifying Account</Text>
        
        <Text style={[theme.typography.body1, styles.subtitle]}>
          Please wait while an admin reviews your Government ID and Selfie.
        </Text>

        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: theme.spacing.xl }} />
        
        <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.md }]}>
          This usually takes just a few seconds...
        </Text>
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
