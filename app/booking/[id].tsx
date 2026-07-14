import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Check, MapPin, Clock, Calendar } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { RatingStars } from '@/components/RatingStars';
import { providers, weekDays, timeSlots } from '@/constants/mockData';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const provider = providers.find((p) => p.id === id) || providers[0];

  const [selectedDay, setSelectedDay] = useState('2');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [address, setAddress] = useState('123 Oak Street, Apt 4B');
  const [notes, setNotes] = useState('');

  const handleBack = useCallback(() => router.back(), []);
  const handleContinue = useCallback(() => {
    router.push('/payment');
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold">Schedule Booking</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Provider Summary */}
        <View style={styles.providerSummary}>
          <Avatar uri={provider.avatarUri} size={48} />
          <View style={styles.providerInfo}>
            <View style={styles.providerNameRow}>
              <AppText variant="body" weight="bold">{provider.name}</AppText>
              {provider.verified && <Badge label="Verified" variant="verified" />}
            </View>
            <AppText variant="caption" color={Colors.textSecondary}>{provider.category}</AppText>
            <RatingStars rating={provider.rating} size={13} showValue reviewCount={provider.reviewCount} />
          </View>
          <AppText variant="h4" weight="bold" color={Colors.cta}>{provider.price}</AppText>
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Calendar size={18} color={Colors.cta} strokeWidth={2} />
            <AppText variant="body" weight="semiBold">Select Date</AppText>
          </View>
          <View style={styles.weekRow}>
            {weekDays.map((d) => (
              <Pressable
                key={d.id}
                onPress={() => setSelectedDay(d.id)}
                style={[
                  styles.dayCard,
                  {
                    backgroundColor: selectedDay === d.id ? Colors.cta : Colors.white,
                    borderColor: selectedDay === d.id ? Colors.cta : Colors.border,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  weight="semiBold"
                  color={selectedDay === d.id ? Colors.white : Colors.textSecondary}
                >
                  {d.day}
                </AppText>
                <AppText
                  variant="h4"
                  weight="bold"
                  color={selectedDay === d.id ? Colors.white : Colors.textPrimary}
                  style={{ marginTop: 2 }}
                >
                  {d.date}
                </AppText>
                {d.today && (
                  <View style={[styles.todayDot, { backgroundColor: selectedDay === d.id ? Colors.white : Colors.cta }]} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Select Time */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Clock size={18} color={Colors.cta} strokeWidth={2} />
            <AppText variant="body" weight="semiBold">Select Time</AppText>
          </View>
          <View style={styles.slotsGrid}>
            {timeSlots.map((slot) => (
              <Pressable
                key={slot.id}
                disabled={!slot.available}
                onPress={() => setSelectedSlot(slot.id)}
                style={[
                  styles.slotCard,
                  {
                    backgroundColor: selectedSlot === slot.id ? Colors.cta : Colors.white,
                    borderColor: selectedSlot === slot.id ? Colors.cta : slot.available ? Colors.border : Colors.borderLight,
                    opacity: slot.available ? 1 : 0.4,
                  },
                ]}
              >
                <AppText
                  variant="bodySm"
                  weight="semiBold"
                  color={selectedSlot === slot.id ? Colors.white : slot.available ? Colors.textPrimary : Colors.textTertiary}
                >
                  {slot.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Service Address */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MapPin size={18} color={Colors.cta} strokeWidth={2} />
            <AppText variant="body" weight="semiBold">Service Address</AppText>
          </View>
          <AppInput
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            style={{ marginTop: Spacing['3'] }}
            leftIcon={<MapPin size={20} color={Colors.textTertiary} strokeWidth={2} />}
          />
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <AppText variant="body" weight="semiBold">Additional Notes</AppText>
          <AppInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe the issue or special requests..."
            multiline
            numberOfLines={4}
            style={{ marginTop: Spacing['3'] }}
            inputStyle={{ minHeight: 80, textAlignVertical: 'top' }}
          />
        </View>

        {/* Price Summary */}
        <View style={[styles.section, { paddingBottom: Spacing['4'] }]}>
          <AppText variant="body" weight="semiBold">Price Summary</AppText>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <AppText variant="bodySm" color={Colors.textSecondary}>Service Rate</AppText>
              <AppText variant="bodySm" weight="semiBold">{provider.price}</AppText>
            </View>
            <View style={styles.priceRow}>
              <AppText variant="bodySm" color={Colors.textSecondary}>Booking Fee</AppText>
              <AppText variant="bodySm" weight="semiBold">$5.00</AppText>
            </View>
            <View style={styles.priceRow}>
              <AppText variant="bodySm" color={Colors.textSecondary}>First-time Discount</AppText>
              <AppText variant="bodySm" weight="semiBold" color={Colors.success}>-$9.00</AppText>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <AppText variant="body" weight="bold">Total</AppText>
              <AppText variant="h4" weight="bold" color={Colors.cta}>$41.00</AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <AppButton
          label="Continue to Payment"
          size="lg"
          fullWidth
          onPress={handleContinue}
          disabled={!selectedSlot}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'], paddingTop: Spacing['3'], paddingBottom: Spacing['3'],
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.full, backgroundColor: Colors.surfaceLight },
  providerSummary: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing['4'], marginTop: Spacing['4'],
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    gap: Spacing['3'], ...Elevation.sm,
  },
  providerInfo: { flex: 1 },
  providerNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'], flexWrap: 'wrap' },
  section: { marginTop: Spacing['6'], paddingHorizontal: Spacing['4'] },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'] },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing['3'] },
  dayCard: {
    width: 44, height: 64, borderRadius: Radius.lg, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  todayDot: { position: 'absolute', bottom: 6, width: 5, height: 5, borderRadius: 2.5 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing['3'], marginTop: Spacing['3'] },
  slotCard: {
    width: 100, height: 44, borderRadius: Radius.lg, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  priceCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    marginTop: Spacing['3'], ...Elevation.sm,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing['2'] },
  priceDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing['2'] },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, paddingHorizontal: Spacing['4'], paddingVertical: Spacing['3'],
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
});
