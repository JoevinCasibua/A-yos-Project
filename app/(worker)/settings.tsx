import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import {
  ChevronRight, User, Wrench, MapPin, Briefcase,
  Wallet, Clock, Bell, Settings, HelpCircle, Shield,
  LogOut, ArrowLeftRight,
} from 'lucide-react-native';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'personal', title: 'Personal Information', icon: User },
      { id: 'industry', title: 'Industry & Skills', icon: Wrench },
      { id: 'areas', title: 'Service Areas', icon: MapPin },
      { id: 'portfolio', title: 'Portfolio', icon: Briefcase },
    ],
  },
  {
    title: 'Payments',
    items: [
      { id: 'payout-methods', title: 'Payout Methods', icon: Wallet },
      { id: 'payout-history', title: 'Payout History', icon: Clock },
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

export default function WorkerSettingsScreen() {
  const router = useRouter();

  const handleItemPress = () => {
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
        <Text style={theme.typography.h2}>Settings</Text>
      </View>

      <View style={styles.content}>
        {SETTINGS_SECTIONS.map((section) => (
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
                    onPress={handleItemPress}
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
