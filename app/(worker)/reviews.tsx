import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReviewsTab } from '@/components/ReviewsTab';
import { SearchBar } from '@/components/SearchBar';
import { workerReviews } from '@/constants/workerMockData';

export default function WorkerReviewsScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return workerReviews;
    const q = searchQuery.toLowerCase();
    return workerReviews.filter(
      (r) =>
        r.author.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.serviceType.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ReviewsTab
        reviews={filteredReviews}
        headerComponent={
          <View>
            <PageHeader title="My Reviews" from={from} />
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search reviews..."
              style={styles.searchBar}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchBar: { marginBottom: theme.spacing.md, marginHorizontal: theme.layout.screenPadding * 2 },
});
