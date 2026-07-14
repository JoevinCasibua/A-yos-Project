import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Bell, ChevronRight, Wrench, Zap, Wind, Sparkles, Hammer, Paintbrush, TreePine, Grid2x2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { ProviderCard } from '@/components/ProviderCard';
import { ServiceCategoryCard } from '@/components/ServiceCategoryCard';
import { providers, serviceCategories } from '@/constants/mockData';



const iconMap: Record<string, React.ReactNode> = {
  Wrench: <Wrench size={26} color={Colors.cta} strokeWidth={2} />,
  Zap: <Zap size={26} color="#F9A825" strokeWidth={2} />,
  Wind: <Wind size={26} color="#1565C0" strokeWidth={2} />,
  Sparkles: <Sparkles size={26} color="#7B1FA2" strokeWidth={2} />,
  Hammer: <Hammer size={26} color="#E65100" strokeWidth={2} />,
  Paintbrush: <Paintbrush size={26} color="#C2185B" strokeWidth={2} />,
  TreePine: <TreePine size={26} color="#33691E" strokeWidth={2} />,
  Grid2x2: <Grid2x2 size={26} color="#616161" strokeWidth={2} />,
};

const bgColors: Record<string, string> = {
  Wrench: '#E8F5E9',
  Zap: '#FFF8E1',
  Wind: '#E3F2FD',
  Sparkles: '#F3E5F5',
  Hammer: '#FFF3E0',
  Paintbrush: '#FCE4EC',
  TreePine: '#F1F8E9',
  Grid2x2: '#F5F5F5',
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <AppText variant="caption" color={Colors.textSecondary}>
                Welcome back
              </AppText>
              <AppText variant="h3" weight="bold" style={{ marginTop: 2 }}>
                Alex
              </AppText>
            </View>
            <Pressable style={styles.bell} hitSlop={12}>
              <Bell size={22} color={Colors.textPrimary} strokeWidth={2} />
              <View style={styles.bellDot} />
            </Pressable>
          </View>

          <SearchBar
            placeholder="Search for services..."
            style={{ marginTop: Spacing['4'] }}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader title="Categories" actionLabel="See all" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
            style={{ marginTop: Spacing['3'] }}
          >
            {serviceCategories.map((cat) => (
              <ServiceCategoryCard
                key={cat.id}
                icon={iconMap[cat.icon]}
                label={cat.label}
                backgroundColor={bgColors[cat.icon]}
                style={{ marginRight: Spacing['3'] }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Promo Banner */}
        <View style={styles.section}>
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <AppText variant="h4" weight="bold" color={Colors.white}>
                Get 20% OFF
              </AppText>
              <AppText variant="bodySm" color={Colors.white} style={{ marginTop: 2, opacity: 0.9 }}>
                On your first booking
              </AppText>
              <View style={styles.promoBadge}>
                <AppText variant="caption" weight="bold" color={Colors.cta}>
                  CLAIM NOW
                </AppText>
              </View>
            </View>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.promoImage}
            />
          </View>
        </View>

        {/* Top Rated Providers */}
        <View style={styles.section}>
          <SectionHeader
            title="Top Rated Near You"
            actionLabel="See all"
            onActionPress={() => router.push('/search')}
          />
          <View style={styles.providersGrid}>
            {providers.slice(0, 4).map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                compact
                style={{ marginBottom: Spacing['3'] }}
                onPress={() => router.push(`/provider/${p.id}`)}
              />
            ))}
          </View>
        </View>

        {/* Recently Viewed */}
        <View style={[styles.section, { paddingBottom: Spacing['8'] }]}>
          <SectionHeader title="Recently Viewed" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: Spacing['3'], marginTop: Spacing['3'] }}
          >
            {providers.slice(0, 3).map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                style={{ width: 280 }}
                onPress={() => router.push(`/provider/${p.id}`)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['16'],
    paddingBottom: Spacing['5'],
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bell: {
    position: 'relative',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.full,
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  section: {
    marginTop: Spacing['6'],
    paddingHorizontal: Spacing['4'],
  },
  categoriesRow: {
    paddingRight: Spacing['4'],
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cta,
    borderRadius: Radius.xl,
    padding: Spacing['5'],
    overflow: 'hidden',
    ...Elevation.md,
  },
  promoContent: {
    flex: 1,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing['3'],
    paddingVertical: Spacing['1'],
    borderRadius: Radius.full,
    marginTop: Spacing['3'],
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    resizeMode: 'cover',
  },
  providersGrid: {
    marginTop: Spacing['3'],
  },
});
