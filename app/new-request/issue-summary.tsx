import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Bot, CheckCircle, AlertTriangle, ChevronLeft } from 'lucide-react-native';
import { Colors, Layout, Spacing } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { AppCard } from '@/components/AppCard';
import { Chip } from '@/components/Chip';
import { useRequest } from '@/context/RequestContext';

export default function AISummaryScreen() {
  const router = useRouter();
  const { request, updateRequest } = useRequest();
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [editableSummary, setEditableSummary] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    // Simulate AI API call
    const timer = setTimeout(() => {
      // Dummy response based on context (ideally using real vision model)
      const mockSummary = request.description
        ? `Detected: ${request.description}. Requires moderate repair work.`
        : 'Plumbing leak detected under the sink. Moderate water damage visible.';
      
      const mockRecs = request.category ? [request.category, 'Tools required'] : ['Plumbing', 'Wrench needed'];
      const mockConfidence = 92;

      setEditableSummary(mockSummary);
      setRecommendations(mockRecs);
      setConfidence(mockConfidence);
      setIsAnalyzing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [request.description, request.category]);

  const handleNext = () => {
    updateRequest({
      aiSummary: editableSummary,
      aiRecommendations: recommendations,
      confidenceScore: confidence,
    });
    router.push('/new-request/urgency' as any);
  };

  if (isAnalyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <AppText variant="h3" style={{ marginTop: Spacing[4], textAlign: 'center' }}>
          Analyzing your issue...
        </AppText>
        <AppText variant="body" style={{ color: Colors.textSecondary, marginTop: Spacing[2], textAlign: 'center' }}>
          Our AI is reviewing your photos and description to find the right fix.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Issue Summary</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <AppCard style={styles.card}>
          <View style={styles.headerRow}>
            <Bot size={24} color={Colors.primary} />
            <AppText variant="h3" style={styles.cardTitle}>AI Assessment</AppText>
            <View style={styles.confidenceBadge}>
              <CheckCircle size={14} color={Colors.success} />
              <AppText variant="caption" style={styles.confidenceText}>
                {confidence}% match
              </AppText>
            </View>
          </View>

          <AppText variant="body" style={styles.label}>Generated Summary (Editable)</AppText>
          <AppInput
            value={editableSummary}
            onChangeText={setEditableSummary}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <AppText variant="body" style={styles.label}>AI Recommendations</AppText>
          <View style={styles.chipContainer}>
            {recommendations.map((rec, index) => (
              <Chip key={index} label={rec} style={styles.chip} />
            ))}
          </View>
          
          <View style={styles.disclaimerRow}>
            <AlertTriangle size={16} color={Colors.warning} />
            <AppText variant="caption" style={styles.disclaimerText}>
              Review the summary above. You can edit it to provide more accurate details to workers.
            </AppText>
          </View>
        </AppCard>

      </ScrollView>

      <View style={styles.footer}>
        <AppButton 
          label="Continue" 
          onPress={handleNext} 
          disabled={editableSummary.trim().length === 0}
        />
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
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.screenPadding,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Layout.screenPadding,
  },
  card: {
    padding: Layout.cardPadding,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  cardTitle: {
    flex: 1,
    marginLeft: Spacing[2],
    fontWeight: '600',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  confidenceText: {
    color: Colors.success,
    fontWeight: '600',
  },
  label: {
    fontWeight: '500',
    marginBottom: Spacing[2],
    marginTop: Spacing[4],
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    backgroundColor: Colors.surfaceLight,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningBg,
    padding: Spacing[3],
    borderRadius: 8,
    marginTop: Spacing[5],
    gap: Spacing[2],
  },
  disclaimerText: {
    flex: 1,
    color: Colors.warning,
    lineHeight: 18,
  },
  footer: {
    padding: Layout.screenPadding,
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
