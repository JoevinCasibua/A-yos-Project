import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MapPin, X, Plus, CheckCircle2 } from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppSelect } from '@/components/AppSelect';
import { SearchBar } from '@/components/SearchBar';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { useWorkerProfile } from '@/hooks';
import { useWorkerStore } from '@/store/useWorkerStore';

const SUGGESTED_AREAS = [
  'Makati City', 'Taguig City', 'Pasig City', 'Mandaluyong City',
  'San Juan City', 'Parañaque City', 'Las Piñas City', 'Muntinlupa City',
  'Pasay City', 'Caloocan City', 'Malabon City', 'Navotas City',
  'Valenzuela City', 'Marikina City', 'Pateros',
];

const RADIUS_OPTIONS = [
  { label: '2 km', value: '2000' },
  { label: '5 km', value: '5000' },
  { label: '10 km', value: '10000' },
  { label: '20 km', value: '20000' },
  { label: '50 km', value: '50000' },
];

export default function ServiceAreasScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { data: workerProfile } = useWorkerProfile();
  const matchingOnline = useWorkerStore((s) => s.matchingOnline);
  const [areas, setAreas] = useState<string[]>(workerProfile?.serviceAreas ?? []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [originLabel, setOriginLabel] = useState('');
  const [coverageRadius, setCoverageRadius] = useState('10000');

  const readinessItems = [
    { label: 'Admin verification approved', ready: workerProfile?.verificationStatus === 'verified' },
    { label: 'Industry & skills', ready: (workerProfile?.skills?.length ?? 0) > 0 },
    { label: 'Service rate set', ready: !!workerProfile?.hourlyRate },
    { label: 'Service origin and radius', ready: false },
    { label: 'Working schedule', ready: false },
    { label: 'Available for matching', ready: matchingOnline },
  ];

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
    Alert.alert('Saved', `Areas: ${areas.length}, Origin: ${originLabel || 'not set'}, Radius: ${RADIUS_OPTIONS.find((o) => o.value === coverageRadius)?.label}`);
  };

  return (
    <Screen safeArea scrollable header={<PageHeader title="Service Areas" from={from} />}>

      {/* Matching Readiness */}
      <View style={styles.section}>
        <View style={styles.card}>
          <AppText variant="body" weight="bold">Matching readiness</AppText>
          {readinessItems.map((item) => (
            <View key={item.label} style={styles.readinessRow}>
              <View style={[styles.readinessDot, item.ready && styles.readinessDotReady]} />
              <AppText variant="bodySm" color={item.ready ? Colors.success : Colors.textSecondary}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>

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
          <View style={styles.searchBarFlex}>
            <SearchBar
              value={searchQuery}
              onChangeText={(text) => { setSearchQuery(text); setShowSuggestions(true); }}
              placeholder="Search or type area name..."
            />
          </View>
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

      {/* Service Origin */}
      <View style={styles.section}>
        <View style={styles.card}>
          <View style={styles.originTitle}>
            <MapPin size={18} color={Colors.primary} />
            <AppText variant="body" weight="bold">Service origin</AppText>
          </View>
          <AppText variant="caption" color={Colors.textSecondary}>
            Customers only see your approximate distance. Your confirmed point is used to check the coverage radius.
          </AppText>
          <Pressable
            style={styles.mapPlaceholder}
            onPress={() => Alert.alert('Coming Soon', 'Map selection will be available soon.')}
          >
            <MapPin size={32} color={Colors.textTertiary} />
            <AppText variant="bodySm" color={Colors.textTertiary}>
              Tap to set your service location
            </AppText>
          </Pressable>
          <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={{ textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing['1'] }}>
            Service area label
          </AppText>
          <TextInput
            style={styles.textInput}
            placeholder="Trece Martires City, Cavite"
            placeholderTextColor={Colors.textTertiary}
            value={originLabel}
            onChangeText={setOriginLabel}
          />
          <AppSelect
            label="Coverage radius"
            options={RADIUS_OPTIONS}
            value={coverageRadius}
            onSelect={setCoverageRadius}
          />
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
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  searchBarFlex: {
    flex: 1,
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['4'],
    gap: Spacing['3'],
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  readinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  readinessDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
  readinessDotReady: {
    backgroundColor: Colors.success,
  },
  originTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    paddingVertical: Spacing['3'],
    paddingHorizontal: Spacing['4'],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignSelf: 'flex-start',
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2'],
  },
  textInput: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['2'],
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
