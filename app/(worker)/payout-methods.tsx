import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Plus, Trash2, Star } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { walletPayoutMethods } from '@/constants/workerMockData';

interface PayoutMethod {
  id: string;
  label: string;
  account: string;
  color: string;
  isDefault: boolean;
}

const initialMethods: PayoutMethod[] = walletPayoutMethods.map((m, i) => ({
  ...m,
  isDefault: i === 0,
}));

export default function PayoutMethodsScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [methods, setMethods] = useState<PayoutMethod[]>(initialMethods);

  const handleSetDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const handleRemove = (id: string) => {
    Alert.alert('Remove Method', 'Are you sure you want to remove this payout method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setMethods((prev) => prev.filter((m) => m.id !== id)),
      },
    ]);
  };

  const handleAddMethod = () => {
    Alert.alert('Add Method', 'This feature will allow you to add a new payout method.');
  };

  return (
    <Screen safeArea scrollable header={<PageHeader title="Payout Methods" from={from} />}>

      <View style={styles.methodsList}>
        {methods.map((method) => (
          <View key={method.id} style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <View style={[styles.methodDot, { backgroundColor: method.color }]} />
              <View style={styles.methodInfo}>
                <AppText variant="body" weight="semiBold">{method.label}</AppText>
                <AppText variant="caption" color={Colors.textTertiary}>{method.account}</AppText>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <Star size={12} color={Colors.warning} fill={Colors.warning} />
                  <AppText variant="caption" weight="semiBold" color={Colors.warning}>Default</AppText>
                </View>
              )}
            </View>
            <View style={styles.methodActions}>
              {!method.isDefault && (
                <Pressable style={styles.setDefaultBtn} onPress={() => handleSetDefault(method.id)}>
                  <AppText variant="caption" weight="semiBold" color={Colors.cta}>Set as Default</AppText>
                </Pressable>
              )}
              <Pressable style={styles.removeBtn} onPress={() => handleRemove(method.id)}>
                <Trash2 size={14} color={Colors.error} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.addBtn} onPress={handleAddMethod}>
        <Plus size={20} color={Colors.cta} />
        <AppText variant="body" weight="semiBold" color={Colors.cta}>Add New Method</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  methodsList: {
    gap: Spacing['3'],
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    ...Elevation.sm,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  methodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  methodInfo: { flex: 1, gap: 2 },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing['2'],
    paddingVertical: Spacing['1'],
    backgroundColor: `${Colors.warning}15`,
    borderRadius: Radius.full,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing['3'],
    paddingTop: Spacing['3'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  setDefaultBtn: {
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2'],
    marginHorizontal: theme.layout.screenPadding,
    paddingVertical: Spacing['3'],
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.cta,
    borderStyle: 'dashed',
  },
});
