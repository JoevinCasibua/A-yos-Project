import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReviewsTab } from '@/components/ReviewsTab';
import { SearchBar } from '@/components/SearchBar';
import { workerReviews } from '@/constants/workerMockData';

export default function WorkerReviewsScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
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
    <Screen safeArea style={{ paddingBottom: 0 }}>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: { marginBottom: theme.spacing.md, marginHorizontal: theme.layout.screenPadding },
});
