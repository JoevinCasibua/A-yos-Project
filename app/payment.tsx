import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { ChevronLeft, CreditCard, Wallet, Banknote, Check, Info, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Typography, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { paymentMethods } from '@/constants/mockData';
import { useRequest } from '@/context/RequestContext';

export default function PaymentScreen() {
  const { request } = useRequest();
  const [selectedMethod, setSelectedMethod] = useState('visa');

  const handleBack = useCallback(() => router.back(), []);
  const handlePay = useCallback(() => {
    // Navigate forward to Live Tracking, using the selected worker or defaulting to p1
    const workerId = request.selectedWorkerId || 'p1';
    
    // Dismiss any underlying modals from the previous flow (e.g. Open Bidding / Schedule)
    // so they are fully unmounted before Live Tracking loads, exactly replicating ASAP's clean transition.
    router.dismissAll();
    router.replace(`/tracking/${workerId}`);
  }, [request.selectedWorkerId]);

  // Using a more generalized icon getter that maps to the new visuals
  const getMethodIcon = (type: string) => {
    if (type === 'Apple Pay' || type.toLowerCase().includes('gcash')) return <Wallet size={24} color={Colors.textPrimary} strokeWidth={2} />;
    if (type.toLowerCase().includes('cash')) return <Banknote size={24} color={Colors.textPrimary} strokeWidth={2} />;
    return <CreditCard size={24} color={Colors.textPrimary} strokeWidth={2} />;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Confirm Booking</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Booking Details Card */}
        <View style={styles.section}>
          <View style={styles.bookingCard}>
            <View style={styles.bookingCardHeader}>
              <View style={styles.bookingCardInfo}>
                <AppText variant="h4" weight="bold" style={{ marginBottom: 4 }}>Deep Cleaning Service</AppText>
                <View style={styles.dateRow}>
                  <Calendar size={14} color={Colors.textSecondary} />
                  <AppText variant="bodySm" color={Colors.textSecondary} style={{ marginLeft: 4 }}>
                    Oct 24, 2023 • 9:00 AM
                  </AppText>
                </View>
              </View>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=200' }} 
                style={styles.serviceImage} 
              />
            </View>
            
            <View style={styles.summaryRow}>
              <AppText variant="body" color={Colors.textSecondary}>Service Fee (3 hrs)</AppText>
              <AppText variant="body" weight="semiBold">₱1,500.00</AppText>
            </View>
            <View style={[styles.summaryRow, { marginTop: Spacing['2'] }]}>
              <AppText variant="body" color={Colors.textSecondary}>Cleaning Supplies</AppText>
              <AppText variant="body" weight="semiBold">₱250.00</AppText>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryRow}>
              <AppText variant="h4" weight="bold">Total</AppText>
              <AppText variant="h3" weight="bold" color={Colors.textPrimary}>₱1,750.00</AppText>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <AppText variant="h4" weight="bold" style={{ marginBottom: Spacing['3'] }}>Payment Method</AppText>
          <View style={styles.methodsList}>
            {/* Hardcoded matching the visual for demonstration, but keeping state functional.
                In a real app, we'd map over updated mockData. Here we map over existing 
                mock data but adapt the display somewhat to match the visual if possible.
                Since it's a visual update, I will update the rendered list to exactly match the image
                while mapping their values to the state. */}
            
            <Pressable
              onPress={() => setSelectedMethod('gcash')}
              style={[
                styles.methodCard,
                { borderColor: selectedMethod === 'gcash' ? Colors.textPrimary : Colors.border },
              ]}
            >
              <View style={styles.methodIcon}><Wallet size={24} color={Colors.textPrimary} strokeWidth={2} /></View>
              <View style={styles.methodInfo}>
                <AppText variant="body" weight="semiBold">GCash</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>0917 •••• 1234</AppText>
              </View>
              {selectedMethod === 'gcash' ? (
                <View style={styles.selectedCircle}>
                  <Check size={14} color={Colors.white} strokeWidth={3} />
                </View>
              ) : (
                <View style={styles.unselectedCircle} />
              )}
            </Pressable>

            <Pressable
              onPress={() => setSelectedMethod('visa')}
              style={[
                styles.methodCard,
                { borderColor: selectedMethod === 'visa' ? Colors.textPrimary : Colors.border },
              ]}
            >
              <View style={styles.methodIcon}><CreditCard size={24} color={Colors.textPrimary} strokeWidth={2} /></View>
              <View style={styles.methodInfo}>
                <AppText variant="body" weight="semiBold">Credit / Debit Card</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>Visa ending in 4242</AppText>
              </View>
              {selectedMethod === 'visa' ? (
                <View style={styles.selectedCircle}>
                  <Check size={14} color={Colors.white} strokeWidth={3} />
                </View>
              ) : (
                <View style={styles.unselectedCircle} />
              )}
            </Pressable>

            <Pressable
              onPress={() => setSelectedMethod('cash')}
              style={[
                styles.methodCard,
                { borderColor: selectedMethod === 'cash' ? Colors.textPrimary : Colors.border },
              ]}
            >
              <View style={styles.methodIcon}><Banknote size={24} color={Colors.textPrimary} strokeWidth={2} /></View>
              <View style={styles.methodInfo}>
                <AppText variant="body" weight="semiBold">Cash on Service</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>Pay directly to provider</AppText>
              </View>
              {selectedMethod === 'cash' ? (
                <View style={styles.selectedCircle}>
                  <Check size={14} color={Colors.white} strokeWidth={3} />
                </View>
              ) : (
                <View style={styles.unselectedCircle} />
              )}
            </Pressable>

          </View>
        </View>

      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        {/* Security Note */}
        <View style={styles.securityNote}>
          <Info size={20} color={Colors.success} strokeWidth={2} />
          <AppText variant="bodySm" color={Colors.success} style={{ flex: 1 }}>
            Online payment will be held and only released after the job is completed.
          </AppText>
        </View>
        
        <AppButton
          label="Confirm & Pay ₱1,750.00"
          size="xl"
          fullWidth
          onPress={handlePay}
          style={{ backgroundColor: Colors.textPrimary, borderRadius: Radius.lg }}
          labelStyle={{ color: Colors.white }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60,
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  section: { paddingHorizontal: Spacing['4'], marginBottom: Spacing['6'] },
  
  bookingCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 5,
    borderTopColor: Colors.primary,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing['4'],
  },
  bookingCardInfo: {
    flex: 1,
    paddingRight: Spacing['2'],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  summaryDivider: { 
    height: 1, 
    backgroundColor: Colors.border, 
    marginVertical: Spacing['4'] 
  },

  methodsList: { gap: Spacing['3'] },
  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing['4'], borderWidth: 1, gap: Spacing['3'],
  },
  methodIcon: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center',
  },
  methodInfo: { flex: 1 },
  selectedCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.textPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  unselectedCircle: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.textTertiary,
  },

  bottomContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'transparent', 
    paddingHorizontal: Spacing['4'], paddingBottom: Spacing['6'],
  },
  securityNote: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.successBg,
    padding: Spacing['3'],
    borderRadius: Radius.md,
    gap: Spacing['2'], 
    marginBottom: Spacing['4'],
  },
});
