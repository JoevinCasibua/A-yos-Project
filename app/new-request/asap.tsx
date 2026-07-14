import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Edit3, Image as ImageIcon, Map as MapIcon, Check, Wallet, Banknote, CreditCard, ChevronLeft, Info } from 'lucide-react-native';
import { Colors, Layout, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Chip } from '@/components/Chip';
import { useRequest } from '@/context/RequestContext';

export default function ReviewRequestScreen() {
  const router = useRouter();
  const { request, updateRequest } = useRequest();
  
  const [location, setLocation] = useState(request.location);
  const [isLoadingLocation, setIsLoadingLocation] = useState(!request.location);
  const [paymentMethod, setPaymentMethod] = useState('GCash');

  const PAYMENT_METHODS = [
    { id: 'GCash', icon: <Wallet size={24} color={Colors.textPrimary} strokeWidth={2} />, subtitle: '0917 •••• 1234' },
    { id: 'Credit / Debit Card', icon: <CreditCard size={24} color={Colors.textPrimary} strokeWidth={2} />, subtitle: 'Visa ending in 4242' },
    { id: 'Cash on Service', icon: <Banknote size={24} color={Colors.textPrimary} strokeWidth={2} />, subtitle: 'Pay directly to provider' }
  ];

  useEffect(() => {
    if (!request.location) {
      // Mock location immediately to avoid Expo Go native module errors
      const mockLoc = { latitude: 37.78825, longitude: -122.4324, address: '123 Main St, San Francisco' };
      setLocation(mockLoc);
      updateRequest({ location: mockLoc });
      setIsLoadingLocation(false);
    }
  }, []);

  const handleBack = () => router.back();

  const handlePostRequest = () => {
    if (request.urgency === 'ASAP') {
      updateRequest({ status: 'Searching' });
      router.push('/payment');
    } else {
      router.push('/new-request/bidding' as any);
    }
  };

  const isASAP = request.urgency === 'ASAP';
  const getPrimaryButtonText = () => {
    if (isASAP) return 'Confirm & Proceed';
    return 'Confirm & Post for Bidding';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Review Request</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Photos Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3" style={styles.sectionTitle}>Photos</AppText>
            <Pressable onPress={() => router.push('/new-request/create' as any)}>
              <Edit3 size={18} color={Colors.primary} />
            </Pressable>
          </View>
          {request.photos && request.photos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroll}>
              {request.photos.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.photo} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noPhoto}>
              <ImageIcon size={24} color={Colors.textTertiary} />
              <AppText variant="caption" style={{ color: Colors.textTertiary }}>No photos provided</AppText>
            </View>
          )}
        </View>

        {/* Details Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3" style={styles.sectionTitle}>Job Details</AppText>
            <Pressable onPress={() => router.push('/new-request/issue-summary' as any)}>
              <Edit3 size={18} color={Colors.primary} />
            </Pressable>
          </View>
          <View style={styles.card}>
            <AppText variant="body" style={styles.summaryText}>{request.aiSummary}</AppText>
            <View style={styles.chipRow}>
              {request.category && <Chip label={request.category} style={styles.chip} />}
              <Chip 
                label={request.urgency || 'Unspecified Urgency'} 
                selected 
                color={Colors.primary}
                style={styles.chip}
              />
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3" style={styles.sectionTitle}>Location</AppText>
          </View>
          <View style={styles.mapCard}>
            {isLoadingLocation || !location ? (
              <View style={styles.mapPlaceholder}>
                <AppText>Locating...</AppText>
              </View>
            ) : (
              <View style={[styles.mapPlaceholder, { backgroundColor: Colors.primarySurface }]}>
                <MapIcon size={32} color={Colors.primary} />
                <AppText style={{ marginTop: 8, color: Colors.primary, fontWeight: '600' }}>Location Pinned</AppText>
              </View>
            )}
            <View style={styles.addressBar}>
              <MapPin size={18} color={Colors.primary} />
              <AppText variant="body" style={styles.addressText} numberOfLines={1}>
                {location?.address || 'Detecting address...'}
              </AppText>
            </View>
          </View>
        </View>


      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>

        
        <AppButton
          label={getPrimaryButtonText()}
          size="xl"
          fullWidth
          onPress={handlePostRequest}
          style={{ backgroundColor: Colors.primary, borderRadius: Radius.lg }}
          labelStyle={{ color: Colors.white }}
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing['4'], paddingTop: Spacing['4'], paddingBottom: Spacing['4'],
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: Colors.textPrimary,
  },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: 160,
  },
  section: {
    marginBottom: Spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontWeight: '700',
  },
  photoScroll: {
    gap: Spacing[3],
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    marginRight: Spacing[2],
  },
  noPhoto: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surfaceCard,
    padding: Spacing[4],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing[2],
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: Spacing[2],
  },
  methodsList: { gap: Spacing['3'] },
  methodCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing['4'], borderWidth: 1, gap: Spacing['3'],
  },
  methodIcon: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center',
  },
  methodInfo: { flex: 1 },
  selectedCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.textPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  unselectedCircle: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.textTertiary,
  },
  mapCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceCard,
  },
  mapPlaceholder: {
    height: 140,
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[3],
    backgroundColor: Colors.surfaceCard,
    gap: Spacing[2],
  },
  addressText: {
    flex: 1,
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'transparent', 
    paddingHorizontal: Spacing['4'], paddingBottom: Spacing['6'],
  },
  securityNote: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.successBg,
    padding: Spacing['3'],
    borderRadius: Radius.md,
    gap: Spacing['2'], 
    marginBottom: Spacing['4'],
  },
});
