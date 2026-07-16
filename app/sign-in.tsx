import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Home, Mail, Lock, EyeOff, Eye, ArrowRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    router.replace('/(tabs)');
  };

  const handleRegister = () => {
    router.push('/sign-up');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header Logo */}
        <Pressable style={styles.header} onPress={() => router.push('/')}>
          <Home size={24} color={Colors.textPrimary} strokeWidth={2.5} />
          <AppText variant="h4" weight="bold" color={Colors.textPrimary} style={styles.logoText}>
            A-yos
          </AppText>
        </Pressable>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <AppText variant="h1" weight="bold" style={{ marginBottom: Spacing['2'] }}>
            Welcome Back
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            Sign in to your account to continue booking trusted home services.
          </AppText>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <AppInput
            label="Email or Phone"
            placeholder="Enter your email or phone"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={20} color={Colors.textTertiary} />}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            label="Password"
            placeholder="Enter your password"
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

          <Pressable style={styles.forgotPassword}>
            <AppText variant="bodySm" weight="semiBold" color={Colors.textPrimary}>
              Forgot Password?
            </AppText>
          </Pressable>

          <AppButton
            label="Sign In"
            onPress={handleSignIn}
            fullWidth
            style={styles.primaryButton}
            labelStyle={{ color: Colors.white }}
            rightIcon={<ArrowRight size={20} color={Colors.white} strokeWidth={2} />}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <AppText variant="bodySm" color={Colors.textSecondary} style={{ marginHorizontal: Spacing['3'] }}>
            Or continue with
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialContainer}>
          <Pressable style={styles.socialButton}>
            <AppText variant="body" weight="semiBold" color={Colors.textPrimary}>G</AppText>
            <AppText variant="body" weight="semiBold" style={{ marginLeft: 8 }}>Google</AppText>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <AppText variant="body" weight="semiBold" color={Colors.primary}>f</AppText>
            <AppText variant="body" weight="semiBold" style={{ marginLeft: 8 }}>Facebook</AppText>
          </Pressable>
        </View>

        {/* Bottom Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=800' }} 
            style={styles.bottomImage} 
            resizeMode="cover"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppText variant="body" color={Colors.textSecondary}>
          Don't have an account?{' '}
        </AppText>
        <Pressable onPress={handleRegister}>
          <AppText variant="body" weight="bold" color={Colors.textPrimary}>
            Register
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing['4'],
    paddingTop: 60, // Safe area approx
    paddingBottom: Spacing['6'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    marginBottom: Spacing['8'],
  },
  logoText: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  titleSection: {
    marginBottom: Spacing['8'],
  },
  formSection: {
    gap: Spacing['4'],
    marginBottom: Spacing['6'],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -Spacing['2'],
    marginBottom: Spacing['2'],
  },
  primaryButton: {
    backgroundColor: Colors.primary,
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
  socialContainer: {
    flexDirection: 'row',
    gap: Spacing['3'],
    marginBottom: Spacing['8'],
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    height: 160,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing['6'],
  },
  bottomImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['6'],
    backgroundColor: Colors.background,
  },
});
