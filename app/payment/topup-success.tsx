import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { theme } from '@/constants/theme';
import { CheckCircle2 } from 'lucide-react-native';

export default function TopUpSuccessScreen() {
  const router = useRouter();
  const { amount } = useLocalSearchParams();
  const displayAmount = amount ? `₱${Number(amount).toLocaleString()}` : '₱0.00';

  return (
    <Screen safeArea>
      <View style={styles.container}>
        <CheckCircle2 color={theme.colors.success} size={80} style={styles.icon} />
        <Text style={[theme.typography.h1, styles.title]}>Top Up Successful!</Text>
        <Text style={[theme.typography.body1, styles.subtitle]}>
          Your wallet has been successfully funded with {displayAmount}.
        </Text>

        <View style={styles.receiptCard}>
          <View style={styles.row}>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Reference No.</Text>
            <Text style={theme.typography.label}>AYOS-TU-{Math.floor(Math.random() * 1000000)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Date</Text>
            <Text style={theme.typography.label}>Oct 24, 11:35 AM</Text>
          </View>
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md, marginTop: theme.spacing.sm }]}>
            <Text style={theme.typography.h4}>Total Topped Up</Text>
            <Text style={[theme.typography.h3, { color: theme.colors.primary }]}>{displayAmount}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button 
            title="Back to Wallet" 
            onPress={() => router.replace('/wallet')}
            fullWidth 
            style={styles.actionBtn}
          />
          <Button 
            title="Go to Home" 
            variant="ghost"
            onPress={() => router.replace('/(tabs)/home')}
            fullWidth 
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: theme.spacing.xxxl },
  icon: { marginBottom: theme.spacing.lg },
  title: { marginBottom: theme.spacing.sm, textAlign: 'center' },
  subtitle: { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xxl, paddingHorizontal: theme.spacing.xl },
  receiptCard: { width: '100%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.xxxl, ...theme.shadows.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  actions: { width: '100%', marginTop: 'auto' },
  actionBtn: { marginBottom: theme.spacing.sm },
});
