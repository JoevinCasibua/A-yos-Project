import React, { useEffect, useState } from 'react';
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
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { ImageUploadCard } from '@/components/ImageUploadCard';
import { supabase } from '@/lib/supabase';

export default function WorkerSettingsScreen() {
  // Personal info
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');

  // Industry & skills (display only for now)
  const [industry, setIndustry] = useState('');
  const [skills, setSkills] = useState('');

  // Address
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Notification preferences
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      setEmail(auth.user.email || '');
      const [profile, address, worker, preferences] = await Promise.all([
        supabase.rpc('get_my_private_profile'),
        supabase.from('addresses').select('street_number,street,district,city,region,postal_code').eq('user_id', auth.user.id).eq('is_default', true).maybeSingle(),
        supabase.from('worker_applications').select('id,worker_services(title,categories(name))').eq('user_id', auth.user.id).single(),
        supabase.from('notification_preferences').select('booking_alerts,message_alerts,promotions').eq('user_id', auth.user.id).maybeSingle(),
      ]);
      if (profile.data) {
        setFirstName(profile.data.first_name); setMiddleName(profile.data.middle_name || ''); setLastName(profile.data.last_name);
        setPhone(profile.data.phone || '');
        if (profile.data.birthday) { const [year,month,day]=profile.data.birthday.split('-'); setBirthday(`${month}/${day}/${year}`); }
      }
      if (address.data) {
        setStreet(address.data.street); setBarangay(address.data.district || ''); setCity(address.data.city);
        setProvince(address.data.region); setZipCode(address.data.postal_code || '');
      }
      const services = (worker.data?.worker_services || []) as unknown as Array<{ title:string; categories:{name:string}|Array<{name:string}> }>;
      const selectedCategory=services[0]?.categories;
      setIndustry((Array.isArray(selectedCategory)?selectedCategory[0]?.name:selectedCategory?.name) || ''); setSkills(services.map(item=>item.title).join(', '));
      if (preferences.data) {
        setBookingAlerts(preferences.data.booking_alerts); setMessageAlerts(preferences.data.message_alerts); setPromotions(preferences.data.promotions);
      }
    })();
  }, []);

  const handleBack = () => router.push('/(worker)/profile');

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser(); if (!auth.user) throw new Error('Please sign in again.');
      const [month,day,year] = birthday.split('/');
      const profile = await supabase.from('profiles').update({ first_name:firstName.trim(),middle_name:middleName.trim()||null,last_name:lastName.trim(),phone:phone.trim(),birthday:year&&month&&day?`${year}-${month}-${day}`:null }).eq('id',auth.user.id);
      if(profile.error) throw profile.error;
      const address = await supabase.from('addresses').update({ street, district:barangay||null, city, region:province, postal_code:zipCode||null }).eq('user_id',auth.user.id).eq('is_default',true);
      if(address.error) throw address.error;
      const [{data:application,error:applicationError},{data:category,error:categoryError}] = await Promise.all([
        supabase.from('worker_applications').select('id').eq('user_id',auth.user.id).single(),
        supabase.from('categories').select('id').ilike('name',industry.trim()).maybeSingle(),
      ]);
      if(applicationError||categoryError||!category) throw applicationError||categoryError||new Error('Choose an existing service category.');
      const skillValues=skills.split(',').map(value=>value.trim()).filter(Boolean);
      if(!skillValues.length) throw new Error('Add at least one service skill.');
      const service=await supabase.from('worker_services').update({category_id:category.id,title:skillValues[0],description:skillValues.join(', ')}).eq('worker_id',application.id);
      if(service.error) throw service.error;
      const preferences = await supabase.from('notification_preferences').upsert({ user_id:auth.user.id,booking_alerts:bookingAlerts,message_alerts:messageAlerts,promotions });
      if(preferences.error) throw preferences.error;
      if (email.trim().toLowerCase() !== auth.user.email?.toLowerCase()) { const changed=await supabase.auth.updateUser({email:email.trim().toLowerCase()}); if(changed.error) throw changed.error; }
      if (newPassword) {
        if(newPassword!==confirmPassword || !currentPassword) throw new Error('Confirm your current and new passwords.');
        const verified=await supabase.auth.signInWithPassword({email:auth.user.email||email,password:currentPassword}); if(verified.error) throw verified.error;
        const changed=await supabase.auth.updateUser({password:newPassword}); if(changed.error) throw changed.error;
      }
      Alert.alert('Saved', 'Profile updated successfully.', [{ text: 'OK', onPress: () => router.push('/(worker)/profile') }]);
    } catch (error) { Alert.alert('Unable to save', error instanceof Error ? error.message : 'Please try again.'); }
    finally { setSaving(false); }
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
            onImageSelected={() => Alert.alert('Unavailable', 'Profile photo storage is not enabled in this MVP build.')}
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
          loading={saving}
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
