import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { Image } from 'expo-image';
import { Search, Bell, MapPin, Star, ChevronRight, Droplets, Zap, Wrench, Sparkles, Monitor, Fan, Paintbrush, Shovel, Wallet } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDraftStore } from '@/store/useDraftStore';
import { homeCategories, homePromotions, homeRecommendedWorkers } from '@/constants/mockData';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ color: string; size: number }>> = {
  Plumbing: Droplets,
  Electrical: Zap,
  Carpentry: Wrench,
  Cleaning: Sparkles,
  Appliance: Monitor,
  'AC Repair': Fan,
  Painting: Paintbrush,
  Gardening: Shovel,
};

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const clearCurrentDraft = useDraftStore(state => state.clearCurrentDraft);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Top Nav (Fixed at the top) */}
      <View style={[styles.topNav, { paddingTop: insets.top + theme.spacing.sm }]}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={[theme.typography.body2, { color: 'rgba(255,255,255,0.8)' }]}>Good morning,</Text>
              <Text style={[theme.typography.h3, { color: theme.colors.surface }]}>{user?.name || 'Guest'} 👋</Text>
            </View>
          </View>
          <View style={styles.headerTopRow}>
            <TouchableOpacity 
              style={styles.searchBar} 
              activeOpacity={0.8}
              onPress={() => router.push('/search' as any)}
            >
              <Search color={theme.colors.textSecondary} size={20} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.colors.textTertiary, fontSize: 14 }}>Search workers...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
              <Bell color={theme.colors.surface} size={24} />
              <View style={styles.badge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarButton} onPress={() => router.push('/(tabs)/profile')}>
              <Image 
                source="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
                style={styles.headerAvatar} 
                contentFit="cover" 
              />
            </TouchableOpacity>
          </View>
        </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {/* White Card */}
        <View style={[styles.mainCard, { marginTop: theme.spacing.md }]}>
          {/* Categories Grid */}
          <View style={styles.categoriesGrid}>
            {homeCategories.map(cat => {
              const Icon = CATEGORY_ICONS[cat.name] || Wrench;
              return (
                <TouchableOpacity key={cat.id} style={styles.categoryItem} onPress={() => router.push(`/category/${cat.name.toLowerCase()}` as any)}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: cat.bg }]}>
                    <Icon color={cat.color} size={28} />
                  </View>
                  <Text style={[theme.typography.caption, styles.categoryName]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Widgets Row */}
          <View style={styles.widgetsRow}>
            <TouchableOpacity style={styles.widgetCard} onPress={() => router.push('/wallet')}>
              <View>
                <Text style={theme.typography.caption}>Finance</Text>
                <Text style={theme.typography.h4}>₱0.00</Text>
              </View>
              <Wallet color={theme.colors.primary} size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.widgetCard}>
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.caption}>Rate</Text>
                <Text style={theme.typography.body2} numberOfLines={1}>Mario Rossi - Plumb...</Text>
              </View>
              <Star color={theme.colors.warning} size={24} fill={theme.colors.warning} />
            </TouchableOpacity>
          </View>
        </View>

        {/* A-yos AI Promo Ad */}
        <View style={styles.aiPromoCard}>
          <View style={styles.aiPromoContent}>
            <Text style={[theme.typography.h3, { color: theme.colors.surface, marginBottom: 8 }]}>Need Help Around the House?</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.surface, opacity: 0.9, marginBottom: 16 }]}>
              Let A-yos AI understand your needs, recommend the right service, and connect you with trusted, verified workers near you.
            </Text>
            <TouchableOpacity style={styles.aiPromoButton} onPress={() => { clearCurrentDraft(); router.push('/new-request/create'); }}>
              <Text style={[theme.typography.button, { color: theme.colors.primary, fontSize: 13 }]}>Try A-yos AI</Text>
              <Sparkles color={theme.colors.primary} size={14} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
          <Image 
            source="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=400&auto=format&fit=crop" 
            style={styles.aiPromoImage}
            contentFit="cover"
          />
        </View>

        {/* Promotions Carousel (Order Now style) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={theme.typography.h3}>Book Now</Text>
            <ChevronRight color={theme.colors.textSecondary} size={20} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
            {homePromotions.map(promo => (
              <TouchableOpacity key={promo.id} style={styles.promoCard}>
                <Image source={promo.image} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
                <View style={{ zIndex: 1, padding: theme.spacing.lg }}>
                  <Text style={[theme.typography.h2, styles.promoTitle]}>{promo.title}</Text>
                  <Text style={[theme.typography.body1, styles.promoSubtitle]}>{promo.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>Discover popular</Text>
            <Text style={[theme.typography.h4, { color: theme.colors.primary }]}>service picks</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={[theme.typography.button, { color: theme.colors.textPrimary, fontSize: 12 }]}>See top workers</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop" 
            style={styles.bannerImage}
            contentFit="cover"
          />
        </View>

        {/* Recommended Workers Grid */}
        <View style={styles.recommendedGrid}>
          {homeRecommendedWorkers.map(worker => (
            <TouchableOpacity key={worker.id} style={styles.recommendedCard}>
              <View style={styles.recommendedImageContainer}>
                <Image source={worker.cover} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                {worker.promo && (
                  <View style={styles.promoTag}>
                    <Text style={{ color: theme.colors.surface, fontSize: 10, fontWeight: '700' }}>{worker.promo}</Text>
                  </View>
                )}
                <View style={styles.providerBadge}>
                  <Image source={worker.avatar} style={styles.providerAvatar} contentFit="cover" />
                </View>
              </View>
              <View style={styles.recommendedInfo}>
                <Text style={theme.typography.body1} numberOfLines={2}>{worker.name}</Text>
                <View style={styles.recommendedMeta}>
                  <View style={styles.ratingRow}>
                    <Star color={theme.colors.warning} size={14} fill={theme.colors.warning} />
                    <Text style={[theme.typography.caption, { marginLeft: 4 }]}>{worker.rating}</Text>
                  </View>
                  <View style={styles.distanceRow}>
                    <MapPin color={theme.colors.textSecondary} size={14} />
                    <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 2 }]}>{worker.distance}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  topNav: { backgroundColor: '#1e3a8a', paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.md },
  greetingRow: { marginBottom: theme.spacing.md },
  headerTopRow: { flexDirection: 'row', alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.full, paddingHorizontal: theme.spacing.md, height: 44, marginRight: theme.spacing.sm },
  searchInput: { flex: 1, fontSize: 14, color: theme.colors.textPrimary },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.sm },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.error, borderWidth: 1, borderColor: '#1e3a8a' },
  avatarButton: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.surface },
  headerAvatar: { width: '100%', height: '100%' },
  content: { flex: 1, zIndex: 5 },
  contentContainer: { paddingBottom: theme.spacing.xxxl, paddingTop: theme.spacing.lg },
  mainCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, marginHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.md, paddingHorizontal: theme.spacing.md, ...theme.shadows.md, marginBottom: theme.spacing.xl },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  categoryItem: { width: '25%', alignItems: 'center', marginBottom: theme.spacing.lg },
  categoryIconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.xs },
  categoryName: { textAlign: 'center', color: theme.colors.textPrimary, fontSize: 11, fontWeight: '500' },
  widgetsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.md },
  widgetCard: { flex: 0.48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.background, padding: theme.spacing.md, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.borderLight },
  
  aiPromoCard: { marginHorizontal: theme.layout.screenPadding, backgroundColor: '#1e40af', borderRadius: theme.radius.xl, flexDirection: 'row', overflow: 'hidden', marginBottom: theme.spacing.xl, ...theme.shadows.md },
  aiPromoContent: { flex: 1.5, padding: theme.spacing.lg, justifyContent: 'center' },
  aiPromoButton: { backgroundColor: theme.colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderRadius: theme.radius.full, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
  aiPromoImage: { flex: 1, opacity: 0.9 },

  section: { marginBottom: theme.spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginHorizontal: theme.layout.screenPadding, marginBottom: theme.spacing.md },
  promoScroll: { paddingHorizontal: theme.layout.screenPadding, flexGrow: 0 },
  promoCard: { width: 280, height: 160, borderRadius: theme.radius.xl, marginRight: theme.spacing.md, overflow: 'hidden', justifyContent: 'flex-end' },
  promoTitle: { color: theme.colors.surface, marginBottom: 4 },
  promoSubtitle: { color: theme.colors.surface, opacity: 0.9 },
  bannerContainer: { marginHorizontal: theme.layout.screenPadding, backgroundColor: '#f3e8ff', borderRadius: theme.radius.xl, flexDirection: 'row', overflow: 'hidden', marginBottom: theme.spacing.xl, height: 120 },
  bannerContent: { flex: 1, padding: theme.spacing.lg, justifyContent: 'center' },
  bannerButton: { backgroundColor: theme.colors.surface, paddingHorizontal: theme.spacing.md, paddingVertical: 8, borderRadius: theme.radius.full, alignSelf: 'flex-start', marginTop: theme.spacing.sm },
  bannerImage: { width: 140, height: '100%' },
  recommendedGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: theme.layout.screenPadding },
  recommendedCard: { width: '48%', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, overflow: 'hidden', marginBottom: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.borderLight },
  recommendedImageContainer: { height: 140, width: '100%' },
  promoTag: { position: 'absolute', top: 8, left: 8, backgroundColor: '#f97316', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4 },
  providerBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: theme.colors.warning, padding: 2, borderRadius: 4 },
  providerAvatar: { width: 24, height: 24, borderRadius: 2 },
  recommendedInfo: { padding: theme.spacing.sm },
  recommendedMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  distanceRow: { flexDirection: 'row', alignItems: 'center' },
});
