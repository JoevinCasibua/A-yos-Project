import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  ChevronRight,
  Settings,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  MapPin,
  Heart,
  Award,
  Edit3,
  ArrowLeftRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';

const menuItems = [
  { id: 'payment', icon: CreditCard, label: 'Payment Methods', color: Colors.cta, bg: Colors.primarySurface },
  { id: 'notifications', icon: Bell, label: 'Notifications', color: Colors.warning, bg: Colors.warningBg },
  { id: 'addresses', icon: MapPin, label: 'Saved Addresses', color: Colors.info, bg: Colors.infoBg },
  { id: 'favorites', icon: Heart, label: 'Favorites', color: Colors.error, bg: Colors.errorBg },
  { id: 'rewards', icon: Award, label: 'Rewards & Points', color: Colors.cta, bg: Colors.primarySurface },
  { id: 'privacy', icon: Shield, label: 'Privacy & Security', color: Colors.info, bg: Colors.infoBg },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', color: Colors.textSecondary, bg: Colors.surfaceLight },
  { id: 'settings', icon: Settings, label: 'Settings', color: Colors.textSecondary, bg: Colors.surfaceLight },
];

export default function ProfileScreen() {
  const handleItemPress = useCallback(() => {}, []);
  const handleSwitchToWorker = useCallback(() => router.replace('/(worker)'), []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            <Avatar
              uri="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
              size={80}
            />
            <Pressable style={styles.editBtn}>
              <Edit3 size={16} color={Colors.white} strokeWidth={2} />
            </Pressable>
          </View>
          <AppText variant="h3" weight="bold" style={{ marginTop: Spacing['3'] }}>
            Alex Johnson
          </AppText>
          <AppText variant="bodySm" color={Colors.textSecondary}>
            alex.johnson@email.com
          </AppText>
          <View style={styles.memberBadge}>
            <Badge label="Gold Member" variant="verified" size="md" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <AppText variant="h3" weight="bold" color={Colors.cta}>12</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Bookings</AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AppText variant="h3" weight="bold" color={Colors.cta}>5</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Reviews</AppText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AppText variant="h3" weight="bold" color={Colors.cta}>340</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Points</AppText>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <Pressable
              key={item.id}
              onPress={handleItemPress}
              style={({ pressed }) => [
                styles.menuItem,
                {
                  opacity: pressed ? 0.7 : 1,
                  borderBottomWidth: idx === menuItems.length - 1 ? 0 : 1,
                },
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.bg }]}>
                <item.icon size={20} color={item.color} strokeWidth={2} />
              </View>
              <AppText variant="body" weight="medium" style={{ flex: 1 }}>
                {item.label}
              </AppText>
              <ChevronRight size={20} color={Colors.textTertiary} strokeWidth={2} />
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <LogOut size={20} color={Colors.error} strokeWidth={2} />
          <AppText variant="body" weight="semiBold" color={Colors.error}>Log Out</AppText>
        </Pressable>

        {/* Development Switch */}
        <AppText variant="caption" color={Colors.textTertiary} align="center" style={{ marginTop: Spacing['5'] }}>
          For Development Testing
        </AppText>
        <Pressable
          onPress={handleSwitchToWorker}
          style={({ pressed }) => [styles.switchBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <ArrowLeftRight size={20} color={Colors.cta} strokeWidth={2} />
          <AppText variant="body" weight="semiBold" color={Colors.cta}>Switch Account</AppText>
        </Pressable>

        <AppText variant="caption" color={Colors.textTertiary} align="center" style={{ marginTop: Spacing['6'] }}>
          Version 1.0.0
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileHeader: {
    backgroundColor: Colors.white, alignItems: 'center',
    paddingHorizontal: Spacing['4'], paddingTop: Spacing['16'], paddingBottom: Spacing['5'],
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatarRow: { position: 'relative' },
  editBtn: {
    position: 'absolute', bottom: 0, right: -4,
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.cta,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white,
  },
  memberBadge: { marginTop: Spacing['3'] },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    marginHorizontal: Spacing['4'], marginTop: -Spacing['2'],
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    ...Elevation.md,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  menuSection: {
    marginHorizontal: Spacing['4'], marginTop: Spacing['5'],
    backgroundColor: Colors.white, borderRadius: Radius.xl, overflow: 'hidden',
    ...Elevation.sm,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing['3'],
    paddingHorizontal: Spacing['4'], paddingVertical: Spacing['4'],
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    width: 40, height: 40, borderRadius: Radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing['2'],
    marginHorizontal: Spacing['4'], marginTop: Spacing['5'],
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    paddingVertical: Spacing['4'], borderWidth: 1.5, borderColor: Colors.error,
    ...Elevation.sm,
  },
  switchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing['2'],
    marginHorizontal: Spacing['4'], marginTop: Spacing['5'],
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    paddingVertical: Spacing['4'], borderWidth: 1.5, borderColor: Colors.primaryBorder,
    ...Elevation.sm,
  },
});
