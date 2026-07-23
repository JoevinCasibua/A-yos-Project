import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { ArrowLeft, ChevronDown, ChevronUp, Check } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { AccordionSection } from '@/components/AccordionSection';
import { ReportConfirmation } from '@/components/ReportConfirmation';
import { reportReasons, workerBookings, ReportReason } from '@/constants/workerMockData';

export default function ReportUserScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const booking = workerBookings.find((b) => b.id === id);

  const groupedReasons = useMemo(() => {
    const groups: Record<string, ReportReason[]> = {
      safety: [],
      service: [],
      fraud: [],
    };
    reportReasons.forEach((r) => {
      groups[r.category].push(r);
    });
    return groups;
  }, []);

  const categoryLabels: Record<string, string> = {
    safety: 'Safety & Security',
    service: 'Service Quality',
    fraud: 'Fraud & Misconduct',
  };

  const categoryOrder = ['safety', 'service', 'fraud'];

  const handleSelectReason = (reason: ReportReason) => {
    setSelectedReason(reason);
  };

  const handleConfirm = () => {
    if (selectedReason) {
      setShowConfirmation(true);
    }
  };

  const handleDone = () => {
    setShowConfirmation(false);
    router.push(`/(worker)/booking-request/${id}?from=${from || 'dashboard'}`);
  };

  const canConfirm = selectedReason !== null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push(`/(worker)/booking-request/${id}?from=${from || 'dashboard'}`)}
          hitSlop={12}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold" color={Colors.textPrimary}>
          Report User
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <AppText variant="h3" weight="bold">
            Report this customer
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            Select a reason and optionally describe the issue.
          </AppText>
        </View>

        {/* Customer Card */}
        {booking && (
          <View style={styles.customerCard}>
            <Avatar uri={booking.customerAvatar} size={48} />
            <AppText variant="body" weight="semiBold">{booking.customerName}</AppText>
          </View>
        )}

        {/* Accordion Sections */}
        <View style={styles.accordionContainer}>
          {categoryOrder.map((category, index) => {
            const reasons = groupedReasons[category];
            if (!reasons || reasons.length === 0) return null;
            const isLast = index === categoryOrder.length - 1;
            
            return (
              <AccordionSection
                key={category}
                title={categoryLabels[category]}
                isExpanded={expandedSection === category}
                onToggle={() => setExpandedSection(expandedSection === category ? null : category)}
                isLast={isLast}
              >
                {reasons.map((reason) => (
                  <Pressable
                    key={reason.id}
                    style={[
                      styles.reasonOption,
                      selectedReason?.id === reason.id && styles.reasonOptionSelected,
                    ]}
                    onPress={() => handleSelectReason(reason)}
                  >
                    <AppText
                      variant="body"
                      color={selectedReason?.id === reason.id ? Colors.cta : Colors.textSecondary}
                    >
                      {reason.label}
                    </AppText>
                    {selectedReason?.id === reason.id && (
                      <Check size={18} color={Colors.cta} />
                    )}
                  </Pressable>
                ))}
              </AccordionSection>
            );
          })}
        </View>

        {/* Additional Details */}
        <View style={styles.detailsSection}>
          <AppText variant="label" color={Colors.textSecondary}>
            Additional Details (optional)
          </AppText>
          <TextInput
            style={styles.input}
            placeholder="Describe the issue..."
            placeholderTextColor={Colors.textTertiary}
            value={additionalDetails}
            onChangeText={setAdditionalDetails}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
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

      {/* Confirmation Popup */}
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
    gap: Spacing['2'],
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
  accordionContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing['5'],
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.md,
    padding: Spacing['3'],
  },
  reasonOptionSelected: {
    backgroundColor: Colors.primarySurface,
  },
  detailsSection: {
    marginBottom: Spacing['5'],
  },
  input: {
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
