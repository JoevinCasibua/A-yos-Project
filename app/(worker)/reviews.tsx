import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
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
            <View style={styles.header}>
              <Pressable
                style={styles.backButton}
                hitSlop={12}
                onPress={() => {
                  if (from === 'profile') router.push('/(worker)/profile');
                  else router.back();
                }}
              >
                <ChevronLeft size={24} color={theme.colors.textPrimary} />
              </Pressable>
              <Text style={[theme.typography.h2, { flex: 1, marginLeft: theme.spacing.sm }]}>My Reviews</Text>
              <View style={{ width: 40 }} />
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: theme.spacing.md * 2,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: { marginBottom: theme.spacing.md },
});
