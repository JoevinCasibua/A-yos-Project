import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { Wrench, Briefcase, Check, Plus } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { useWorkerProfile } from '@/hooks';
import { INDUSTRIES, SKILLS_BY_INDUSTRY } from '@/constants/workerMockData';

export default function IndustrySkillsScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const { data: workerProfile } = useWorkerProfile();
  const [industry, setIndustry] = useState(workerProfile?.category ?? '');
  const [isEditingIndustry, setIsEditingIndustry] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(workerProfile?.skills ?? []);
  const [rateBySkill, setRateBySkill] = useState<Record<string, number | null>>({});
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const currentIndustryOption = INDUSTRIES.find(
    (i) => i.label.toLowerCase() === industry.toLowerCase(),
  );
  const industryValue = currentIndustryOption?.value || industry.toLowerCase().replace(/\s+/g, '_');

  const availableSkills = SKILLS_BY_INDUSTRY[industryValue] || [];

  const toggleSkill = (value: string) => {
    setSelectedSkills((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Your industry and skills have been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const hasChanges =
    workerProfile != null && (
      industry !== workerProfile.category ||
      selectedSkills.some((s) => !workerProfile!.skills.includes(s)) ||
      workerProfile.skills.some((s) => !selectedSkills.includes(s))
    );

  return (
    <Screen safeArea scrollable>
      <PageHeader title="Industry & Skills" from={from} />

      <View style={styles.content}>
        {/* Industry Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Briefcase size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.h4, { marginLeft: theme.spacing.sm }]}>
              Primary Industry
            </Text>
          </View>

          {!isEditingIndustry ? (
            <Pressable
              style={styles.selectedCard}
              onPress={() => setIsEditingIndustry(true)}
            >
              <View style={styles.selectedCardContent}>
                <Wrench size={18} color={theme.colors.surface} />
                <Text style={[theme.typography.body1, { color: theme.colors.surface, fontWeight: '600', flex: 1, marginLeft: theme.spacing.sm }]}>
                  {industry}
                </Text>
              </View>
              <Text style={[theme.typography.caption, { color: 'rgba(255,255,255,0.7)' }]}>Tap to change</Text>
            </Pressable>
          ) : (
            <View style={styles.editSection}>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginBottom: theme.spacing.sm }}>
                Select your primary trade:
              </Text>
              <View style={styles.industryGrid}>
                {INDUSTRIES.map((ind) => {
                  const isSelected = industry === ind.label;
                  return (
                    <Pressable
                      key={ind.value}
                      style={[styles.industryChip, isSelected && styles.industryChipActive]}
                      onPress={() => {
                        setIndustry(ind.label);
                        setSelectedSkills([]);
                        setRateBySkill({});
                        setIsEditingIndustry(false);
                      }}
                    >
                      <Text style={[styles.industryChipText, isSelected && styles.industryChipTextActive]}>
                        {ind.label}
                      </Text>
                      {isSelected && <Check size={16} color={theme.colors.surface} style={{ marginLeft: 4 }} />}
                    </Pressable>
                  );
                })}
              </View>
              <AppButton
                label="Cancel"
                variant="ghost"
                size="sm"
                onPress={() => {
                  setIsEditingIndustry(false);
                  setIndustry(workerProfile?.category ?? '');
                }}
              />
            </View>
          )}
        </View>

        {/* Skills Section */}
        <View style={styles.skillCard}>
          <View style={styles.sectionTitleRow}>
            <Wrench size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.h4, { marginLeft: theme.spacing.sm }]}>
              {industry} Skills & Services
            </Text>
          </View>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginBottom: theme.spacing.md }}>
            Check all specific services you are qualified to perform:
          </Text>

          <View style={styles.skillsList}>
            {availableSkills.map((skill) => {
              const isChecked = selectedSkills.includes(skill.label);
              return (
                <View key={skill.value} style={styles.skillBlock}>
                  <Pressable
                    style={[styles.skillRow, isChecked && styles.skillRowChecked]}
                    onPress={() => toggleSkill(skill.label)}
                  >
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      {isChecked && <Check size={14} color={theme.colors.surface} />}
                    </View>
                    <Text style={[theme.typography.body2, { fontWeight: isChecked ? '700' : '400' }]}>
                      {skill.label}
                    </Text>
                  </Pressable>
                  {isChecked && (
                    <AppInput
                      label="Your service rate (PHP/₱)"
                      placeholder="Set rate to match this service"
                      keyboardType="decimal-pad"
                      leftIcon={<Text style={styles.currencyPrefix}>₱</Text>}
                      value={
                        rateBySkill[skill.label] == null
                          ? ''
                          : String(rateBySkill[skill.label]! / 100)
                      }
                      onChangeText={(value) => {
                        const normalized = value.replace(/[^0-9.]/g, '');
                        const amount = Number(normalized);
                        setRateBySkill((current) => ({
                          ...current,
                          [skill.label]:
                            normalized && Number.isFinite(amount)
                              ? Math.round(amount * 100)
                              : null,
                        }));
                      }}
                    />
                  )}
                </View>
              );
            })}
            {selectedSkills
              .filter((s) => !availableSkills.some((a) => a.label === s))
              .map((customLabel) => (
                <View key={customLabel} style={styles.skillBlock}>
                  <Pressable
                    style={[styles.skillRow, styles.skillRowChecked]}
                    onPress={() => toggleSkill(customLabel)}
                  >
                    <View style={[styles.checkbox, styles.checkboxChecked]}>
                      <Check size={14} color={theme.colors.surface} />
                    </View>
                    <Text style={[theme.typography.body2, { fontWeight: '700' }]}>
                      {customLabel}
                    </Text>
                  </Pressable>
                  <AppInput
                    label="Your service rate (PHP/₱)"
                    placeholder="Set rate to match this service"
                    keyboardType="decimal-pad"
                    leftIcon={<Text style={styles.currencyPrefix}>₱</Text>}
                    value={
                      rateBySkill[customLabel] == null
                        ? ''
                        : String(rateBySkill[customLabel]! / 100)
                    }
                    onChangeText={(value) => {
                      const normalized = value.replace(/[^0-9.]/g, '');
                      const amount = Number(normalized);
                      setRateBySkill((current) => ({
                        ...current,
                        [customLabel]:
                          normalized && Number.isFinite(amount)
                            ? Math.round(amount * 100)
                            : null,
                      }));
                    }}
                  />
                </View>
              ))}
          </View>

          {!showAddSkill ? (
            <Pressable
              style={styles.addSkillBtn}
              onPress={() => setShowAddSkill(true)}
            >
              <Plus size={18} color={theme.colors.primary} />
              <Text style={[theme.typography.body2, { color: theme.colors.primary, fontWeight: '600' }]}>
                Add custom skill
              </Text>
            </Pressable>
          ) : (
            <View style={styles.addSkillForm}>
              <TextInput
                style={styles.addSkillInput}
                placeholder="Type custom skill name..."
                placeholderTextColor={theme.colors.textTertiary}
                value={customSkillInput}
                onChangeText={setCustomSkillInput}
                autoFocus
              />
              <View style={styles.addSkillActions}>
                <Pressable
                  style={styles.addSkillCancel}
                  onPress={() => { setShowAddSkill(false); setCustomSkillInput(''); }}
                >
                  <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>Cancel</Text>
                </Pressable>
                  <AppButton
                    label="Add"
                    variant="primary"
                    size="sm"
                    fullWidth
                    style={{ flex: 1.5 }}
                  disabled={!customSkillInput.trim()}
                  onPress={() => {
                    const trimmed = customSkillInput.trim();
                    if (trimmed && !selectedSkills.includes(trimmed)) {
                      setSelectedSkills((prev) => [...prev, trimmed]);
                    }
                    setCustomSkillInput('');
                    setShowAddSkill(false);
                  }}
                />
            </View>
          </View>
          )}
        </View>

        <AppButton
          label="Save Changes"
          variant="primary"
          fullWidth
          disabled={!hasChanges}
          onPress={handleSave}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  editSection: {
    gap: theme.spacing.sm,
  },
  industryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  industryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  industryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  industryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  industryChipTextActive: {
    color: theme.colors.surface,
  },
  skillCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  skillsList: {
    gap: theme.spacing.sm,
  },
  skillBlock: {
    gap: theme.spacing.sm,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  skillRowChecked: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}0D`,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  currencyPrefix: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
  },
  addSkillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  addSkillForm: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  addSkillInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addSkillActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  addSkillCancel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
});
