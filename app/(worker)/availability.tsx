import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';

export default function AvailabilityScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();

  const [matchingOnline, setMatchingOnline] = useState(false);

  return (
    <Screen safeArea scrollable>
      <PageHeader title="My Availability" from={from} />

      <View style={styles.content}>
        {/* Day cards — commented out per request
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
        */}

        {/* Available for matching card — ported from ayos-final */}
        <View style={styles.matchingCard}>
          <View style={styles.matchingRow}>
            <View style={styles.matchingCopy}>
              <AppText variant="body" weight="bold">
                Available for matching
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Turn this on when you are ready to receive requests.
              </AppText>
            </View>
            <Switch
              value={matchingOnline}
              onValueChange={setMatchingOnline}
              trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
              thumbColor={matchingOnline ? theme.colors.primary : theme.colors.textTertiary}
            />
          </View>
          {matchingOnline && (
            <AppText variant="caption" color={theme.colors.secondary}>
              Your profile is eligible for matching.
            </AppText>
          )}
        </View>

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
  matchingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  matchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  matchingCopy: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
