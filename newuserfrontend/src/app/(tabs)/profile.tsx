import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/buttons/Button';
import { theme } from '../../theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronRight, Shield, Bell, CreditCard, Settings, HelpCircle, LogOut, MapPin, Heart, BookOpen, Fingerprint, Wallet } from 'lucide-react-native';
import { Image } from 'expo-image';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'personal', title: 'Personal Information', icon: Fingerprint, route: '/(settings)/account' },
      { id: 'addresses', title: 'Saved Addresses', icon: MapPin, route: '/(settings)/account' },
      { id: 'favorites', title: 'Favorite Workers', icon: Heart, route: '/(settings)/account' },
    ]
  },
  {
    title: 'Payments',
    items: [
      { id: 'payment-methods', title: 'Payment Methods', icon: CreditCard, route: '/(settings)/payment' },
      { id: 'history', title: 'Payment History', icon: BookOpen, route: '/(settings)/payment' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: 'budget', title: 'Budget & Price Range', icon: Wallet, route: '/new-request/budget-config' },
      { id: 'notifications', title: 'Notifications', icon: Bell, route: '/(settings)/preferences' },
      { id: 'appearance', title: 'App Appearance', icon: Settings, route: '/(settings)/preferences' },
    ]
  },
  {
    title: 'Support & Legal',
    items: [
      { id: 'help', title: 'Help Center', icon: HelpCircle, route: '/(settings)/support' },
      { id: 'privacy', title: 'Privacy Policy', icon: Shield, route: '/(settings)/support' },
    ]
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <Screen safeArea scrollable>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Image 
            source="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
            style={styles.avatar} 
            contentFit="cover" 
          />
          <Text style={theme.typography.h3}>{user?.name || 'Juan Dela Cruz'}</Text>
          <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>{user?.email || 'juan.delacruz@example.com'}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={[theme.typography.caption, { color: theme.colors.success }]}>✓ Verified User</Text>
          </View>
        </View>

        {SETTINGS_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={[theme.typography.h4, styles.sectionTitle]}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === section.items.length - 1;
                return (
                  <TouchableOpacity key={item.id} style={[styles.settingItem, !isLast && styles.borderBottom]} onPress={() => router.push(item.route as any)}>
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.xxxl },
  userInfo: { alignItems: 'center', marginVertical: theme.spacing.xl },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: theme.colors.border, marginBottom: theme.spacing.sm },
  verifiedBadge: { backgroundColor: `${theme.colors.success}15`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radius.sm, marginTop: theme.spacing.xs },
  section: { marginBottom: theme.spacing.xl },
  sectionTitle: { marginBottom: theme.spacing.md, marginLeft: theme.spacing.xs },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  settingText: { flex: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, backgroundColor: `${theme.colors.error}10`, borderRadius: theme.radius.md, marginTop: theme.spacing.md, marginBottom: theme.spacing.xxxl },
});
