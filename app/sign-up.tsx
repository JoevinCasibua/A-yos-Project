import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { router } from 'expo-router';
import { 
  Home, User, Mail, Phone, Lock, EyeOff, Eye, Square, Check, 
  ChevronRight, ChevronLeft, CircleCheck, ShieldCheck, MapPin
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { AppSelect, SelectOption } from '@/components/AppSelect';
import { ImageUploadCard } from '@/components/ImageUploadCard';
// LocationPicker temporarily removed for manual address entry

const ID_TYPES: SelectOption[] = [
  { label: 'National ID (PhilSys)', value: 'philsys' },
  { label: "Driver's License", value: 'drivers_license' },
  { label: 'Passport', value: 'passport' },
  { label: 'UMID', value: 'umid' },
  { label: 'Postal ID', value: 'postal' },
  { label: 'PRC ID', value: 'prc' },
  { label: "Voter's ID", value: 'voters' },
  { label: 'Senior Citizen ID', value: 'senior' },
  { label: 'Other Government-issued ID', value: 'other' },
];

const GENDERS: SelectOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'other' },
];

// Regex Validations
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(09|\+639)\d{9}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function SignUpScreen() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Step 1: Personal Info
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Verification
  const [idType, setIdType] = useState('');
  const [frontId, setFrontId] = useState<string | null>(null);
  const [backId, setBackId] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  // Step 3: Location & Consent
  const [streetNumber, setStreetNumber] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [infoAccurate, setInfoAccurate] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!emailRegex.test(email)) newErrors.email = 'Valid email is required';
    if (!phoneRegex.test(phone)) newErrors.phone = 'Valid Philippine number required (e.g. 09123456789)';
    if (!passwordRegex.test(password)) {
      newErrors.password = 'Must be 8+ chars, with at least 1 number, 1 special char, and 1 uppercase letter';
    }
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!birthday) newErrors.birthday = 'Birthday is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!idType) newErrors.idType = 'Please select an ID type';
    if (!frontId) newErrors.frontId = 'Front of ID is required';
    if (!backId) newErrors.backId = 'Back of ID is required';
    // selfie is optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!street) newErrors.street = 'Street is required';
    if (!city) newErrors.city = 'City is required';
    if (!region) newErrors.region = 'Province/Region is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && infoAccurate && agreePrivacy && agreeTerms;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setErrors({});
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    } else {
      router.back();
    }
  };

  const handleRegister = () => {
    if (validateStep3()) {
      setShowSuccess(true);
    }
  };

  const handleBirthdayChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    }
    if (digits.length > 4) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    }
    setBirthday(formatted);
  };

  // Location detection temporarily disabled

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((item, index) => (
        <View key={item} style={styles.progressStep}>
          <View style={[styles.progressDot, step >= item ? styles.progressDotActive : null]}>
            {step > item ? <CircleCheck size={16} color={Colors.white} /> : <AppText variant="caption" weight="bold" color={step === item ? Colors.white : Colors.textTertiary}>{item}</AppText>}
          </View>
          {index < 2 && <View style={[styles.progressLine, step > item ? styles.progressLineActive : null]} />}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.formSection}>
      <AppText variant="h3" weight="bold" style={styles.sectionTitle}>Personal Information</AppText>
      
      <AppInput
        label="First Name"
        placeholder="Juan"
        value={firstName}
        onChangeText={setFirstName}
        error={errors.firstName}
      />
      <AppInput
        label="Middle Name (Optional)"
        placeholder="Dela"
        value={middleName}
        onChangeText={setMiddleName}
      />
      <AppInput
        label="Last Name"
        placeholder="Cruz"
        value={lastName}
        onChangeText={setLastName}
        error={errors.lastName}
      />
      <AppInput
        label="Email Address"
        placeholder="juan@example.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AppInput
        label="Mobile Number"
        placeholder="09123456789"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        keyboardType="phone-pad"
      />
      <AppInput
        label="Birthday"
        placeholder="MM/DD/YYYY"
        value={birthday}
        onChangeText={handleBirthdayChange}
        error={errors.birthday}
        keyboardType="number-pad"
        maxLength={10}
      />
      <AppSelect
        label="Gender (Optional)"
        options={GENDERS}
        value={gender}
        onSelect={setGender}
        placeholder="Select gender"
        containerStyle={{ marginBottom: Spacing['4'] }}
      />
      <AppInput
        label="Password"
        placeholder="Min. 8 chars, 1 Upper, 1 Number, 1 Special"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry={!showPassword}
        rightIcon={showPassword ? <EyeOff size={20} color={Colors.textTertiary} /> : <Eye size={20} color={Colors.textTertiary} />}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />
      <AppInput
        label="Confirm Password"
        placeholder="Re-type password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        secureTextEntry={!showPassword}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <ShieldCheck size={28} color={Colors.primary} />
        <AppText variant="h3" weight="bold" style={styles.sectionTitleNoMargin}>Identity Verification</AppText>
      </View>
      <AppText variant="body" color={Colors.textSecondary} style={{ marginBottom: Spacing['6'] }}>
        Help verify every user to reduce fake accounts and improve safety between homeowners and service providers.
      </AppText>

      <AppSelect
        label="Select Valid Government ID"
        options={ID_TYPES}
        value={idType}
        onSelect={setIdType}
        error={errors.idType}
        containerStyle={{ marginBottom: Spacing['4'] }}
      />

      <ImageUploadCard
        label="Upload Front of ID"
        onImageSelected={setFrontId}
        error={errors.frontId}
        containerStyle={{ marginBottom: Spacing['4'] }}
      />

      <ImageUploadCard
        label="Upload Back of ID"
        onImageSelected={setBackId}
        error={errors.backId}
        containerStyle={{ marginBottom: Spacing['4'] }}
      />

      <ImageUploadCard
        label="Selfie Verification (Recommended)"
        description="Take a clear selfie holding your ID"
        onImageSelected={setSelfie}
        containerStyle={{ marginBottom: Spacing['4'] }}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <MapPin size={28} color={Colors.primary} />
        <AppText variant="h3" weight="bold" style={styles.sectionTitleNoMargin}>Location Information</AppText>
      </View>
      <AppText variant="body" color={Colors.textSecondary} style={{ marginBottom: Spacing['4'] }}>
        Know where you are located for better service matching and provider coverage.
      </AppText>

      <AppText variant="h4" weight="bold" style={{ marginVertical: Spacing['4'] }}>Address Entry</AppText>

      <View style={{ flexDirection: 'row', gap: Spacing['3'] }}>
        <AppInput
          label="House/Unit No."
          value={streetNumber}
          onChangeText={setStreetNumber}
          containerStyle={{ flex: 1 }}
        />
        <AppInput
          label="Street"
          value={street}
          onChangeText={setStreet}
          error={errors.street}
          containerStyle={{ flex: 2 }}
        />
      </View>

      <AppInput
        label="Barangay"
        value={district}
        onChangeText={setDistrict}
      />
      
      <View style={{ flexDirection: 'row', gap: Spacing['3'] }}>
        <AppInput
          label="City / Municipality"
          value={city}
          onChangeText={setCity}
          error={errors.city}
          containerStyle={{ flex: 1 }}
        />
        <AppInput
          label="Province"
          value={region}
          onChangeText={setRegion}
          error={errors.region}
          containerStyle={{ flex: 1 }}
        />
      </View>

      <AppInput
        label="ZIP Code"
        value={postalCode}
        onChangeText={setPostalCode}
        keyboardType="number-pad"
      />

      <View style={styles.privacyNotice}>
        <ShieldCheck size={24} color={Colors.verified} />
        <AppText variant="caption" color={Colors.textSecondary} style={{ flex: 1 }}>
          Your ID and location are securely stored and used only for identity verification, fraud prevention, and improving service quality. Your personal information will never be shared publicly without your consent.
        </AppText>
      </View>

      <View style={styles.consentSection}>
        <Pressable style={styles.checkboxContainer} onPress={() => setInfoAccurate(!infoAccurate)}>
          {infoAccurate ? <Check size={24} color={Colors.primary} /> : <Square size={24} color={Colors.textTertiary} />}
          <AppText variant="bodySm" color={Colors.textPrimary} style={{ flex: 1 }}>I confirm that the information provided is accurate.</AppText>
        </Pressable>
        
        <Pressable style={styles.checkboxContainer} onPress={() => setAgreePrivacy(!agreePrivacy)}>
          {agreePrivacy ? <Check size={24} color={Colors.primary} /> : <Square size={24} color={Colors.textTertiary} />}
          <AppText variant="bodySm" color={Colors.textPrimary} style={{ flex: 1 }}>
            I agree to the <AppText variant="bodySm" weight="bold" color={Colors.textLink}>Privacy Policy</AppText>.
          </AppText>
        </Pressable>

        <Pressable style={styles.checkboxContainer} onPress={() => setAgreeTerms(!agreeTerms)}>
          {agreeTerms ? <Check size={24} color={Colors.primary} /> : <Square size={24} color={Colors.textTertiary} />}
          <AppText variant="bodySm" color={Colors.textPrimary} style={{ flex: 1 }}>
            I agree to the <AppText variant="bodySm" weight="bold" color={Colors.textLink}>Terms of Service</AppText>.
          </AppText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold">Create Account</AppText>
        <View style={{ width: 24 }} />
      </View>

      {renderProgressBar()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.footer}>
        {step < 3 ? (
          <AppButton
            label="Next Step"
            onPress={handleNext}
            rightIcon={<ChevronRight size={20} color={Colors.white} />}
            fullWidth
          />
        ) : (
          <AppButton
            label="Complete Registration"
            onPress={handleRegister}
            fullWidth
          />
        )}
      </View>

      <Modal visible={showSuccess} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <CircleCheck size={48} color={Colors.verified} />
            </View>
            <AppText variant="h2" weight="bold" style={{ marginBottom: Spacing['2'], textAlign: 'center' }}>
              Registration Successful!
            </AppText>
            <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center', marginBottom: Spacing['6'] }}>
              Your account is being verified. We will notify you once you're good to go!
            </AppText>
            <AppButton
              label="Go to Sign In"
              onPress={() => {
                setShowSuccess(false);
                router.replace('/sign-in');
              }}
              fullWidth
            />
          </View>
        </View>
      </Modal>

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
    width: 40,
    height: 3,
    backgroundColor: Colors.border,
    marginHorizontal: -4,
    zIndex: 1,
  },
  progressLineActive: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['6'],
    paddingBottom: Spacing['16'],
  },
  formSection: {
    gap: Spacing['2'],
  },
  sectionTitle: {
    marginBottom: Spacing['4'],
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
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.verifiedBg,
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    gap: Spacing['3'],
    marginTop: Spacing['6'],
    marginBottom: Spacing['4'],
    borderWidth: 1,
    borderColor: Colors.verified,
  },
  consentSection: {
    gap: Spacing['4'],
    marginBottom: Spacing['4'],
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  footer: {
    padding: Spacing['4'],
    paddingBottom: 40,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['4'],
  },
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['6'],
    alignItems: 'center',
    width: '100%',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.verifiedBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['4'],
  },
});
