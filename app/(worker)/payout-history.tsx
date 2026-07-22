import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Clock, AlertCircle, TrendingUp, ArrowDownToLine } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { PageHeader } from '@/components/layout/PageHeader';

interface PayoutRecord {
  id: string;
  amount: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference: string;
}

const MOCK_PAYOUTS: PayoutRecord[] = [
  { id: 'p1', amount: '₱5,000.00', method: 'GCash', status: 'completed', date: 'Jul 20, 2026', reference: 'PAY-2026-001' },
  { id: 'p2', amount: '₱3,500.00', method: 'BPI Savings', status: 'completed', date: 'Jul 15, 2026', reference: 'PAY-2026-002' },
  { id: 'p3', amount: '₱8,000.00', method: 'GCash', status: 'completed', date: 'Jul 10, 2026', reference: 'PAY-2026-003' },
  { id: 'p4', amount: '₱2,000.00', method: 'PayPal', status: 'pending', date: 'Jul 22, 2026', reference: 'PAY-2026-004' },
  { id: 'p5', amount: '₱4,500.00', method: 'GCash', status: 'completed', date: 'Jul 5, 2026', reference: 'PAY-2026-005' },
];

type StatusFilter = 'all' | 'completed' | 'pending' | 'failed';

const statusIcon = (s: string) => {
  if (s === 'completed') return <CheckCircle size={14} color={Colors.verified} />;
  if (s === 'pending') return <Clock size={14} color={Colors.warning} />;
  return <AlertCircle size={14} color={Colors.error} />;
};

const statusColor = (s: string) => {
  if (s === 'completed') return Colors.verified;
  if (s === 'pending') return Colors.warning;
  return Colors.error;
};

export default function PayoutHistoryScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return MOCK_PAYOUTS;
    return MOCK_PAYOUTS.filter((p) => p.status === filter);
  }, [filter]);

  return (
    <View style={styles.container}>
      <PageHeader
        title="Payout History"
        from={from}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filters */}
        <View style={styles.filters}>
          {(['all', 'completed', 'pending', 'failed'] as StatusFilter[]).map((f) => (
            <Chip
              key={f}
              label={f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              selected={filter === f}
              onPress={() => setFilter(f)}
              size="sm"
            />
          ))}
        </View>

        {/* Payout List */}
        <View style={styles.payoutList}>
          {filtered.map((payout) => (
            <View key={payout.id} style={styles.payoutCard}>
              <View style={styles.payoutTop}>
                <View style={styles.payoutIcon}>
                  <ArrowDownToLine size={16} color={Colors.cta} />
                </View>
                <View style={styles.payoutInfo}>
                  <AppText variant="body" weight="semiBold">{payout.method}</AppText>
                  <AppText variant="caption" color={Colors.textTertiary}>{payout.date}</AppText>
                </View>
                <AppText variant="body" weight="bold" color={Colors.cta}>{payout.amount}</AppText>
              </View>
              <View style={styles.payoutBottom}>
                <AppText variant="caption" color={Colors.textTertiary}>Ref: {payout.reference}</AppText>
                <View style={styles.statusRow}>
                  {statusIcon(payout.status)}
                  <AppText variant="caption" weight="semiBold" color={statusColor(payout.status)}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </View>

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48, marginBottom: Spacing['3'] }}>💸</Text>
            <AppText variant="h4" weight="bold">No payouts found</AppText>
            <AppText variant="bodySm" color={Colors.textSecondary}>
              {filter === 'all' ? 'You haven\'t made any payouts yet.' : `No ${filter} payouts.`}
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },

  filters: {
    flexDirection: 'row',
    gap: Spacing['2'],
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },

  payoutList: {
    gap: Spacing['3'],
    paddingHorizontal: theme.layout.screenPadding,
  },
  payoutCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    ...Elevation.sm,
  },
  payoutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  payoutIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutInfo: { flex: 1, gap: 2 },
  payoutBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing['3'],
    paddingTop: Spacing['3'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['10'],
    gap: Spacing['1'],
  },
});
