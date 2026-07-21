import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { Clock } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { workerProfile, DAYS, DAY_LABELS, DayAvailability } from '@/constants/workerData';

const defaultAvailability: DayAvailability = { available: false, startTime: '09:00', endTime: '17:00' };

export default function AvailabilityScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [availability, setAvailability] = useState<Record<string, DayAvailability>>(() => {
    const initial: Record<string, DayAvailability> = {};
    for (const day of DAYS) {
      initial[day] = workerProfile.availability[day] || { ...defaultAvailability };
    }
    return initial;
  });

  const updateDay = (day: string, updates: Partial<DayAvailability>) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  };

  const handleSave = () => {
    const availableDays = DAYS.filter((d) => availability[d].available);
    if (availableDays.length === 0) {
      Alert.alert('No Availability', 'Please mark at least one day as available.');
      return;
    }
    for (const day of availableDays) {
      const { startTime, endTime } = availability[day];
      if (!startTime || !endTime) {
        Alert.alert('Missing Time', `Please set both start and end times for ${DAY_LABELS[day]}.`);
        return;
      }
    }
    Alert.alert('Saved', 'Your availability has been updated.', [
      { text: 'OK', onPress: () => {
        if (from === 'profile') router.push('/(worker)/profile');
        else if (from === 'settings') router.push('/(worker)/settings');
        else router.back();
      }},
    ]);
  };

  const availableDays = DAYS.filter((d) => availability[d].available).length;

  return (
    <Screen safeArea scrollable>
      <PageHeader title="My Availability" from={from} />

      <View style={styles.content}>
        <View style={styles.subtitleRow}>
          <Clock size={18} color={theme.colors.textSecondary} />
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginLeft: theme.spacing.sm, flex: 1 }]}>
            Set your weekly working hours
          </Text>
        </View>

        <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, marginBottom: theme.spacing.sm }]}>
          {availableDays} day{availableDays !== 1 ? 's' : ''} available
        </Text>

        {DAYS.map((day) => {
          const dayData = availability[day];
          return (
            <View key={day} style={styles.dayRow}>
              <View style={styles.dayLeft}>
                <Text style={[theme.typography.body1, { flex: 1 }]}>{DAY_LABELS[day]}</Text>
                <Switch
                  value={dayData.available}
                  onValueChange={(v) => updateDay(day, { available: v })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                  thumbColor={dayData.available ? theme.colors.primary : theme.colors.textTertiary}
                />
              </View>
              {dayData.available ? (
                <View style={styles.timeRow}>
                  <View style={styles.timeInput}>
                    <AppInput
                      value={dayData.startTime}
                      onChangeText={(v) => updateDay(day, { startTime: v })}
                      placeholder="09:00"
                      inputStyle={{ textAlign: 'center' }}
                    />
                  </View>
                  <Text style={[theme.typography.body1, { color: theme.colors.textTertiary, marginHorizontal: theme.spacing.sm }]}>
                    →
                  </Text>
                  <View style={styles.timeInput}>
                    <AppInput
                      value={dayData.endTime}
                      onChangeText={(v) => updateDay(day, { endTime: v })}
                      placeholder="17:00"
                      inputStyle={{ textAlign: 'center' }}
                    />
                  </View>
                </View>
              ) : (
                <Text style={[theme.typography.body2, { color: theme.colors.textTertiary, marginTop: theme.spacing.xs }]}>
                  Unavailable
                </Text>
              )}
            </View>
          );
        })}

        <AppButton
          label="Save Changes"
          variant="primary"
          fullWidth
          onPress={handleSave}
          style={{ marginTop: theme.spacing.lg }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  dayRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  dayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  timeInput: {
    flex: 1,
  },
});
