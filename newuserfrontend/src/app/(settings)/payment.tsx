import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { theme } from '../../theme';
import { ArrowLeft, CreditCard, Wallet, Plus, History, ChevronRight } from 'lucide-react-native';

const PAYMENT_METHODS = [
  { id: '1', title: 'A-yos Wallet', subtitle: 'Balance: ₱0.00', icon: Wallet, color: '#10b981', bg: '#d1fae5' },
  { id: '2', title: 'Credit / Debit Card', subtitle: '**** **** **** 1234', icon: CreditCard, color: '#3b82f6', bg: '#dbeafe' },
];

export default function PaymentScreen() {
  const router = useRouter();

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Payments</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[theme.typography.h4, styles.sectionTitle]}>Payment Methods</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Plus color={theme.colors.primary} size={16} />
              <Text style={[theme.typography.button, { color: theme.colors.primary, fontSize: 13, marginLeft: 4 }]}>Add New</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.card}>
            {PAYMENT_METHODS.map((method, index) => {
              const Icon = method.icon;
              return (
                <TouchableOpacity key={method.id} style={[styles.methodRow, index !== PAYMENT_METHODS.length - 1 && styles.borderBottom]}>
                  <View style={[styles.iconContainer, { backgroundColor: method.bg }]}>
                    <Icon color={method.color} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.typography.body1}>{method.title}</Text>
                    <Text style={theme.typography.caption}>{method.subtitle}</Text>
                  </View>
                  <ChevronRight color={theme.colors.textTertiary} size={20} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Payment History</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.historyRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#f3f4f6' }]}>
                <History color={theme.colors.textSecondary} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.body1}>View All History</Text>
                <Text style={theme.typography.caption}>See your past transactions</Text>
              </View>
              <ChevronRight color={theme.colors.textTertiary} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.md },
  
  section: { marginBottom: theme.spacing.xl },
  sectionTitle: { marginBottom: theme.spacing.md, marginLeft: theme.spacing.xs },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${theme.colors.primary}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.radius.full },
  
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  
  historyRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
});
