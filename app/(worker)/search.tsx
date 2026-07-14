import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Pressable } from 'react-native';
import { SlidersHorizontal, MapPin, Clock, DollarSign } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { SearchBar } from '@/components/SearchBar';
import { Chip } from '@/components/Chip';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { RatingStars } from '@/components/RatingStars';

interface JobOpportunity {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  category: string;
  description: string;
  location: string;
  distance: string;
  offeredPrice: string;
  urgency: 'normal' | 'urgent';
  postedTime: string;
}

const mockJobs: JobOpportunity[] = [
  {
    id: '1',
    customerName: 'Alex Johnson',
    customerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Emergency Pipe Repair',
    category: 'Plumbing',
    description: 'Burst pipe in kitchen causing flooding. Need immediate assistance.',
    location: '123 Oak Street',
    distance: '0.8 mi',
    offeredPrice: '$60',
    urgency: 'urgent',
    postedTime: '5 min ago',
  },
  {
    id: '2',
    customerName: 'Sarah Williams',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Water Heater Installation',
    category: 'Plumbing',
    description: 'Need a new 40-gallon water heater installed. Old one removed.',
    location: '456 Pine Avenue',
    distance: '1.2 mi',
    offeredPrice: '$450',
    urgency: 'normal',
    postedTime: '1 hour ago',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Faucet Replacement',
    category: 'Plumbing',
    description: 'Replace kitchen faucet with new model. Already have the faucet.',
    location: '789 Elm Drive',
    distance: '2.1 mi',
    offeredPrice: '$85',
    urgency: 'normal',
    postedTime: '3 hours ago',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Drain Cleaning',
    category: 'Plumbing',
    description: 'Clogged bathroom drain. Water backing up.',
    location: '321 Maple Court',
    distance: '1.5 mi',
    offeredPrice: '$75',
    urgency: 'urgent',
    postedTime: '10 min ago',
  },
];

const filterOptions = ['All', 'Urgent', 'Nearby', 'High Pay'];
const sortOptions = ['Nearest', 'Highest Pay', 'Most Recent'];

export default function WorkerBrowseScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Nearest');

  const filteredJobs = useMemo(() => {
    let result = [...mockJobs];

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
        <Pressable style={({ pressed }) => [styles.acceptBtn, { opacity: pressed ? 0.8 : 1 }]}>
          <AppText variant="button" color={Colors.white}>Accept Job</AppText>
        </Pressable>
      </View>
    ),
    [],
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
