import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Keyboard, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { AppText } from '@/components/AppText';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { User, ArrowLeft, Square, Check, ChevronRight, CircleCheck } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [keyboardUp, setKeyboardUp] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardUp(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardUp(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const password = watch('password');

  const onSubmit = (data: { name: string; mobile: string; email: string; password: string; confirmPassword: string }) => {
    if (!emailVerified) {
      alert("Please verify your email address.");
      return;
    }
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions.");
      return;
    }
    
    setLoading(true);
    // Simulate API call and redirect to OTP
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/(auth)/otp', params: { phone: data.mobile } });
    }, 1500);
  };

  const step = 1;

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2].map((item, index) => (
        <View key={item} style={styles.progressStep}>
          <View style={[styles.progressDot, step >= item ? styles.progressDotActive : null]}>
            {step > item ? (
              <CircleCheck size={16} color={Colors.white} />
            ) : (
              <AppText variant="caption" weight="bold" color={step === item ? Colors.white : Colors.textTertiary}>
                {item}
              </AppText>
            )}
          </View>
          {index < 1 && <View style={[styles.progressLine, step > item ? styles.progressLineActive : null]} />}
        </View>
      ))}
    </View>
  );

  const renderStepLabels = () => {
    const stepLabels = ['Account', 'Verification'];
    return (
      <View style={styles.stepLabelsContainer}>
        {stepLabels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = step >= stepNum;
          return (
            <AppText key={label} variant="caption" weight={isActive ? 'bold' : 'regular'} color={isActive ? Colors.primary : Colors.textTertiary} style={{ textAlign: 'center', width: 80 }}>
              {label}
            </AppText>
          );
        })}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold">Register as User</AppText>
        <View style={{ width: 24 }} />
      </View>

      {renderProgressBar()}
      {renderStepLabels()}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <User size={28} color={Colors.primary} />
            <AppText variant="h3" weight="bold" style={styles.sectionTitleNoMargin}>
              Account for Ayos
            </AppText>
          </View>
          <AppText variant="body" color={Colors.textSecondary} style={{ marginBottom: Spacing['4'] }}>
            Create your user account credentials. This will be used to sign in.
          </AppText>

          <Controller
            control={control}
            rules={{ required: 'Full name is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Full Name"
                placeholder="Juan Dela Cruz"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                containerStyle={{ marginBottom: Spacing['4'] }}
              />
            )}
            name="name"
          />

          <Controller
            control={control}
            rules={{ 
              required: 'Mobile number is required',
              pattern: { value: /^[0-9]{11}$/, message: 'Must be 11 digits (e.g. 09171234567)' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Mobile Number"
                placeholder="09171234567"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.mobile?.message}
                containerStyle={{ marginBottom: Spacing['4'] }}
              />
            )}
            name="mobile"
          />

          <Controller
            control={control}
            rules={{ 
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ position: 'relative', marginBottom: Spacing['4'] }}>
                <AppInput
                  label="Email Address"
                  placeholder="juan@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={(val) => {
                    onChange(val);
                    if (emailVerified) setEmailVerified(false);
                  }}
                  value={value}
                  error={errors.email?.message}
                />
                <View style={{ position: 'absolute', right: 0, top: 28, height: 48, justifyContent: 'center', paddingRight: 12 }}>
                  {emailVerified ? (
                    <Text style={{ color: Colors.success, fontWeight: 'bold' }}>Verified</Text>
                  ) : (
                    <TouchableOpacity onPress={() => value && !errors.email ? setEmailVerified(true) : alert('Please enter a valid email first.')}>
                      <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Verify</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            name="email"
          />

          <Controller
            control={control}
            rules={{ 
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Password"
                placeholder="Create password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                containerStyle={{ marginBottom: Spacing['4'] }}
              />
            )}
            name="password"
          />

          <Controller
            control={control}
            rules={{ 
              required: 'Confirm password is required',
              validate: val => val === password || 'Passwords do not match'
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Confirm Password"
                placeholder="Confirm password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
                containerStyle={{ marginBottom: Spacing['4'] }}
              />
            )}
            name="confirmPassword"
          />

          <View style={styles.consentSection}>
            <Pressable style={styles.checkboxContainer} onPress={() => setAcceptedTerms(!acceptedTerms)}>
              {acceptedTerms ? <Check size={24} color={Colors.primary} /> : <Square size={24} color={Colors.textTertiary} />}
              <AppText variant="bodySm" color={Colors.textSecondary} style={{ flex: 1, marginLeft: Spacing['2'] }}>
                I accept the <AppText variant="bodySm" weight="bold" color={Colors.textLink}>Terms and Conditions</AppText> and <AppText variant="bodySm" weight="bold" color={Colors.textLink}>Privacy Policy</AppText>
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: keyboardUp ? 10 : 30 }]}>
        <AppButton 
          label="Next Step" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading}
          rightIcon={<ChevronRight size={20} color={Colors.white} />}
          fullWidth 
        />
        <View style={styles.loginContainer}>
          <AppText variant="bodySm" color={Colors.textSecondary}>Already have an account? </AppText>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <AppText variant="bodySm" weight="bold" color={Colors.primary}>Log In</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['4'],
    paddingBottom: Spacing['4'],
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    padding: Spacing['1'],
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4'],
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing['8'],
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressLine: {
    width: 64, // Slightly wider for 2 steps instead of 4
    height: 3,
    backgroundColor: Colors.border,
    marginHorizontal: -4,
    zIndex: 1,
  },
  progressLineActive: {
    backgroundColor: Colors.primary,
  },
  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed to space-around for 2 steps
    paddingHorizontal: Spacing['8'],
    paddingBottom: Spacing['3'],
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['16'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    marginBottom: Spacing['2'],
  },
  sectionTitleNoMargin: {
    marginBottom: 0,
  },
  formSection: {
    marginBottom: Spacing['4'],
  },
  consentSection: {
    marginTop: Spacing['2'],
    marginBottom: Spacing['4'],
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  footer: {
    padding: Spacing['4'],
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing['4'],
  },
});
