import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { SearchBar } from '@/components/SearchBar';
import {
  Settings, ArrowLeftRight, Wrench, ChevronRight,
} from 'lucide-react-native';

export default function WorkerSettingsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSwitchToUser = () => {
    router.replace('/(tabs)');
  };

  return (
    <Screen safeArea scrollable>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Settings color={theme.colors.textTertiary} size={24} />
          <Text style={[theme.typography.body1, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm }]}>
            Settings and preferences can be managed from your Profile.
          </Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search settings..."
          style={styles.searchBar}
        />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(worker)/industry-skills')}
        >
          <View style={styles.menuLeft}>
            <Wrench size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.body1, { marginLeft: theme.spacing.md }]}>
              Industry & Skills
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>

        <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing.xl }]}>
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
  infoCard: { alignItems: 'center', padding: theme.spacing.lg },
  searchBar: { marginVertical: theme.spacing.md },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg,
    padding: theme.spacing.md, ...theme.shadows.sm,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, backgroundColor: `${theme.colors.primary}08`, borderRadius: theme.radius.md, marginTop: theme.spacing.sm },
});
