import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, Moon, Globe } from 'lucide-react-native';

export default function AppearanceScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>App Appearance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={[styles.settingRow, styles.borderBottom]}>
              <View style={[styles.iconContainer, { backgroundColor: '#e0e7ff' }]}>
                <Moon color="#6366f1" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.body1}>Dark Mode</Text>
              </View>
              <Switch 
                value={darkMode} 
                onValueChange={setDarkMode} 
                trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }} 
              />
            </View>

            <TouchableOpacity style={styles.settingRow}>
              <View style={[styles.iconContainer, { backgroundColor: '#d1fae5' }]}>
                <Globe color="#10b981" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.body1}>Language</Text>
                <Text style={theme.typography.caption}>English (US)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.md },
  
  section: { marginBottom: theme.spacing.xl },
  
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
});
