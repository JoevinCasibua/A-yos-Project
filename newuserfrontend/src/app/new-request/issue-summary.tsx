import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { ArrowLeft, Sparkles, CheckCircle2, MapPin, Calendar, Clock, DollarSign, PenTool, AlertTriangle, ShieldAlert } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDraftStore } from '../../store/useDraftStore';

export default function IssueSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [analyzing, setAnalyzing] = useState(true);
  const saveDraft = useDraftStore(state => state.saveDraft);
  const currentDraft = useDraftStore(state => state.currentDraft);

  const AI_KNOWLEDGE: Record<string, any> = {
    '1': { name: 'Plumbing', iconName: 'Droplets', color: '#0ea5e9', bg: '#e0f2fe', urgency: 'High - Immediate attention recommended', cause: 'Deteriorated seal or cracked pipe.', advice: 'Please place a bucket under the leak and avoid using the water source.' },
    '2': { name: 'Electrical', iconName: 'Zap', color: '#f59e0b', bg: '#fef3c7', urgency: 'Critical - Fire hazard', cause: 'Faulty wiring or overloaded circuit.', advice: 'Turn off the main breaker for this area immediately. Do not touch exposed wires.' },
    '3': { name: 'Carpentry', iconName: 'Wrench', color: '#10b981', bg: '#d1fae5', urgency: 'Low - Aesthetic or minor functional issue', cause: 'Wear and tear or loose hinges.', advice: 'Avoid placing heavy loads on the affected structure until repaired.' },
    '4': { name: 'Cleaning', iconName: 'Sparkles', color: '#06b6d4', bg: '#cffafe', urgency: 'Low - Routine maintenance', cause: 'Accumulated dirt or grime.', advice: 'Clear the area of personal items before the cleaners arrive.' },
    '5': { name: 'Appliance', iconName: 'Monitor', color: '#6366f1', bg: '#e0e7ff', urgency: 'Medium - Functional impairment', cause: 'Worn out belt, motor issue, or faulty sensor.', advice: 'Unplug the appliance to prevent further electrical damage.' },
    '6': { name: 'AC Repair', iconName: 'Fan', color: '#3b82f6', bg: '#dbeafe', urgency: 'Medium - Comfort issue', cause: 'Clogged filters or low refrigerant.', advice: 'Turn off the AC unit to prevent the compressor from overheating.' },
    '7': { name: 'Painting', iconName: 'Paintbrush', color: '#8b5cf6', bg: '#ede9fe', urgency: 'Low - Aesthetic improvement', cause: 'Fading, peeling, or new design choice.', advice: 'Ensure the room is well-ventilated and cover furniture.' },
    '8': { name: 'Gardening', iconName: 'Shovel', color: '#22c55e', bg: '#dcfce7', urgency: 'Low - Outdoor maintenance', cause: 'Overgrown weeds or landscaping needs.', advice: 'Ensure pets are kept inside while gardening tools are in use.' },
  };

  const aiData = currentDraft.categoryId ? AI_KNOWLEDGE[currentDraft.categoryId] : AI_KNOWLEDGE['1'];

  const handleSaveDraft = () => {
    saveDraft({
      category: aiData.name,
      iconName: aiData.iconName,
      color: aiData.color,
      bg: aiData.bg
    });
    router.push('/drafts' as any);
  };

  // Simulate AI Analysis delay
  React.useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Screen safeArea scrollable>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Summary</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {analyzing ? (
          <View style={styles.analyzingContainer}>
            <Sparkles color={theme.colors.primary} size={48} style={styles.sparkleIcon} />
            <Text style={[theme.typography.h3, { marginBottom: theme.spacing.sm }]}>Analyzing your request...</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xl }]}>
              Our AI is reviewing your description and photos to determine the best approach and estimate costs.
            </Text>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <View style={styles.summaryContainer}>
            <View style={styles.successHeader}>
              <CheckCircle2 color={theme.colors.success} size={48} />
              <Text style={[theme.typography.h2, { marginTop: theme.spacing.md }]}>Analysis Complete</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={theme.typography.h4}>Request Draft</Text>
                <TouchableOpacity onPress={() => router.replace('/new-request/create')} style={styles.editBtn}>
                  <PenTool color={theme.colors.primary} size={20} />
                </TouchableOpacity>
              </View>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Urgency</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
                <AlertTriangle color={aiData.urgency.includes('Critical') ? theme.colors.error : theme.colors.warning} size={16} />
                <Text style={[theme.typography.body1, { marginLeft: 6, color: aiData.urgency.includes('Critical') ? theme.colors.error : theme.colors.warning }]}>{aiData.urgency}</Text>
              </View>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Possible Cause</Text>
              <Text style={[theme.typography.body1, { marginBottom: theme.spacing.md }]}>{aiData.cause}</Text>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Suggested Service Category</Text>
              <Text style={[theme.typography.body1, { marginBottom: theme.spacing.md, color: aiData.color, fontWeight: 'bold' }]}>{aiData.name}</Text>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Service Location</Text>
              <Text style={[theme.typography.body1, { marginBottom: theme.spacing.md }]}>{currentDraft.address}</Text>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Preferred Schedule</Text>
              <Text style={[theme.typography.body1, { marginBottom: theme.spacing.md }]}>{currentDraft.schedule || 'As soon as possible'}</Text>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Estimated Cost / Budget</Text>
              <Text style={[theme.typography.body1, { marginBottom: theme.spacing.md }]}>{currentDraft.budget ? `₱${currentDraft.budget}` : '₱500 - ₱1,500 (AI Estimate)'}</Text>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Safety Advice</Text>
              <View style={styles.safetyBox}>
                <ShieldAlert color={theme.colors.error} size={20} />
                <Text style={[theme.typography.caption, { color: theme.colors.error, marginLeft: 8, flex: 1 }]}>
                  {aiData.advice}
                </Text>
              </View>
            </View>

          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue to AI Matching" 
          onPress={() => router.push('/new-request/matching')} 
          disabled={analyzing}
          fullWidth 
          style={{ marginBottom: theme.spacing.sm }}
        />
        <Button 
          title="Save Draft and Continue Later" 
          variant="outlined"
          onPress={handleSaveDraft} 
          disabled={analyzing}
          fullWidth 
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingVertical: theme.spacing.xl, justifyContent: 'center' },
  analyzingContainer: { alignItems: 'center', paddingHorizontal: theme.spacing.xl },
  sparkleIcon: { marginBottom: theme.spacing.lg },
  summaryContainer: { flex: 1, justifyContent: 'flex-start' },
  successHeader: { alignItems: 'center', marginBottom: theme.spacing.xxl },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, ...theme.shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight, paddingBottom: theme.spacing.sm },
  editBtn: { padding: 4 },
  safetyBox: { flexDirection: 'row', backgroundColor: `${theme.colors.error}10`, padding: theme.spacing.md, borderRadius: theme.radius.md, alignItems: 'center' },
  footer: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
});
