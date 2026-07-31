import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { theme, Colors, Radius, Spacing, Layout } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { PulsingDot } from '@/components/PulsingDot';

interface DispatchOfferProps {
  category: string;
  area: string;
  distance: string;
  budget: string;
  postedTime: string;
  description: string;
  status?: 'pending' | 'accepted' | 'declined';
  onAccept?: () => void;
  onDecline?: () => void;
  onPress?: () => void;
}

export const DispatchOffer = React.memo(function DispatchOffer({
  category,
  area,
  distance,
  budget,
  postedTime,
  description,
  status = 'pending',
  onAccept = () => {},
  onDecline = () => {},
  onPress,
}: DispatchOfferProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <PulsingDot color={Colors.primary} size={8} />
        <AppText variant="overline" color={Colors.primary}>
          Nearby {category} request
        </AppText>
      </View>

      <View style={styles.divider} />

      <AppText
        style={styles.title}
        numberOfLines={3}
      >
        {description}
      </AppText>

      <View style={styles.locationRow}>
        <MapPin size={14} color={Colors.textSecondary} />
        <AppText variant="caption" color={Colors.textSecondary}>
          {area}
        </AppText>
      </View>

      <View style={styles.infoStrip}>
        <View style={styles.infoCol}>
          <AppText style={styles.infoLabel}>Distance</AppText>
          <AppText style={styles.infoValue}>{distance}</AppText>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoCol}>
          <AppText style={styles.infoLabel}>Offer</AppText>
          <AppText style={styles.infoValue}>{budget}</AppText>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoCol}>
          <AppText style={styles.infoLabel}>Posted</AppText>
          <AppText style={styles.infoValue}>{postedTime}</AppText>
        </View>
      </View>

      {status === 'accepted' ? (
        <View style={styles.feedbackAccepted}>
          <AppText style={styles.feedbackAcceptedText}>✓ Request accepted</AppText>
        </View>
      ) : status === 'declined' ? (
        <View style={styles.feedbackDeclined}>
          <AppText style={styles.feedbackDeclinedText}>Request declined</AppText>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <AppButton
            label="Decline"
            variant="outline"
            size="sm"
            pressedColor={Colors.errorBg}
            onPress={(e: any) => { e.stopPropagation?.(); onDecline(); }}
            labelStyle={{ color: Colors.error }}
            style={styles.btnDecline}
          />
          <AppButton
            label="Accept request"
            variant="primary"
            size="sm"
            onPress={(e: any) => { e.stopPropagation?.(); onAccept(); }}
            style={styles.btnAccept}
          />
        </View>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Layout.cardPadding,
    ...theme.shadows.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing['3'],
  },
  title: {
    ...theme.typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing['3'],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['1'],
    marginBottom: Spacing['4'],
  },
  infoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing['3'],
    paddingHorizontal: Spacing['4'],
    marginBottom: Spacing['4'],
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    ...theme.typography.caption,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    ...theme.typography.body2,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.divider,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing['3'],
  },
  btnDecline: {
    flex: 1,
    borderColor: Colors.error,
  },
  btnAccept: {
    flex: 2,
  },
  feedbackAccepted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3'],
    borderRadius: Radius.lg,
    backgroundColor: Colors.successBg,
    borderWidth: 1.5,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  feedbackAcceptedText: {
    color: Colors.success,
    fontWeight: '600',
    fontSize: 14,
  },
  feedbackDeclined: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3'],
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: Colors.divider,
  },
  feedbackDeclinedText: {
    color: Colors.textTertiary,
    fontWeight: '600',
    fontSize: 14,
  },
});
