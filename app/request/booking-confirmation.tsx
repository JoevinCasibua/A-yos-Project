import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, CalendarDays } from 'lucide-react-native';
import { Colors, Layout, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { useRequest } from '@/context/RequestContext';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { request, resetRequest } = useRequest();

  const handleViewBookings = () => {
    resetRequest();
    // Navigate to the bookings tab and reset the stack
    router.replace('/(tabs)/bookings');
  };

  const handleGoHome = () => {
    resetRequest();
    router.replace('/');
  };

  const statusStr = request.urgency === 'ASAP' ? 'En Route (ASAP)' : 'Offer Accepted';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircle2 size={80} color={Colors.success} strokeWidth={1.5} />
        
        <AppText variant="h2" style={styles.title}>Worker Assigned!</AppText>
        <AppText variant="body" style={styles.subtitle}>
          {request.urgency === 'ASAP' 
            ? 'We found an available worker for your emergency request.'
            : 'You have successfully accepted the offer. The worker has been notified.'}
        </AppText>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <CheckCircle2 size={24} color={Colors.primary} />
            <View style={styles.cardInfo}>
              <AppText style={{ fontWeight: '600' }}>{statusStr}</AppText>
              <AppText variant="caption" style={{ color: Colors.textSecondary }}>Waiting for worker to arrive</AppText>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <View style={styles.cardInfo}>
              <AppText variant="caption" style={{ color: Colors.textSecondary }}>Worker ID</AppText>
              <AppText style={{ fontWeight: '600' }}>{request.selectedWorkerId}</AppText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton 
          label="View in My Bookings" 
          onPress={handleViewBookings} 
          style={{ marginBottom: Spacing[3] }}
        />
        <AppButton 
          label="Back to Home" 
          variant="outline"
          onPress={handleGoHome} 
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
  content: {
    flex: 1,
    padding: Layout.screenPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    marginTop: Spacing[6],
    marginBottom: Spacing[2],
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing[8],
    paddingHorizontal: Spacing[4],
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  cardInfo: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing[4],
  },
  footer: {
    padding: Layout.screenPadding,
    paddingBottom: 40,
  },
});
