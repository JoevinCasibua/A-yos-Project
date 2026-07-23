import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { theme } from '@/constants/theme';
import { ArrowLeft, Wallet, Plus, History, ChevronRight, X, CreditCard, Smartphone, Building } from 'lucide-react-native';

const TOP_UP_AMOUNTS = [500, 1000, 2000, 5000];

const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Payment for Plumbing Service', amount: '-₱850.00', date: 'Oct 15, 2023', type: 'debit' },
  { id: '2', title: 'Top Up', amount: '+₱2,000.00', date: 'Oct 14, 2023', type: 'credit' },
  { id: '3', title: 'Payment for AC Repair', amount: '-₱1,200.00', date: 'Oct 10, 2023', type: 'debit' },
];

const PAYMENT_METHODS = [
  { id: 'gcash', name: 'GCash', icon: Smartphone, color: '#007df2' },
  { id: 'maya', name: 'Maya', icon: Smartphone, color: '#10ce69' },
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, color: '#6366f1' },
  { id: 'bank', name: 'Online Banking', icon: Building, color: '#f59e0b' }
];

export default function WalletScreen() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const handleTopUpClick = () => {
    setShowPaymentModal(true);
  };

  const handleProceedPayment = () => {
    setShowPaymentModal(false);
    setTimeout(() => {
       router.push(`/payment/topup-success?amount=${selectedAmount}`);
    }, 300);
  };

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>My Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeaderRow}>
            <Text style={[theme.typography.body2, { color: 'rgba(255,255,255,0.9)' }]}>Total Balance</Text>
            <Wallet color={theme.colors.surface} size={20} />
          </View>
          <Text style={[theme.typography.h1, { color: theme.colors.surface, marginTop: theme.spacing.sm }]}>₱0.00</Text>
        </View>

        {/* Top Up Section */}
        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Quick Top Up</Text>
          <View style={styles.amountsGrid}>
            {TOP_UP_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.amountButton,
                  selectedAmount === amount && styles.amountButtonActive
                ]}
                onPress={() => setSelectedAmount(amount)}
              >
                <Text style={[
                  theme.typography.body2,
                  { color: selectedAmount === amount ? theme.colors.surface : theme.colors.textPrimary, fontWeight: selectedAmount === amount ? '600' : '400' }
                ]}>₱{amount.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button 
            title={selectedAmount ? `Top Up ₱${selectedAmount.toLocaleString()}` : "Select an amount to Top Up"} 
            onPress={handleTopUpClick} 
            disabled={!selectedAmount}
            fullWidth 
            style={{ marginTop: theme.spacing.md }}
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[theme.typography.h4, styles.sectionTitle]}>Recent Transactions</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={[theme.typography.button, { color: theme.colors.primary, fontSize: 12 }]}>See All</Text>
              <ChevronRight color={theme.colors.primary} size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsList}>
            {MOCK_TRANSACTIONS.map((tx, index) => (
              <View key={tx.id} style={[styles.transactionItem, index !== MOCK_TRANSACTIONS.length - 1 && styles.borderBottom]}>
                <View style={[styles.txIconContainer, { backgroundColor: tx.type === 'credit' ? '#dcfce7' : '#f3f4f6' }]}>
                  {tx.type === 'credit' ? (
                    <Plus color="#22c55e" size={20} />
                  ) : (
                    <History color={theme.colors.textSecondary} size={20} />
                  )}
                </View>
                <View style={styles.txDetails}>
                  <Text style={theme.typography.body1} numberOfLines={1}>{tx.title}</Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>{tx.date}</Text>
                </View>
                <Text style={[
                  theme.typography.body2, 
                  { fontWeight: '600', color: tx.type === 'credit' ? '#22c55e' : theme.colors.textPrimary }
                ]}>
                  {tx.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Payment Method Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={theme.typography.h4}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <X color={theme.colors.textPrimary} size={24} />
              </TouchableOpacity>
            </View>

            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }]}>
              You are topping up ₱{selectedAmount?.toLocaleString()}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {PAYMENT_METHODS.map(method => {
                const Icon = method.icon;
                const isSelected = selectedPayment === method.id;
                return (
                  <TouchableOpacity 
                    key={method.id} 
                    style={[styles.paymentMethodCard, isSelected && styles.paymentMethodCardActive]}
                    onPress={() => setSelectedPayment(method.id)}
                  >
                    <View style={[styles.paymentIconBox, { backgroundColor: method.color + '20' }]}>
                      <Icon color={method.color} size={24} />
                    </View>
                    <Text style={[theme.typography.body1, { flex: 1, marginLeft: theme.spacing.md }]}>{method.name}</Text>
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            <Button 
              title="Confirm Payment" 
              onPress={handleProceedPayment} 
              disabled={!selectedPayment}
              fullWidth 
              style={{ marginTop: theme.spacing.xl }}
            />
          </View>
        </View>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding },
  
  balanceCard: { backgroundColor: theme.colors.primary, borderRadius: theme.radius.xl, padding: theme.spacing.xl, marginTop: theme.spacing.sm, marginBottom: theme.spacing.xl, ...theme.shadows.md },
  balanceHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  section: { marginBottom: theme.spacing.xxl },
  sectionTitle: { marginBottom: theme.spacing.md },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
  
  amountsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  amountButton: { width: '48%', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.borderLight, paddingVertical: theme.spacing.md, borderRadius: theme.radius.md, alignItems: 'center', marginBottom: theme.spacing.md },
  amountButtonActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  
  transactionsList: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, paddingHorizontal: theme.spacing.md, ...theme.shadows.sm },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  txIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  txDetails: { flex: 1, marginRight: theme.spacing.sm },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.background, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, padding: theme.spacing.xl, paddingBottom: 40, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  paymentMethodCard: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.borderLight, borderRadius: theme.radius.lg, marginBottom: theme.spacing.md },
  paymentMethodCardActive: { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '05' },
  paymentIconBox: { width: 40, height: 40, borderRadius: theme.radius.md, justifyContent: 'center', alignItems: 'center' },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.border, justifyContent: 'center', alignItems: 'center' },
  radioCircleActive: { borderColor: theme.colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.primary },
});
