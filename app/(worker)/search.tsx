import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Alert } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { SearchBar } from '@/components/SearchBar';
import { Chip } from '@/components/Chip';
import { JobPostCard } from '@/components/JobPostCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { workerJobs, jobComments as initialJobComments } from '@/constants/workerMockData';
import type { JobOpportunity, JobComment } from '@/constants/workerMockData';

const filterOptions = ['All', 'Urgent', 'Nearby', 'High Pay'];
const sortOptions = ['Nearest', 'Highest Pay', 'Most Recent'];

export default function WorkerBrowseScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Nearest');
  const [commentSortNewest, setCommentSortNewest] = useState(true);
  const [allComments, setAllComments] = useState<Record<string, JobComment[]>>(() => {
    const grouped: Record<string, JobComment[]> = {};
    initialJobComments.forEach((c) => {
      if (!grouped[c.jobId]) grouped[c.jobId] = [];
      grouped[c.jobId].push(c);
    });
    return grouped;
  });

  const filteredJobs = useMemo(() => {
    let result = [...workerJobs];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (j) => j.customerName.toLowerCase().includes(q) || j.service.toLowerCase().includes(q) || j.description.toLowerCase().includes(q),
      );
    }

    if (activeFilter === 'Urgent') result = result.filter((j) => j.urgency === 'urgent');
    if (activeFilter === 'Nearby') result = result.filter((j) => parseFloat(j.distance) <= 1.5);
    if (activeFilter === 'High Pay') result = result.filter((j) => parseInt(j.offeredPrice.replace('$', '')) >= 100);

    if (sortBy === 'Highest Pay') result.sort((a, b) => parseInt(b.offeredPrice.replace('$', '')) - parseInt(a.offeredPrice.replace('$', '')));
    if (sortBy === 'Most Recent') result.sort((a, b) => a.postedTime.localeCompare(b.postedTime));

    return result;
  }, [query, activeFilter, sortBy]);

  const handleComment = useCallback((jobId: string, text: string, offerMin: string, offerMax: string) => {
    const newComment: JobComment = {
      id: `c${Date.now()}`,
      jobId,
      author: 'You',
      avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
      text,
      offerMin: offerMin ? `$${offerMin}` : undefined,
      offerMax: offerMax ? `$${offerMax}` : undefined,
      postedTime: 'Just now',
    };
    setAllComments((prev) => ({
      ...prev,
      [jobId]: [newComment, ...(prev[jobId] || [])],
    }));
  }, []);

  const handleShare = useCallback((jobId: string) => {
    Alert.alert('Coming Soon', 'Share functionality will be available soon.');
  }, []);

  const renderItem: ListRenderItem<JobOpportunity> = useCallback(
    ({ item }) => (
      <JobPostCard
        job={item}
        comments={allComments[item.id] || []}
        sortNewest={commentSortNewest}
        onToggleSort={() => setCommentSortNewest(!commentSortNewest)}
        onComment={handleComment}
        onShare={handleShare}
      />
    ),
    [allComments, commentSortNewest, handleComment, handleShare],
  );

  const keyExtractor = useCallback((item: JobOpportunity) => item.id, []);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Job Posts" />
      <FlatList
        data={filteredJobs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing['3'] }} />}
        ListHeaderComponent={
          <View>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search jobs..."
              //style={{ marginTop: Spacing['0'] }}
            />
            <FlatList
              data={filterOptions}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={activeFilter === item}
                  onPress={() => setActiveFilter(item)}
                  size="sm"
                />
              )}
              keyExtractor={(item) => item}
            />
            <FlatList
              data={sortOptions}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
              renderItem={({ item }) => (
                <Chip
                  label={item}
                  selected={sortBy === item}
                  onPress={() => setSortBy(item)}
                  size="sm"
                />
              )}
              keyExtractor={(item) => item}
            />
            <AppText variant="bodySm" color={Colors.textSecondary} style={{ marginTop: Spacing['3'], marginBottom: Spacing['4'] }}>
              {filteredJobs.length} posts available
            </AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: Spacing['4'], paddingBottom: 100 },
  chipRow: { gap: Spacing['2'], marginTop: Spacing['3'] },
});
