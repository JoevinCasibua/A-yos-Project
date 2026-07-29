import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Modal, TextInput, Alert, Keyboard } from 'react-native';
import { Calendar, Clock, X } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';

interface RescheduleDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, message: string) => void;
  customerName: string;
}

const QUICK_TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

function parseMMDDYYYY(s: string): Date | null {
  const match = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, mm, dd, yyyy] = match;
  const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  if (date.getMonth() !== parseInt(mm) - 1 || date.getDate() !== parseInt(dd)) return null;
  return date;
}

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

function formatTimeInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    if (digits.length === 2) {
      const h = parseInt(digits);
      if (h === 0) return '01';
      if (h > 24) return '24';
    }
    return digits;
  }
  const h = parseInt(digits.slice(0, 2));
  const hh = h === 0 ? '01' : h > 24 ? '24' : digits.slice(0, 2);
  if (digits.length === 3) return `${hh}:${digits.slice(2)}`;
  const m = parseInt(digits.slice(2));
  const mm = m > 59 ? '59' : digits.slice(2);
  return `${hh}:${mm}`;
}

export function RescheduleDialog({
  visible,
  onClose,
  onConfirm,
  customerName,
}: RescheduleDialogProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
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
    const parsed = parseMMDDYYYY(date.trim());
    if (!parsed) {
      Alert.alert('Invalid Date', 'The date you entered is not valid.');
      return;
    }
    const timeParts = time.trim().match(/^(\d{2}):(\d{2})$/);
    if (!timeParts) {
      Alert.alert('Invalid Time', 'Please enter a valid time in HH:MM format.');
      return;
    }
    const hour = parseInt(timeParts[1]);
    const minute = parseInt(timeParts[2]);
    if (hour < 1 || hour > 24) {
      Alert.alert('Invalid Time', 'Hour must be between 01 and 24.');
      return;
    }
    if (minute > 59) {
      Alert.alert('Invalid Time', 'Minutes must be between 00 and 59.');
      return;
    }
    Alert.alert(
      'Confirm Reschedule',
      `Propose ${date.trim()} at ${time.trim()} to the customer?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Proposal',
          onPress: () => {
            onConfirm(date.trim(), time.trim(), message.trim());
            setDate('');
            setTime('');
            setMessage('');
          },
        },
      ]
    );
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setDate('');
    setTime('');
    setMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.dialog} onPress={() => Keyboard.dismiss()}>
          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h4" weight="bold">Reschedule Booking</AppText>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color={Colors.textTertiary} />
            </Pressable>
          </View>

          <AppText variant="bodySm" color={Colors.textSecondary} style={styles.subtitle}>
            Propose a new date and time to {customerName}. They&apos;ll be notified of the change.
          </AppText>

          {/* Date Input */}
          <View style={styles.field}>
            <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.label}>NEW DATE</AppText>
            <View style={styles.inputRow}>
              <Calendar size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={Colors.textTertiary}
                value={date}
                onChangeText={(t) => setDate(formatDateInput(t))}
                keyboardType="numeric"
                maxLength={10}
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
                placeholder="HH:MM (24h)"
                placeholderTextColor={Colors.textTertiary}
                value={time}
                onChangeText={(t) => setTime(formatTimeInput(t))}
                keyboardType="numeric"
                maxLength={5}
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
