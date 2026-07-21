import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { theme } from '@/constants/theme';
import { ArrowLeft, Phone, MessageSquare, MapPin, CheckCircle2, Circle, Navigation, Clock } from 'lucide-react-native';
import { useWorkerBookingStore } from '@/store/useWorkerBookingStore';
import { workerBookings } from '@/constants/workerMockData';

const TIMELINE_STEPS = [
  { id: '1', title: 'Provider Hired', subtitle: 'Worker has been selected' },
  { id: '2', title: 'Provider Accepted', subtitle: 'Job has been accepted' },
  { id: '3', title: 'En Route', subtitle: 'Provider is on the way' },
  { id: '4', title: 'Arrived', subtitle: 'Provider has arrived at the location' },
  { id: '5', title: 'In Progress', subtitle: 'Service has started' },
  { id: '6', title: 'Completed', subtitle: 'Service finished' },
];

const STATUS_STEP_MAP: Record<string, number> = {
  hired: 0,
  accepted: 1,
  en_route: 2,
  in_progress: 4,
  pending_review: 5,
  completed: 5,
};

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(2);

  const workerStatus = useWorkerBookingStore((s) => s.currentStatus);
  const elapsedSeconds = useWorkerBookingStore((s) => s.elapsedSeconds);
  const booking = workerBookings.find((b) => b.id === id);

  const stepIndex = useMemo(() => {
    if (workerStatus && STATUS_STEP_MAP[workerStatus] !== undefined) {
      return STATUS_STEP_MAP[workerStatus];
    }
    return currentStep;
  }, [workerStatus, currentStep]);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    router.push(`/payment/${id}`);
  };

  const isEnRoute = workerStatus === 'en_route';
  const isInProgress = workerStatus === 'in_progress';

  return (
    <Screen safeArea backgroundColor={theme.colors.surface}>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Live Tracking</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Map Area */}
        <View style={styles.mapContainer}>
          {isEnRoute || isInProgress ? (
            <View style={styles.mapWithStatus}>
              <Navigation size={28} color={theme.colors.primary} />
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
                {isEnRoute ? 'Provider is on the way' : 'Provider is working'}
              </Text>
              {isEnRoute && (
                <View style={styles.etaBadge}>
                  <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>15 Min</Text>
                  <Text style={theme.typography.caption}>ETA</Text>
                </View>
              )}
              {isInProgress && (
                <View style={styles.timerBadge}>
                  <Clock size={16} color={theme.colors.warning} />
                  <Text style={[theme.typography.h4, { color: theme.colors.warning }]}>
                    {formatTimer(elapsedSeconds)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.mockMap}>
              <MapPin color={theme.colors.error} size={32} style={styles.mapIcon} />
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
                Map tracking will be displayed here
              </Text>
            </View>
          )}
        </View>

        {/* Worker Info */}
        <View style={styles.workerContainer}>
          <View style={styles.workerInfo}>
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={theme.typography.h4}>Mario Rossi</Text>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Plumber</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.iconButton}>
              <Phone color={theme.colors.primary} size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push(`/messages/chat?id=${id}`)}>
              <MessageSquare color={theme.colors.primary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Timeline */}
        <ScrollView style={styles.timelineScroll} showsVerticalScrollIndicator={false}>
          <Text style={[theme.typography.h3, { marginBottom: theme.spacing.md }]}>Status</Text>
          <View style={styles.timeline}>
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index <= stepIndex;
              const isCurrent = index === stepIndex;
              const isLast = index === TIMELINE_STEPS.length - 1;

              return (
                <View key={step.id} style={styles.timelineItem}>
                  <View style={styles.timelineLineContainer}>
                    {isCompleted ? (
                      <CheckCircle2 color={theme.colors.primary} size={20} />
                    ) : (
                      <Circle color={theme.colors.border} size={20} />
                    )}
                    {!isLast && (
                      <View style={[styles.timelineLine, { backgroundColor: isCompleted ? theme.colors.primary : theme.colors.border }]} />
                    )}
                  </View>
                  <View style={styles.timelineTextContainer}>
                    <Text style={[theme.typography.h4, { color: isCurrent ? theme.colors.primary : theme.colors.textPrimary, opacity: isCompleted ? 1 : 0.5 }]}>
                      {step.title}
                    </Text>
                    <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, opacity: isCompleted ? 1 : 0.5 }]}>
                      {step.subtitle}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {workerStatus === 'pending_review' && (
        <View style={styles.footer}>
          <Button
            title="Confirm Completion"
            onPress={handleComplete}
            fullWidth
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1 },
  mapContainer: { height: 250, position: 'relative' },
  mockMap: { flex: 1, backgroundColor: theme.colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  mapWithStatus: {
    flex: 1, backgroundColor: theme.colors.infoBackground,
    justifyContent: 'center', alignItems: 'center',
  },
  mapIcon: { opacity: 0.5 },
  etaBadge: {
    position: 'absolute', bottom: theme.spacing.md, right: theme.spacing.md,
    backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm, borderRadius: theme.radius.lg,
    alignItems: 'center', ...theme.shadows.md,
  },
  timerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm,
    position: 'absolute', bottom: theme.spacing.md, right: theme.spacing.md,
    backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm, borderRadius: theme.radius.lg,
    ...theme.shadows.md,
  },
  workerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.lg },
  workerInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.border, marginRight: theme.spacing.md },
  actions: { flexDirection: 'row' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.infoBackground, justifyContent: 'center', alignItems: 'center', marginLeft: theme.spacing.sm },
  divider: { height: 1, backgroundColor: theme.colors.borderLight, marginHorizontal: theme.spacing.lg },
  timelineScroll: { flex: 1, padding: theme.spacing.lg },
  timeline: { paddingBottom: theme.spacing.xxxl },
  timelineItem: { flexDirection: 'row', minHeight: 60 },
  timelineLineContainer: { alignItems: 'center', width: 24, marginRight: theme.spacing.md },
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },
  timelineTextContainer: { flex: 1, paddingBottom: theme.spacing.lg },
  footer: { padding: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
});
