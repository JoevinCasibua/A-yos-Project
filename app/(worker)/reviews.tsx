import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Pressable } from 'react-native';
import { Star, ThumbsUp } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { RatingStars } from '@/components/RatingStars';
import { Chip } from '@/components/Chip';

interface WorkerReview {
  id: string;
  author: string;
  avatarUri: string;
  rating: number;
  date: string;
  comment: string;
  serviceType: string;
}

const mockWorkerReviews: WorkerReview[] = [
  {
    id: '1',
    author: 'Alex Johnson',
    avatarUri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '2 days ago',
    comment: 'Carlos was incredibly professional and fixed our leaking pipe in under an hour. He explained everything clearly and the price was fair. Highly recommend!',
    serviceType: 'Pipe Repair',
  },
  {
    id: '2',
    author: 'Sarah Williams',
    avatarUri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '1 week ago',
    comment: 'Arrived on time, was very courteous, and completed the job efficiently. Will definitely book again for future plumbing needs.',
    serviceType: 'Drain Cleaning',
  },
  {
    id: '3',
    author: 'Michael Brown',
    avatarUri: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Good service overall. Took a bit longer than expected but the quality of work was excellent. Fair pricing.',
    serviceType: 'Faucet Installation',
  },
  {
    id: '4',
    author: 'Emily Davis',
    avatarUri: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Best plumber I have hired through the app. Very knowledgeable and friendly. The booking process was seamless.',
    serviceType: 'Water Heater Repair',
  },
];

const filterOptions = ['All', '5 Stars', '4 Stars', '3 Stars', 'Recent'];

export default function WorkerReviewsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'All') return mockWorkerReviews;
    if (activeFilter === '5 Stars') return mockWorkerReviews.filter((r) => r.rating === 5);
    if (activeFilter === '4 Stars') return mockWorkerReviews.filter((r) => r.rating === 4);
    if (activeFilter === '3 Stars') return mockWorkerReviews.filter((r) => r.rating === 3);
    if (activeFilter === 'Recent') return [...mockWorkerReviews].sort((a, b) => a.date.localeCompare(b.date));
    return mockWorkerReviews;
  }, [activeFilter]);

  const avgRating = useMemo(() => {
    const total = mockWorkerReviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / mockWorkerReviews.length).toFixed(1);
  }, []);

  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockWorkerReviews.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });
    return dist;
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLikedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const renderItem: ListRenderItem<WorkerReview> = useCallback(
    ({ item }) => (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Avatar uri={item.avatarUri} size={40} />
          <View style={styles.reviewInfo}>
            <AppText variant="bodySm" weight="semiBold">{item.author}</AppText>
            <View style={styles.metaRow}>
              <RatingStars rating={item.rating} size={13} />
              <AppText variant="caption" color={Colors.textTertiary}>· {item.date}</AppText>
            </View>
          </View>
          <View style={styles.serviceTag}>
            <AppText variant="caption" weight="semiBold" color={Colors.cta}>{item.serviceType}</AppText>
          </View>
        </View>
        <AppText variant="bodySm" color={Colors.textSecondary} style={{ marginTop: Spacing['3'], lineHeight: 22 }}>
          {item.comment}
        </AppText>
        <View style={styles.reviewFooter}>
          <Pressable
            onPress={() => toggleLike(item.id)}
            style={styles.likeBtn}
            hitSlop={8}
          >
            <ThumbsUp size={14} color={likedReviews.has(item.id) ? Colors.cta : Colors.textTertiary} fill={likedReviews.has(item.id) ? Colors.cta : 'transparent'} strokeWidth={2} />
            <AppText variant="caption" weight="medium" color={likedReviews.has(item.id) ? Colors.cta : Colors.textTertiary}>
              Helpful {likedReviews.has(item.id) ? '1' : ''}
            </AppText>
          </Pressable>
        </View>
      </View>
    ),
    [likedReviews, toggleLike],
  );

  const keyExtractor = useCallback((item: WorkerReview) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h2" weight="bold">My Reviews</AppText>
      </View>
      <FlatList
        data={filteredReviews}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing['3'] }} />}
        ListHeaderComponent={
          <View>
            {/* Rating Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryLeft}>
                <AppText variant="h1" weight="bold" color={Colors.cta}>{avgRating}</AppText>
                <RatingStars rating={parseFloat(avgRating)} size={16} />
                <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: Spacing['1'] }}>
                  {mockWorkerReviews.length} reviews
                </AppText>
              </View>
              <View style={styles.summaryRight}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <View key={star} style={styles.distRow}>
                    <AppText variant="caption" color={Colors.textSecondary} style={{ width: 24 }}>{star}</AppText>
                    <Star size={12} color={Colors.star} fill={Colors.star} strokeWidth={0} />
                    <View style={styles.distBar}>
                      <View style={[
                        styles.distFill,
                        {
                          width: `${(ratingDistribution[star] / mockWorkerReviews.length) * 100}%`,
                          backgroundColor: Colors.cta,
                        },
                      ]} />
                    </View>
                    <AppText variant="caption" color={Colors.textTertiary} style={{ width: 24 }}>{ratingDistribution[star]}</AppText>
                  </View>
                ))}
              </View>
            </View>

            {/* Filter */}
            <View style={styles.filterRow}>
              {filterOptions.map((f) => (
                <Chip
                  key={f}
                  label={f}
                  selected={activeFilter === f}
                  onPress={() => setActiveFilter(f)}
                  size="sm"
                />
              ))}
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white, paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['16'], paddingBottom: Spacing['3'],
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  listContent: { padding: Spacing['4'], paddingBottom: 100 },
  summaryCard: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing['5'], gap: Spacing['6'], ...Elevation.sm,
  },
  summaryLeft: { alignItems: 'center', justifyContent: 'center' },
  summaryRight: { flex: 1, gap: Spacing['1'] },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['1'] },
  distBar: { flex: 1, height: 6, backgroundColor: Colors.borderLight, borderRadius: Radius.full, overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: Radius.full },
  filterRow: { flexDirection: 'row', gap: Spacing['2'], marginTop: Spacing['4'], flexWrap: 'wrap' },
  reviewCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    ...Elevation.sm,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing['3'] },
  reviewInfo: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'], marginTop: 2 },
  serviceTag: {
    backgroundColor: Colors.primarySurface, paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'], borderRadius: Radius.full,
  },
  reviewFooter: { flexDirection: 'row', marginTop: Spacing['3'], paddingTop: Spacing['3'], borderTopWidth: 1, borderTopColor: Colors.borderLight },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] },
});
