import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  ChevronRight, User, Wrench, MapPin, Briefcase,
  Wallet, Clock, Bell, Settings, HelpCircle, Shield,
  LogOut, ArrowLeftRight, Star, CheckCircle,
  BadgeCheck, ArrowUpFromLine, PlusCircle,
} from 'lucide-react-native';
import { workerProfile } from '@/constants/workerData';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'personal', title: 'Personal Information', icon: User },
      { id: 'industry', title: 'Industry & Skills', icon: Wrench },
      { id: 'areas', title: 'Service Areas', icon: MapPin },
      { id: 'portfolio', title: 'Portfolio', icon: Briefcase },
      { id: 'verification', title: 'Verification', icon: BadgeCheck },
    ],
  },
  {
    title: 'Payments',
    items: [
      { id: 'payout-methods', title: 'Payout Methods', icon: Wallet },
      { id: 'payout-history', title: 'Payout History', icon: Clock },
      { id: 'topup-methods', title: 'Top-Up Methods', icon: ArrowUpFromLine },
      { id: 'topup-history', title: 'Top-Up History', icon: PlusCircle },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', title: 'Notifications', icon: Bell },
      { id: 'appearance', title: 'App Appearance', icon: Settings },
    ],
  },
  {
    title: 'Support & Legal',
    items: [
      { id: 'help', title: 'Help Center', icon: HelpCircle },
      { id: 'privacy', title: 'Privacy Policy', icon: Shield },
    ],
  },
];

export default function WorkerProfileScreen() {
  const router = useRouter();

  const handleItemPress = (id: string) => {
    if (id === 'verification') {
      router.push('/(worker)/verification');
      return;
    }
    Alert.alert('Coming Soon', 'This feature is under development.');
  };

  const handleLogout = () => {
    router.replace('/');
  };

  const handleSwitchToUser = () => {
    router.replace('/(tabs)');
  };

  return (
    <Screen safeArea scrollable>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Image
            source={workerProfile.avatarUri}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={theme.typography.h3}>{workerProfile.name}</Text>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{workerProfile.email}</Text>
          <View style={styles.verifiedBadge}>
            <CheckCircle color={theme.colors.success} size={14} />
            <Text style={[theme.typography.caption, { color: theme.colors.success, marginLeft: 4 }]}>Verified Worker</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={theme.typography.h3}>{workerProfile.completedJobs}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Jobs Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star color="#F59E0B" size={16} fill="#F59E0B" />
              <Text style={[theme.typography.h3, { marginLeft: 4 }]}>{workerProfile.rating}</Text>
            </View>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={theme.typography.h3}>{workerProfile.earnings}</Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Earnings</Text>
          </View>
        </View>

        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[theme.typography.h4, styles.sectionTitle]}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === section.items.length - 1;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.settingItem, !isLast && styles.borderBottom]}
                    onPress={() => handleItemPress(item.id)}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                      <Icon color={theme.colors.primary} size={20} />
                    </View>
                    <Text style={[theme.typography.body1, styles.settingText]}>{item.title}</Text>
                    <ChevronRight color={theme.colors.textTertiary} size={20} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color={theme.colors.error} size={20} />
          <Text style={[theme.typography.button, { color: theme.colors.error, marginLeft: theme.spacing.sm }]}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing.lg }]}>
          For Development Testing
        </Text>
        <TouchableOpacity style={styles.switchBtn} onPress={handleSwitchToUser}>
          <ArrowLeftRight color={theme.colors.primary} size={20} />
          <Text style={[theme.typography.button, { color: theme.colors.primary, marginLeft: theme.spacing.sm }]}>Switch to User</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.xxxl },
  userInfo: { alignItems: 'center', marginVertical: theme.spacing.xl },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: theme.colors.border, marginBottom: theme.spacing.sm },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${theme.colors.success}15`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.sm, marginTop: theme.spacing.xs },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: theme.spacing.lg, ...theme.shadows.sm, marginBottom: theme.spacing.xl },
  statItem: { alignItems: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: theme.colors.borderLight },
  section: { marginBottom: theme.spacing.xl },
  sectionTitle: { marginBottom: theme.spacing.md, marginLeft: theme.spacing.xs },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  settingText: { flex: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, backgroundColor: `${theme.colors.error}10`, borderRadius: theme.radius.md, marginTop: theme.spacing.md },
  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, backgroundColor: `${theme.colors.primary}08`, borderRadius: theme.radius.md, marginTop: theme.spacing.sm, marginBottom: theme.spacing.xxxl },
});
