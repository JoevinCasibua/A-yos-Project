import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { ArrowLeft, Phone, MessageSquare, MapPin, CheckCircle2, Circle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TIMELINE_STEPS = [
  { id: '1', title: 'Provider Accepted', subtitle: '10:00 AM' },
  { id: '2', title: 'Preparing tools', subtitle: '10:05 AM' },
  { id: '3', title: 'En Route', subtitle: '10:15 AM - Provider is on the way' },
  { id: '4', title: 'Arrived', subtitle: 'Provider has arrived at the location' },
  { id: '5', title: 'In Progress', subtitle: 'Service has started' },
  { id: '6', title: 'Completed', subtitle: 'Service finished' },
];

export default function TrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(2); // Mock: Currently En Route

  const handleComplete = () => {
    // In a real app, this would be updated via backend websocket
    router.push(`/payment/${id}`);
  };

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
        {/* Mock Map Area */}
        <View style={styles.mapContainer}>
          <View style={styles.mockMap}>
            <MapPin color={theme.colors.error} size={32} style={styles.mapIcon} />
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
              Map tracking will be displayed here
            </Text>
          </View>
          
          <View style={styles.etaBadge}>
            <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>15 Min</Text>
            <Text style={theme.typography.caption}>ETA</Text>
          </View>
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
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
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

      <View style={styles.footer}>
        <Button 
          title="Simulate Job Completion" 
          onPress={handleComplete} 
          fullWidth 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1 },
  mapContainer: { height: 250, position: 'relative' },
  mockMap: { flex: 1, backgroundColor: theme.colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  mapIcon: { opacity: 0.5 },
  etaBadge: { position: 'absolute', bottom: theme.spacing.md, right: theme.spacing.md, backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.radius.lg, alignItems: 'center', ...theme.shadows.md },
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
