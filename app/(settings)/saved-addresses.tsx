import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, MapPin, Plus } from 'lucide-react-native';

export default function SavedAddressesScreen() {
  const router = useRouter();

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Saved Addresses</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Plus color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.emptyState}>
              <View style={[styles.emptyStateIcon, { backgroundColor: '#e0f2fe' }]}>
                <MapPin color="#0ea5e9" size={32} />
              </View>
              <Text style={[theme.typography.body1, { marginTop: 16, textAlign: 'center' }]}>No saved addresses yet</Text>
              <Text style={[theme.typography.caption, { textAlign: 'center', marginTop: 8 }]}>Add an address to make booking faster</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  addBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.md },
  
  section: { marginBottom: theme.spacing.xl },
  card: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.sm, overflow: 'hidden' },
  
  emptyState: { padding: theme.spacing.xxxl, alignItems: 'center', justifyContent: 'center' },
  emptyStateIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
});
