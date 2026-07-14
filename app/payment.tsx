import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, CreditCard, Wallet, Plus, Check, Shield, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { paymentMethods } from '@/constants/mockData';

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [promoCode, setPromoCode] = useState('');

  const handleBack = useCallback(() => router.back(), []);
  const handlePay = useCallback(() => {
    router.replace('/(tabs)/bookings');
  }, []);

  const getMethodIcon = (type: string) => {
    if (type === 'Apple Pay') return <Wallet size={24} color={Colors.textPrimary} strokeWidth={2} />;
    return <CreditCard size={24} color={Colors.textPrimary} strokeWidth={2} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold">Payment</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Payment Methods */}
        <View style={styles.section}>
          <AppText variant="body" weight="semiBold">Payment Method</AppText>
          <View style={styles.methodsList}>
            {paymentMethods.map((m) => (
              <Pressable
                key={m.id}
                onPress={() => setSelectedMethod(m.id)}
                style={[
                  styles.methodCard,
                  {
                    borderColor: selectedMethod === m.id ? Colors.cta : Colors.border,
                    backgroundColor: selectedMethod === m.id ? Colors.primarySurface : Colors.white,
                  },
                ]}
              >
                <View style={styles.methodIcon}>{getMethodIcon(m.type)}</View>
                <View style={styles.methodInfo}>
                  <AppText variant="body" weight="semiBold">{m.type}</AppText>
                  {m.last4 && (
                    <AppText variant="caption" color={Colors.textSecondary}>
                      ending in {m.last4}
                    </AppText>
                  )}
                </View>
                {selectedMethod === m.id ? (
                  <View style={styles.selectedCircle}>
                    <Check size={16} color={Colors.white} strokeWidth={3} />
                  </View>
                ) : (
                  <View style={styles.unselectedCircle} />
                )}
              </Pressable>
            ))}

            {/* Add New Card */}
            <Pressable style={styles.addCardBtn}>
              <View style={styles.addIcon}>
                <Plus size={20} color={Colors.cta} strokeWidth={2} />
              </View>
              <AppText variant="body" weight="semiBold" color={Colors.cta}>Add New Card</AppText>
            </Pressable>
          </View>
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <AppText variant="body" weight="semiBold">Promo Code</AppText>
          <View style={styles.promoRow}>
            <View style={styles.promoInput}>
              <AppInput
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter promo code"
                style={{ flex: 1 }}
              />
            </View>
            <AppButton label="Apply" variant="outline" size="md" style={{ width: 100 }} />
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <AppText variant="body" weight="semiBold">Order Summary</AppText>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <AppText variant="bodySm" color={Colors.textSecondary}>Service Rate</AppText>
              <AppText variant="bodySm" weight="semiBold">$45.00</AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant="bodySm" color={Colors.textSecondary}>Booking Fee</AppText>
              <AppText variant="bodySm" weight="semiBold">$5.00</AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant="bodySm" color={Colors.textSecondary}>First-time Discount (20%)</AppText>
              <AppText variant="bodySm" weight="semiBold" color={Colors.success}>-$9.00</AppText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <AppText variant="body" weight="bold">Total</AppText>
              <AppText variant="h3" weight="bold" color={Colors.cta}>$41.00</AppText>
            </View>
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Lock size={16} color={Colors.textSecondary} strokeWidth={2} />
          <AppText variant="caption" color={Colors.textSecondary}>
            Your payment is secured with 256-bit SSL encryption
          </AppText>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <AppButton
          label="Pay $41.00"
          size="lg"
          fullWidth
          onPress={handlePay}
          leftIcon={<Lock size={18} color={Colors.white} strokeWidth={2} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'], paddingTop: Spacing['3'], paddingBottom: Spacing['3'],
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.full, backgroundColor: Colors.surfaceLight },
  section: { marginTop: Spacing['6'], paddingHorizontal: Spacing['4'] },
  methodsList: { marginTop: Spacing['3'], gap: Spacing['3'] },
  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing['4'], borderWidth: 1.5, gap: Spacing['3'],
  },
  methodIcon: {
    width: 44, height: 44, borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceLight, alignItems: 'center', justifyContent: 'center',
  },
  methodInfo: { flex: 1 },
  selectedCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.cta,
    alignItems: 'center', justifyContent: 'center',
  },
  unselectedCircle: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.border,
  },
  addCardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing['3'],
    backgroundColor: Colors.primarySurface, borderRadius: Radius.lg,
    padding: Spacing['4'], borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.primaryBorder,
  },
  addIcon: {
    width: 44, height: 44, borderRadius: Radius.lg, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  promoRow: { flexDirection: 'row', gap: Spacing['3'], marginTop: Spacing['3'] },
  promoInput: { flex: 1 },
  summaryCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    marginTop: Spacing['3'], ...Elevation.sm,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing['2'] },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing['2'] },
  securityNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing['2'], marginTop: Spacing['6'], marginBottom: Spacing['4'],
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, paddingHorizontal: Spacing['4'], paddingVertical: Spacing['3'],
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
});
