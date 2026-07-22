import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, TextInput, Alert } from 'react-native';
import { Calendar, Clock, X } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';

interface RescheduleDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, message: string) => void;
  customerName: string;
  currentDate?: string;
  currentTime?: string;
}

const QUICK_TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];

export function RescheduleDialog({
  visible,
  onClose,
  onConfirm,
  customerName,
  currentDate,
  currentTime,
}: RescheduleDialogProps) {
  const [date, setDate] = useState(currentDate || '');
  const [time, setTime] = useState(currentTime || '');
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    if (!date.trim()) {
      Alert.alert('Required', 'Please enter a date.');
      return;
    }
    if (!time.trim()) {
      Alert.alert('Required', 'Please select a time.');
      return;
    }
    onConfirm(date.trim(), time.trim(), message.trim());
    setDate('');
    setTime('');
    setMessage('');
  };

  const handleClose = () => {
    setDate('');
    setTime('');
    setMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h4" weight="bold">Reschedule Booking</AppText>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={Colors.textTertiary} />
            </Pressable>
          </View>

          <AppText variant="bodySm" color={Colors.textSecondary} style={styles.subtitle}>
            Propose a new date and time to {customerName}. They'll be notified of the change.
          </AppText>

          {/* Date Input */}
          <View style={styles.field}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.label}>NEW DATE</AppText>
            <View style={styles.inputRow}>
              <Calendar size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Jul 28, 2026"
                placeholderTextColor={Colors.textTertiary}
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.field}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.label}>PREFERRED TIME</AppText>
            <View style={styles.timeGrid}>
              {QUICK_TIMES.map((t) => (
                <Pressable
                  key={t}
                  style={[styles.timeChip, time === t && styles.timeChipActive]}
                  onPress={() => setTime(t)}
                >
                  <Clock size={12} color={time === t ? Colors.white : Colors.textTertiary} />
                  <AppText
                    variant="caption"
                    weight="semiBold"
                    color={time === t ? Colors.white : Colors.textSecondary}
                  >
                    {t}
                  </AppText>
                </Pressable>
              ))}
            </View>
            <View style={styles.inputRow}>
              <Clock size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder="Or type a custom time"
                placeholderTextColor={Colors.textTertiary}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          {/* Message */}
          <View style={styles.field}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.label}>MESSAGE (OPTIONAL)</AppText>
            <TextInput
              style={styles.textArea}
              placeholder="Let the customer know why..."
              placeholderTextColor={Colors.textTertiary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <AppButton label="Cancel" variant="outline" onPress={handleClose} style={{ flex: 1 }} />
            <AppButton label="Send Proposal" variant="primary" onPress={handleConfirm} style={{ flex: 1 }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['5'],
  },
  dialog: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: Spacing['5'],
    width: '100%',
    maxWidth: 400,
    gap: Spacing['4'],
    ...Elevation.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: -Spacing['2'],
  },
  field: {
    gap: Spacing['2'],
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: Spacing['1'],
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['1'],
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  timeChipActive: {
    backgroundColor: Colors.cta,
    borderColor: Colors.cta,
  },
  textArea: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 72,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing['3'],
    marginTop: Spacing['1'],
  },
});
