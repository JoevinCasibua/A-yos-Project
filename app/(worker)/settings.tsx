import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Camera, Eye, EyeOff } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { ImageUploadCard } from '@/components/ImageUploadCard';
import { workerProfile } from '@/constants/workerData';

export default function WorkerSettingsScreen() {
  // Personal info
  const [firstName, setFirstName] = useState('Carlos');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('Méndez');
  const [email, setEmail] = useState(workerProfile.email);
  const [phone, setPhone] = useState('09123456789');
  const [birthday, setBirthday] = useState('01/15/1990');

  // Industry & skills (display only for now)
  const [industry, setIndustry] = useState(workerProfile.category);
  const [skills, setSkills] = useState(workerProfile.skills.join(', '));

  // Address
  const [street, setStreet] = useState('123 Oak Street');
  const [barangay, setBarangay] = useState('Downtown');
  const [city, setCity] = useState('Makati City');
  const [province, setProvince] = useState('Metro Manila');
  const [zipCode, setZipCode] = useState('1200');

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Notification preferences
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleBack = () => router.push('/(worker)/profile');

  const handleSave = () => {
    Alert.alert('Saved', 'Profile updated successfully.', [
      { text: 'OK', onPress: () => router.push('/(worker)/profile') },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold">Settings</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Photo */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Profile Photo</AppText>
          <ImageUploadCard
            label="Avatar"
            description="Tap to change your profile photo"
            onImageSelected={() => {}}
            containerStyle={{ marginBottom: Spacing['4'] }}
          />
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Personal Information</AppText>
          <View style={styles.row}>
            <AppInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              containerStyle={{ flex: 1 }}
            />
            <View style={{ width: Spacing['3'] }} />
            <AppInput
              label="Middle Name"
              value={middleName}
              onChangeText={setMiddleName}
              containerStyle={{ flex: 1 }}
            />
          </View>
          <AppInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <AppInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppInput
            label="Mobile Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <AppInput
            label="Birthday"
            value={birthday}
            onChangeText={setBirthday}
            placeholder="MM/DD/YYYY"
          />
        </View>

        {/* Industry & Skills */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Industry & Skills</AppText>
          <AppInput
            label="Primary Industry"
            value={industry}
            onChangeText={setIndustry}
          />
          <AppInput
            label="Skills / Services"
            value={skills}
            onChangeText={setSkills}
            placeholder="Comma-separated list"
          />
        </View>

        {/* Office Address */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Office Address</AppText>
          <AppInput
            label="Street Address"
            value={street}
            onChangeText={setStreet}
          />
          <AppInput
            label="Barangay"
            value={barangay}
            onChangeText={setBarangay}
          />
          <View style={styles.row}>
            <AppInput
              label="City"
              value={city}
              onChangeText={setCity}
              containerStyle={{ flex: 1 }}
            />
            <View style={{ width: Spacing['3'] }} />
            <AppInput
              label="Province"
              value={province}
              onChangeText={setProvince}
              containerStyle={{ flex: 1 }}
            />
          </View>
          <AppInput
            label="ZIP Code"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="number-pad"
          />
        </View>

        {/* Password */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Change Password</AppText>
          <AppInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? <EyeOff size={20} color={Colors.textTertiary} /> : <Eye size={20} color={Colors.textTertiary} />}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          <AppInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
          />
          <AppInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={styles.sectionTitle}>Notification Preferences</AppText>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <AppText variant="body" weight="medium">Booking Alerts</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>New booking requests and updates</AppText>
            </View>
            <Switch
              value={bookingAlerts}
              onValueChange={setBookingAlerts}
              trackColor={{ false: Colors.border, true: Colors.primarySurface }}
              thumbColor={bookingAlerts ? Colors.primary : Colors.textTertiary}
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <AppText variant="body" weight="medium">Message Alerts</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>Customer messages and replies</AppText>
            </View>
            <Switch
              value={messageAlerts}
              onValueChange={setMessageAlerts}
              trackColor={{ false: Colors.border, true: Colors.primarySurface }}
              thumbColor={messageAlerts ? Colors.primary : Colors.textTertiary}
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <AppText variant="body" weight="medium">Promotions</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>Deals, discounts, and app news</AppText>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: Colors.border, true: Colors.primarySurface }}
              thumbColor={promotions ? Colors.primary : Colors.textTertiary}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          label="Save Changes"
          onPress={handleSave}
          fullWidth
        />
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
  scrollContent: {
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['4'],
    paddingBottom: Spacing['16'],
  },
  section: {
    marginBottom: Spacing['6'],
  },
  sectionTitle: {
    marginBottom: Spacing['3'],
  },
  row: {
    flexDirection: 'row',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  toggleInfo: {
    flex: 1,
    marginRight: Spacing['3'],
  },
  footer: {
    padding: Spacing['4'],
    paddingBottom: 40,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
