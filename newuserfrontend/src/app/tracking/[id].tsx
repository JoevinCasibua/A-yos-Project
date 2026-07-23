import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { ArrowLeft, Phone, MessageSquare, MapPin, CheckCircle2, Circle, X, AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useWorkerStore } from '../../store/useWorkerStore';

const TIMELINE_STEPS = [
  { id: '1', title: 'Pending', subtitle: 'Waiting for worker to accept' },
  { id: '2', title: 'Accepted', subtitle: 'Worker has accepted the job' },
  { id: '3', title: 'Worker Preparing', subtitle: 'Gathering tools and materials' },
  { id: '4', title: 'Worker En Route', subtitle: 'Provider is on the way' },
  { id: '5', title: 'Worker Arrived', subtitle: 'Provider has arrived at the location' },
  { id: '6', title: 'Service Started', subtitle: 'Assessment and initial work began' },
  { id: '7', title: 'In Progress', subtitle: 'Work is currently ongoing' },
  { id: '8', title: 'Completed', subtitle: 'Service finished successfully' },
];

const CANCEL_REASONS = [
  'Worker is taking too long',
  'Changed my mind',
  'Found another solution',
  'Cost is too high',
];

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const worker = useWorkerStore(state => state.getWorkerById(id as string));

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  // Modals state
  const [showCancelPolicy, setShowCancelPolicy] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  
  // Cancel form
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  // Auto progression mock logic
  useEffect(() => {
    if (isCancelled || currentStepIndex >= TIMELINE_STEPS.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, 4000); // advance every 4 seconds

    return () => clearTimeout(timer);
  }, [currentStepIndex, isCancelled]);

  const handleCompletePayment = () => {
    router.push(`/payment/${id}` as any);
  };

  const submitCancellation = () => {
    setShowCancelReason(false);
    setIsCancelled(true);
  };

  if (!worker) {
    return (
      <Screen safeArea>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={theme.colors.textPrimary} size={24} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={theme.typography.h3}>Worker not found</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea backgroundColor={theme.colors.surface}>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Live Tracking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mock Map Area */}
        <View style={styles.mapContainer}>
          <View style={styles.mockMap}>
            <Image 
              source={require('../../../assets/map-bg.png')} 
              style={StyleSheet.absoluteFillObject} 
              contentFit="cover" 
            />
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <MapPin color={theme.colors.error} size={40} style={styles.mapIcon} />
          </View>
          
          {!isCancelled && currentStepIndex < 7 && (
            <View style={styles.etaBadge}>
              <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>15 Min</Text>
              <Text style={theme.typography.caption}>ETA</Text>
            </View>
          )}
        </View>

        {/* Worker Info */}
        <View style={styles.workerContainer}>
          <Image source={worker.avatar} style={styles.workerAvatar} contentFit="cover" />
          <View style={styles.workerDetails}>
            <Text style={theme.typography.h4}>{worker.name}</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{worker.skill}</Text>
          </View>
          
          <TouchableOpacity style={styles.circleBtn}>
            <Phone color={theme.colors.textPrimary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.circleBtn, { marginLeft: theme.spacing.sm }]}
            onPress={() => router.push(`/messages/chat?id=${worker.id}` as any)}
          >
            <MessageSquare color={theme.colors.textPrimary} size={20} />
          </TouchableOpacity>
        </View>

        {/* Status Tracker */}
        <View style={styles.trackerContainer}>
          <Text style={[theme.typography.h4, { marginBottom: theme.spacing.lg }]}>Booking Status</Text>
          
          {isCancelled ? (
            <View style={styles.cancelledBox}>
              <AlertTriangle color={theme.colors.error} size={32} style={{ marginBottom: 12 }} />
              <Text style={[theme.typography.h3, { color: theme.colors.error }]}>Booking Cancelled</Text>
              <Text style={[theme.typography.body2, { textAlign: 'center', marginTop: 8, color: theme.colors.textSecondary }]}>
                You have cancelled this booking. Reason: {selectedReason === 'Other' ? otherReason : selectedReason}.
              </Text>
              <Button title="Return to Home" onPress={() => router.push('/(tabs)' as any)} style={{ marginTop: 24, width: '100%' }} />
            </View>
          ) : (
            <View style={styles.timeline}>
              {TIMELINE_STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <View key={step.id} style={styles.timelineStep}>
                    <View style={styles.stepIndicator}>
                      {isCompleted ? (
                        <CheckCircle2 color={theme.colors.primary} size={24} fill={theme.colors.primary} />
                      ) : isCurrent ? (
                        <View style={styles.currentDotWrapper}>
                          <View style={styles.currentDot} />
                        </View>
                      ) : (
                        <Circle color={theme.colors.borderLight} size={24} />
                      )}
                      
                      {index < TIMELINE_STEPS.length - 1 && (
                        <View style={[
                          styles.stepLine,
                          isCompleted && { backgroundColor: theme.colors.primary }
                        ]} />
                      )}
                    </View>
                    
                    <View style={styles.stepContent}>
                      <Text style={[
                        theme.typography.body1,
                        { fontWeight: '600' },
                        (isCompleted || isCurrent) ? { color: theme.colors.textPrimary } : { color: theme.colors.textSecondary }
                      ]}>
                        {step.title}
                      </Text>
                      <Text style={[
                        theme.typography.caption,
                        { color: theme.colors.textTertiary, marginTop: 4 }
                      ]}>
                        {step.subtitle}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {!isCancelled && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom || theme.spacing.md }]}>
          {currentStepIndex >= TIMELINE_STEPS.length - 1 ? (
            <Button 
              title="Pay Now" 
              onPress={handleCompletePayment}
              fullWidth 
            />
          ) : (
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => setShowCancelPolicy(true)}
            >
              <Text style={[theme.typography.button, { color: theme.colors.error }]}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Refund Policy Modal */}
      <Modal visible={showCancelPolicy} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={theme.typography.h3}>Cancellation Policy</Text>
              <TouchableOpacity onPress={() => setShowCancelPolicy(false)}>
                <X color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <AlertTriangle color={theme.colors.warning} size={48} style={{ alignSelf: 'center', marginBottom: 16 }} />
              <Text style={[theme.typography.body1, { marginBottom: 12 }]}>
                Are you sure you want to cancel?
              </Text>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
                • Cancellations made before the worker is "En Route" are <Text style={{ fontWeight: 'bold' }}>fully refunded</Text>.
              </Text>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: 24 }]}>
                • Cancellations made after the worker is dispatched may incur a <Text style={{ fontWeight: 'bold' }}>₱150 cancellation fee</Text>.
              </Text>
              
              <Button 
                title="Keep Booking" 
                onPress={() => setShowCancelPolicy(false)} 
                style={{ marginBottom: 12 }} 
              />
              <Button 
                title="Proceed to Cancel" 
                variant="outlined" 
                onPress={() => {
                  setShowCancelPolicy(false);
                  setShowCancelReason(true);
                }} 
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancellation Reason Modal */}
      <Modal visible={showCancelReason} transparent animationType="slide">
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            activeOpacity={1} 
            onPress={Keyboard.dismiss} 
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={theme.typography.h3}>Reason for Cancelling</Text>
              <TouchableOpacity onPress={() => setShowCancelReason(false)}>
                <X color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
                Please let us know why you are cancelling so we can improve our service.
              </Text>
              
              <View style={styles.chipsContainer}>
                {CANCEL_REASONS.map(reason => (
                  <TouchableOpacity 
                    key={reason}
                    style={[styles.reasonChip, selectedReason === reason && styles.reasonChipActive]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <Text style={[styles.reasonText, selectedReason === reason && styles.reasonTextActive]}>
                      {reason}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity 
                    style={[styles.reasonChip, selectedReason === 'Other' && styles.reasonChipActive]}
                    onPress={() => setSelectedReason('Other')}
                  >
                    <Text style={[styles.reasonText, selectedReason === 'Other' && styles.reasonTextActive]}>
                      Other
                    </Text>
                  </TouchableOpacity>
              </View>

              {selectedReason === 'Other' && (
                <TextInput 
                  style={styles.otherInput}
                  placeholder="Please specify..."
                  value={otherReason}
                  onChangeText={setOtherReason}
                  multiline
                />
              )}
              
              <Button 
                title="Confirm Cancellation" 
                onPress={submitCancellation}
                disabled={!selectedReason || (selectedReason === 'Other' && !otherReason)}
                style={{ marginTop: 24, backgroundColor: theme.colors.error }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1 },
  
  mapContainer: { width: '100%', height: 250, position: 'relative' },
  mockMap: { flex: 1, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  mapIcon: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }] },
  etaBadge: { position: 'absolute', bottom: theme.spacing.md, right: theme.spacing.md, backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 12, borderRadius: theme.radius.lg, alignItems: 'center', ...theme.shadows.md },
  
  workerContainer: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  workerAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: theme.spacing.md },
  workerDetails: { flex: 1 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  
  trackerContainer: { padding: theme.spacing.lg },
  timeline: { paddingLeft: 8 },
  timelineStep: { flexDirection: 'row', marginBottom: 20 },
  stepIndicator: { width: 24, alignItems: 'center' },
  currentDotWrapper: { width: 24, height: 24, borderRadius: 12, backgroundColor: `${theme.colors.primary}30`, justifyContent: 'center', alignItems: 'center' },
  currentDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary },
  stepLine: { position: 'absolute', top: 28, bottom: -20, width: 2, backgroundColor: theme.colors.borderLight },
  stepContent: { flex: 1, marginLeft: theme.spacing.lg, paddingTop: 2 },
  
  bottomBar: { paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.md, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  cancelBtn: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },

  cancelledBox: { alignItems: 'center', padding: theme.spacing.xl, backgroundColor: '#fef2f2', borderRadius: theme.radius.lg, borderWidth: 1, borderColor: '#fecaca' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  modalBody: { padding: theme.spacing.lg },
  
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  reasonChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.borderLight, marginRight: 8, marginBottom: 8 },
  reasonChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  reasonText: { fontSize: 13, color: theme.colors.textSecondary },
  reasonTextActive: { color: theme.colors.surface, fontWeight: '500' },

  otherInput: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.borderLight, borderRadius: theme.radius.md, padding: 12, height: 100, textAlignVertical: 'top', marginTop: 8 },
});
