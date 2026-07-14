import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Home, User, Mail, Phone, Lock, EyeOff, Eye, Square, CheckSquare } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = () => {
    router.replace('/(tabs)');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Home size={24} color={Colors.textPrimary} strokeWidth={2.5} />
          <AppText variant="h4" weight="bold" color={Colors.textPrimary} style={styles.logoText}>
            A-yos
          </AppText>
        </View>
        <Pressable hitSlop={12}>
          <AppText variant="body" weight="semiBold" color={Colors.textSecondary}>
            Support
          </AppText>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <AppText variant="h1" weight="bold" style={{ marginBottom: Spacing['2'], textAlign: 'center' }}>
            Create Account
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center', paddingHorizontal: Spacing['4'] }}>
            Join our community of trusted local service experts today.
          </AppText>
        </View>

        {/* Social Buttons */}
        <View style={styles.socialContainer}>
          <Pressable style={styles.socialButton}>
            <AppText variant="body" weight="bold" color={Colors.textPrimary}>G</AppText>
            <AppText variant="body" weight="semiBold" style={{ marginLeft: 12 }}>Register with Google</AppText>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <AppText variant="body" weight="bold" color={Colors.primary}>f</AppText>
            <AppText variant="body" weight="semiBold" style={{ marginLeft: 12 }}>Register with Facebook</AppText>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <AppText variant="caption" weight="semiBold" color={Colors.textSecondary} style={{ marginHorizontal: Spacing['3'] }}>
            OR EMAIL
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <AppInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<User size={20} color={Colors.textTertiary} />}
          />

          <AppInput
            label="Email Address"
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={20} color={Colors.textTertiary} />}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChangeText={setPhone}
            leftIcon={<Phone size={20} color={Colors.textTertiary} />}
            keyboardType="phone-pad"
          />

          <AppInput
            label="Password"
            placeholder="Min. 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Lock size={20} color={Colors.textTertiary} />}
            rightIcon={
              showPassword ? (
                <EyeOff size={20} color={Colors.textTertiary} />
              ) : (
                <Eye size={20} color={Colors.textTertiary} />
              )
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        </View>

        {/* Terms Checkbox */}
        <Pressable style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)} hitSlop={8}>
          {agreeTerms ? (
            <CheckSquare size={24} color={Colors.textPrimary} />
          ) : (
            <Square size={24} color={Colors.textTertiary} />
          )}
          <AppText variant="bodySm" color={Colors.textSecondary} style={{ flex: 1 }}>
            I agree to the{' '}
            <AppText variant="bodySm" weight="semiBold" color={Colors.textPrimary}>Terms & Conditions</AppText>
            {' '}and{' '}
            <AppText variant="bodySm" weight="semiBold" color={Colors.textPrimary}>Privacy Policy</AppText>
          </AppText>
        </Pressable>

        {/* Register Button */}
        <AppButton
          label="Register"
          onPress={handleRegister}
          fullWidth
          style={styles.primaryButton}
          labelStyle={{ color: Colors.white }}
        />

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppText variant="body" color={Colors.textSecondary}>
          Already have an account?{' '}
        </AppText>
        <Pressable onPress={handleSignIn}>
          <AppText variant="body" weight="bold" color={Colors.textPrimary}>
            Sign In
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing['4'],
    paddingTop: 60, // approximate safe area
    paddingBottom: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
  scrollContent: {
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['8'],
  },
  titleSection: {
    marginBottom: Spacing['6'],
    alignItems: 'center',
  },
  socialContainer: {
    gap: Spacing['3'],
    marginBottom: Spacing['6'],
  },
  socialButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['6'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  formSection: {
    gap: Spacing['4'],
    marginBottom: Spacing['5'],
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing['3'],
    marginBottom: Spacing['6'],
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 56,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['6'],
    backgroundColor: Colors.surfaceLight,
  },
});
