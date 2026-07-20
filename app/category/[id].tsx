import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, Star, MapPin, CheckCircle2, Search } from 'lucide-react-native';
import { Image } from 'expo-image';

// Mock data for 8 categories, 4-5 workers each
const WORKER_MOCKS: Record<string, any[]> = {
  plumbing: [
    { id: 'p1', name: 'Mario Rossi', rating: 4.8, jobs: 124, distance: '1.2km', rate: '₱500/hr', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
    { id: 'p2', name: 'Luigi Verdi', rating: 4.9, jobs: 89, distance: '2.5km', rate: '₱450/hr', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
    { id: 'p3', name: 'Pedro Penduko', rating: 4.7, jobs: 210, distance: '3.1km', rate: '₱600/hr', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200' },
    { id: 'p4', name: 'Juan Dela Cruz', rating: 4.6, jobs: 56, distance: '4.0km', rate: '₱400/hr', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' },
    { id: 'p5', name: 'Alex Reyes', rating: 4.9, jobs: 312, distance: '5.2km', rate: '₱550/hr', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200' },
  ],
  electrical: [
    { id: 'e1', name: 'Mark Santos', rating: 4.9, jobs: 145, distance: '1.5km', rate: '₱550/hr', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200' },
    { id: 'e2', name: 'David Lee', rating: 4.8, jobs: 92, distance: '2.1km', rate: '₱500/hr', image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200' },
    { id: 'e3', name: 'Sam Rivera', rating: 4.7, jobs: 78, distance: '3.8km', rate: '₱480/hr', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200' },
    { id: 'e4', name: 'Chris Bautista', rating: 4.5, jobs: 34, distance: '5.0km', rate: '₱400/hr', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200' },
  ],
  carpentry: [
    { id: 'c1', name: 'Tony Wood', rating: 4.9, jobs: 200, distance: '1.0km', rate: '₱600/hr', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
    { id: 'c2', name: 'Steve Carver', rating: 4.8, jobs: 150, distance: '2.2km', rate: '₱550/hr', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200' },
    { id: 'c3', name: 'Ron Builder', rating: 4.6, jobs: 89, distance: '4.1km', rate: '₱500/hr', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
    { id: 'c4', name: 'Gary Nails', rating: 4.7, jobs: 112, distance: '6.0km', rate: '₱480/hr', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' },
  ],
  cleaning: [
    { id: 'cl1', name: 'Maria Clara', rating: 4.9, jobs: 450, distance: '0.8km', rate: '₱350/hr', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200' },
    { id: 'cl2', name: 'Sarah Jane', rating: 4.8, jobs: 320, distance: '1.5km', rate: '₱300/hr', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' },
    { id: 'cl3', name: 'Elena Cruz', rating: 4.7, jobs: 215, distance: '3.0km', rate: '₱280/hr', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' },
    { id: 'cl4', name: 'Ana Reyes', rating: 4.9, jobs: 512, distance: '4.2km', rate: '₱400/hr', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200' },
  ],
  appliance: [
    { id: 'a1', name: 'Tech Fixers', rating: 4.8, jobs: 230, distance: '2.0km', rate: '₱600/hr', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200' },
    { id: 'a2', name: 'Joe Appliance', rating: 4.7, jobs: 180, distance: '3.5km', rate: '₱550/hr', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200' },
    { id: 'a3', name: 'Quick Fix TV', rating: 4.6, jobs: 145, distance: '5.1km', rate: '₱500/hr', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200' },
    { id: 'a4', name: 'Mike Repairs', rating: 4.9, jobs: 320, distance: '6.5km', rate: '₱650/hr', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
  ],
  'ac repair': [
    { id: 'ac1', name: 'Cool Air Services', rating: 4.9, jobs: 400, distance: '1.8km', rate: '₱700/hr', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200' },
    { id: 'ac2', name: 'Breeze Tech', rating: 4.8, jobs: 250, distance: '2.9km', rate: '₱650/hr', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
    { id: 'ac3', name: 'Ice Cold Repairs', rating: 4.7, jobs: 190, distance: '4.0km', rate: '₱600/hr', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200' },
    { id: 'ac4', name: 'AC Master', rating: 4.6, jobs: 120, distance: '5.5km', rate: '₱550/hr', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' },
  ],
  painting: [
    { id: 'pa1', name: 'Color Pros', rating: 4.9, jobs: 310, distance: '2.5km', rate: '₱450/hr', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' },
    { id: 'pa2', name: 'Brush Masters', rating: 4.8, jobs: 240, distance: '3.2km', rate: '₱400/hr', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' },
    { id: 'pa3', name: 'Artistic Walls', rating: 4.7, jobs: 180, distance: '4.8km', rate: '₱350/hr', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200' },
    { id: 'pa4', name: 'Elite Painters', rating: 4.6, jobs: 110, distance: '6.1km', rate: '₱380/hr', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200' },
  ],
  gardening: [
    { id: 'g1', name: 'Green Thumbs', rating: 4.9, jobs: 280, distance: '1.5km', rate: '₱400/hr', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200' },
    { id: 'g2', name: 'Nature Care', rating: 4.8, jobs: 195, distance: '2.8km', rate: '₱350/hr', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200' },
    { id: 'g3', name: 'Lawn Masters', rating: 4.7, jobs: 150, distance: '4.2km', rate: '₱320/hr', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200' },
    { id: 'g4', name: 'Garden Pros', rating: 4.6, jobs: 90, distance: '5.9km', rate: '₱300/hr', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
  ],
};

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const categoryName = typeof id === 'string' ? id.toLowerCase() : '';
  const workers = WORKER_MOCKS[categoryName] || [];

  // Capitalize title
  const title = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'Workers';

  return (
    <Screen safeArea scrollable backgroundColor={theme.colors.background}>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>{title} Experts</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }]}>
          Showing {workers.length} top-rated workers in your area for {title}.
        </Text>

        {workers.length > 0 ? (
          workers.map(worker => (
            <TouchableOpacity key={worker.id} style={styles.workerCard} onPress={() => router.push('/new-request/create')}>
              <Image source={worker.image} style={styles.workerAvatar} contentFit="cover" />
              <View style={styles.workerInfo}>
                <View style={styles.workerHeader}>
                  <Text style={theme.typography.h3}>{worker.name}</Text>
                  <CheckCircle2 color={theme.colors.success} size={16} style={{ marginLeft: 4 }} />
                </View>
                <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: 8 }]}>{title} Specialist</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Star color={theme.colors.warning} size={14} fill={theme.colors.warning} />
                    <Text style={[theme.typography.caption, { marginLeft: 4, fontWeight: '700' }]}>{worker.rating}</Text>
                    <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}> ({worker.jobs})</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MapPin color={theme.colors.textSecondary} size={14} />
                    <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 4 }]}>{worker.distance}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>{worker.rate}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Search color={theme.colors.textTertiary} size={48} />
            <Text style={[theme.typography.h4, { color: theme.colors.textSecondary, marginTop: theme.spacing.md }]}>No workers found</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: 4 }]}>Try adjusting your location or checking back later.</Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.xxxl },
  
  workerCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md, ...theme.shadows.sm, borderWidth: 1, borderColor: theme.colors.borderLight },
  workerAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.border },
  workerInfo: { flex: 1, marginLeft: theme.spacing.md, justifyContent: 'center' },
  workerHeader: { flexDirection: 'row', alignItems: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: theme.spacing.md },
  
  priceContainer: { justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 4 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing.xxxl, marginTop: theme.spacing.xl }
});
