import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, Trash2, Star, ShieldCheck } from 'lucide-react-native';
import { useWorkerStore } from '@/store/useWorkerStore';
import { Image } from 'expo-image';
import { Button } from '@/components/buttons/Button';

const { width } = Dimensions.get('window');

export default function CompareScreen() {
  const router = useRouter();
  const { compareList, getWorkerById, removeFromCompare, clearCompare } = useWorkerStore();

  const comparingWorkers = compareList.map(id => getWorkerById(id)).filter(w => w !== undefined);

  if (comparingWorkers.length === 0) {
    return (
      <Screen safeArea>
        <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={theme.colors.textPrimary} size={24} />
          </TouchableOpacity>
          <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Compare Workers</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={theme.typography.h3}>No workers selected</Text>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8 }]}>
            Go back to search and add some workers to compare.
          </Text>
          <Button title="Back to Search" onPress={() => router.push('/search' as any)} style={{ marginTop: theme.spacing.xl }} />
        </View>
      </Screen>
    );
  }

  // Define the rows we want to compare
  const features = [
    { label: 'Category', key: 'category' },
    { label: 'Price', key: 'price' },
    { label: 'Experience', key: 'experienceYears', suffix: ' years' },
    { label: 'Availability', key: 'availability' },
    { label: 'Distance', key: 'distance' },
  ];

  return (
    <Screen safeArea>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Compare Workers</Text>
        <TouchableOpacity onPress={clearCompare} style={styles.clearBtn}>
          <Text style={[theme.typography.button, { color: theme.colors.error, fontSize: 13 }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header Row (Worker Profiles) */}
          <View style={styles.row}>
            <View style={styles.labelCol} />
            {comparingWorkers.map((worker) => (
              <View key={worker.id} style={styles.workerCol}>
                <TouchableOpacity 
                  style={styles.removeBtn} 
                  onPress={() => removeFromCompare(worker.id)}
                >
                  <Trash2 color={theme.colors.textTertiary} size={16} />
                </TouchableOpacity>
                <Image source={worker.avatar} style={styles.avatar} contentFit="cover" />
                <Text style={[theme.typography.h4, { textAlign: 'center', marginTop: 8 }]} numberOfLines={1}>
                  {worker.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Star color={theme.colors.warning} size={12} fill={theme.colors.warning} />
                  <Text style={[theme.typography.label, { marginLeft: 4 }]}>{worker.rating}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {features.map((feature, idx) => (
            <View key={idx} style={styles.row}>
              <View style={[styles.labelCol, { justifyContent: 'center' }]}>
                <Text style={[theme.typography.label, { color: theme.colors.textSecondary }]}>{feature.label}</Text>
              </View>
              {comparingWorkers.map((worker) => (
                <View key={worker.id} style={styles.cellCol}>
                  <Text style={[theme.typography.body2, { textAlign: 'center' }]}>
                    {/* @ts-ignore */}
                    {worker[feature.key]} {feature.suffix || ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {/* Action Row */}
          <View style={[styles.row, { borderBottomWidth: 0, marginTop: theme.spacing.lg }]}>
            <View style={styles.labelCol} />
            {comparingWorkers.map((worker) => (
              <View key={worker.id} style={styles.workerCol}>
                <Button 
                  title="View Profile" 
                  variant="outlined" 
                  style={{ width: '100%', marginBottom: 8, paddingVertical: 8 }}
                  textStyle={{ fontSize: 12 }}
                  onPress={() => router.push(`/worker/${worker.id}` as any)}
                />
                <Button 
                  title="Hire Now" 
                  style={{ width: '100%', paddingVertical: 8 }}
                  textStyle={{ fontSize: 12 }}
                  onPress={() => router.push(`/tracking/${worker.id}` as any)}
                />
              </View>
            ))}
          </View>
          
        </ScrollView>
      </ScrollView>
    </Screen>
  );
}

const COL_WIDTH = (width - 120) / 2; // Show ~2 columns at a time, scroll for 3rd

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  clearBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xxxl },

  scrollContent: { paddingBottom: 100 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  
  labelCol: { width: 100, padding: theme.spacing.md, backgroundColor: theme.colors.background },
  workerCol: { width: COL_WIDTH, padding: theme.spacing.md, alignItems: 'center', backgroundColor: theme.colors.surface, borderLeftWidth: 1, borderLeftColor: theme.colors.borderLight },
  cellCol: { width: COL_WIDTH, padding: theme.spacing.md, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: theme.colors.borderLight },
  
  avatar: { width: 64, height: 64, borderRadius: 32 },
  removeBtn: { position: 'absolute', top: 8, right: 8, zIndex: 10, padding: 4, backgroundColor: theme.colors.background, borderRadius: 12 },
});
