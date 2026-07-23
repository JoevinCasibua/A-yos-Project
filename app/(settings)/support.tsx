import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { ArrowLeft, HelpCircle, Shield, FileText, MessageSquare, ChevronRight, AlertTriangle } from 'lucide-react-native';

export default function SupportScreen() {
  const router = useRouter();

  const SUPPORT_ITEMS = [
    { id: '1', title: 'Help Center', subtitle: 'FAQs and guides', icon: HelpCircle, color: '#3b82f6', bg: '#dbeafe', route: null },
    { id: '2', title: 'Contact Us', subtitle: 'Chat with our support team', icon: MessageSquare, color: '#10b981', bg: '#d1fae5', route: null },
    { id: '3', title: 'Report a User', subtitle: 'Report misconduct or block someone', icon: AlertTriangle, color: '#ef4444', bg: '#fee2e2', route: '/(settings)/report-user' },
  ];

  const LEGAL_ITEMS = [
    { id: '4', title: 'Privacy Policy', subtitle: 'How we protect your data', icon: Shield, color: '#f59e0b', bg: '#fef3c7', route: null },
    { id: '5', title: 'Terms of Service', subtitle: 'Rules and guidelines', icon: FileText, color: '#6366f1', bg: '#e0e7ff', route: null },
  ];

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Support & Legal</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Support</Text>
          <View style={styles.card}>
            {SUPPORT_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.menuRow, index !== SUPPORT_ITEMS.length - 1 && styles.borderBottom]}
                  onPress={() => item.route ? router.push(item.route as any) : null}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                    <Icon color={item.color} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.typography.body1}>{item.title}</Text>
                    <Text style={theme.typography.caption}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight color={theme.colors.textTertiary} size={20} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.h4, styles.sectionTitle]}>Legal</Text>
          <View style={styles.card}>
            {LEGAL_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.menuRow, index !== LEGAL_ITEMS.length - 1 && styles.borderBottom]}
                  onPress={() => item.route ? router.push(item.route as any) : null}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
                    <Icon color={item.color} size={20} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.typography.body1}>{item.title}</Text>
                    <Text style={theme.typography.caption}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight color={theme.colors.textTertiary} size={20} />
                </TouchableOpacity>
              );
            })}
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
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
});
