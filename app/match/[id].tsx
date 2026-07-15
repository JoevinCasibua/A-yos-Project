import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Easing, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout, Spacing, Radius, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { providers } from '@/constants/mockData';
import { useRequest } from '@/context/RequestContext';
import { ChevronLeft, MapPin, CheckCircle, MessageSquare, ShieldAlert } from 'lucide-react-native';

const RadarPulse = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    setTimeout(() => {
      Animated.loop(
        Animated.timing(pulseAnim2, {
          toValue: 1,
          duration: 2500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    }, 1250);
  }, [pulseAnim, pulseAnim2]);

  const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 4] });
  const opacity = pulseAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.6, 0.1, 0] });

  const scale2 = pulseAnim2.interpolate({ inputRange: [0, 1], outputRange: [0.5, 4] });
  const opacity2 = pulseAnim2.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.6, 0.1, 0] });

  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseCircle, { transform: [{ scale }], opacity }]} />
      <Animated.View style={[styles.pulseCircle, { transform: [{ scale: scale2 }], opacity: opacity2 }]} />
      <View style={styles.centerPin}>
        <MapPin size={24} color={Colors.white} />
      </View>
    </View>
  );
};

export default function ASAPMatchScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { request } = useRequest();
  
  const [matchedWorkers, setMatchedWorkers] = useState<any[]>([]);

  useEffect(() => {
    // Cascade popups every 3 seconds
    const worker1 = {
      ...providers[0],
      estimatedPrice: '$60/hr',
      eta: '5 mins away',
      message: 'I am nearby and can fix this right now!',
    };
    
    const worker2 = {
      ...providers[1],
      estimatedPrice: '$55/hr',
      eta: '8 mins away',
      message: 'Just finishing up a job, I can head over immediately!',
    };

    const t1 = setTimeout(() => {
      setMatchedWorkers(prev => [worker1, ...prev]);
    }, 2500);

    const t2 = setTimeout(() => {
      setMatchedWorkers(prev => [worker2, ...prev]);
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleBack = () => router.back();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Finding Workers</AppText>
        <View style={{ width: 40 }} />
      </View>

      {/* Map Area */}
      <View style={styles.mapArea}>
        {/* Placeholder for actual MapView */}
        <View style={styles.mapBackground} />
        <RadarPulse />
        
        <View style={styles.mapOverlayTop}>
          <View style={styles.statusBadge}>
            <AppText variant="caption" weight="bold" color={Colors.primary}>BROADCASTING</AppText>
          </View>
        </View>
      </View>

      {/* Workers List Area */}
      <View style={styles.workersArea}>
        {matchedWorkers.length === 0 ? (
          <View style={styles.emptyState}>
            <AppText variant="h4" weight="bold" style={{ marginBottom: Spacing['2'] }}>Searching nearby...</AppText>
            <AppText variant="body" color={Colors.textSecondary} align="center">
              Please wait while we match you with the closest available workers.
            </AppText>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {matchedWorkers.map((worker, index) => (
              <View key={worker.id} style={[styles.workerCard, index === 0 ? styles.newCard : {}]}>
                <View style={styles.matchBadge}>
                  <CheckCircle size={12} color={Colors.white} />
                  <AppText variant="caption" weight="bold" color={Colors.white} style={{ marginLeft: 4, fontSize: 10 }}>WORKER FOUND</AppText>
                </View>
                <View style={styles.workerHeader}>
                  <Avatar uri={worker.avatarUri} size={60} />
                  <View style={styles.workerInfo}>
                    <View style={styles.nameRow}>
                      <AppText variant="h4" weight="bold">{worker.name}</AppText>
                      {worker.verified && <CheckCircle size={14} color={Colors.verified} strokeWidth={2.5} style={{ marginLeft: 4 }} />}
                    </View>
                    <View style={styles.statsRow}>
                      <Badge label={`${worker.rating} ★`} variant="warning" />
                      <AppText variant="caption" color={Colors.textSecondary}>• {worker.reviewCount} jobs</AppText>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <AppText variant="h3" weight="bold" color={Colors.cta}>{worker.estimatedPrice}</AppText>
                    <AppText variant="caption" weight="bold" color={Colors.primary} style={{ marginTop: 2 }}>{worker.eta}</AppText>
                  </View>
                </View>

                <View style={styles.messageBubble}>
                  <AppText variant="bodySm" color={Colors.textSecondary} numberOfLines={2}>
                    "{worker.message}"
                  </AppText>
                </View>

                <AppButton 
                  label="Message Worker" 
                  size="xl" 
                  fullWidth
                  leftIcon={<MessageSquare size={20} color={Colors.white} />}
                  onPress={() => router.push(`/chat/${worker.id}` as any)}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
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
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60,
    paddingBottom: Spacing['4'],
    backgroundColor: Colors.white,
    zIndex: 10,
    ...Elevation.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#E5E9EA', // map placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5E9EA',
    opacity: 0.5,
  },
  mapOverlayTop: {
    position: 'absolute',
    top: Spacing['4'],
    alignItems: 'center',
    width: '100%',
  },
  statusBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing['4'],
    paddingVertical: Spacing['2'],
    borderRadius: Radius.full,
    ...Elevation.md,
  },
  pulseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
  },
  centerPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.md,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  workersArea: {
    height: '45%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -20,
    ...Elevation.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['6'],
  },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingTop: Spacing['6'],
  },
  workerCard: {
    backgroundColor: Colors.surfaceCard,
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    marginBottom: Spacing['4'],
    ...Elevation.sm,
    position: 'relative',
  },
  newCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  matchBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -60,
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    zIndex: 2,
  },
  workerHeader: {
    flexDirection: 'row',
    marginBottom: Spacing['3'],
    marginTop: Spacing['2'],
  },
  workerInfo: {
    flex: 1,
    marginLeft: Spacing['3'],
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  messageBubble: {
    backgroundColor: Colors.primarySurface,
    padding: Spacing['3'],
    borderRadius: Radius.md,
    marginBottom: Spacing['4'],
  },
});
