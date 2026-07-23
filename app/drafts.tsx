import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/buttons/Button';
import { theme } from '@/constants/theme';
import { ArrowLeft, Clock, Droplets, Zap, Wrench, Trash2, Calendar, Paintbrush } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDraftStore } from '@/store/useDraftStore';

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Zap,
  Wrench,
  Paintbrush
};

export default function DraftsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const savedDrafts = useDraftStore(state => state.savedDrafts);
  const loadDraft = useDraftStore(state => state.loadDraft);
  const deleteDraft = useDraftStore(state => state.deleteDraft);

  return (
    <Screen safeArea scrollable>
      <View style={[styles.header, { paddingHorizontal: theme.layout.screenPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[theme.typography.h4, { color: theme.colors.textPrimary }]}>Saved Drafts</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {savedDrafts.map(draft => {
          const Icon = iconMap[draft.iconName] || Wrench;
          return (
            <View key={draft.id} style={styles.draftCard}>
              <View style={styles.draftHeader}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: draft.bg }]}>
                    <Icon color={draft.color} size={20} />
                  </View>
                  <Text style={[theme.typography.h4, { marginLeft: theme.spacing.sm }]}>{draft.category}</Text>
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteDraft(draft.id)}>
                  <Trash2 color={theme.colors.error} size={18} />
                </TouchableOpacity>
              </View>

              <Text style={[theme.typography.body1, styles.issueText]} numberOfLines={2}>
                {draft.issue}
              </Text>

              <View style={styles.draftFooter}>
                <View style={styles.metaRow}>
                  <Calendar color={theme.colors.textSecondary} size={14} />
                  <Text style={[theme.typography.caption, styles.metaText]}>{draft.date}</Text>
                  <View style={styles.dotSeparator} />
                  <Clock color={theme.colors.textSecondary} size={14} />
                  <Text style={[theme.typography.caption, styles.metaText]}>{draft.time}</Text>
                </View>
                
                <Button 
                  title="Continue" 
                  size="sm"
                  onPress={() => {
                    loadDraft(draft.id);
                    router.push('/new-request/create');
                  }}
                  style={styles.continueBtn}
                />
              </View>
            </View>
          );
        })}
        
        {savedDrafts.length === 0 && (
          <View style={styles.emptyState}>
            <Clock color={theme.colors.textTertiary} size={48} style={{ marginBottom: theme.spacing.md }} />
            <Text style={theme.typography.h4}>No saved drafts</Text>
            <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.xs }]}>
              Your saved requests will appear here so you can continue them later.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  content: { flex: 1, paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.md },
  
  draftCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.md, marginBottom: theme.spacing.md, ...theme.shadows.sm, borderWidth: 1, borderColor: theme.colors.borderLight },
  draftHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  categoryInfo: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: { padding: 4 },
  
  issueText: { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg },
  
  draftFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { color: theme.colors.textSecondary, marginLeft: 4 },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.textTertiary, marginHorizontal: 8 },
  continueBtn: { minWidth: 90 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, paddingHorizontal: theme.spacing.xl },
});
