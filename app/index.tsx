import React from 'react';
import { View, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Menu, Home, Briefcase } from 'lucide-react-native';
import { Colors, Spacing, Typography, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { StatusBar } from 'expo-status-bar';

export default function LandingScreen() {
  const handleGetStarted = () => {
    router.push('/sign-up');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleRegisterWorker = () => {
    router.push('/register-worker');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=800' }}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Home size={24} color={Colors.white} strokeWidth={2.5} />
            <AppText variant="h4" weight="bold" color={Colors.white} style={styles.logoText}>
              A-yos
            </AppText>
          </View>
          <Pressable hitSlop={12}>
            <Menu size={28} color={Colors.white} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          <AppText variant="h1" weight="bold" color={Colors.white} style={{ marginBottom: Spacing['2'] }}>
            A-yos
          </AppText>
          <AppText variant="body" color={Colors.white} style={{ marginBottom: Spacing['8'], opacity: 0.9 }}>
            Ang Inyong Kaagapay sa Tahanan
          </AppText>

          <View style={styles.buttonGroup}>
            <AppButton
              label="Get Started"
              onPress={handleGetStarted}
              fullWidth
              style={styles.primaryButton}
              labelStyle={{ color: Colors.white }}
            />
            
            <Pressable style={styles.glassButton} onPress={handleSignIn}>
              <AppText variant="button" weight="semiBold" color={Colors.white}>
                Sign In
              </AppText>
            </Pressable>
          </View>

          <View style={styles.dividerLine} />

          <Pressable style={styles.workerButton} onPress={handleRegisterWorker}>
            <Briefcase size={20} color={Colors.white} strokeWidth={2} />
            <AppText variant="button" weight="semiBold" color={Colors.white}>
              Register a Worker Account
            </AppText>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)', // Darken image for text readability
    justifyContent: 'space-between',
    padding: Spacing['4'],
    paddingTop: 60, // Safe area approx
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  logoText: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  bottomContent: {
    paddingBottom: Spacing['10'],
  },
  buttonGroup: {
    gap: Spacing['3'],
  },
  workerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    gap: Spacing['2'],
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  glassButton: {
    height: 56,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dividerLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: Spacing['6'],
  },
});
