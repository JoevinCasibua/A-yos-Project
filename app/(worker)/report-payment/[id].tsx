import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { ReportConfirmation } from '@/components/ReportConfirmation';
import { workerBookings } from '@/constants/workerMockData';

interface PaymentIssue {
  id: string;
  label: string;
}

const PAYMENT_ISSUES: PaymentIssue[] = [
  { id: 'no_payment', label: 'Customer did not pay' },
  { id: 'underpaid', label: 'Customer paid less than the agreed amount' },
  { id: 'wrong_amount', label: 'Customer paid the wrong amount' },
  { id: 'refused', label: 'Customer refused to pay' },
];

export default function ReportPaymentScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [selectedIssue, setSelectedIssue] = useState<PaymentIssue | null>(null);
  const [amountReceived, setAmountReceived] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const booking = workerBookings.find((b) => b.id === id);

  const handleConfirm = () => {
    if (selectedIssue) {
      setShowConfirmation(true);
    }
  };

  const handleDone = () => {
    setShowConfirmation(false);
    router.push(`/(worker)/cash-confirm/${id}`);
  };

  const canConfirm = selectedIssue !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push(`/(worker)/cash-confirm/${id}`)}
          hitSlop={12}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold" color={Colors.textPrimary}>
          Report Payment Issue
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <AppText variant="body" color={Colors.textSecondary}>
            Let us know what happened with the payment.
          </AppText>
        </View>

        {booking && (
          <View style={styles.customerCard}>
            <Avatar uri={booking.customerAvatar} size={48} />
            <AppText variant="body" weight="semiBold">{booking.customerName}</AppText>
          </View>
        )}

        <AppText variant="label" color={Colors.textSecondary} style={styles.issueSectionTitle}>
          What went wrong with the payment?
        </AppText>

        <View style={styles.issueContainer}>
          {PAYMENT_ISSUES.map((issue, index) => {
            const isSelected = selectedIssue?.id === issue.id;
            const isLast = index === PAYMENT_ISSUES.length - 1;

            return (
              <React.Fragment key={issue.id}>
                <Pressable
                  style={[
                    styles.issueOption,
                    isSelected && styles.issueOptionSelected,
                  ]}
                  onPress={() => setSelectedIssue(issue)}
                >
                  <AppText
                    variant="body"
                    color={isSelected ? Colors.cta : Colors.textSecondary}
                  >
                    {issue.label}
                  </AppText>
                  {isSelected && (
                    <Check size={18} color={Colors.cta} />
                  )}
                </Pressable>
                {!isLast && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </View>

        <View style={styles.amountSection}>
          <AppText variant="label" color={Colors.textSecondary}>
            Amount received (optional)
          </AppText>
          <View style={styles.amountInput}>
            <AppText variant="body" color={Colors.textTertiary} style={styles.currencyPrefix}>₱</AppText>
            <TextInput
              style={styles.amountField}
              placeholder="0.00"
              placeholderTextColor={Colors.textTertiary}
              value={amountReceived}
              onChangeText={setAmountReceived}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {booking && (
          <View style={styles.agreedSection}>
            <AppText variant="label" color={Colors.textSecondary}>
              Agreed amount
            </AppText>
            <View style={styles.agreedAmount}>
              <AppText variant="body" weight="semiBold">{booking.price}</AppText>
            </View>
          </View>
        )}

        <View style={styles.descriptionSection}>
          <AppText variant="label" color={Colors.textSecondary}>
            Description (optional)
          </AppText>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe what happened..."
            placeholderTextColor={Colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.submitSection}>
          <AppButton
            label="Submit Report"
            variant="danger"
            fullWidth
            disabled={!canConfirm}
            onPress={handleConfirm}
          />
        </View>
      </ScrollView>

      <ReportConfirmation
        visible={showConfirmation}
        customerName={booking?.customerName || 'Customer'}
        onDone={handleDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing['16'],
    paddingBottom: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing['10'],
  },
  titleSection: {
    marginBottom: Spacing['5'],
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    marginBottom: Spacing['5'],
    ...Elevation.sm,
  },
  issueSectionTitle: {
    marginBottom: Spacing['3'],
  },
  issueContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing['5'],
  },
  issueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.md,
    padding: Spacing['3'],
  },
  issueOptionSelected: {
    backgroundColor: Colors.primarySurface,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing['4'],
  },
  amountSection: {
    marginBottom: Spacing['4'],
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Layout.cardPadding,
    marginTop: Spacing['2'],
  },
  currencyPrefix: {
    marginRight: Spacing['2'],
  },
  amountField: {
    flex: 1,
    paddingVertical: Spacing['3'],
    fontSize: 16,
    color: Colors.textPrimary,
  },
  agreedSection: {
    marginBottom: Spacing['4'],
  },
  agreedAmount: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.xl,
    paddingHorizontal: Layout.cardPadding,
    paddingVertical: Spacing['3'],
    marginTop: Spacing['2'],
  },
  descriptionSection: {
    marginBottom: Spacing['5'],
  },
  descriptionInput: {
    marginTop: Spacing['2'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Layout.cardPadding,
    paddingVertical: Spacing['3'],
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 100,
  },
  submitSection: {
    marginTop: Spacing['2'],
  },
});
