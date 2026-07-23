import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Clock, AlertCircle, ArrowDownToLine } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { SearchBar } from '@/components/SearchBar';
import { Screen } from '@/components/layout/Screen';
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

const parseMMDDYYYY = (s: string): Date | null => {
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, mm, dd, yyyy] = match;
  const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  if (date.getMonth() !== parseInt(mm) - 1 || date.getDate() !== parseInt(dd)) return null;
  return date;
};

const parseRecordDate = (d: string): Date => {
  return new Date(d);
};

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
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filtered = useMemo(() => {
    let result = [...MOCK_PAYOUTS];

    if (filter !== 'all') {
      result = result.filter((p) => p.status === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.method.toLowerCase().includes(q) ||
          p.amount.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q),
      );
    }

    if (fromDate.trim()) {
      const from = parseMMDDYYYY(fromDate.trim());
      if (from) {
        result = result.filter((p) => parseRecordDate(p.date) >= from);
      }
    }

    if (toDate.trim()) {
      const to = parseMMDDYYYY(toDate.trim());
      if (to) {
        result = result.filter((p) => parseRecordDate(p.date) <= to);
      }
    }

    return result;
  }, [filter, searchQuery, fromDate, toDate]);

  return (
    <Screen safeArea scrollable header={<PageHeader title="Payout History" from={from} />}>

      {/* Search */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search payouts..."
        />
      </View>

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

      {/* Date Range */}
      <View style={styles.dateRangeSection}>
        <View style={styles.dateInputWrap}>
          <AppText variant="caption" color={Colors.textTertiary}>From</AppText>
          <TextInput
            style={styles.dateInput}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={Colors.textTertiary}
            value={fromDate}
            onChangeText={setFromDate}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        <AppText variant="body" color={Colors.textTertiary}>—</AppText>
        <View style={styles.dateInputWrap}>
          <AppText variant="caption" color={Colors.textTertiary}>To</AppText>
          <TextInput
            style={styles.dateInput}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={Colors.textTertiary}
            value={toDate}
            onChangeText={setToDate}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      {/* Payout List */}
      <View style={styles.payoutList}>
        {filtered.map((payout) => (
          <Pressable
            key={payout.id}
            style={styles.payoutCard}
            onPress={() => router.push(`/(worker)/earnings-receipt?transactionId=${payout.id}&type=payout&from=payout-history`)}
          >
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
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <AppText variant="h4" weight="bold">No payouts found</AppText>
          <AppText variant="bodySm" color={Colors.textSecondary}>
            {filter === 'all' ? 'You haven\'t made any payouts yet.' : `No ${filter} payouts.`}
          </AppText>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.md,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing['2'],
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.md,
  },
  dateRangeSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing['2'],
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  dateInputWrap: { flex: 1, gap: Spacing['1'] },
  dateInput: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
