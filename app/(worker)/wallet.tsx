import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
  Alert,
  Keyboard,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronDown,
  ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Elevation, Layout, Typography, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Badge } from '@/components/Badge';
import { Chip } from '@/components/Chip';
import {
  walletTransactions,
  walletBarData,
  walletPayoutMethods,
  walletPerformance,
} from '@/constants/workerMockData';
import type { WalletTransaction, TransactionStatus } from '@/constants/workerMockData';

type Period = 'week' | 'month' | 'all';
type TxFilter = 'all' | 'credit' | 'debit';

const { width: screenWidth } = Dimensions.get('window');
const BAR_MAX = Math.max(...walletBarData.map((d) => d.val));

const periodStats: Record<Period, { gross: string; net: string; jobs: string; commission: string }> = {
  week: { gross: '₱8,925', net: '₱7,200', jobs: '6', commission: '₱892' },
  month: { gross: '₱31,500', net: '₱28,350', jobs: '28', commission: '₱3,150' },
  all: { gross: '₱184,200', net: '₱165,780', jobs: '182', commission: '₱18,420' },
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

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('week');
  const [txFilter, setTxFilter] = useState<TxFilter>('all');
  const [showPayout, setShowPayout] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('18450');
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('5000');
  const [selectedTopUpMethod, setSelectedTopUpMethod] = useState('gcash');
  const [showPayoutSuccess, setShowPayoutSuccess] = useState(false);
  const [showTopUpSuccess, setShowTopUpSuccess] = useState(false);

  const stats = periodStats[period];

  const filteredTransactions = useMemo(() => {
    let filtered = walletTransactions;
    if (txFilter === 'credit') filtered = filtered.filter((t) => t.credit);
    if (txFilter === 'debit') filtered = filtered.filter((t) => !t.credit);
    return filtered.slice(0, 3);
  }, [txFilter]);

  const maxBarWidth = screenWidth - Layout.screenPadding * 2 - 60;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>Wallet</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <AppText variant="caption" color={Colors.textTertiary}>Available Balance</AppText>
            <AppText variant="h1" weight="bold" color={Colors.textPrimary}>₱18,450.00</AppText>
            <View style={styles.pendingRow}>
              <Clock size={11} color={Colors.textTertiary} />
              <AppText variant="caption" color={Colors.textTertiary}>₱600.00 pending clearance</AppText>
            </View>
          </View>
          <View style={styles.balanceActions}>
            <AppButton
              label="Top-Up"
              variant="outline"
              size="sm"
              leftIcon={<ArrowUpFromLine size={14} color={Colors.cta} />}
              onPress={() => setShowTopUp(true)}
              style={styles.balanceBtn}
            />
            <AppButton
              label="Payout"
              variant="secondary"
              size="sm"
              leftIcon={<ArrowDownToLine size={14} color={Colors.cta} />}
              onPress={() => setShowPayout(true)}
              style={styles.balanceBtn}
            />
          </View>
        </View>

        {/* Period Toggle */}
        <View style={styles.periodToggle}>
          {(['week', 'month', 'all'] as Period[]).map((p) => (
            <Chip
              key={p}
              label={p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
              selected={period === p}
              onPress={() => setPeriod(p)}
              size="sm"
            />
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Gross Earnings', val: stats.gross, color: Colors.info, icon: <TrendingUp size={16} color={Colors.info} /> },
            { label: 'Net Earnings', val: stats.net, color: Colors.verified, icon: <DollarSign size={16} color={Colors.verified} /> },
            { label: 'Jobs Completed', val: stats.jobs, color: Colors.warning, icon: <CheckCircle size={16} color={Colors.warning} /> },
            { label: 'Commission Paid', val: stats.commission, color: Colors.textTertiary, icon: <TrendingDown size={16} color={Colors.textTertiary} /> },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${s.color}15` }]}>
                {s.icon}
              </View>
              <AppText variant="h4" weight="bold" color={s.color}>{s.val}</AppText>
              <AppText variant="caption" color={Colors.textTertiary}>{s.label}</AppText>
            </View>
          ))}
        </View>

        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <AppText variant="body" weight="bold">Daily Earnings — This Week</AppText>
            <Badge label="Peak: Thu ₱2,160" variant="info" size="sm" />
          </View>
          <View style={styles.barChart}>
            {walletBarData.map((d, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${(d.val / BAR_MAX) * 100}%`,
                        backgroundColor: d.val === BAR_MAX ? Colors.verified : Colors.info,
                      },
                    ]}
                  />
                </View>
                <AppText variant="caption" color={Colors.textTertiary}>{d.day}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.txSection}>
          <View style={styles.txHeader}>
            <AppText variant="body" weight="bold">Transactions</AppText>
            <View style={styles.txFilters}>
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
          </View>
          <View style={styles.txList}>
            {filteredTransactions.map((tx) => (
              <View key={tx.id + tx.date} style={styles.txRow}>
                <View
                  style={[
                    styles.txIcon,
                    {
                      backgroundColor: tx.credit
                        ? Colors.successBg
                        : tx.label.includes('Commission')
                          ? Colors.errorBg
                          : Colors.infoBg,
                    },
                  ]}
                >
                  {tx.credit ? (
                    <TrendingUp size={14} color={Colors.verified} />
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
                    <AppText variant="caption" color={Colors.textTertiary}>{tx.sub} · {tx.date}</AppText>
                    <View style={styles.txStatus}>
                      {statusIcon(tx.status)}
                      <AppText variant="caption" weight="bold" color={statusColor(tx.status)}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* See All */}
          <Pressable
            style={styles.seeAllBtn}
            onPress={() => router.push('/(worker)/transactions-history')}
          >
            <AppText variant="bodySm" weight="bold" color={Colors.info}>See All Transactions</AppText>
            <ChevronRight size={16} color={Colors.info} />
          </Pressable>
        </View>

        {/* Performance Card */}
        <View style={styles.perfCard}>
          <View style={styles.perfHeader}>
            <View style={styles.perfAvatar}>
              <AppText variant="body" weight="bold" color={Colors.white}>JR</AppText>
            </View>
            <View style={styles.perfInfo}>
              <AppText variant="body" weight="bold">Juan Reyes</AppText>
              <Badge label="TOP WORKER" variant="warning" size="sm" />
            </View>
            <ChevronDown size={16} color={Colors.textTertiary} />
          </View>
          <View style={styles.perfStats}>
            {[
              { label: 'Completion Rate', val: walletPerformance.completionRate, color: Colors.verified },
              { label: 'On-Time Arrival', val: walletPerformance.onTimeArrival, color: Colors.info },
              { label: 'Repeat Clients', val: walletPerformance.repeatClients, color: Colors.warning },
            ].map((s) => (
              <View key={s.label} style={styles.perfRow}>
                <View style={styles.perfRowTop}>
                  <AppText variant="caption" color={Colors.textSecondary}>{s.label}</AppText>
                  <AppText variant="caption" weight="bold" color={s.color}>{s.val}%</AppText>
                </View>
                <View style={styles.perfTrack}>
                  <View style={[styles.perfFill, { width: `${s.val}%`, backgroundColor: s.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Payout Sheet */}
      <Modal visible={showPayout} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => { Keyboard.dismiss(); setShowPayout(false); }}>
          <Pressable style={styles.sheet} onPress={() => Keyboard.dismiss()}>
            <View style={styles.sheetHandle} />
            <AppText variant="h4" weight="bold">Request Payout</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              Available balance: <AppText weight="bold" color={Colors.textPrimary}>₱18,450.00</AppText>
            </AppText>

            <View style={styles.amountWrap}>
              <AppText variant="h3" weight="bold" color={Colors.textPrimary}>₱</AppText>
              <TextInput
                style={styles.amountInput}
                value={payoutAmount}
                onChangeText={setPayoutAmount}
                keyboardType="number-pad"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={styles.quickAmounts}>
              {['5,000', '10,000', '18,450'].map((a) => (
                <Pressable
                  key={a}
                  style={styles.quickAmt}
                  onPress={() => setPayoutAmount(a.replace(',', ''))}
                >
                  <AppText variant="caption" weight="bold" color={Colors.info}>₱{a}</AppText>
                </Pressable>
              ))}
            </View>

            <AppText variant="caption" weight="bold" color={Colors.textTertiary} style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Send to
            </AppText>
            <View style={styles.methodList}>
              {walletPayoutMethods.map((m) => (
                <Pressable
                  key={m.id}
                  style={[styles.methodRow, selectedMethod === m.id && styles.methodRowActive]}
                  onPress={() => setSelectedMethod(m.id)}
                >
                  <View style={[styles.methodDot, { backgroundColor: m.color }]} />
                  <View style={styles.methodInfo}>
                    <AppText variant="bodySm" weight="bold">{m.label}</AppText>
                    <AppText variant="caption" color={Colors.textTertiary}>{m.account}</AppText>
                  </View>
                  {selectedMethod === m.id && <CheckCircle size={16} color={Colors.info} />}
                </Pressable>
              ))}
            </View>

            <View style={styles.payoutNote}>
              <AlertCircle size={12} color={Colors.textTertiary} />
              <AppText variant="caption" color={Colors.textTertiary}>Payouts are processed within 1–2 business days.</AppText>
            </View>

            <View style={styles.sheetActions}>
              <AppButton label="Cancel" variant="outline" onPress={() => setShowPayout(false)} style={{ flex: 1 }} />
              <AppButton
                label="Confirm Payout"
                variant="primary"
                leftIcon={<ArrowDownToLine size={14} color={Colors.white} />}
                onPress={() => { setShowPayout(false); setShowPayoutSuccess(true); }}
                style={{ flex: 1 }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Top-Up Sheet */}
      <Modal visible={showTopUp} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => { Keyboard.dismiss(); setShowTopUp(false); }}>
          <Pressable style={styles.sheet} onPress={() => Keyboard.dismiss()}>
            <View style={styles.sheetHandle} />
            <AppText variant="h4" weight="bold">Top-Up Wallet</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              Available balance: <AppText weight="bold" color={Colors.textPrimary}>₱18,450.00</AppText>
            </AppText>

            <View style={styles.amountWrap}>
              <AppText variant="h3" weight="bold" color={Colors.textPrimary}>₱</AppText>
              <TextInput
                style={styles.amountInput}
                value={topUpAmount}
                onChangeText={setTopUpAmount}
                keyboardType="number-pad"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={styles.quickAmounts}>
              {['5,000', '10,000', '18,450'].map((a) => (
                <Pressable
                  key={a}
                  style={styles.quickAmt}
                  onPress={() => setTopUpAmount(a.replace(',', ''))}
                >
                  <AppText variant="caption" weight="bold" color={Colors.info}>₱{a}</AppText>
                </Pressable>
              ))}
            </View>

            <AppText variant="caption" weight="bold" color={Colors.textTertiary} style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Pay with
            </AppText>
            <View style={styles.methodList}>
              {walletPayoutMethods.map((m) => (
                <Pressable
                  key={m.id}
                  style={[styles.methodRow, selectedTopUpMethod === m.id && styles.methodRowActive]}
                  onPress={() => setSelectedTopUpMethod(m.id)}
                >
                  <View style={[styles.methodDot, { backgroundColor: m.color }]} />
                  <View style={styles.methodInfo}>
                    <AppText variant="bodySm" weight="bold">{m.label}</AppText>
                    <AppText variant="caption" color={Colors.textTertiary}>{m.account}</AppText>
                  </View>
                  {selectedTopUpMethod === m.id && <CheckCircle size={16} color={Colors.info} />}
                </Pressable>
              ))}
            </View>

            <View style={styles.payoutNote}>
              <AlertCircle size={12} color={Colors.textTertiary} />
              <AppText variant="caption" color={Colors.textTertiary}>Top-ups are processed instantly.</AppText>
            </View>

            <View style={styles.sheetActions}>
              <AppButton label="Cancel" variant="outline" onPress={() => setShowTopUp(false)} style={{ flex: 1 }} />
              <AppButton
                label="Confirm Top-Up"
                variant="primary"
                leftIcon={<ArrowUpFromLine size={14} color={Colors.white} />}
                onPress={() => { setShowTopUp(false); setShowTopUpSuccess(true); }}
                style={{ flex: 1 }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Payout Success */}
      <Modal visible={showPayoutSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color={Colors.verified} />
            </View>
            <AppText variant="h3" weight="bold" align="center">Payout Requested</AppText>
            <AppText variant="body" color={Colors.textSecondary} align="center">
              Your payout of <AppText weight="bold" color={Colors.textPrimary}>₱{Number(payoutAmount).toLocaleString()}</AppText> to{' '}
              <AppText weight="bold" color={Colors.textPrimary}>{walletPayoutMethods.find((m) => m.id === selectedMethod)?.label}</AppText>{' '}
              is being processed. Funds will arrive within 1–2 business days.
            </AppText>
            <AppButton label="Done" variant="primary" fullWidth onPress={() => setShowPayoutSuccess(false)} />
          </View>
        </View>
      </Modal>

      {/* Top-Up Success */}
      <Modal visible={showTopUpSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color={Colors.verified} />
            </View>
            <AppText variant="h3" weight="bold" align="center">Top-Up Successful</AppText>
            <AppText variant="body" color={Colors.textSecondary} align="center">
              <AppText weight="bold" color={Colors.textPrimary}>₱{Number(topUpAmount).toLocaleString()}</AppText> has been added to your wallet balance from{' '}
              <AppText weight="bold" color={Colors.textPrimary}>{walletPayoutMethods.find((m) => m.id === selectedTopUpMethod)?.label}</AppText>.
            </AppText>
            <AppButton label="Done" variant="primary" fullWidth onPress={() => setShowTopUpSuccess(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.xxl },

  // Balance card
  balanceCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing['5'], gap: Spacing['4'], ...Elevation.sm,
    marginBottom: theme.spacing.xl,
  },
  balanceTop: { gap: Spacing['1'] },
  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['1'], marginTop: Spacing['1'] },
  balanceActions: { flexDirection: 'row', gap: Spacing['3'] },
  balanceBtn: { flex: 1 },

  // Period toggle
  periodToggle: { flexDirection: 'row', gap: Spacing['2'], marginBottom: theme.spacing.xl },

  // Stats grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing['3'], marginBottom: theme.spacing.xl },
  statCard: {
    width: (screenWidth - Layout.screenPadding * 2 - Spacing['3']) / 2,
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing['4'], gap: Spacing['2'], ...Elevation.sm,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },

  // Bar chart
  chartCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing['4'], ...Elevation.sm,
    marginBottom: theme.spacing.xl,
  },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing['4'] },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing['2'], height: 100 },
  barCol: { flex: 1, alignItems: 'center', gap: Spacing['1'], height: '100%' },
  barTrack: { flex: 1, width: '100%', backgroundColor: Colors.borderLight, borderRadius: Radius.xs, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: Radius.xs },

  // Transactions
  txSection: { gap: Spacing['3'], marginBottom: theme.spacing.xl },
  txHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  txFilters: { flexDirection: 'row', gap: Spacing['2'] },
  txList: { gap: Spacing['2'] },
  txRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing['3'],
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing['3'], ...Elevation.sm,
  },
  txIcon: {
    width: 36, height: 36, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  txBody: { flex: 1, gap: 2 },
  txTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txStatus: { flexDirection: 'row', alignItems: 'center', gap: 3 },

  // See All
  seeAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing['2'], paddingVertical: Spacing['3'],
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.borderLight,
  },

  // Performance card
  perfCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing['4'], ...Elevation.sm,
    marginBottom: theme.spacing.xl,
  },
  perfHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing['3'], marginBottom: Spacing['4'] },
  perfAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.info, alignItems: 'center', justifyContent: 'center',
  },
  perfInfo: { flex: 1, gap: 2 },
  perfStats: { gap: Spacing['3'] },
  perfRow: { gap: Spacing['1'] },
  perfRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  perfTrack: { height: 6, backgroundColor: Colors.borderLight, borderRadius: Radius.full, overflow: 'hidden' },
  perfFill: { height: '100%', borderRadius: Radius.full },

  // Payout sheet
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl,
    padding: Spacing['5'], gap: Spacing['3'],
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: Spacing['2'] },
  amountWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.xl, padding: Spacing['4'], gap: Spacing['2'],
  },
  amountInput: {
    flex: 1, fontSize: Typography['5xl'], fontWeight: '800', color: Colors.textPrimary,
    paddingVertical: 0,
  },
  quickAmounts: { flexDirection: 'row', gap: Spacing['2'] },
  quickAmt: {
    flex: 1, paddingVertical: Spacing['2'], borderRadius: Radius.md,
    backgroundColor: Colors.primarySurface, alignItems: 'center',
  },
  methodList: { gap: Spacing['2'] },
  methodRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing['3'],
    backgroundColor: Colors.surfaceLight, borderRadius: Radius.xl,
    padding: Spacing['3'], borderWidth: 2, borderColor: 'transparent',
  },
  methodRowActive: { borderColor: Colors.info, backgroundColor: Colors.primarySurface },
  methodDot: { width: 12, height: 12, borderRadius: 6 },
  methodInfo: { flex: 1 },
  payoutNote: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] },
  sheetActions: { flexDirection: 'row', gap: Spacing['3'], marginTop: Spacing['2'] },

  // Success popups
  successOverlay: {
    flex: 1, backgroundColor: Colors.overlay,
    justifyContent: 'center', alignItems: 'center', padding: Layout.screenPadding,
  },
  successCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xxl,
    padding: Spacing['6'], width: '100%', maxWidth: 340,
    alignItems: 'center', gap: Spacing['4'], ...Elevation.lg,
  },
  successIcon: {
    width: 80, height: 80, borderRadius: Radius.full,
    backgroundColor: Colors.verifiedBg, alignItems: 'center', justifyContent: 'center',
  },
});
