import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, ChevronLeft } from 'lucide-react-native';
import { Colors, Layout, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { useRequest } from '@/context/RequestContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['Morning (8am-12pm)', 'Afternoon (12pm-4pm)', 'Evening (4pm-8pm)'];

export default function ScheduleScreen() {
  const router = useRouter();
  const { request, updateRequest } = useRequest();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [description, setDescription] = useState(request.description || '');

  const handleBack = () => router.back();

  const handleConfirm = () => {
    updateRequest({
      description,
      // You could also save selectedDay/Time to context if needed
    });
    // Navigate directly to the existing payment screen as the single source of truth
    router.push('/payment');
  };

  const isFormValid = selectedDay && selectedTime && description.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Schedule This Week</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Day Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={Colors.primary} />
            <AppText variant="h3" style={styles.sectionTitle}>Select Day</AppText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysContainer}>
            {DAYS.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <Pressable
                  key={day}
                  style={[
                    styles.dayChip,
                    isSelected && styles.dayChipSelected,
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <AppText 
                    style={{ 
                      fontWeight: isSelected ? '700' : '500', 
                      color: isSelected ? Colors.white : Colors.textPrimary 
                    }}
                  >
                    {day}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.primary} />
            <AppText variant="h3" style={styles.sectionTitle}>Select Time</AppText>
          </View>
          <View style={styles.timesContainer}>
            {TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <Pressable
                  key={time}
                  style={[
                    styles.timeCard,
                    isSelected && styles.timeCardSelected
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <AppText 
                    style={{ 
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? Colors.primary : Colors.textPrimary 
                    }}
                  >
                    {time}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <AppText variant="h3" style={[styles.sectionTitle, { marginLeft: 0 }]}>Job Description</AppText>
          <AppText variant="bodySm" color={Colors.textSecondary} style={{ marginBottom: Spacing['3'] }}>
            Describe what needs fixing in detail so the worker arrives prepared.
          </AppText>
          <AppInput
            value={description}
            onChangeText={setDescription}
            placeholder="E.g., The sink in the guest bathroom is leaking from the U-bend..."
            multiline
            numberOfLines={5}
            style={styles.textArea}
          />
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton 
          label="Confirm and Proceed" 
          onPress={handleConfirm} 
          disabled={!isFormValid}
          style={{ backgroundColor: Colors.primary }}
          fullWidth
          size="xl"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: 60,
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Layout.sectionSpacing,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
    marginBottom: Spacing['3'],
  },
  sectionTitle: {
    fontWeight: '700',
  },
  daysContainer: {
    gap: Spacing['3'],
    paddingVertical: Spacing['1'],
  },
  dayChip: {
    paddingHorizontal: Spacing['5'],
    paddingVertical: Spacing['3'],
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timesContainer: {
    gap: Spacing['3'],
  },
  timeCard: {
    padding: Spacing['4'],
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeCardSelected: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  footer: {
    padding: Layout.screenPadding,
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
