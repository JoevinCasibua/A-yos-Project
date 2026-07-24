import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle2,
  Loader2,
  XCircle,
  Wrench,
  AudioLines,
  Banknote,
  PhilippinePeso,
  User,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Layout, AvatarSize } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { ThreeDotMenu } from '@/components/ThreeDotMenu';
import { BookingStepIndicator } from '@/components/booking/BookingStepIndicator';
import { BookingChat } from '@/components/booking/BookingChat';
import { BookingMap } from '@/components/booking/BookingMap';
import { JobTimer } from '@/components/booking/JobTimer';
import { CompletedSummary } from '@/components/booking/CompletedSummary';
import { RescheduleDialog } from '@/components/booking/RescheduleDialog';
import { getBackRoute } from '@/constants/backRoutes';
import { workerJobs, workerBookings, statusConfig } from '@/constants/workerMockData';
import { useWorkerBookingStore } from '@/store/useWorkerBookingStore';
import type { WorkerBooking } from '@/constants/workerMockData';

export default function BookingRequestScreen() {
  const { id, autoAccept, from } = useLocalSearchParams<{ id: string; autoAccept?: string; from?: string }>();
  const job = useMemo(() => workerJobs.find((j) => j.id === id) || workerJobs[0], [id]);

  const [statusOverrides, setStatusOverrides] = useState<Record<string, WorkerBooking['status']>>(() => {
    if (autoAccept === 'true' && id) {
      const base = workerBookings.find((b) => b.id === id);
      if (base?.status === 'hired') return { [base.id]: 'accepted' as WorkerBooking['status'] };
    }
    return {};
  });

  const booking = useMemo(() => {
    const base = workerBookings.find((b) => b.id === id) || workerBookings[0];
    return statusOverrides[base.id] ? { ...base, status: statusOverrides[base.id] } : base;
  }, [id, statusOverrides]);

  const setStoreStatus = useWorkerBookingStore((s) => s.setStatus);
  const setCompletionTimer = useWorkerBookingStore((s) => s.setCompletionTimer);
  const clearCurrentBooking = useWorkerBookingStore((s) => s.clearCurrentBooking);
  const completionTimestamp = useWorkerBookingStore((s) => s.completionTimestamp);

  useEffect(() => {
    setStoreStatus(booking.id, booking.status);
    return () => {
      if (booking.status === 'in_progress') {
        clearCurrentBooking();
      }
    };
  }, [booking.id, booking.status]);



  const updateStatus = (newStatus: WorkerBooking['status']) => {
    setStatusOverrides((prev) => ({ ...prev, [booking.id]: newStatus }));
    setStoreStatus(booking.id, newStatus);
    if (newStatus === 'pending_review') {
      setCompletionTimer();
    }
  };

  useEffect(() => {
    if (autoAccept === 'true' && booking.status === 'hired') {
      updateStatus('accepted');
    }
  }, [autoAccept, booking.status]);

  useEffect(() => {
    if (booking.status === 'pending_review' && !completionTimestamp) {
      setCompletionTimer();
    }
  }, [booking.status]);

  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const handleRescheduleConfirm = (date: string, time: string, message: string) => {
    setShowRescheduleDialog(false);
    Alert.alert(
      'Reschedule Proposed',
      `New date: ${date}\nNew time: ${time}${message ? `\nMessage: ${message}` : ''}\n\nThe customer will be notified.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleConfirmDetails = () => {
    Alert.alert('Confirm Details', 'Are you sure you want to confirm the details and head to the location?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Proceed', onPress: () => updateStatus('en_route') },
    ]);
  };

  const handleArrived = () => {
    Alert.alert('Arrived', 'You have arrived at the location. Start the job when ready.', [
      { text: 'Start Job', onPress: () => updateStatus('in_progress') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleComplete = () => {
    Alert.alert('Complete Job', 'Mark this job as completed and notify the customer?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        onPress: () => updateStatus('pending_review'),
      },
    ]);
  };

  const handleLeaveFeedback = () => {
    Alert.alert('Feedback', 'Thanks for your feedback!', [
      { text: 'OK', onPress: () => setFeedbackGiven(true) },
    ]);
  };

  useEffect(() => {
    if (booking.status !== 'pending_review' || !completionTimestamp) return;
    const remaining = completionTimestamp - Date.now();
    if (remaining <= 0) {
      updateStatus('completed');
      return;
    }
    const timer = setTimeout(() => {
      updateStatus('completed');
    }, remaining);
    return () => clearTimeout(timer);
  }, [booking.status, completionTimestamp]);

  const handleReport = () => {
    router.push(`/(worker)/report-user/${booking.id}?from=booking-request/${booking.id}`);
  };

  const handleCancelService = () => {
    router.push(`/(worker)/cancel-service/${booking.id}?from=${from || 'dashboard'}`);
  };

  const handleBack = () => {
    const route = getBackRoute(from);
    route ? router.push(route) : router.back();
  };

  const isCompleted = booking.status === 'completed';
  const isCancelled = booking.status === 'cancelled';

  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    if (booking.status !== 'pending_review' || !completionTimestamp) {
      setRemainingTime('');
      return;
    }
    const update = () => {
      const remaining = completionTimestamp - Date.now();
      if (remaining <= 0) {
        setRemainingTime('Auto-confirming...');
      } else {
        setRemainingTime(`${Math.ceil(remaining / 1000)}s`);
      }
    };
    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [booking.status, completionTimestamp]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack} hitSlop={12}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold" color={Colors.textPrimary}>
          Booking Request
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Job Card ─── */}
        <View style={styles.jobCard}>
          <BookingStepIndicator currentStatus={booking.status} />

          <View style={styles.statusBadgeRow}>
            <Badge
              label={statusConfig[booking.status]?.label || booking.status}
              variant={(statusConfig[booking.status]?.variant as any) || 'info'}
              size="md"
            />
            {booking.status === 'in_progress' && (
              <Badge label="Currently Working" variant="warning" size="md" />
            )}
          </View>

          <View style={styles.cardTopRow}>
            <AppText variant="h3" weight="bold" style={{ flex: 1 }}>
              {job.service}
            </AppText>
            <ThreeDotMenu
              onReportUser={handleReport}
              onCancelService={handleCancelService}
              showCancel={!isCompleted && !isCancelled && booking.status !== 'pending_review'}
            />
          </View>

          <AppText variant="caption" color={Colors.textTertiary}>
            Booking #{booking.id.padStart(4, '0')}
          </AppText>

          <View style={styles.infoBadgeRow}>
            {job.urgency === 'urgent' && (
              <Badge label="URGENT" variant="error" size="sm" />
            )}
            <Badge
              label={booking.paymentMethod === 'cash' ? 'Cash Payment' : 'Online Payment'}
              variant={booking.paymentMethod === 'cash' ? 'warning' : 'info'}
              size="sm"
            />
            {booking.pricingType === 'hourly' && (
              <Badge label="Hourly Rate" variant="neutral" size="sm" />
            )}
          </View>

          {job.imageUrl && (
            <Image source={{ uri: job.imageUrl }} style={styles.jobImage} resizeMode="cover" />
          )}

          <AppText variant="body" color={Colors.textSecondary} style={styles.description}>
            "{job.description}"
          </AppText>

          {booking.issueIdentified && (
            <View style={styles.analysisCard}>
              <View style={styles.analysisRow}>
                <AppText variant="label" weight="semiBold" color={Colors.textSecondary}>Issue Identified</AppText>
                <AppText variant="bodySm" color={Colors.textPrimary}>{booking.issueIdentified}</AppText>
              </View>
              {booking.estimatedRepairTime && (
                <View style={styles.analysisRow}>
                  <AppText variant="label" weight="semiBold" color={Colors.textSecondary}>Estimated Repair Time</AppText>
                  <AppText variant="bodySm" color={Colors.textPrimary}>{booking.estimatedRepairTime}</AppText>
                </View>
              )}
              {booking.recommendedAction && (
                <View style={styles.analysisRow}>
                  <AppText variant="label" weight="semiBold" color={Colors.textSecondary}>Recommended Action</AppText>
                  <AppText variant="bodySm" color={Colors.textPrimary}>{booking.recommendedAction}</AppText>
                </View>
              )}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <User size={14} color={Colors.textTertiary} />
              <AppText variant="label" color={Colors.textTertiary}>Client</AppText>
            </View>
            <AppText variant="body" weight="semiBold">{job.customerName}</AppText>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <MapPin size={14} color={Colors.textTertiary} />
              <AppText variant="label" color={Colors.textTertiary}>Location</AppText>
            </View>
            <AppText variant="body" weight="semiBold">{job.location}</AppText>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Clock size={14} color={Colors.textTertiary} />
              <AppText variant="label" color={Colors.textTertiary}>Schedule</AppText>
            </View>
            <AppText variant="body" weight="semiBold">
              {booking.date} · {booking.time}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <PhilippinePeso size={14} color={Colors.textTertiary} />
              <AppText variant="label" color={Colors.textTertiary}>
                {booking.pricingType === 'hourly' ? 'Est. Earnings (Hourly)' : 'Est. Earnings'}
              </AppText>
            </View>
            <AppText variant="body" weight="semiBold" color={Colors.cta}>
              {booking.pricingType === 'hourly' ? `₱${booking.hourlyRate}/hr` : booking.price}
            </AppText>
          </View>

          {booking.serviceType && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailLabel}>
                  <Wrench size={14} color={Colors.textTertiary} />
                  <AppText variant="label" color={Colors.textTertiary}>Service Type</AppText>
                </View>
                <AppText variant="body" weight="semiBold">{booking.serviceType}</AppText>
              </View>
            </>
          )}

          {booking.voiceTranscript && (
            <>
              <View style={styles.divider} />
              <View style={styles.voiceTranscriptSection}>
                <View style={styles.detailLabel}>
                  <AudioLines size={14} color={Colors.cta} />
                  <AppText variant="label" weight="semiBold" color={Colors.cta}>AI Voice Transcript</AppText>
                </View>
                <AppText variant="bodySm" color={Colors.textSecondary} style={styles.voiceTranscriptText}>
                  {booking.voiceTranscript}
                </AppText>
              </View>
            </>
          )}
        </View>

        {/* ─── Client Card ─── */}
        <View style={styles.clientCard}>
          <View style={styles.clientHeader}>
            <Avatar uri={job.customerAvatar} size={AvatarSize.medium} />
            <View style={styles.clientInfo}>
              <AppText variant="body" weight="semiBold">{job.customerName}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                4 bookings · No cancellations
              </AppText>
            </View>
          </View>
          <Badge label="Good client" variant="success" size="sm" />
        </View>

        {/* ─── State-Specific Content ─── */}
        {booking.status === 'hired' && (
          <View style={styles.hiredBanner}>
            <View style={styles.hiredIconRow}>
              <Calendar size={28} color={Colors.cta} />
            </View>
            <AppText variant="h3" weight="bold" style={styles.hiredTitle}>
              You've Been Selected!
            </AppText>
            <AppText variant="body" color={Colors.textSecondary} style={styles.hiredSubtitle}>
              {job.customerName} has selected you for this job. Accept to start coordinating.
            </AppText>
            <View style={styles.hiredActions}>
              <AppButton
                label="Accept Booking"
                variant="primary"
                leftIcon={<Calendar size={18} color={Colors.white} />}
                fullWidth
                onPress={() => {
                  Alert.alert(
                    'Accept Booking',
                    'Accept this booking request and start coordinating with the customer?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Accept', onPress: () => updateStatus('accepted') },
                    ]
                  );
                }}
              />
              <AppButton
                label="Reschedule"
                variant="outline"
                fullWidth
                onPress={() => setShowRescheduleDialog(true)}
              />
            </View>
          </View>
        )}

        {booking.status === 'accepted' && (
          <>
            <BookingChat
              customerName={job.customerName}
              customerAvatar={job.customerAvatar}
            />
            <Pressable style={styles.contactNowBtn} onPress={() => router.push(`/messages/chat?id=${booking.id}`)}>
              <MessageSquare size={16} color={Colors.cta} />
              <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>
                Open Full Chat
              </AppText>
            </Pressable>
            <Pressable
              style={styles.confirmDetailsBtn}
              onPress={handleConfirmDetails}
            >
              <AppText variant="body" weight="semiBold" color={Colors.white}>
                ✓ Confirm Details
              </AppText>
            </Pressable>
          </>
        )}

        {booking.status === 'en_route' && (
          <>
            <BookingMap
              destinationLat={booking.lat}
              destinationLng={booking.lng}
              destinationAddress={booking.address}
            />
            <View style={styles.contactRow}>
              <Pressable style={styles.contactBtn} onPress={() => Alert.alert('Call', 'Calling customer...')}>
                <Phone size={18} color={Colors.cta} />
                <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>Call</AppText>
              </Pressable>
              <Pressable style={styles.contactBtn} onPress={() => router.push(`/messages/chat?id=${booking.id}`)}>
                <MessageSquare size={18} color={Colors.cta} />
                <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>Message</AppText>
              </Pressable>
            </View>
            <AppButton
              label="I've Arrived"
              variant="primary"
              leftIcon={<MapPin size={18} color={Colors.white} />}
              fullWidth
              onPress={handleArrived}
            />
          </>
        )}

        {booking.status === 'in_progress' && (
          <>
            <JobTimer hourlyRate={booking.pricingType === 'hourly' ? booking.hourlyRate : undefined} />
            <View style={styles.contactRow}>
              <Pressable style={styles.contactBtn} onPress={() => Alert.alert('Call', 'Calling customer...')}>
                <Phone size={18} color={Colors.cta} />
                <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>Call</AppText>
              </Pressable>
              <Pressable style={styles.contactBtn} onPress={() => router.push(`/messages/chat?id=${booking.id}`)}>
                <MessageSquare size={18} color={Colors.cta} />
                <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>Message</AppText>
              </Pressable>
            </View>
            {booking.paymentMethod === 'cash' ? (
              <AppButton
                label="Collect Cash Payment"
                variant="primary"
                leftIcon={<Banknote size={18} color={Colors.white} />}
                fullWidth
                onPress={() => router.push(`/(worker)/cash-confirm/${booking.id}`)}
              />
            ) : (
              <AppButton
                label="Complete Job"
                variant="primary"
                leftIcon={<CheckCircle2 size={18} color={Colors.white} />}
                fullWidth
                onPress={handleComplete}
              />
            )}
          </>
        )}

        {booking.status === 'pending_review' && (
          <View style={styles.reviewCard}>
            <Loader2 size={36} color={Colors.warning} style={styles.spinner} />
            <AppText variant="h4" weight="bold" style={styles.reviewTitle}>
              Waiting for Customer
            </AppText>
            <AppText variant="body" color={Colors.textSecondary} style={styles.reviewSubtitle}>
              The customer has been notified to confirm the job completion.
            </AppText>
            {remainingTime && (
              <View style={styles.timeoutBadge}>
                <Clock size={14} color={Colors.textTertiary} />
                <AppText variant="caption" color={Colors.textSecondary}>
                  Auto-confirms in {remainingTime}
                </AppText>
              </View>
            )}
            <View style={styles.contactRow}>
              <Pressable style={styles.contactBtn} onPress={() => Alert.alert('Call', 'Calling customer...')}>
                <Phone size={18} color={Colors.cta} />
                <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>Call</AppText>
              </Pressable>
              <Pressable style={styles.contactBtn} onPress={() => router.push(`/messages/chat?id=${booking.id}`)}>
                <MessageSquare size={18} color={Colors.cta} />
                <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>Message</AppText>
              </Pressable>
            </View>
          </View>
        )}

        {isCompleted && (
          <CompletedSummary
            bookingId={booking.id}
            duration="1h 15m"
            earnings={booking.price}
            onLeaveFeedback={handleLeaveFeedback}
            onViewReceipt={() => router.push(`/(worker)/earnings-receipt?bookingId=${booking.id}&duration=1h 15m&earnings=${encodeURIComponent(booking.price)}&from=booking-request/${booking.id}`)}
          />
        )}

        {isCancelled && (
          <View style={styles.cancelledBanner}>
            {booking.cancelledBy === 'worker' ? (
              <>
                <XCircle size={36} color={Colors.warning} />
                <AppText variant="h4" weight="bold" color={Colors.warning}>Booking Cancelled</AppText>
                <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
                  You have cancelled this booking.
                </AppText>
              </>
            ) : (
              <>
                <XCircle size={36} color={Colors.error} />
                <AppText variant="h4" weight="bold" color={Colors.error}>Booking Cancelled</AppText>
                <AppText variant="body" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
                  The customer has cancelled this booking.
                </AppText>
              </>
            )}
            {booking.cancelledReason && (
              <AppText variant="caption" color={Colors.textTertiary} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Reason: {booking.cancelledReason}
              </AppText>
            )}
          </View>
        )}
      </ScrollView>

      <RescheduleDialog
        visible={showRescheduleDialog}
        onClose={() => setShowRescheduleDialog(false)}
        onConfirm={handleRescheduleConfirm}
        customerName={job.customerName}
        currentDate={booking.date}
        currentTime={booking.time}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing['16'], paddingBottom: Spacing['4'],
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40, height: 40, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: Layout.screenPadding, paddingBottom: Spacing['10'], gap: Spacing['4'],
  },
  jobCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Layout.cardPadding, gap: Spacing['3'], ...Elevation.sm,
  },
  cardTopRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  jobImage: { width: '100%', height: 180, borderRadius: Radius.lg },
  description: { fontStyle: 'italic' },
  analysisCard: {
    backgroundColor: Colors.surfaceLight, borderRadius: Radius.lg,
    padding: Spacing['3'], gap: Spacing['2'],
  },
  analysisRow: { gap: Spacing['1'] },
  voiceTranscriptSection: { gap: Spacing['2'] },
  voiceTranscriptText: { fontStyle: 'italic', lineHeight: 20 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing['1'] },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing['2'] },
  detailLabel: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing['1'] },
  clientCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Layout.cardPadding,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...Elevation.sm,
  },
  clientHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing['3'] },
  clientInfo: { gap: Spacing['1'] },
  statusBadgeRow: { flexDirection: 'row', gap: Spacing['2'], marginBottom: Spacing['2'] },
  infoBadgeRow: { flexDirection: 'row', gap: Spacing['2'], flexWrap: 'wrap' },

  // Hired
  hiredBanner: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['6'],
    alignItems: 'center', gap: Spacing['3'], ...Elevation.sm,
  },
  hiredIconRow: { marginBottom: Spacing['1'] },
  hiredTitle: { textAlign: 'center' },
  hiredSubtitle: { textAlign: 'center' },
  hiredActions: { width: '100%', gap: Spacing['2'], marginTop: Spacing['2'] },

  // En Route
  contactRow: { flexDirection: 'row', gap: Spacing['3'] },
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing['2'], paddingVertical: Spacing['3'],
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, ...Elevation.sm,
  },

  // Accepted chat
  confirmDetailsBtn: {
    marginHorizontal: Spacing['3'],
    paddingVertical: Spacing['4'],
    borderRadius: Radius.lg,
    backgroundColor: Colors.cta,
    alignItems: 'center',
  },
  contactNowBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing['2'], paddingVertical: Spacing['2'],
  },

  // Pending review
  reviewCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['6'],
    alignItems: 'center', gap: Spacing['3'], ...Elevation.sm,
  },
  spinner: { marginBottom: Spacing['1'] },
  reviewTitle: { textAlign: 'center' },
  reviewSubtitle: { textAlign: 'center' },
  timeoutBadge: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing['1'],
    backgroundColor: Colors.surfaceLight, paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'], borderRadius: Radius.full,
  },

  // Cancelled
  cancelledBanner: {
    alignItems: 'center', gap: Spacing['2'],
    padding: Spacing['6'], backgroundColor: Colors.white,
    borderRadius: Radius.xl, ...Elevation.sm,
  },
});
