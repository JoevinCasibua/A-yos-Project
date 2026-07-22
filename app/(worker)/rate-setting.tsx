import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Switch } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DollarSign, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { workerProfile } from '@/constants/workerData';

const MIN_RATE = 150;
const MAX_RATE = 2500;

function parseCurrentRate(rateStr: string): number {
  const match = rateStr.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 45;
}

export default function RateSettingScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const currentRate = parseCurrentRate(workerProfile.hourlyRate);
  const [rateEnabled, setRateEnabled] = useState(true);
  const [rateInput, setRateInput] = useState(currentRate.toString());
  const [saved, setSaved] = useState(false);

  const numericRate = parseInt(rateInput, 10);
  const isValid = !isNaN(numericRate) && numericRate >= MIN_RATE && numericRate <= MAX_RATE;
  const isBelowMin = !isNaN(numericRate) && numericRate > 0 && numericRate < MIN_RATE;
  const isAboveMax = !isNaN(numericRate) && numericRate > MAX_RATE;

  const handleSave = () => {
    if (!isValid) return;
    Alert.alert(
      'Update Rate',
      `Set your hourly rate to ₱${numericRate.toLocaleString()}/hr?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          },
        },
      ]
    );
  };

  return (
    <Screen safeArea scrollable header={<PageHeader title="Rate Setting" from={from} />}>
      <View style={styles.content}>
        {/* Enable/Disable Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <AppText variant="body" weight="semiBold">Hourly Rate</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {rateEnabled
                ? 'Your rate is visible to customers on job requests'
                : 'Enable to set a rate visible to customers'}
            </AppText>
          </View>
          <Switch
            value={rateEnabled}
            onValueChange={setRateEnabled}
            trackColor={{ false: Colors.borderLight, true: `${Colors.cta}40` }}
            thumbColor={rateEnabled ? Colors.cta : Colors.border}
          />
        </View>

        {rateEnabled ? (
          <>
            {/* Rate Input */}
            <View style={styles.rateCard}>
              <AppText variant="caption" color={Colors.textTertiary} style={styles.rateLabel}>
                YOUR HOURLY RATE
              </AppText>
              <View style={styles.rateInputRow}>
                <View style={styles.currencyBadge}>
                  <AppText variant="h4" weight="bold" color={Colors.cta}>₱</AppText>
                </View>
                <TextInput
                  style={styles.rateInput}
                  value={rateInput}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setRateInput(cleaned);
                    setSaved(false);
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.border}
                  maxLength={5}
                />
                <AppText variant="body" color={Colors.textSecondary}>/hr</AppText>
              </View>

              {/* Validation Feedback */}
              {isBelowMin && (
                <View style={styles.validationRow}>
                  <AlertTriangle size={14} color={Colors.warning} />
                  <AppText variant="caption" color={Colors.warning}>
                    Minimum rate is ₱{MIN_RATE.toLocaleString()}/hr
                  </AppText>
                </View>
              )}
              {isAboveMax && (
                <View style={styles.validationRow}>
                  <AlertTriangle size={14} color={Colors.error} />
                  <AppText variant="caption" color={Colors.error}>
                    Maximum rate is ₱{MAX_RATE.toLocaleString()}/hr
                  </AppText>
                </View>
              )}
              {isValid && (
                <View style={styles.validationRow}>
                  <CheckCircle size={14} color={Colors.success} />
                  <AppText variant="caption" color={Colors.success}>
                    Rate within acceptable range
                  </AppText>
                </View>
              )}
            </View>

            {/* Rate Guidelines */}
            <View style={styles.guidelinesCard}>
              <AppText variant="bodySm" weight="semiBold" color={Colors.textPrimary} style={styles.guidelinesTitle}>
                Rate Guidelines
              </AppText>
              <View style={styles.guidelineRow}>
                <DollarSign size={14} color={Colors.textTertiary} />
                <AppText variant="caption" color={Colors.textSecondary}>
                  Minimum: ₱{MIN_RATE.toLocaleString()}/hr
                </AppText>
              </View>
              <View style={styles.guidelineRow}>
                <DollarSign size={14} color={Colors.textTertiary} />
                <AppText variant="caption" color={Colors.textSecondary}>
                  Maximum: ₱{MAX_RATE.toLocaleString()}/hr
                </AppText>
              </View>
              <View style={[styles.guidelineRow, { marginTop: Spacing['2'] }]}>
                <AppText variant="caption" color={Colors.textTertiary} style={{ lineHeight: 18 }}>
                  Your rate appears on job requests. Customers see this before booking. Competitive rates attract more bookings.
                </AppText>
              </View>
            </View>

            {/* Save Button */}
            <AppButton
              label={saved ? 'Rate Updated!' : 'Save Rate'}
              variant="primary"
              fullWidth
              onPress={handleSave}
              disabled={!isValid || saved}
            />
          </>
        ) : (
          <View style={styles.disabledMessage}>
            <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
              Hourly rate is disabled. Enable the toggle above to set your rate.
            </AppText>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing['4'],
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    ...Elevation.sm,
  },
  toggleInfo: {
    flex: 1,
    gap: Spacing['1'],
  },
  disabledMessage: {
    alignItems: 'center',
    padding: Spacing['6'],
  },
  rateCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['5'],
    ...Elevation.sm,
  },
  rateLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing['3'],
  },
  rateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  currencyBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    backgroundColor: `${Colors.cta}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderLight,
    paddingVertical: Spacing['2'],
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['1'],
    marginTop: Spacing['3'],
  },
  guidelinesCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    gap: Spacing['2'],
    ...Elevation.sm,
  },
  guidelinesTitle: {
    marginBottom: Spacing['1'],
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
});
