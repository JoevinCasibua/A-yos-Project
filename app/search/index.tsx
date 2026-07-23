import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, Search, Filter, Star, MapPin, SlidersHorizontal, ChevronRight, X } from 'lucide-react-native';
import { useWorkerStore, WorkerProfile } from '@/store/useWorkerStore';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/buttons/Button';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'AC Repair'];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { workers, compareList, addToCompare, removeFromCompare } = useWorkerStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Derived filtered & sorted workers
  const filteredWorkers = useMemo(() => {
    let result = workers;

    if (selectedCategory !== 'All') {
      result = result.filter(w => w.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(w => 
        w.name.toLowerCase().includes(q) || 
        w.skill.toLowerCase().includes(q) ||
        w.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Default sort by rating descending for now
    return result.sort((a, b) => b.rating - a.rating);
  }, [workers, searchQuery, selectedCategory]);

  const renderWorkerCard = ({ item }: { item: WorkerProfile }) => {
    const isComparing = compareList.includes(item.id);

    return (
      <TouchableOpacity 
        style={styles.workerCard} 
        onPress={() => router.push(`/worker/${item.id}` as any)}
      >
        <View style={styles.workerHeader}>
          <Image source={item.avatar} style={styles.avatar} contentFit="cover" />
          <View style={styles.workerInfo}>
            <Text style={theme.typography.h4}>{item.name}</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{item.skill}</Text>
          </View>
          <View style={styles.priceTag}>
            <Text style={[theme.typography.caption, { color: theme.colors.primary, fontWeight: '600' }]}>{item.price.split(' ')[0]}/hr</Text>
          </View>
        </View>

        <View style={styles.workerStats}>
          <View style={styles.stat}>
            <Star color={theme.colors.warning} size={14} fill={theme.colors.warning} />
            <Text style={[theme.typography.label, { marginLeft: 4 }]}>{item.rating} ({item.reviewsCount})</Text>
          </View>
          <Text style={{ color: theme.colors.border }}>|</Text>
          <View style={styles.stat}>
            <MapPin color={theme.colors.textSecondary} size={14} />
            <Text style={[theme.typography.label, { marginLeft: 4, color: theme.colors.textSecondary }]}>{item.distance}</Text>
          </View>
          <Text style={{ color: theme.colors.border }}>|</Text>
          <View style={styles.stat}>
            <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>{item.experienceYears} yrs exp</Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {item.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
            </View>
          ))}
          {item.skills.length > 3 && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>+{item.skills.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.compareBtn, isComparing && styles.compareBtnActive]}
            onPress={() => {
              if (isComparing) {
                removeFromCompare(item.id);
              } else {
                if (compareList.length >= 3) {
                  alert('You can only compare up to 3 workers.');
                  return;
                }
                addToCompare(item.id);
              }
            }}
          >
            <Text style={[styles.compareBtnText, isComparing && { color: theme.colors.primary }]}>
              {isComparing ? 'Added to Compare' : '+ Compare'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen safeArea>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Discover Workers</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search color={theme.colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, skill, or category..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={theme.colors.textSecondary} size={20} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal color={theme.colors.surface} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {compareList.length > 0 && (
        <View style={styles.compareBanner}>
          <Text style={[theme.typography.body2, { color: theme.colors.primary, fontWeight: '500' }]}>
            {compareList.length} worker{compareList.length > 1 ? 's' : ''} selected to compare
          </Text>
          <TouchableOpacity style={styles.compareBannerBtn} onPress={() => router.push('/compare' as any)}>
            <Text style={[theme.typography.button, { color: theme.colors.surface, fontSize: 12 }]}>View Compare</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredWorkers}
        keyExtractor={item => item.id}
        renderItem={renderWorkerCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Search color={theme.colors.textTertiary} size={48} style={{ marginBottom: 16 }} />
            <Text style={theme.typography.h4}>No workers found</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
              Try adjusting your search or filters to find what you're looking for.
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  searchSection: { flexDirection: 'row', paddingHorizontal: theme.layout.screenPadding, marginBottom: theme.spacing.sm },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.md, height: 48, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.borderLight, marginRight: theme.spacing.sm },
  searchInput: { flex: 1, marginLeft: theme.spacing.sm, fontSize: 14, color: theme.colors.textPrimary },
  filterButton: { width: 48, height: 48, backgroundColor: theme.colors.primary, borderRadius: theme.radius.lg, justifyContent: 'center', alignItems: 'center' },
  
  categoriesSection: { marginBottom: theme.spacing.md },
  categoriesScroll: { paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.xs },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.borderLight, marginRight: theme.spacing.sm },
  categoryChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  categoryChipText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  categoryChipTextActive: { color: theme.colors.surface },

  compareBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e0f2fe', marginHorizontal: theme.layout.screenPadding, padding: theme.spacing.md, borderRadius: theme.radius.lg, marginBottom: theme.spacing.md },
  compareBannerBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.radius.full },

  listContainer: { paddingHorizontal: theme.layout.screenPadding, paddingBottom: 100 },
  workerCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.borderLight, ...theme.shadows.sm },
  workerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: theme.spacing.md },
  workerInfo: { flex: 1 },
  priceTag: { backgroundColor: theme.colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.sm },
  
  workerStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.background, padding: theme.spacing.sm, borderRadius: theme.radius.md, marginBottom: theme.spacing.sm },
  stat: { flexDirection: 'row', alignItems: 'center' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.spacing.sm },
  tag: { backgroundColor: theme.colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 10, color: theme.colors.textSecondary },

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.sm },
  compareBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: theme.radius.sm, borderWidth: 1, borderColor: theme.colors.borderLight },
  compareBtnActive: { backgroundColor: '#e0f2fe', borderColor: '#e0f2fe' },
  compareBtnText: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: '600' },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xxxl, marginTop: 40 },
});
