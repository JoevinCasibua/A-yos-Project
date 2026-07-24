import React from 'react';
import { View, Modal, StyleSheet, Pressable, Alert } from 'react-native';
import { AlertTriangle, X, Phone, MapPin, ShieldAlert, Flag } from 'lucide-react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/buttons/Button';
import { router } from 'expo-router';

interface WorkerSOSModalProps {
  visible: boolean;
  onClose: () => void;
  bookingId?: string;
  customerName?: string;
}

export function WorkerSOSModal({ visible, onClose, bookingId, customerName }: WorkerSOSModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <AlertTriangle color={Colors.error} size={24} style={{ marginRight: 8 }} />
              <AppText variant="h4" weight="bold" color={Colors.error}>Emergency SOS</AppText>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <X color={Colors.textSecondary} size={24} />
            </Pressable>
          </View>

          <View style={styles.body}>
            {customerName && (
              <View style={styles.contextBanner}>
                <AppText variant="body" weight="medium" color={Colors.textPrimary}>
                  You are currently on a booking for {customerName}.
                </AppText>
              </View>
            )}

            <AppText variant="body" color={Colors.textSecondary} style={styles.description}>
              If you feel unsafe or need immediate assistance, use one of the options below.
            </AppText>

            <Button
              title="Call Emergency Services (911)"
              variant="outlined"
              icon={Phone}
              iconColor={Colors.error}
              fullWidth
              style={{ marginBottom: Spacing['3'], borderColor: Colors.error }}
              textStyle={{ color: Colors.error }}
              onPress={() => {
                Alert.alert('Dialing 911...', 'Connecting you to local emergency services.');
                onClose();
              }}
            />

            <Button
              title="Alert A-yos Safety Team"
              variant="danger"
              icon={ShieldAlert}
              fullWidth
              style={{ marginBottom: Spacing['3'] }}
              onPress={() => {
                Alert.alert('Safety Team Alerted', 'A-yos Safety has been notified and will review this booking immediately.');
                onClose();
              }}
            />

            <Button
              title="Share Location with Support"
              variant="outlined"
              icon={MapPin}
              fullWidth
              onPress={() => {
                Alert.alert('Location Shared', 'Your live location has been sent to A-yos support.');
                onClose();
              }}
            />

            <View style={styles.divider} />

            <Button
              title="End Job & Report Issue"
              variant="outlined"
              icon={Flag}
              fullWidth
              onPress={() => {
                Alert.alert(
                  'End Job & Report Issue',
                  'This will end the current job and open a report form. Are you sure?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'End Job',
                      style: 'destructive',
                      onPress: () => {
                        onClose();
                        if (bookingId) {
                          router.push(`/(worker)/report-user/${bookingId}?from=booking-request/${bookingId}`);
                        }
                      },
                    },
                  ]
                );
              }}
            />

            <AppText variant="caption" color={Colors.textTertiary} style={styles.footerNote}>
              Your location is being shared with A-yos during active bookings.
            </AppText>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingBottom: Spacing['10'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    padding: Spacing['4'],
  },
  contextBanner: {
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.lg,
    padding: Spacing['3'],
    marginBottom: Spacing['3'],
  },
  description: {
    marginBottom: Spacing['4'],
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginTop: Spacing['4'],
    marginBottom: Spacing['4'],
  },
  footerNote: {
    marginTop: Spacing['4'],
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
