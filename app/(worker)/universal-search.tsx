import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CalendarDays, Briefcase, Star, Wallet, Wrench,
  Settings, HelpCircle, User, MessageSquare, Clock,
  MapPin, FileText, CreditCard, ChevronRight,
  SearchX, TrendingUp,
} from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { SearchBar } from '@/components/SearchBar';
import { Badge } from '@/components/Badge';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { workerBookings, workerJobs, workerReviews, walletTransactions, SKILLS_BY_INDUSTRY } from '@/constants/workerMockData';
import { workerProfile } from '@/constants/workerData';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
  route: string;
  badge?: string;
  badgeVariant?: string;
}

const SCREEN_LINKS: { title: string; subtitle: string; icon: React.ReactNode; route: string }[] = [
  { title: 'Profile', subtitle: 'View and edit your profile', icon: <User size={18} color={Colors.cta} />, route: '/(worker)/profile' },
  { title: 'Wallet', subtitle: 'Check balance and transactions', icon: <Wallet size={18} color={Colors.verified} />, route: '/(worker)/wallet' },
  { title: 'Bookings', subtitle: 'View all your bookings', icon: <CalendarDays size={18} color={Colors.info} />, route: '/(worker)/bookings' },
  { title: 'Messages', subtitle: 'Chat with customers', icon: <MessageSquare size={18} color={Colors.primary} />, route: '/(worker)/messages' },
  { title: 'Help Center', subtitle: 'FAQ and support', icon: <HelpCircle size={18} color={Colors.warning} />, route: '/(worker)/help' },
  { title: 'Settings', subtitle: 'App preferences', icon: <Settings size={18} color={Colors.textTertiary} />, route: '/(worker)/settings' },
  { title: 'My Reviews', subtitle: 'See customer feedback', icon: <Star size={18} color={Colors.warning} />, route: '/(worker)/reviews' },
  { title: 'Industry & Skills', subtitle: 'Manage your skills', icon: <Wrench size={18} color={Colors.info} />, route: '/(worker)/industry-skills' },
  { title: 'Work Experience', subtitle: 'Your work history', icon: <FileText size={18} color={Colors.cta} />, route: '/(worker)/work-experience' },
  { title: 'Availability', subtitle: 'Set your schedule', icon: <Clock size={18} color={Colors.verified} />, route: '/(worker)/availability' },
  { title: 'Service Areas', subtitle: 'Manage coverage areas', icon: <MapPin size={18} color={Colors.error} />, route: '/(worker)/service-areas' },
  { title: 'Payout Methods', subtitle: 'Manage payment methods', icon: <CreditCard size={18} color={Colors.info} />, route: '/(worker)/payout-methods' },
  { title: 'Payout History', subtitle: 'Past withdrawals', icon: <TrendingUp size={18} color={Colors.verified} />, route: '/(worker)/payout-history' },
  { title: 'Personal Information', subtitle: 'Edit your details', icon: <User size={18} color={Colors.cta} />, route: '/(worker)/personal-info' },
  { title: 'Privacy Policy', subtitle: 'Data and privacy', icon: <FileText size={18} color={Colors.textTertiary} />, route: '/(worker)/privacy' },
];

function matchQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export default function UniversalSearchScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const items: SearchResult[] = [];

    workerBookings.forEach((b) => {
      if (matchQuery(b.customerName, q) || matchQuery(b.service, q) || matchQuery(b.address, q)) {
        items.push({
          id: `booking-${b.id}`,
          title: b.service,
          subtitle: `${b.customerName} · ${b.date}`,
          category: 'Bookings',
          icon: <CalendarDays size={18} color={Colors.info} />,
          route: `/(worker)/booking-request/${b.id}`,
          badge: b.status,
        });
      }
    });

    workerJobs.forEach((j) => {
      if (matchQuery(j.customerName, q) || matchQuery(j.service, q) || matchQuery(j.location, q) || matchQuery(j.description, q)) {
        items.push({
          id: `job-${j.id}`,
          title: j.service,
          subtitle: `${j.customerName} · ${j.location} · ${j.offeredPrice}`,
          category: 'Job Opportunities',
          icon: <Briefcase size={18} color={Colors.cta} />,
          route: `/(worker)/booking-request/${j.id}`,
          badge: j.urgency === 'urgent' ? 'Urgent' : undefined,
          badgeVariant: j.urgency === 'urgent' ? 'error' : undefined,
        });
      }
    });

    workerReviews.forEach((r) => {
      if (matchQuery(r.author, q) || matchQuery(r.serviceType, q) || matchQuery(r.comment, q)) {
        items.push({
          id: `review-${r.id}`,
          title: `${r.author} — ${r.serviceType}`,
          subtitle: r.comment.slice(0, 60) + '...',
          category: 'Reviews',
          icon: <Star size={18} color={Colors.warning} />,
          route: '/(worker)/reviews',
        });
      }
    });

    walletTransactions.forEach((t) => {
      if (matchQuery(t.label, q) || matchQuery(t.sub, q) || matchQuery(t.amount, q)) {
        items.push({
          id: `tx-${t.id}`,
          title: t.label,
          subtitle: `${t.sub} · ${t.amount} · ${t.date}`,
          category: 'Transactions',
          icon: <Wallet size={18} color={Colors.verified} />,
          route: '/(worker)/transactions-history',
        });
      }
    });

    const allSkills = Object.values(SKILLS_BY_INDUSTRY).flat();
    allSkills.forEach((skill) => {
      if (matchQuery(skill.label, q) || matchQuery(skill.value, q)) {
        items.push({
          id: `skill-${skill.value}`,
          title: skill.label,
          subtitle: 'Skill',
          category: 'Skills',
          icon: <Wrench size={18} color={Colors.info} />,
          route: '/(worker)/industry-skills',
        });
      }
    });

    if (matchQuery(workerProfile.name, q) || matchQuery(workerProfile.category, q)) {
      items.push({
        id: 'profile-name',
        title: workerProfile.name,
        subtitle: workerProfile.category,
        category: 'Profile',
        icon: <User size={18} color={Colors.cta} />,
        route: '/(worker)/profile',
      });
    }

    workerProfile.serviceAreas.forEach((area) => {
      if (matchQuery(area, q)) {
        items.push({
          id: `area-${area}`,
          title: area,
          subtitle: 'Service Area',
          category: 'Service Areas',
          icon: <MapPin size={18} color={Colors.error} />,
          route: '/(worker)/service-areas',
        });
      }
    });

    SCREEN_LINKS.forEach((s) => {
      if (matchQuery(s.title, q) || matchQuery(s.subtitle, q)) {
        items.push({
          id: `screen-${s.title}`,
          title: s.title,
          subtitle: s.subtitle,
          category: 'Screens',
          icon: s.icon,
          route: s.route,
        });
      }
    });

    return items;
  }, [query]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return Object.entries(groups);
  }, [results]);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  const searchHeader = (
    <View style={styles.searchHeader}>
      <PageHeader title="Search" from={from} />
      <View style={styles.searchBarWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search bookings, jobs, skills..."
          autoFocus
        />
      </View>
    </View>
  );

  return (
    <Screen safeArea header={searchHeader}>
      <ScrollView
        style={styles.resultsScroll}
        contentContainerStyle={styles.resultsContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!hasQuery && (
          <>
            <View style={styles.section}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.sectionLabel}>QUICK LINKS</AppText>
              <View style={styles.quickLinksGrid}>
                {SCREEN_LINKS.slice(0, 8).map((link) => (
                  <Pressable
                    key={link.title}
                    style={styles.quickLink}
                    onPress={() => router.push(link.route as any)}
                  >
                    <View style={styles.quickLinkIcon}>{link.icon}</View>
                    <AppText variant="caption" weight="semiBold" style={styles.quickLinkText}>{link.title}</AppText>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.sectionLabel}>RECENT BOOKINGS</AppText>
              {workerBookings.slice(0, 3).map((b) => (
                <Pressable
                  key={b.id}
                  style={styles.recentItem}
                  onPress={() => router.push(`/(worker)/booking-request/${b.id}`)}
                >
                  <CalendarDays size={16} color={Colors.info} />
                  <View style={styles.recentInfo}>
                    <AppText variant="bodySm" weight="semiBold">{b.service}</AppText>
                    <AppText variant="caption" color={Colors.textTertiary}>{b.customerName} · {b.date}</AppText>
                  </View>
                  <ChevronRight size={16} color={Colors.textTertiary} />
                </Pressable>
              ))}
            </View>
          </>
        )}

        {hasQuery && hasResults && (
          <>
            {groupedResults.map(([category, items]) => (
              <View key={category} style={styles.section}>
                <AppText variant="caption" weight="semiBold" color={Colors.textTertiary} style={styles.sectionLabel}>
                  {category.toUpperCase()}
                </AppText>
                {items.slice(0, 5).map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.resultItem}
                    onPress={() => router.push(item.route as any)}
                  >
                    <View style={styles.resultIcon}>{item.icon}</View>
                    <View style={styles.resultInfo}>
                      <AppText variant="bodySm" weight="semiBold" numberOfLines={1}>{item.title}</AppText>
                      <AppText variant="caption" color={Colors.textTertiary} numberOfLines={1}>{item.subtitle}</AppText>
                    </View>
                    {item.badge && (
                      <Badge label={item.badge} variant={(item.badgeVariant as any) || 'info'} size="sm" />
                    )}
                    <ChevronRight size={16} color={Colors.textTertiary} />
                  </Pressable>
                ))}
              </View>
            ))}
          </>
        )}

        {hasQuery && !hasResults && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <SearchX size={48} color={Colors.textTertiary} />
            </View>
            <AppText variant="h4" weight="bold">No results found</AppText>
            <AppText variant="bodySm" color={Colors.textSecondary} align="center">
              No results found for "{query}".{'\n'}Try a different search term.
            </AppText>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchHeader: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchBarWrap: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: Spacing['4'],
  },

  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingTop: Spacing['3'],
    paddingBottom: Spacing['10'],
  },

  section: {
    paddingHorizontal: theme.layout.screenPadding,
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing['3'],
  },

  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['2'],
  },
  quickLink: {
    width: '23%',
    alignItems: 'center',
    gap: Spacing['1'],
    paddingVertical: Spacing['2'],
  },
  quickLinkIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkText: {
    textAlign: 'center',
  },

  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['3'],
    marginBottom: Spacing['2'],
    ...Elevation.sm,
  },
  recentInfo: { flex: 1, gap: 2 },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['3'],
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing['3'],
    marginBottom: Spacing['2'],
    ...Elevation.sm,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: { flex: 1, gap: 2 },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing['2'],
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: Spacing['10'],
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2'],
  },
});
