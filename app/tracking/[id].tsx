import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { ChevronLeft, Phone, MessageCircle, Navigation, Star, Clock, MapPin } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { RatingStars } from '@/components/RatingStars';
import { providers } from '@/constants/mockData';

const { width, height } = Dimensions.get('window');

const trackingSteps = [
  { id: 0, label: 'Provider Assigned', desc: 'Carlos has accepted your request', icon: 'check' },
  { id: 1, label: 'On the Way', desc: 'Heading to your location', icon: 'navigation' },
  { id: 2, label: 'Arrived', desc: 'Provider has arrived at your address', icon: 'pin' },
  { id: 3, label: 'Service in Progress', desc: 'Work is underway', icon: 'wrench' },
  { id: 4, label: 'Completed', desc: 'Service finished — please review', icon: 'star' },
];

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const provider = providers.find((p) => p.id === id) || providers[0];
  const [currentStep, setCurrentStep] = useState(1);
  const [etaMinutes, setEtaMinutes] = useState(25);

  useEffect(() => {
    if (currentStep >= 2) return;
    const timer = setInterval(() => {
      setEtaMinutes((m) => {
        if (m <= 1) {
          setCurrentStep(2);
          return 0;
        }
        return m - 1;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [currentStep]);

  const handleBack = useCallback(() => router.back(), []);
  const handleComplete = useCallback(() => {
    router.push(`/review/${provider.id}`);
  }, [provider.id]);

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <Image
        source={{ uri: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800' }}
        style={styles.mapImage}
      />
      <View style={styles.mapOverlay} />

      {/* Top Nav */}
      <View style={styles.topNav}>
        <Pressable style={styles.navBtn} onPress={handleBack}>
          <ChevronLeft size={22} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <View style={styles.etaPill}>
          <Clock size={16} color={Colors.cta} strokeWidth={2} />
          <AppText variant="bodySm" weight="semiBold" color={Colors.cta}>
            {currentStep >= 2 ? 'Arrived' : `ETA ${etaMinutes} min`}
          </AppText>
        </View>
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
            <Pressable style={[styles.actionBtn, { marginLeft: Spacing['2'] }]}>
              <MessageCircle size={20} color={Colors.cta} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

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
  topNav: {
    position: 'absolute', top: 50, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'],
  },
  navBtn: {
    width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center', ...Elevation.md,
  },
  etaPill: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing['1'],
    backgroundColor: Colors.white, paddingHorizontal: Spacing['4'], paddingVertical: Spacing['2'],
    borderRadius: Radius.full, ...Elevation.md,
  },
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
