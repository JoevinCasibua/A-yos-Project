import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import {
  Settings, ArrowLeftRight,
} from 'lucide-react-native';

export default function WorkerSettingsScreen() {
  const router = useRouter();

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
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingBottom: theme.spacing.xxxl, justifyContent: 'center' },
  infoCard: { alignItems: 'center', padding: theme.spacing.lg },
  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.md, backgroundColor: `${theme.colors.primary}08`, borderRadius: theme.radius.md, marginTop: theme.spacing.sm },
});
