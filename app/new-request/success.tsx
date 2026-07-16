import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { Colors, Layout, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { useRequest } from '@/context/RequestContext';
import { showFeatureLocked } from '@/lib/featureLocks';

export default function RequestSuccessScreen() {
  const router = useRouter();
  const { resetRequest } = useRequest();

  const handleViewRequest = () => {
    showFeatureLocked('open_bidding');
  };

  const handleBackToHome = () => {
    resetRequest();
    router.replace('/(tabs)/' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color={Colors.success} strokeWidth={1.5} />
        </View>
        
        <AppText variant="h2" weight="bold" align="center" style={styles.title}>
          Open Bidding Preview
        </AppText>
        
        <AppText variant="body" color={Colors.textSecondary} align="center" style={styles.subtitle}>
          Open Bidding is visible as a future feature, but it is not connected to the MVP backend and no request or bid was created.
        </AppText>

        <View style={styles.statusBox}>
          <AppText variant="h4" weight="bold" align="center" style={styles.statusBoxTitle}>
            Not available in this MVP
          </AppText>
          <View style={styles.stepRow}>
            <View style={styles.stepDot} />
            <AppText variant="bodySm" color={Colors.textSecondary} style={styles.stepText}>No bids or offers are persisted</AppText>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepDot} />
            <AppText variant="bodySm" color={Colors.textSecondary} style={styles.stepText}>Chat message sending is also locked</AppText>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepDot} />
            <AppText variant="bodySm" color={Colors.textSecondary} style={styles.stepText}>Use normal worker recommendations for an MVP booking</AppText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton 
          label="Open Bidding Unavailable" 
          onPress={handleViewRequest} 
          fullWidth
          size="lg"
          style={styles.primaryBtn}
        />
        <AppButton 
          label="Back to Home" 
          onPress={handleBackToHome} 
          variant="ghost"
          fullWidth
          size="lg"
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
  content: {
    flexGrow: 1,
    padding: Layout.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['6'],
  },
  title: {
    marginBottom: Spacing['4'],
  },
  subtitle: {
    marginBottom: Spacing['8'],
    paddingHorizontal: Spacing['2'],
    lineHeight: 22,
  },
  statusBox: {
    backgroundColor: Colors.surfaceCard,
    padding: Spacing['5'],
    borderRadius: Radius.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statusBoxTitle: {
    marginBottom: Spacing['4'],
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['3'],
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryLight,
    marginRight: Spacing['3'],
  },
  stepText: {
    flex: 1,
  },
  footer: {
    padding: Layout.screenPadding,
    backgroundColor: Colors.background,
    gap: Spacing['3'],
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
  },
});
