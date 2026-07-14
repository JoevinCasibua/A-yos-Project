import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  ChevronRight,
  Edit3,
  LogOut,
  Star,
} from 'lucide-react-native';
import { Colors, Radius, Spacing, Elevation, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';

interface MenuItem {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  color: string;
  bg: string;
}

interface Stat {
  value: string | number;
  label: string;
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  iconColor?: string;
}

interface ProfileScreenProps {
  avatarUri: string;
  name: string;
  subtitle: string;
  badge?: { label: string; variant: 'verified' | 'warning' | 'error' | 'neutral' };
  caption?: string;
  stats: Stat[];
  menuItems: MenuItem[];
  devLabel?: string;
  onSwitchAccount?: () => void;
  onLogout?: () => void;
  onMenuItemPress?: (id: string) => void;
}

export function ProfileScreen({
  avatarUri,
  name,
  subtitle,
  badge,
  caption,
  stats,
  menuItems,
  devLabel,
  onSwitchAccount,
  onLogout,
  onMenuItemPress,
}: ProfileScreenProps) {
  const handleItemPress = React.useCallback(() => {}, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            <Avatar uri={avatarUri} size={80} />
            <Pressable style={styles.editBtn}>
              <Edit3 size={16} color={Colors.white} strokeWidth={2} />
            </Pressable>
          </View>
          <AppText variant="h3" weight="bold" style={{ marginTop: Spacing['3'] }}>
            {name}
          </AppText>
          <AppText variant="bodySm" color={Colors.textSecondary}>
            {subtitle}
          </AppText>
          {badge && (
            <View style={styles.badgeRow}>
              <Badge label={badge.label} variant={badge.variant} size="md" />
            </View>
          )}
          {caption && (
            <AppText variant="caption" color={Colors.cta} weight="semiBold" style={{ marginTop: Spacing['2'] }}>
              {caption}
            </AppText>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              {idx > 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                {stat.icon ? (
                  <View style={styles.ratingStat}>
                    {React.createElement(stat.icon as React.ComponentType<any>, {
                      size: 14,
                      color: stat.iconColor ?? Colors.star,
                      fill: stat.iconColor ?? Colors.star,
                      strokeWidth: 0,
                    })}
                    <AppText variant="h3" weight="bold" color={Colors.cta}>{stat.value}</AppText>
                  </View>
                ) : (
                  <AppText variant="h3" weight="bold" color={Colors.cta}>{stat.value}</AppText>
                )}
                <AppText variant="caption" color={Colors.textSecondary}>{stat.label}</AppText>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <Pressable
              key={item.id}
              onPress={() => onMenuItemPress?.(item.id) ?? handleItemPress()}
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
          onPress={onLogout}
          style={({ pressed }) => [styles.logoutBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <LogOut size={20} color={Colors.error} strokeWidth={2} />
          <AppText variant="body" weight="semiBold" color={Colors.error}>Log Out</AppText>
        </Pressable>

        {/* Development Switch */}
        {devLabel && onSwitchAccount && (
          <>
            <AppText variant="caption" color={Colors.textTertiary} align="center" style={{ marginTop: Spacing['5'] }}>
              {devLabel}
            </AppText>
            <Pressable
              onPress={onSwitchAccount}
              style={({ pressed }) => [styles.switchBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <AppText variant="body" weight="semiBold" color={Colors.cta}>Switch Account</AppText>
            </Pressable>
          </>
        )}

        <AppText variant="caption" color={Colors.textTertiary} align="center" style={{ marginTop: Spacing['6'] }}>
          Version 1.0.0
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  profileHeader: {
    backgroundColor: Colors.white, alignItems: 'center',
    paddingHorizontal: Spacing['4'], paddingTop: Spacing['16'], paddingBottom: Spacing['5'],
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  avatarRow: { position: 'relative' },
  editBtn: {
    position: 'absolute', bottom: 0, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.cta, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  badgeRow: { marginTop: Spacing['3'] },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    marginHorizontal: Spacing['4'], marginTop: -Spacing['2'],
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    ...Elevation.md,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  ratingStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
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
    marginHorizontal: Spacing['4'], marginTop: Spacing['2'],
    backgroundColor: Colors.white, borderRadius: Radius.lg, paddingVertical: Spacing['4'],
    borderWidth: 1.5, borderColor: Colors.primaryBorder,
    ...Elevation.sm,
  },
});
