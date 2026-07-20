import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { CheckCircle2 } from 'lucide-react-native';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <Screen safeArea>
      <View style={styles.container}>
        <CheckCircle2 color={theme.colors.success} size={80} style={styles.icon} />
        <Text style={[theme.typography.h1, styles.title]}>Payment Successful!</Text>
        <Text style={[theme.typography.body1, styles.subtitle]}>
          Your payment of ₱1,250.00 has been processed successfully.
        </Text>

        <View style={styles.receiptCard}>
          <View style={styles.row}>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Reference No.</Text>
            <Text style={theme.typography.label}>AYOS-982347</Text>
          </View>
          <View style={styles.row}>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Date</Text>
            <Text style={theme.typography.label}>Oct 24, 11:30 AM</Text>
          </View>
          <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md, marginTop: theme.spacing.sm }]}>
            <Text style={theme.typography.h4}>Total Paid</Text>
            <Text style={[theme.typography.h3, { color: theme.colors.primary }]}>₱ 1,250.00</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button 
            title="Rate the Service" 
            onPress={() => router.replace(`/review/${id}`)}
            fullWidth 
            style={styles.actionBtn}
          />
          <Button 
            title="Back to Home" 
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
