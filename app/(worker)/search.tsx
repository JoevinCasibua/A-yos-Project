import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Pressable, Alert } from 'react-native';
import { MapPin, DollarSign } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { SearchBar } from '@/components/SearchBar';
import { Chip } from '@/components/Chip';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { workerJobs } from '@/constants/workerMockData';
import type { JobOpportunity } from '@/constants/workerMockData';

const filterOptions = ['All', 'Urgent', 'Nearby', 'High Pay'];
const sortOptions = ['Nearest', 'Highest Pay', 'Most Recent'];

export default function WorkerBrowseScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Nearest');

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

  const handleAcceptJob = useCallback((job: JobOpportunity) => {
    Alert.alert('Accept Job', `Accept ${job.service} from ${job.customerName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: () => Alert.alert('Accepted', 'Job added to your bookings.') },
    ]);
  }, []);

  const renderItem: ListRenderItem<JobOpportunity> = useCallback(
    ({ item }) => (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Avatar uri={item.customerAvatar} size={44} />
          <View style={styles.jobInfo}>
            <View style={styles.nameRow}>
              <AppText variant="body" weight="semiBold">{item.customerName}</AppText>
              {item.urgency === 'urgent' && <Badge label="Urgent" variant="error" />}
            </View>
            <AppText variant="caption" color={Colors.textSecondary}>{item.postedTime}</AppText>
          </View>
        </View>
        <AppText variant="body" weight="semiBold" color={Colors.cta} style={{ marginTop: Spacing['3'] }}>
          {item.service}
        </AppText>
        <AppText variant="bodySm" color={Colors.textSecondary} style={{ marginTop: Spacing['2'], lineHeight: 20 }}>
          {item.description}
        </AppText>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <MapPin size={14} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary}>{item.distance} · {item.location}</AppText>
          </View>
          <View style={styles.metaItem}>
            <DollarSign size={14} color={Colors.cta} />
            <AppText variant="bodySm" weight="bold" color={Colors.cta}>{item.offeredPrice}</AppText>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [styles.acceptBtn, { opacity: pressed ? 0.8 : 1 }]}
          onPress={() => handleAcceptJob(item)}
        >
          <AppText variant="button" color={Colors.white}>Accept Job</AppText>
        </Pressable>
      </View>
    ),
    [handleAcceptJob],
  );

  const keyExtractor = useCallback((item: JobOpportunity) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h2" weight="bold">Browse Jobs</AppText>
      </View>
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
              style={{ marginTop: Spacing['3'] }}
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
                  color={Colors.info}
                />
              )}
              keyExtractor={(item) => item}
            />
            <AppText variant="bodySm" color={Colors.textSecondary} style={{ marginTop: Spacing['3'] }}>
              {filteredJobs.length} jobs available
            </AppText>
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
  chipRow: { gap: Spacing['2'], marginTop: Spacing['3'] },
  jobCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    ...Elevation.sm,
  },
  jobHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing['3'] },
  jobInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] },
  jobMeta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing['3'], paddingTop: Spacing['3'],
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  acceptBtn: {
    backgroundColor: Colors.cta, borderRadius: Radius.lg,
    paddingVertical: Spacing['3'], alignItems: 'center', marginTop: Spacing['3'],
  },
});
