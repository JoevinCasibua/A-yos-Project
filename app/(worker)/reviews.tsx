import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { ReviewsTab } from '@/components/ReviewsTab';
import { workerReviews } from '@/constants/workerMockData';

export default function WorkerReviewsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>My Reviews</Text>
      </View>
      <ReviewsTab reviews={workerReviews} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
});
