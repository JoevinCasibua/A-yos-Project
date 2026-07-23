import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, Bell, Settings, Moon, Globe } from 'lucide-react-native';

export default function PreferencesScreen() {
  const router = useRouter();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Notifications</Text>
          <View style={styles.card}>
            <View style={[styles.settingRow, styles.borderBottom]}>
              <View style={[styles.iconContainer, { backgroundColor: '#fef3c7' }]}>
                <Bell color="#f59e0b" size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.body1}>Push Notifications</Text>
                <Text style={theme.typography.caption}>Receive alerts on your device</Text>
              </View>
              <Switch 
                value={pushEnabled} 
                onValueChange={setPushEnabled} 
                trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }} 
              />
            </View>

            <View style={[styles.settingRow, styles.borderBottom]}>
              <View style={styles.iconContainerSpacer} />
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.body1}>Email Updates</Text>
              </View>
              <Switch 
                value={emailEnabled} 
                onValueChange={setEmailEnabled} 
                trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }} 
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.iconContainerSpacer} />
              <View style={{ flex: 1 }}>
                <Text style={theme.typography.body1}>SMS Alerts</Text>
              </View>
              <Switch 
                value={smsEnabled} 
                onValueChange={setSmsEnabled} 
                trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }} 
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>App Appearance</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Language & Region</Text>
          <View style={styles.card}>
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
  sectionTitle: { marginBottom: theme.spacing.md, marginLeft: theme.spacing.xs },
  
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  iconContainerSpacer: { width: 40, marginRight: theme.spacing.md },
});
