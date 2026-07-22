import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { workerProfile } from '@/constants/workerData';

export default function PersonalInfoScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [name, setName] = useState(workerProfile.name);
  const [email, setEmail] = useState(workerProfile.email);
  const [phone, setPhone] = useState('+63 917 123 4567');
  const [address, setAddress] = useState('123 Sampaguita St., Quezon City');
  const [bio, setBio] = useState('Licensed Master Plumber with 12 years of experience in residential and commercial plumbing services.');

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    Alert.alert('Saved', 'Your personal information has been updated.', [
      { text: 'OK' },
    ]);
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Personal Information"
        from={from}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.inputLabel}>FULL NAME *</AppText>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.inputLabel}>EMAIL ADDRESS *</AppText>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.inputLabel}>PHONE NUMBER *</AppText>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.textTertiary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.inputLabel}>ADDRESS</AppText>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your address"
              placeholderTextColor={Colors.textTertiary}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.inputLabel}>BIO</AppText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Tell customers about yourself..."
              placeholderTextColor={Colors.textTertiary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <AppText variant="caption" color={Colors.textTertiary}>{bio.length}/200</AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton
            label="Save Changes"
            variant="primary"
            fullWidth
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },

  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    gap: Spacing['4'],
    marginHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
    ...Elevation.sm,
  },
  inputGroup: {
    gap: Spacing['1'],
  },
  inputLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: Spacing['2'],
  },

  actions: {
    paddingHorizontal: theme.layout.screenPadding,
  },
});
