import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MapPin, X, Plus } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { PageHeader } from '@/components/layout/PageHeader';
import { workerProfile } from '@/constants/workerData';

const INITIAL_AREAS = [...workerProfile.serviceAreas];

const SUGGESTED_AREAS = [
  'Makati City', 'Taguig City', 'Pasig City', 'Mandaluyong City',
  'San Juan City', 'Parañaque City', 'Las Piñas City', 'Muntinlupa City',
  'Pasay City', 'Caloocan City', 'Malabon City', 'Navotas City',
  'Valenzuela City', 'Marikina City', 'Pateros',
];

export default function ServiceAreasScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [areas, setAreas] = useState<string[]>(INITIAL_AREAS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = SUGGESTED_AREAS.filter(
    (a) => !areas.includes(a) && a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddArea = (area: string) => {
    if (!areas.includes(area)) {
      setAreas((prev) => [...prev, area]);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleRemoveArea = (area: string) => {
    setAreas((prev) => prev.filter((a) => a !== area));
  };

  const handleAddCustom = () => {
    const trimmed = searchQuery.trim();
    if (trimmed && !areas.includes(trimmed)) {
      setAreas((prev) => [...prev, trimmed]);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSave = () => {
    Alert.alert('Saved', `${areas.length} service area(s) saved.`);
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title="Service Areas"
        from={from}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Areas */}
        <View style={styles.section}>
          <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.sectionLabel}>
            YOUR SERVICE AREAS ({areas.length})
          </AppText>
          <View style={styles.chipContainer}>
            {areas.map((area) => (
              <View key={area} style={styles.areaChip}>
                <MapPin size={12} color={Colors.cta} />
                <AppText variant="bodySm" weight="semiBold">{area}</AppText>
                <Pressable onPress={() => handleRemoveArea(area)}>
                  <X size={14} color={Colors.textTertiary} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Search / Add */}
        <View style={styles.section}>
          <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.sectionLabel}>
            ADD SERVICE AREA
          </AppText>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search or type area name..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={(text) => { setSearchQuery(text); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />
            {searchQuery.trim() && !filteredSuggestions.includes(searchQuery.trim()) && (
              <Pressable style={styles.addCustomBtn} onPress={handleAddCustom}>
                <Plus size={18} color={Colors.white} />
              </Pressable>
            )}
          </View>

          {/* Suggestions */}
          {showSuggestions && searchQuery.length > 0 && filteredSuggestions.length > 0 && (
            <View style={styles.suggestions}>
              {filteredSuggestions.slice(0, 6).map((area) => (
                <Pressable
                  key={area}
                  style={styles.suggestionItem}
                  onPress={() => handleAddArea(area)}
                >
                  <MapPin size={14} color={Colors.textTertiary} />
                  <AppText variant="bodySm">{area}</AppText>
                  <Plus size={14} color={Colors.cta} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Popular Areas */}
        <View style={styles.section}>
          <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.sectionLabel}>
            POPULAR AREAS
          </AppText>
          <View style={styles.popularGrid}>
            {SUGGESTED_AREAS.filter((a) => !areas.includes(a)).slice(0, 8).map((area) => (
              <Pressable
                key={area}
                style={styles.popularChip}
                onPress={() => handleAddArea(area)}
              >
                <AppText variant="caption" weight="semiBold">{area}</AppText>
                <Plus size={12} color={Colors.cta} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <AppButton
            label={`Save ${areas.length} Area(s)`}
            variant="primary"
            fullWidth
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },

  section: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing['3'],
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.cta,
  },

  searchRow: {
    flexDirection: 'row',
    gap: Spacing['2'],
    marginBottom: Spacing['2'],
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
    ...Elevation.sm,
  },
  addCustomBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.cta,
    alignItems: 'center',
    justifyContent: 'center',
  },

  suggestions: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Elevation.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },

  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  actions: {
    paddingHorizontal: theme.layout.screenPadding,
  },
});
