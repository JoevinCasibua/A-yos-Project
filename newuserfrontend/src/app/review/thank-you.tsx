import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { CheckCircle2, Star, Award, Calendar, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useWorkerStore } from '../../store/useWorkerStore';

export default function ReviewThankYouScreen() {
  const router = useRouter();
  const { id, rating } = useLocalSearchParams();
  
  const workerId = (id as string) || 'w1';
  const parsedRating = rating ? parseInt(rating as string, 10) : 5;

  const worker = useWorkerStore(state => state.getWorkerById(workerId)) || {
    id: workerId,
    name: 'Mario Rossi',
    category: 'Plumbing Specialist',
    skill: 'Master Specialist',
    price: '₱670 - ₱1015 / hr',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  };

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Celebration Header */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <CheckCircle2 color={theme.colors.success} size={56} />
          </View>
          <View style={styles.awardBadge}>
            <Award color="#ffffff" size={18} />
          </View>
        </View>

        <Text style={[theme.typography.h2, styles.title]}>Thank You!</Text>
        <Text style={[theme.typography.body1, styles.subtitle]}>
          Your feedback has been submitted. You help maintain quality, trust, and excellence across the A-yos community.
        </Text>

        {/* Worker & Rating Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Image source={worker.avatar} style={styles.avatar} contentFit="cover" />
            <View style={styles.workerDetails}>
              <Text style={theme.typography.h4}>{worker.name}</Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                {worker.category || 'Professional Service'}
              </Text>
              <View style={styles.trustTag}>
                <ShieldCheck color={theme.colors.secondary} size={14} style={{ marginRight: 4 }} />
                <Text style={[theme.typography.caption, { color: theme.colors.secondary, fontWeight: '600' }]}>
                  Verified Provider
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.ratingSection}>
            <Text style={[theme.typography.label, { color: theme.colors.textSecondary, marginBottom: 8 }]}>
              YOUR RATING
            </Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  color={star <= parsedRating ? theme.colors.warning : theme.colors.border}
                  fill={star <= parsedRating ? theme.colors.warning : 'transparent'}
                  style={{ marginHorizontal: 3 }}
                />
              ))}
              <Text style={[theme.typography.h4, { marginLeft: 8, color: theme.colors.textPrimary }]}>
                {parsedRating}.0
              </Text>
            </View>
          </View>
        </View>

        {/* Book Again Recommendation Box */}
        <View style={styles.bookAgainBox}>
          <View style={styles.bookAgainHeader}>
            <View style={styles.calendarIconWrapper}>
              <Calendar color={theme.colors.primary} size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>
                Need more work done?
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                Skip the wait! You can immediately rebook {worker.name} for future projects or recurring maintenance.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookAgainBtn}
            activeOpacity={0.8}
            onPress={() => router.push(`/worker/${worker.id}` as any)}
          >
            <Text style={[theme.typography.button, { color: '#ffffff' }]}>
              Book {worker.name} Again
            </Text>
            <ArrowRight color="#ffffff" size={18} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Alternative Actions */}
        <View style={styles.actions}>
          <Button
            title="Explore Other Services"
            variant="outlined"
            onPress={() => router.push('/search' as any)}
            style={styles.actionBtn}
            fullWidth
          />
          <Button
            title="Back to Home"
            variant="ghost"
            onPress={() => router.replace('/(tabs)' as any)}
            fullWidth
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: theme.spacing.lg,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  awardBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    ...theme.shadows.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    lineHeight: 22,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.borderLight,
  },
  workerDetails: {
    flex: 1,
  },
  trustTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: theme.spacing.md,
  },
  ratingSection: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookAgainBox: {
    width: '100%',
    backgroundColor: '#eff6ff',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  bookAgainHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  calendarIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  bookAgainBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: theme.radius.lg,
    ...theme.shadows.sm,
  },
  actions: {
    width: '100%',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  actionBtn: {
    marginBottom: theme.spacing.sm,
  },
});
