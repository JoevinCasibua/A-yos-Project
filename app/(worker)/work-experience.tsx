import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { Plus, Pencil, Trash2, Building2, Calendar, Briefcase, Check } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { workerProfile, WorkExperience } from '@/constants/workerData';

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

const emptyForm: Omit<WorkExperience, 'id'> = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

export default function WorkExperienceScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [experiences, setExperiences] = useState<WorkExperience[]>(workerProfile.workExperience);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<WorkExperience, 'id'>>({ ...emptyForm });

  const isEditing = editingId !== null;

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const startAdd = () => {
    resetForm();
    setEditingId('__new__');
  };

  const startEdit = (exp: WorkExperience) => {
    setForm({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      description: exp.description,
    });
    setEditingId(exp.id);
  };

  const handleSave = () => {
    if (!form.company.trim() || !form.role.trim() || !form.startDate.trim()) {
      Alert.alert('Missing Fields', 'Company, Role, and Start Date are required.');
      return;
    }
    if (editingId === '__new__') {
      const newExp: WorkExperience = {
        id: `exp${Date.now()}`,
        ...form,
        endDate: form.isCurrent ? undefined : form.endDate || undefined,
      };
      setExperiences((prev) => [newExp, ...prev]);
    } else {
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, ...form, endDate: form.isCurrent ? undefined : form.endDate || undefined }
            : e,
        ),
      );
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Experience', 'Are you sure you want to remove this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setExperiences((prev) => prev.filter((e) => e.id !== id)) },
    ]);
  };

  return (
    <Screen safeArea scrollable>
      <PageHeader title="Work Experience" from={from} />

      <View style={styles.content}>
        {!isEditing && (
          <AppButton
            label="Add Experience"
            variant="outline"
            fullWidth
            leftIcon={<Plus size={18} color={theme.colors.primary} />}
            onPress={startAdd}
          />
        )}

        {isEditing && (
          <View style={styles.formCard}>
            <Text style={[theme.typography.h4, { marginBottom: theme.spacing.md }]}>
              {editingId === '__new__' ? 'New Experience' : 'Edit Experience'}
            </Text>

            <AppInput
              label="Company"
              value={form.company}
              onChangeText={(v) => setForm((f) => ({ ...f, company: v }))}
              placeholder="e.g. ABC Plumbing"
            />
            <AppInput
              label="Role / Position"
              value={form.role}
              onChangeText={(v) => setForm((f) => ({ ...f, role: v }))}
              placeholder="e.g. Senior Plumber"
            />

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <AppInput
                  label="Start Date"
                  value={form.startDate}
                  onChangeText={(v) => setForm((f) => ({ ...f, startDate: v }))}
                  placeholder="YYYY-MM"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.dateField}>
                <AppInput
                  label="End Date"
                  value={form.isCurrent ? '' : form.endDate}
                  onChangeText={(v) => setForm((f) => ({ ...f, endDate: v }))}
                  placeholder="YYYY-MM"
                  editable={!form.isCurrent}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={theme.typography.body1}>Currently working here</Text>
              <Switch
                value={form.isCurrent}
                onValueChange={(v) => setForm((f) => ({ ...f, isCurrent: v }))}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
                thumbColor={form.isCurrent ? theme.colors.primary : theme.colors.textTertiary}
              />
            </View>

            <AppInput
              label="Description"
              value={form.description}
              onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
              placeholder="Describe your responsibilities"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            <View style={styles.formActions}>
              <AppButton label="Cancel" variant="ghost" size="sm" onPress={resetForm} />
              <AppButton label="Save" variant="primary" size="sm" onPress={handleSave} />
            </View>
          </View>
        )}

        {experiences.length === 0 && (
          <Text style={[theme.typography.body2, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing.xl }]}>
            No work experience added yet. Tap "Add Experience" to get started.
          </Text>
        )}

        {experiences.map((exp) => (
          <View key={exp.id} style={styles.expCard}>
            <View style={styles.expHeader}>
              <View style={styles.expTitleRow}>
                <View style={styles.iconCircle}>
                  <Building2 size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.expTitleContent}>
                  <Text style={theme.typography.body1}>{exp.role}</Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{exp.company}</Text>
                </View>
              </View>
              <View style={styles.expActions}>
                <Pressable onPress={() => startEdit(exp)} hitSlop={8} style={styles.actionBtn}>
                  <Pencil size={16} color={theme.colors.textSecondary} />
                </Pressable>
                <Pressable onPress={() => handleDelete(exp.id)} hitSlop={8} style={styles.actionBtn}>
                  <Trash2 size={16} color={theme.colors.error} />
                </Pressable>
              </View>
            </View>

            <View style={styles.dateBadge}>
              <Calendar size={12} color={theme.colors.textSecondary} />
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginLeft: 4 }]}>
                {formatDate(exp.startDate)} – {exp.isCurrent ? 'Present' : formatDate(exp.endDate!)}
              </Text>
              {exp.isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={[theme.typography.caption, { color: theme.colors.success, fontSize: 10 }]}>Current</Text>
                </View>
              )}
            </View>

            {exp.description ? (
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm, lineHeight: 20 }]}>
                {exp.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
    gap: theme.spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  dateField: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  expCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  expTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  expTitleContent: {
    flex: 1,
  },
  expActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionBtn: {
    padding: theme.spacing.xs,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginLeft: 52,
  },
  currentBadge: {
    backgroundColor: `${theme.colors.success}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    marginLeft: theme.spacing.sm,
  },
});
