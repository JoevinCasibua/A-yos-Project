import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Alert } from 'react-native';
import { ChevronLeft, Phone, MessageCircle, Navigation, Star, Clock, MapPin } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { RatingStars } from '@/components/RatingStars';
import { useRequest } from '@/context/RequestContext';
import { fetchProviderById, subscribeToBooking } from '@/services/api';
import { confirmBookingComplete, fetchBookingTracking, type RouteResult } from '@/services/marketplace';
import type { ProviderData } from '@/components/ProviderCard';
import AyosMap from '@/components/AyosMap';
import { showFeatureLocked } from '@/lib/featureLocks';

const { width, height } = Dimensions.get('window');

const trackingSteps = [
  { id: 0, label: 'Provider Assigned', desc: 'Carlos has accepted your request', icon: 'check' },
  { id: 1, label: 'On the Way', desc: 'Heading to your location', icon: 'navigation' },
  { id: 2, label: 'Arrived', desc: 'Provider has arrived at your address', icon: 'pin' },
  { id: 3, label: 'Service in Progress', desc: 'Work is underway', icon: 'wrench' },
  { id: 4, label: 'Completed', desc: 'Service finished — please review', icon: 'star' },
];

export default function TrackingScreen() {
  const { request } = useRequest();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider,setProvider]=useState<ProviderData|null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [route,setRoute]=useState<RouteResult|null>(null);

  useEffect(() => {
    if(!id)return;let active=true;const load=async()=>{const result=await fetchBookingTracking(id);if(!active||!result.data)return;const steps:Record<string,number>={scheduled:0,accepted:0,en_route:1,arrived:2,in_progress:3,pending_confirmation:4,completed:4,cancelled:0};setCurrentStep(steps[result.data.status]||0);setRoute(result.data.route);const worker=await fetchProviderById(result.data.workerId);if(active)setProvider(worker.data||null);};void load();const channel=subscribeToBooking(id,()=>void load());return()=>{active=false;void channel.unsubscribe();};
  }, [id]);

  const handleBack = useCallback(() => router.replace('/order'), []);
  const handleComplete = useCallback(async () => { if(!id)return;const result=await confirmBookingComplete(id);if(result.error&&result.error.code!=='INVALID_TRANSITION'){Alert.alert('Unable to confirm completion',result.error.message);return;}router.push(`/review/${id}`); }, [id]);

  if(!provider)return <View style={styles.container}/>;

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapImage}><AyosMap origin={route?.origin} destination={route?.destination} route={route?.geometry}/></View>
      <View style={styles.mapOverlay} />

      {/* Top Nav (Standardized Header) */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Live Tracking</AppText>
        <View style={{ width: 40 }} />
      </View>

      {/* Map Pin Marker */}
      <View style={styles.pinContainer}>
        <View style={styles.providerPin}>
          <Avatar uri={provider.avatarUri} size={44} borderRadius={22} />
          <View style={styles.pinDot} />
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Handle */}
        <View style={styles.sheetHandle} />

        {/* Provider Info */}
        <View style={styles.providerRow}>
          <Avatar uri={provider.avatarUri} size={56} />
          <View style={styles.providerInfo}>
            <View style={styles.nameRow}>
              <AppText variant="h4" weight="bold">{provider.name}</AppText>
              {provider.verified && <Badge label="Verified" variant="verified" />}
            </View>
            <AppText variant="caption" color={Colors.textSecondary}>{provider.category}</AppText>
            <RatingStars rating={provider.rating} size={13} showValue reviewCount={provider.reviewCount} />
          </View>
          <View style={styles.actionBtns}>
            <Pressable style={styles.actionBtn}>
              <Phone size={20} color={Colors.cta} strokeWidth={2} />
            </Pressable>
            <Pressable style={[styles.actionBtn, { marginLeft: Spacing['2'] }]} onPress={()=>showFeatureLocked('chat')}>
              <MessageCircle size={20} color={Colors.cta} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Replacement Parts Status */}
        {request.hasParts !== null && request.hasParts !== undefined && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing['4'] }}>
            <View style={{ 
              backgroundColor: request.hasParts ? `${Colors.success}15` : `${Colors.warning}15`, 
              paddingHorizontal: Spacing['3'], 
              paddingVertical: Spacing['1'], 
              borderRadius: Radius.full 
            }}>
              <AppText variant="caption" weight="semiBold" style={{ color: request.hasParts ? Colors.success : Colors.warning }}>
                {request.hasParts ? '🟢 Customer Has Parts' : '🟠 Needs Parts'}
              </AppText>
            </View>
          </View>
        )}

        {/* Tracking Steps */}
        <View style={styles.stepsContainer}>
          {trackingSteps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isActive = idx === currentStep;
            const isLast = idx === trackingSteps.length - 1;

            return (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[
                    styles.stepCircle,
                    {
                      backgroundColor: isDone || isActive ? Colors.cta : Colors.surfaceLight,
                      borderColor: isDone || isActive ? Colors.cta : Colors.border,
                    },
                  ]}>
                    {isDone ? (
                      <View style={styles.checkDot} />
                    ) : isActive ? (
                      <Navigation size={14} color={Colors.white} strokeWidth={2.5} />
                    ) : null}
                  </View>
                  {!isLast && (
                    <View style={[styles.stepLine, { backgroundColor: isDone ? Colors.cta : Colors.border }]} />
                  )}
                </View>
                <View style={[styles.stepContent, { paddingBottom: isLast ? 0 : Spacing['4'] }]}>
                  <AppText
                    variant="bodySm"
                    weight={isDone || isActive ? 'bold' : 'medium'}
                    color={isDone || isActive ? Colors.textPrimary : Colors.textSecondary}
                  >
                    {step.label}
                  </AppText>
                  <AppText variant="caption" color={Colors.textTertiary} style={{ marginTop: 2 }}>
                    {step.desc}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>

        {/* CTA */}
        <AppButton
          label="Evaluate Worker"
          size="lg"
          fullWidth
          onPress={handleComplete}
          leftIcon={<Star size={18} color={Colors.white} strokeWidth={2} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapImage: { width: '100%', height: '100%', resizeMode: 'cover', position: 'absolute' },
  mapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(245,246,250,0.3)' },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingTop: 60,
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  pinContainer: {
    position: 'absolute', top: height * 0.35, left: 0, right: 0,
    alignItems: 'center',
  },
  providerPin: {
    position: 'relative', alignItems: 'center',
    ...Elevation.lg,
  },
  pinDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.cta,
    marginTop: -4, borderWidth: 2, borderColor: Colors.white,
  },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing['4'], paddingTop: Spacing['3'], paddingBottom: Spacing['6'],
    ...Elevation.xl,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: Spacing['4'],
  },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['3'] },
  providerInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'], flexWrap: 'wrap' },
  actionBtns: { flexDirection: 'row' },
  actionBtn: {
    width: 44, height: 44, borderRadius: Radius.lg, backgroundColor: Colors.primarySurface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.primaryBorder,
  },
  stepsContainer: { marginTop: Spacing['5'] },
  stepRow: { flexDirection: 'row' },
  stepLeft: { alignItems: 'center' },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  checkDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.white },
  stepLine: { width: 2, flex: 1, minHeight: 28, marginTop: 2 },
  stepContent: { flex: 1, marginLeft: Spacing['3'] },
});
