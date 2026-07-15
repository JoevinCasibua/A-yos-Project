import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, ScrollView } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { SearchBar } from '@/components/SearchBar';
import { Chip } from '@/components/Chip';
import { ProviderCard, ProviderData } from '@/components/ProviderCard';
import { providers } from '@/constants/mockData';

const filters = ['All', 'Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Repair'];
const sortOptions = ['Nearest', 'Top Rated', 'Price: Low to High'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Nearest');

  const filteredProviders = useMemo(() => {
    let result = [...providers];

    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (activeFilter !== 'All') {
      result = result.filter((p) =>
        p.category.toLowerCase().includes(activeFilter.toLowerCase()),
      );
    }

    if (sortBy === 'Top Rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => parseInt(a.price || '0') - parseInt(b.price || '0'));
    }

    return result;
  }, [query, activeFilter, sortBy]);

  const handleProviderPress = useCallback((id: string) => {
    router.push(`/provider/${id}`);
  }, []);

  const renderItem: ListRenderItem<ProviderData> = useCallback(
    ({ item }) => (
      <ProviderCard
        provider={item}
        onPress={() => handleProviderPress(item.id)}
      />
    ),
    [handleProviderPress],
  );

  const keyExtractor = useCallback((item: ProviderData) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2" weight="bold" style={{ marginBottom: Spacing['4'] }}>
          Browse
        </AppText>
        <View style={styles.searchRow}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search providers..."
            style={{ flex: 1 }}
          />
          <View style={styles.filterBtn}>
            <SlidersHorizontal size={20} color={Colors.cta} strokeWidth={2} />
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((f) => (
            <Chip
              key={f}
              label={f}
              selected={activeFilter === f}
              onPress={() => setActiveFilter(f)}
            />
          ))}
        </ScrollView>

        {/* Sort */}
        <View style={styles.sortRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            {filteredProviders.length} providers found
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortChips}
          >
            {sortOptions.map((s) => (
              <Chip
                key={s}
                label={s}
                size="sm"
                selected={sortBy === s}
                onPress={() => setSortBy(s)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={filteredProviders}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing['3'] }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText variant="body" weight="semiBold" align="center">
              No providers found
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing['1'] }}>
              Try adjusting your search or filters
            </AppText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['16'],
    paddingBottom: Spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primaryBorder,
  },
  filterRow: {
    gap: Spacing['2'],
    marginTop: Spacing['3'],
    paddingRight: Spacing['4'],
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing['3'],
  },
  sortChips: {
    gap: Spacing['2'],
    paddingLeft: Spacing['3'],
  },
  listContent: {
    padding: Spacing['4'],
    paddingBottom: 100,
  },
  emptyState: {
    paddingVertical: Spacing['12'],
    alignItems: 'center',
  },
});
