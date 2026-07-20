import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { theme } from '@/constants/theme';
import { ArrowLeft, Sparkles, CheckCircle2, MapPin, Calendar, Clock, DollarSign, PenTool } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IssueSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [analyzing, setAnalyzing] = useState(true);

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
              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Issue Identified</Text>
              <Text style={[theme.typography.body1, { marginBottom: theme.spacing.md }]}>Leaking P-trap under the kitchen sink.</Text>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Estimated Repair Time</Text>
              <Text style={[theme.typography.body1, { marginBottom: theme.spacing.md }]}>1 - 2 hours</Text>

              <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }]}>Recommended Action</Text>
              <Text style={theme.typography.body1}>Requires replacement of the PVC P-trap assembly and resealing of the drain joint.</Text>
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
  footer: { paddingVertical: theme.spacing.md },
});
