import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { ArrowLeft, MapPin, Star, MessageSquare, AlertCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_WORKERS = [
  { id: '1', name: 'Mario Rossi', skill: 'Plumber', rating: 4.8, distance: '1.2km', confidence: 95, price: '₱800 - 1,000', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Luigi Verdi', skill: 'Plumber', rating: 4.9, distance: '2.5km', confidence: 92, price: '₱900 - 1,200', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Pedro Penduko', skill: 'Master Plumber', rating: 4.7, distance: '3.1km', confidence: 88, price: '₱750 - 950', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop' },
];

export default function MatchingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [matchState, setMatchState] = useState<'searching' | 'results' | 'no_workers' | 'declined'>('searching');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (matchState === 'searching') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
        ])
      ).start();

      const timer = setTimeout(() => {
        // Simulate no workers on first attempt, then success
        if (retryCount === 0) {
          setMatchState('no_workers');
        } else {
          setMatchState('results');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [matchState, pulseAnim, retryCount]);

  const handleHire = (workerId: string) => {
    // Simulate Worker Decline error loop on specific mock worker
    if (workerId === '2') {
      setMatchState('declined');
    } else {
      router.push(`/tracking/${workerId}`);
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
      <Text style={[theme.typography.h3, { marginBottom: theme.spacing.md }]}>Worker Declined</Text>
      <Text style={[theme.typography.body1, { textAlign: 'center', color: theme.colors.textSecondary, marginBottom: theme.spacing.xxxl }]}>
        Luigi Verdi is unable to take the job right now. Please select another recommended worker.
      </Text>
      <Button 
        title="View Other Matches" 
        onPress={() => setMatchState('results')} 
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
          <Animated.View style={[styles.radarCenter, { transform: [{ scale: pulseAnim }] }]} />
          <View style={styles.radarCenterSolid}>
            <MapPin color={theme.colors.surface} size={32} />
          </View>
          <Text style={[theme.typography.h3, { marginTop: theme.spacing.xxxl }]}>Broadcasting Request...</Text>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, textAlign: 'center' }]}>
            Finding the best available plumbers near you based on AI compatibility.
          </Text>
        </View>
      )}

      {matchState === 'no_workers' && renderNoWorkers()}
      {matchState === 'declined' && renderDeclined()}

      {matchState === 'results' && (
        <View style={styles.resultsContainer}>
          <Text style={[theme.typography.h3, { marginBottom: theme.spacing.md }]}>Top AI Matches</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {MOCK_WORKERS.map(worker => (
              <View key={worker.id} style={styles.workerCard}>
                <View style={styles.workerHeader}>
                  <Image source={worker.avatar} style={styles.avatarPlaceholder} contentFit="cover" />
                  <View style={styles.workerInfo}>
                    <Text style={theme.typography.h4}>{worker.name}</Text>
                    <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{worker.skill}</Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={[theme.typography.caption, { color: theme.colors.surface, fontWeight: '700' }]}>{worker.confidence}% Match</Text>
                  </View>
                </View>

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
                    <Text style={[theme.typography.label, { color: theme.colors.primary }]}>{worker.price}</Text>
                  </View>
                </View>

                <View style={styles.workerActions}>
                  <Button 
                    title="Message" 
                    variant="outlined" 
                    icon={MessageSquare} 
                    style={{ flex: 1, marginRight: theme.spacing.sm }} 
                    onPress={() => router.push(`/messages/chat?id=${worker.id}`)}
                  />
                  <Button 
                    title={worker.id === '2' ? "Hire (Will Decline)" : "Hire Now"} 
                    style={{ flex: 1 }} 
                    onPress={() => handleHire(worker.id)} 
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  searchingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xl },
  radarCenter: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: `${theme.colors.primary}30` },
  radarCenterSolid: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xl },
  resultsContainer: { flex: 1, paddingVertical: theme.spacing.md },
  workerCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, ...theme.shadows.md },
  workerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.border, marginRight: theme.spacing.md },
  workerInfo: { flex: 1 },
  matchBadge: { backgroundColor: theme.colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.sm },
  workerStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.background, padding: theme.spacing.sm, borderRadius: theme.radius.md, marginBottom: theme.spacing.md },
  stat: { flexDirection: 'row', alignItems: 'center' },
  workerActions: { flexDirection: 'row', justifyContent: 'space-between' },
});
