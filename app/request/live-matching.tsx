import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { Colors, Layout, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { RatingStars } from '@/components/RatingStars';
import { Chip } from '@/components/Chip';
import { useRequest } from '@/context/RequestContext';

// Mock incoming workers
const MOCK_WORKERS = [
  { id: 'w1', name: 'Michael T.', rating: 4.9, distance: '1.2 mi', eta: '5 min', price: '$80', specialty: 'Master Plumber', image: 'https://i.pravatar.cc/150?u=w1' },
  { id: 'w2', name: 'David R.', rating: 4.7, distance: '2.5 mi', eta: '12 min', price: '$65', specialty: 'General Handyman', image: 'https://i.pravatar.cc/150?u=w2' },
  { id: 'w3', name: 'Sarah K.', rating: 5.0, distance: '3.0 mi', eta: '15 min', price: '$90', specialty: 'Licensed Electrician', image: 'https://i.pravatar.cc/150?u=w3' },
];

export default function LiveMatchingScreen() {
  const router = useRouter();
  const { updateRequest } = useRequest();
  
  const [offers, setOffers] = useState<typeof MOCK_WORKERS>([]);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Simulate incoming offers staggered
    const t1 = setTimeout(() => setOffers((prev) => [...prev, MOCK_WORKERS[0]]), 3000);
    const t2 = setTimeout(() => setOffers((prev) => [...prev, MOCK_WORKERS[1]]), 6000);
    const t3 = setTimeout(() => setOffers((prev) => [...prev, MOCK_WORKERS[2]]), 10000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleReject = (id: string) => {
    setOffers((prev) => prev.filter((w) => w.id !== id));
  };

  const handleAccept = (worker: typeof MOCK_WORKERS[0]) => {
    updateRequest({ selectedWorkerId: worker.id, status: 'Accepted' });
    router.replace(`/tracking/${worker.id}`);
  };

  const handleCancel = () => {
    updateRequest({ status: 'Draft' });
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      
      {/* Header / Radar area */}
      <View style={styles.header}>
        <Animated.View style={[styles.radarCircle, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.radarCenter}>
          <AppText variant="h2" style={{ color: Colors.white, fontWeight: '700' }}>
            {offers.length}
          </AppText>
        </View>
        <AppText variant="h3" style={styles.searchingText}>Searching nearby...</AppText>
        <AppText variant="body" style={styles.subText}>
          {offers.length > 0 ? 'Review offers below' : 'Notifying workers in your area'}
        </AppText>
      </View>

      {/* Offers List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {offers.map((worker) => (
          <View key={worker.id} style={styles.offerCard}>
            <View style={styles.offerHeader}>
              <Avatar uri={worker.image} size={48} />
              <View style={styles.workerInfo}>
                <AppText variant="label" style={{ fontWeight: '600' }}>{worker.name}</AppText>
                <RatingStars rating={worker.rating} reviewCount={Math.floor(Math.random() * 100) + 20} size={12} />
              </View>
              <View style={styles.priceContainer}>
                <AppText variant="h3" style={{ color: Colors.success, fontWeight: '700' }}>{worker.price}</AppText>
              </View>
            </View>
            
            <View style={styles.tagsRow}>
              <Chip label={worker.specialty} style={styles.chip} size="sm" />
              <Chip label={worker.distance} style={styles.chip} size="sm" />
              <Chip label={`ETA: ${worker.eta}`} style={styles.chip} size="sm" />
            </View>

            <View style={styles.actionRow}>
              <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(worker.id)}>
                <X size={20} color={Colors.textSecondary} />
                <AppText style={{ color: Colors.textSecondary, fontWeight: '600', marginLeft: 8 }}>Decline</AppText>
              </Pressable>
              <Pressable style={[styles.actionBtn, styles.acceptBtn]} onPress={() => handleAccept(worker)}>
                <Check size={20} color={Colors.white} />
                <AppText style={{ color: Colors.white, fontWeight: '600', marginLeft: 8 }}>Accept</AppText>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={handleCancel} style={styles.cancelLink}>
          <AppText style={{ color: Colors.error, fontWeight: '600' }}>Cancel Request</AppText>
        </Pressable>
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
    height: 240,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  radarCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 60,
  },
  radarCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing[4],
    borderWidth: 4,
    borderColor: Colors.white,
  },
  searchingText: {
    color: Colors.white,
    fontWeight: '700',
  },
  subText: {
    color: Colors.primarySurface,
    marginTop: 4,
  },
  scrollContent: {
    padding: Layout.screenPadding,
    gap: Spacing[4],
  },
  offerCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerInfo: {
    flex: 1,
    marginLeft: Spacing[3],
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
    marginTop: Spacing[4],
    marginBottom: Spacing[4],
  },
  chip: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: Colors.surfaceLight,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
  },
  footer: {
    padding: Layout.screenPadding,
    alignItems: 'center',
    paddingBottom: 40,
  },
  cancelLink: {
    padding: Spacing[2],
  },
});
