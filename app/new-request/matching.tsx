import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { theme } from '@/constants/theme';
import { ArrowLeft, MapPin, Star, MessageSquare, AlertCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDraftStore } from '@/store/useDraftStore';
import { useWorkerStore, WorkerProfile } from '@/store/useWorkerStore';

// We'll define a mapping similar to the one in issue-summary if needed to convert categoryId to category name
const CATEGORY_MAP: Record<string, string> = {
  '1': 'Plumbing',
  '2': 'Electrical',
  '3': 'Carpentry',
  '4': 'Cleaning',
  '5': 'Appliance',
  '6': 'AC Repair',
  '7': 'Painting',
  '8': 'Gardening',
};

export default function MatchingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [matchState, setMatchState] = useState<'searching' | 'results' | 'no_workers' | 'declined'>('searching');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [retryCount, setRetryCount] = useState(0);

  // Animation values for the 5 worker cards
  const [cardAnims] = useState(() => [...Array(5)].map(() => new Animated.Value(0)));

  const { workers } = useWorkerStore();
  const currentDraft = useDraftStore(state => state.currentDraft);
  
  const [matchedWorkers, setMatchedWorkers] = useState<WorkerProfile[]>([]);
  const [declinedWorkers, setDeclinedWorkers] = useState<string[]>([]);
  const [declinedName, setDeclinedName] = useState('');

  useEffect(() => {
    if (matchState === 'searching') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
        ])
      ).start();

      // Determine requested category
      const requestedCatName = currentDraft.categoryId ? CATEGORY_MAP[currentDraft.categoryId] : 'Plumbing';

      // Find top 5 matches excluding declined workers
      const matches = workers
        .filter(w => w.category === requestedCatName && !declinedWorkers.includes(w.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      setMatchedWorkers(matches);

      const timer = setTimeout(() => {
        if (matches.length === 0) {
          setMatchState('no_workers');
        } else {
          setMatchState('results');
          // Trigger stagger animation for the cards
          Animated.stagger(150, 
            matches.map((_, i) => 
              Animated.spring(cardAnims[i], {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
              })
            )
          ).start();
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [matchState, pulseAnim, currentDraft, workers, cardAnims, declinedWorkers]);

  const handleHire = (workerId: string) => {
    // Simulate Worker Decline on specific mock workers for demo
    // The node script generated IDs like w1, w2, etc. We will make 'w2' and 'w3' decline.
    if (workerId === 'w2' || workerId === 'w3') {
      const worker = workers.find(w => w.id === workerId);
      setDeclinedName(worker ? worker.name : 'Worker');
      setMatchState('declined');
    } else {
      router.push(`/tracking/${workerId}` as any);
    }
  };

  const renderNoWorkers = () => (
    <View style={styles.errorContainer}>
      <AlertCircle color={theme.colors.error} size={64} style={{ marginBottom: theme.spacing.lg }} />
      <Text style={[theme.typography.h3, { marginBottom: theme.spacing.md }]}>No Workers Available</Text>
      <Text style={[theme.typography.body1, { textAlign: 'center', color: theme.colors.textSecondary, marginBottom: theme.spacing.xxxl }]}>
        All nearby professionals are currently busy. Would you like to expand the search radius or try scheduling for later?
      </Text>
      <Button 
        title="Retry Search" 
        onPress={() => { setRetryCount(1); setMatchState('searching'); }} 
        style={{ marginBottom: theme.spacing.md }} 
        fullWidth
      />
      <Button 
        title="Schedule for Later" 
        variant="outlined"
        onPress={() => router.back()} 
        fullWidth
      />
    </View>
  );

  const renderDeclined = () => (
    <View style={styles.errorContainer}>
      <AlertCircle color={theme.colors.warning} size={64} style={{ marginBottom: theme.spacing.lg }} />
      <Text style={[theme.typography.h3, { marginBottom: theme.spacing.md }]}>Worker Unavailable</Text>
      <Text style={[theme.typography.body1, { textAlign: 'center', color: theme.colors.textSecondary, marginBottom: theme.spacing.xxxl }]}>
        {declinedName} is unable to take the job right now. We are finding you another top-rated professional.
      </Text>
      <Button 
        title="Find Another Match" 
        onPress={() => {
          // Add to declined list so they are filtered out
          const declinedWorker = workers.find(w => w.name === declinedName);
          if (declinedWorker) {
            setDeclinedWorkers(prev => [...prev, declinedWorker.id]);
          }
          setMatchState('searching'); // Restart radar
        }} 
        fullWidth
      />
    </View>
  );

  return (
    <Screen safeArea>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>AI Matching</Text>
        <View style={{ width: 40 }} />
      </View>

      {matchState === 'searching' && (
        <View style={styles.searchingContainer}>
          <Image 
            source={require('../../assets/map-bg.png')} 
            style={[StyleSheet.absoluteFillObject, { opacity: 0.4 }]} 
            contentFit="cover" 
          />
          <View style={styles.radarWrapper}>
            <Animated.View style={[styles.radarCenter, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.radarCenterSolid}>
              <MapPin color={theme.colors.surface} size={32} />
            </View>
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.textBackground}>
              <Text style={[theme.typography.h3, { textAlign: 'center' }]}>Broadcasting Request...</Text>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: 'center' }]}>
                Finding the best available plumbers near you based on AI compatibility.
              </Text>
            </View>
          </View>
        </View>
      )}

      {matchState === 'no_workers' && renderNoWorkers()}
      {matchState === 'declined' && renderDeclined()}

      {matchState === 'results' && (
        <View style={styles.resultsContainer}>
          <Text style={[theme.typography.h3, { marginBottom: theme.spacing.md }]}>Top AI Matches</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {matchedWorkers.map((worker, index) => {
              const animValue = cardAnims[index];
              const translateY = animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0] // Start 50px below and slide up
              });

              return (
                <Animated.View 
                  key={worker.id} 
                  style={[
                    styles.workerCard, 
                    { 
                      opacity: animValue, 
                      transform: [{ translateY }] 
                    }
                  ]}
                >
                  <TouchableOpacity style={styles.workerHeader} onPress={() => router.push(`/worker/${worker.id}` as any)}>
                    <Image source={worker.avatar} style={styles.avatarPlaceholder} contentFit="cover" />
                    <View style={styles.workerInfo}>
                      <Text style={theme.typography.h4}>{worker.name}</Text>
                      <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{worker.skill}</Text>
                    </View>
                    <View style={styles.matchBadge}>
                      <Text style={[theme.typography.caption, { color: theme.colors.surface, fontWeight: '700' }]}>Top Match</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.workerStats}>
                    <View style={styles.stat}>
                      <Star color={theme.colors.warning} size={16} fill={theme.colors.warning} />
                      <Text style={[theme.typography.label, { marginLeft: 4 }]}>{worker.rating}</Text>
                    </View>
                    <Text style={{ color: theme.colors.border }}>|</Text>
                    <View style={styles.stat}>
                      <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>{worker.distance} away</Text>
                    </View>
                    <Text style={{ color: theme.colors.border }}>|</Text>
                    <View style={styles.stat}>
                      <Text style={[theme.typography.label, { color: theme.colors.primary }]}>{worker.price.split(' ')[0]}/hr</Text>
                    </View>
                  </View>

                  <View style={styles.workerActions}>
                    <Button 
                      title="Profile" 
                      variant="outlined" 
                      style={{ flex: 1, marginRight: theme.spacing.xs, paddingVertical: 8 }} 
                      textStyle={{ fontSize: 12 }}
                      onPress={() => router.push(`/worker/${worker.id}` as any)}
                    />
                    <Button 
                      title="Message" 
                      variant="outlined" 
                      style={{ flex: 1, marginRight: theme.spacing.xs, paddingVertical: 8 }} 
                      textStyle={{ fontSize: 12 }}
                      onPress={() => router.push(`/user-messages/chat?id=${worker.id}` as any)}
                    />
                    <Button 
                      title="Hire Now" 
                      style={{ flex: 1, paddingVertical: 8 }} 
                      textStyle={{ fontSize: 12 }}
                      onPress={() => handleHire(worker.id)} 
                    />
                  </View>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  searchingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  radarWrapper: { justifyContent: 'center', alignItems: 'center', width: 120, height: 120 },
  radarCenter: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: `${theme.colors.primary}30` },
  radarCenterSolid: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  textContainer: { position: 'absolute', bottom: 80, left: 20, right: 20, alignItems: 'center' },
  textBackground: { backgroundColor: 'rgba(255,255,255,0.9)', padding: theme.spacing.lg, borderRadius: theme.radius.lg, alignItems: 'center', width: '100%' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xl },
  resultsContainer: { flex: 1, paddingVertical: theme.spacing.md },
  workerCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, ...theme.shadows.md },
  workerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.border, marginRight: theme.spacing.md },
  workerInfo: { flex: 1 },
  matchBadge: { backgroundColor: theme.colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.sm },
  workerStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.background, padding: theme.spacing.sm, borderRadius: theme.radius.md, marginBottom: theme.spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center' },
  workerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.xs },
  compareBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.borderLight },
});
