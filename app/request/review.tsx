import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
// Removed react-native-maps and expo-location to fix Expo Go crash
import { MapPin, Edit3, Image as ImageIcon, Map as MapIcon } from 'lucide-react-native';
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
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const PAYMENT_METHODS = [
    { id: 'Cash', icon: '💵' },
    { id: 'GCash', icon: '📱' },
    { id: 'PayMaya', icon: '💳' },
    { id: 'Credit Card', icon: '🏦' }
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

  const handlePostRequest = () => {
    if (request.urgency === 'ASAP') {
      updateRequest({ status: 'Searching' });
      router.push('/request/live-matching');
    } else {
      router.push('/request/open-bids' as any);
    }
  };

  const getPrimaryButtonText = () => {
    if (request.urgency === 'ASAP') return 'Post Request Now';
    return 'Post for Bidding';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Photos Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3" style={styles.sectionTitle}>Photos</AppText>
            <Pressable onPress={() => router.push('/request/create')}>
              <Edit3 size={18} color={Colors.primary} />
            </Pressable>
          </View>
          {request.photos.length > 0 ? (
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
            <AppText variant="h3" style={styles.sectionTitle}>Issue Details</AppText>
            <Pressable onPress={() => router.push('/request/ai-summary')}>
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
                color={request.urgency === 'ASAP' ? Colors.error : Colors.cta}
                style={styles.chip}
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h3" style={styles.sectionTitle}>Payment Method</AppText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paymentScroll}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.id;
              return (
                <Pressable
                  key={method.id}
                  style={[
                    styles.paymentCard,
                    isSelected && styles.paymentCardSelected
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                >
                  <AppText style={styles.paymentIcon}>{method.icon}</AppText>
                  <AppText 
                    variant="caption" 
                    style={{ 
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? Colors.cta : Colors.textPrimary 
                    }}
                  >
                    {method.id}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
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

      <View style={styles.footer}>
        <AppText variant="caption" style={styles.estimateText}>
          Estimated Price: <AppText style={{ fontWeight: '700' }}>$50 - $120</AppText>
        </AppText>
        <AppButton 
          label={getPrimaryButtonText()} 
          onPress={handlePostRequest} 
          variant={request.urgency === 'ASAP' ? 'danger' : 'primary'}
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
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: 40,
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
  paymentScroll: {
    gap: Spacing[3],
    paddingRight: Spacing[4],
  },
  paymentCard: {
    backgroundColor: Colors.surfaceCard,
    padding: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  paymentCardSelected: {
    borderColor: Colors.cta,
    backgroundColor: Colors.surfaceLight,
  },
  paymentIcon: {
    fontSize: 20,
    marginBottom: Spacing[1],
  },
  mapCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceCard,
  },
  map: {
    height: 140,
    width: '100%',
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
  footer: {
    padding: Layout.screenPadding,
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  estimateText: {
    textAlign: 'center',
    marginBottom: Spacing[3],
    color: Colors.textSecondary,
  },
});
