import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { theme } from '../../theme';
import { ArrowLeft, User, Mail, Phone, MapPin, Heart, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';

export default function AccountScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const INFO_ITEMS = [
    { id: '1', title: 'Name', value: user?.name || 'Juan Dela Cruz', icon: User },
    { id: '2', title: 'Email Address', value: user?.email || 'juan.delacruz@example.com', icon: Mail },
    { id: '3', title: 'Phone Number', value: user?.phone || '0917 123 4567', icon: Phone },
  ];

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Personal Information</Text>
          <View style={styles.card}>
            {INFO_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={[styles.infoRow, index !== INFO_ITEMS.length - 1 && styles.borderBottom]}>
                  <View style={styles.iconContainer}>
                    <Icon color={theme.colors.textSecondary} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.typography.caption}>{item.title}</Text>
                    <Text style={[theme.typography.body1, { marginTop: 2 }]}>{item.value}</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={[theme.typography.button, { color: theme.colors.primary, fontSize: 14 }]}>Edit</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Manage Details</Text>
          <View style={styles.card}>
            <TouchableOpacity style={[styles.menuItem, styles.borderBottom]}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#e0f2fe' }]}>
                <MapPin color="#0ea5e9" size={20} />
              </View>
              <Text style={[theme.typography.body1, { flex: 1 }]}>Saved Addresses</Text>
              <ChevronRight color={theme.colors.textTertiary} size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#fee2e2' }]}>
                <Heart color="#ef4444" size={20} />
              </View>
              <Text style={[theme.typography.body1, { flex: 1 }]}>Favorite Workers</Text>
              <ChevronRight color={theme.colors.textTertiary} size={20} />
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
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  menuIconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
});
