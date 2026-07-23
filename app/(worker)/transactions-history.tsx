import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { SearchBar } from '@/components/SearchBar';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLocalSearchParams, router } from 'expo-router';
import { walletTransactions } from '@/constants/workerMockData';
import type { WalletTransaction, TransactionStatus } from '@/constants/workerMockData';

type TxFilter = 'all' | 'credit' | 'debit';

const parseMMDDYYYY = (s: string): Date | null => {
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, mm, dd, yyyy] = match;
  const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  if (date.getMonth() !== parseInt(mm) - 1 || date.getDate() !== parseInt(dd)) return null;
  return date;
};

const parseTxDate = (d: string): Date => {
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const [m, day] = d.split(' ');
  return new Date(2026, months[m] || 0, parseInt(day));
};

const statusIcon = (s: TransactionStatus) => {
  if (s === 'completed') return <CheckCircle size={12} color={Colors.verified} />;
  if (s === 'pending') return <Clock size={12} color={Colors.warning} />;
  return <AlertCircle size={12} color={Colors.error} />;
};

const statusColor = (s: TransactionStatus) => {
  if (s === 'completed') return Colors.verified;
  if (s === 'pending') return Colors.warning;
  return Colors.error;
};

export default function TransactionsHistoryScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [txFilter, setTxFilter] = useState<TxFilter>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredTransactions = useMemo(() => {
    let result = [...walletTransactions];

    if (txFilter === 'credit') result = result.filter((t) => t.credit);
    if (txFilter === 'debit') result = result.filter((t) => !t.credit);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.label.toLowerCase().includes(q) ||
          t.sub.toLowerCase().includes(q) ||
          t.amount.toLowerCase().includes(q) ||
          (t.reference && t.reference.toLowerCase().includes(q)),
      );
    }

    if (fromDate.trim()) {
      const from = parseMMDDYYYY(fromDate.trim());
      if (from) {
        result = result.filter((t) => parseTxDate(t.date) >= from);
      }
    }

    if (toDate.trim()) {
      const to = parseMMDDYYYY(toDate.trim());
      if (to) {
        result = result.filter((t) => parseTxDate(t.date) <= to);
      }
    }

    result.sort((a, b) => parseTxDate(b.date).getTime() - parseTxDate(a.date).getTime());

    return result;
  }, [searchQuery, txFilter, fromDate, toDate]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, WalletTransaction[]> = {};
    filteredTransactions.forEach((tx) => {
      if (!groups[tx.date]) groups[tx.date] = [];
      groups[tx.date].push(tx);
    });
    return Object.entries(groups).sort(([a], [b]) => parseTxDate(b).getTime() - parseTxDate(a).getTime());
  }, [filteredTransactions]);

  return (
    <Screen safeArea scrollable header={<PageHeader title="Transaction History" from={from} />}>

      {/* Search */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search transactions..."
        />
      </View>

      {/* Type Filters */}
      <View style={styles.filterSection}>
        {(['all', 'credit', 'debit'] as TxFilter[]).map((f) => (
          <Chip
            key={f}
            label={f === 'all' ? 'All' : f === 'credit' ? 'Income' : 'Deductions'}
            selected={txFilter === f}
            onPress={() => setTxFilter(f)}
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

      {/* Transaction Groups */}
      {groupedTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <AppText variant="body" color={Colors.textSecondary} align="center">No transactions found</AppText>
        </View>
      ) : (
        groupedTransactions.map(([date, txs]) => (
          <View key={date} style={styles.dateGroup}>
            <AppText variant="bodySm" weight="bold" color={Colors.textSecondary} style={styles.dateHeader}>
              {date}
            </AppText>
            <View style={styles.txList}>
              {txs.map((tx) => (
                <Pressable
                  key={tx.id + tx.date}
                  style={styles.txRow}
                  onPress={() => router.push(`/(worker)/earnings-receipt?transactionId=${tx.id}&type=${tx.type}&from=transactions`)}
                >
                  <View
                    style={[
                      styles.txIcon,
                      {
                        backgroundColor: tx.credit
                          ? tx.type === 'topup' ? Colors.infoBg : Colors.successBg
                          : tx.label.includes('Commission')
                            ? Colors.errorBg
                            : Colors.infoBg,
                      },
                    ]}
                  >
                    {tx.credit ? (
                      tx.type === 'topup' ? (
                        <ArrowUpFromLine size={14} color={Colors.info} />
                      ) : (
                        <TrendingUp size={14} color={Colors.verified} />
                      )
                    ) : tx.label.includes('Commission') ? (
                      <TrendingDown size={14} color={Colors.error} />
                    ) : (
                      <ArrowDownToLine size={14} color={Colors.info} />
                    )}
                  </View>
                  <View style={styles.txBody}>
                    <View style={styles.txTop}>
                      <AppText variant="bodySm" weight="bold" numberOfLines={1}>{tx.label}</AppText>
                      <AppText
                        variant="bodySm"
                        weight="bold"
                        color={tx.credit ? Colors.verified : tx.label.includes('Payout') ? Colors.info : Colors.error}
                      >
                        {tx.amount}
                      </AppText>
                    </View>
                    <View style={styles.txBottom}>
                      <AppText variant="caption" color={Colors.textTertiary}>
                        {tx.reference ? `${tx.reference} — ` : ''}{tx.sub}
                      </AppText>
                      <View style={styles.txStatus}>
                        {statusIcon(tx.status)}
                        <AppText variant="caption" weight="bold" color={statusColor(tx.status)}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </AppText>
                      </View>
                    </View>
                   </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.md,
  },
  filterSection: {
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

  dateGroup: {
    gap: Spacing['2'],
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.md,
  },
  dateHeader: { marginTop: Spacing['1'] },
  txList: { gap: Spacing['3'] },
  txRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing['3'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    ...Elevation.sm,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txBody: { flex: 1, gap: 2 },
  txTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing['3'], paddingTop: Spacing['3'],
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  txStatus: { flexDirection: 'row', alignItems: 'center', gap: 3 },

  emptyState: { paddingVertical: Spacing['10'], alignItems: 'center' },
});
