import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, TextInput, ScrollView } from 'react-native';
import { X, CheckCircle } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';

const REASON_CATEGORIES = [
  {
    title: 'Schedule Conflict',
    reasons: [
      'I have another booking at this time',
      'This time doesn\'t work for my schedule',
    ],
  },
  {
    title: 'Location Issues',
    reasons: [
      'The location is too far from me',
      'I cannot access the area',
    ],
  },
  {
    title: 'Job Description',
    reasons: [
      'The job is outside my expertise',
      'The description doesn\'t match the actual job',
    ],
  },
  {
    title: 'Personal Reasons',
    reasons: [
      'Personal emergency came up',
      'I\'m not feeling well',
    ],
  },
];

interface DeclineReasonDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  customerName: string;
}

export const DeclineReasonDialog = React.memo(function DeclineReasonDialog({
  visible,
  onClose,
  onConfirm,
  customerName,
}: DeclineReasonDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = () => {
    const reason = selectedReason === 'custom' ? customReason.trim() : selectedReason;
    if (!reason) return;
    onConfirm(reason);
    setSelectedReason(null);
    setCustomReason('');
  };

  const handleClose = () => {
    setSelectedReason(null);
    setCustomReason('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.dialogHeader}>
            <AppText variant="h4" weight="bold">Decline Booking</AppText>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <X size={20} color={Colors.textTertiary} />
            </Pressable>
          </View>

          <AppText variant="bodySm" color={Colors.textSecondary} style={styles.subtitle}>
            Select a reason for declining {customerName}'s booking:
          </AppText>

          <ScrollView style={styles.reasonsScroll} showsVerticalScrollIndicator={false}>
            {REASON_CATEGORIES.map((category) => (
              <View key={category.title} style={styles.category}>
                <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.categoryTitle}>
                  {category.title.toUpperCase()}
                </AppText>
                {category.reasons.map((reason) => (
                  <Pressable
                    key={reason}
                    style={[styles.reasonOption, selectedReason === reason && styles.reasonOptionActive]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <AppText variant="bodySm" style={{ flex: 1 }}>{reason}</AppText>
                    {selectedReason === reason && <CheckCircle size={18} color={Colors.cta} />}
                  </Pressable>
                ))}
              </View>
            ))}

            <View style={styles.category}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.categoryTitle}>
                OTHER
              </AppText>
              <Pressable
                style={[styles.reasonOption, selectedReason === 'custom' && styles.reasonOptionActive]}
                onPress={() => setSelectedReason('custom')}
              >
                <AppText variant="bodySm" style={{ flex: 1 }}>Other reason</AppText>
                {selectedReason === 'custom' && <CheckCircle size={18} color={Colors.cta} />}
              </Pressable>
              {selectedReason === 'custom' && (
                <TextInput
                  style={styles.customInput}
                  placeholder="Type your reason..."
                  placeholderTextColor={Colors.textTertiary}
                  value={customReason}
                  onChangeText={setCustomReason}
                  multiline
                />
              )}
            </View>
          </ScrollView>

          <View style={styles.dialogActions}>
            <AppButton label="Cancel" variant="outline" onPress={handleClose} style={{ flex: 1 }} />
            <AppButton
              label="Decline"
              variant="primary"
              onPress={handleConfirm}
              disabled={!selectedReason || (selectedReason === 'custom' && !customReason.trim())}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['4'],
  },
  dialog: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
    ...Elevation.lg,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['3'],
  },
  reasonsScroll: {
    paddingHorizontal: Spacing['4'],
    maxHeight: 350,
  },
  category: {
    marginTop: Spacing['3'],
  },
  categoryTitle: {
    marginBottom: Spacing['2'],
    letterSpacing: 0.5,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    padding: Spacing['3'],
    marginBottom: Spacing['2'],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reasonOptionActive: {
    borderColor: Colors.cta,
    backgroundColor: Colors.primarySurface,
  },
  customInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: Spacing['2'],
  },
  dialogActions: {
    flexDirection: 'row',
    gap: Spacing['3'],
    padding: Spacing['4'],
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
