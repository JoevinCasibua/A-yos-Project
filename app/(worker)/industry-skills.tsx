import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { ChevronLeft, Wrench, X, Briefcase, Check } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/Screen';
import { theme } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppAutocomplete } from '@/components/AppAutocomplete';
import { Chip } from '@/components/Chip';
import { INDUSTRIES, SKILLS_BY_INDUSTRY } from '@/constants/workerMockData';
import { workerProfile } from '@/constants/workerData';

export default function IndustrySkillsScreen() {
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [industry, setIndustry] = useState(workerProfile.category);
  const [isEditingIndustry, setIsEditingIndustry] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(workerProfile.skills);
  const [skillInput, setSkillInput] = useState('');

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

  const addCustomSkill = (text: string) => {
    const exists = selectedSkills.find(
      (s) => s.toLowerCase() === text.toLowerCase(),
    );
    if (!exists) {
      setSelectedSkills((prev) => [...prev, text]);
    }
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Your industry and skills have been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const hasChanges =
    industry !== workerProfile.category ||
    selectedSkills.some((s) => !workerProfile.skills.includes(s)) ||
    workerProfile.skills.some((s) => !selectedSkills.includes(s));

  return (
    <Screen safeArea scrollable>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (from === 'profile') router.push('/(worker)/profile');
            else if (from === 'settings') router.push('/(worker)/settings');
            else router.back();
          }}
          hitSlop={12}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={theme.typography.h4}>Industry & Skills</Text>
        <View style={{ width: 40 }} />
      </View>

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
              <Text style={[theme.typography.caption, { color: 'rgba(255,255,255,0.7)' }]}>Tap to edit</Text>
            </Pressable>
          ) : (
            <View style={styles.editSection}>
              <AppAutocomplete
                value={industry}
                onChangeText={setIndustry}
                onSelect={(option) => {
                  setIndustry(option.label);
                  setIsEditingIndustry(false);
                  setSelectedSkills([]);
                }}
                options={INDUSTRIES}
                placeholder="Type or select your industry"
              />
              <AppButton
                label="Cancel"
                variant="ghost"
                size="sm"
                onPress={() => {
                  setIsEditingIndustry(false);
                  setIndustry(workerProfile.category);
                }}
              />
            </View>
          )}
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Check size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.h4, { marginLeft: theme.spacing.sm }]}>
              Skills
            </Text>
          </View>

          <View style={styles.chipGrid}>
            {selectedSkills.map((skill) => {
              const match = availableSkills.find((s) => s.label === skill);
              return (
                <Chip
                  key={skill}
                  label={match?.label || skill}
                  selected
                  color={theme.colors.primary}
                  onPress={() => toggleSkill(match?.value || skill)}
                  rightIcon={<X size={14} color={theme.colors.surface} />}
                  size="sm"
                />
              );
            })}
          </View>

          <AppAutocomplete
            label="Add Skills"
            value={skillInput}
            onChangeText={setSkillInput}
            options={availableSkills.filter(
              (s) => !selectedSkills.includes(s.label),
            )}
            placeholder="Type or select skills"
            multiSelect
            selectedValues={selectedSkills.map((s) => {
              const m = availableSkills.find((a) => a.label === s);
              return m?.value || s;
            })}
            onToggle={(value) => {
              const match = availableSkills.find((s) => s.value === value);
              const label = match?.label || value;
              setSelectedSkills((prev) =>
                prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label],
              );
              setSkillInput('');
            }}
            onAddCustom={addCustomSkill}
          />

          {selectedSkills.length === 0 && (
            <Text style={[theme.typography.caption, { color: theme.colors.textTertiary, textAlign: 'center', marginTop: theme.spacing.md }]}>
              No skills selected. Start typing to add skills.
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.layout.screenPadding,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
