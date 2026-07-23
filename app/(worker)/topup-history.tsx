import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Clock, AlertCircle, ArrowUpFromLine } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { SearchBar } from '@/components/SearchBar';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';

interface TopUpRecord {
  id: string;
  amount: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference: string;
}

const MOCK_TOPUPS: TopUpRecord[] = [
  { id: 't1', amount: '₱2,000.00', method: 'GCash', status: 'completed', date: 'Jul 21, 2026', reference: 'TOP-2026-001' },
  { id: 't2', amount: '₱5,000.00', method: 'Maya', status: 'completed', date: 'Jul 18, 2026', reference: 'TOP-2026-002' },
  { id: 't3', amount: '₱1,000.00', method: 'GCash', status: 'completed', date: 'Jul 14, 2026', reference: 'TOP-2026-003' },
  { id: 't4', amount: '₱3,000.00', method: 'BDO Savings', status: 'pending', date: 'Jul 22, 2026', reference: 'TOP-2026-004' },
  { id: 't5', amount: '₱1,500.00', method: 'GCash', status: 'completed', date: 'Jul 8, 2026', reference: 'TOP-2026-005' },
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

function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    const m = parseInt(digits);
    if (digits.length === 2 && m === 0) return '01';
    if (digits.length === 2 && m > 12) return '12';
    return digits;
  }
  if (digits.length <= 4) {
    const m = parseInt(digits.slice(0, 2));
    const day = parseInt(digits.slice(2));
    if (m === 0) return `01/${digits.slice(2)}`;
    if (m > 12) return `12/${digits.slice(2)}`;
    if (digits.length === 4 && day === 0) return `${digits.slice(0, 2)}/01`;
    if (digits.length === 4 && day > 31) return `${digits.slice(0, 2)}/31`;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  const m = parseInt(digits.slice(0, 2));
  const d = parseInt(digits.slice(2, 4));
  const mm = m === 0 ? '01' : m > 12 ? '12' : digits.slice(0, 2);
  const dd = d === 0 ? '01' : d > 31 ? '31' : digits.slice(2, 4);
  const yy = digits[4] && parseInt(digits[4]) < 2 ? '2' + digits.slice(5) : digits.slice(4);
  return `${mm}/${dd}/${yy}`;
}

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

export default function TopUpHistoryScreen() {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filtered = useMemo(() => {
    let result = [...MOCK_TOPUPS];

    if (filter !== 'all') {
      result = result.filter((t) => t.status === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.method.toLowerCase().includes(q) ||
          t.amount.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q),
      );
    }

    if (fromDate.trim()) {
      const from = parseMMDDYYYY(fromDate.trim());
      if (from) {
        result = result.filter((t) => parseRecordDate(t.date) >= from);
      }
    }

    if (toDate.trim()) {
      const to = parseMMDDYYYY(toDate.trim());
      if (to) {
        result = result.filter((t) => parseRecordDate(t.date) <= to);
      }
    }

    return result;
  }, [filter, searchQuery, fromDate, toDate]);

  return (
    <Screen safeArea scrollable header={<PageHeader title="Top-Up History" from={from} />}>

      {/* Search */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search top-ups..."
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
            onChangeText={(t) => setFromDate(formatDateInput(t))}
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
            onChangeText={(t) => setToDate(formatDateInput(t))}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      {/* Top-Up List */}
      <View style={styles.topupList}>
        {filtered.map((topup) => (
          <Pressable
            key={topup.id}
            style={styles.topupCard}
            onPress={() => router.push(`/(worker)/earnings-receipt?transactionId=${topup.id}&type=topup&from=topup-history`)}
          >
            <View style={styles.topupTop}>
              <View style={styles.topupIcon}>
                <ArrowUpFromLine size={16} color={Colors.cta} />
              </View>
              <View style={styles.topupInfo}>
                <AppText variant="body" weight="semiBold">{topup.method}</AppText>
                <AppText variant="caption" color={Colors.textTertiary}>{topup.date}</AppText>
              </View>
              <AppText variant="body" weight="bold" color={Colors.cta}>{topup.amount}</AppText>
            </View>
            <View style={styles.topupBottom}>
              <AppText variant="caption" color={Colors.textTertiary}>Ref: {topup.reference}</AppText>
              <View style={styles.statusRow}>
                {statusIcon(topup.status)}
                <AppText variant="caption" weight="semiBold" color={statusColor(topup.status)}>
                  {topup.status.charAt(0).toUpperCase() + topup.status.slice(1)}
                </AppText>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <AppText variant="h4" weight="bold">No top-ups found</AppText>
          <AppText variant="bodySm" color={Colors.textSecondary}>
            {filter === 'all' ? 'You haven\'t made any top-ups yet.' : `No ${filter} top-ups.`}
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
  topupList: {
    gap: Spacing['3'],
    paddingHorizontal: theme.layout.screenPadding,
  },
  topupCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    ...Elevation.sm,
  },
  topupTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  topupIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topupInfo: { flex: 1, gap: 2 },
  topupBottom: {
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
