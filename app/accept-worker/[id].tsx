import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, X } from 'lucide-react-native';
import { Colors, Layout, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { useRequest } from '@/context/RequestContext';
import { useEffect, useState } from 'react';
import { fetchProviderById } from '@/services/api';
import { selectRecommendedWorker } from '@/services/marketplace';
import type { ProviderData } from '@/components/ProviderCard';

export default function AcceptWorkerModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { request, updateRequest } = useRequest();
  useEffect(() => { if (id) void fetchProviderById(id).then((result) => setProvider(result.data || null)); }, [id]);

  const handleHire = async () => {
    if (!provider || !request.publishedRequestId) { Alert.alert('Unable to hire worker', 'The published request or worker is unavailable.'); return; }
    setSubmitting(true);
    const result = await selectRecommendedWorker(request.publishedRequestId, provider.id);
    setSubmitting(false);
    if (result.error || !result.data) { Alert.alert('Unable to hire worker', result.error?.message || 'Please try again.'); return; }
    updateRequest({
      selectedWorkerId: provider.id,
      status: 'Accepted',
      bookingId: result.data.bookingId,
    });
    // Navigate to payment
    router.replace('/payment' as any);
  };

  if (!provider) return <View style={styles.overlay} />;

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <AppText variant="h3" weight="bold">Hire This Worker?</AppText>
          <Pressable onPress={handleCancel} hitSlop={12} style={styles.closeBtn}>
            <X size={24} color={Colors.textSecondary} />
          </Pressable>
        </View>

        {/* Worker Info */}
        <View style={styles.workerInfo}>
          <Avatar uri={provider.avatarUri} size={60} />
          <View style={{ marginLeft: Spacing['3'], flex: 1 }}>
            <AppText variant="h4" weight="bold">{provider.name}</AppText>
            <AppText variant="bodySm" color={Colors.textSecondary}>{provider.category}</AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <AppText variant="body" weight="bold" color={Colors.cta}>{provider.price}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}> / hr</AppText>
            </View>
          </View>
        </View>

        {/* Message */}
        <View style={styles.messageBox}>
          <CheckCircle2 size={24} color={Colors.cta} style={{ marginBottom: Spacing['2'] }} />
          <AppText variant="body" align="center" style={{ lineHeight: 22 }}>
            Once accepted, <AppText variant="body" weight="bold">{provider.name}</AppText> will be assigned to your request, and you will proceed to payment to finalize the booking.
          </AppText>
        </View>

        {/* Buttons */}
        <View style={styles.footer}>
          <AppButton 
            label="Cancel" 
            variant="outline" 
            onPress={handleCancel} 
            style={styles.actionBtn}
          />
          <AppButton 
            label="Hire Worker" 
            onPress={handleHire} 
            loading={submitting}
            disabled={submitting}
            style={styles.actionBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Layout.screenPadding,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['4'],
  },
  closeBtn: {
    padding: Spacing['1'],
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    marginBottom: Spacing['4'],
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  messageBox: {
    backgroundColor: Colors.primarySurface,
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginBottom: Spacing['6'],
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing['3'],
  },
  actionBtn: {
    flex: 1,
  },
});
