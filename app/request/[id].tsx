import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ArrowLeft, CheckCircle, Clock3, MessageSquare } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout, Spacing, Radius, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { JobSummary } from '@/components/JobSummary';
import { ProviderCard } from '@/components/ProviderCard';
import { providers } from '@/constants/mockData';
import { useRequest } from '@/context/RequestContext';

export default function RequestDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { request } = useRequest();
  
  // Mock applicants data based on providers
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load applicants if the status is Posted
    if (request.status !== 'Posted') {
      setIsLoading(false);
      return;
    }

    // Simulate waiting for workers
    const timer = setTimeout(() => {
      if (request.urgency === 'Open Bidding') {
        // Mock Bids
        setApplicants([
          {
            ...providers[0],
            estimatedPrice: '₱450',
            eta: '2 hours',
            message: 'I can swing by tomorrow morning to fix this! Should be a quick job.',
          },
          {
            ...providers[1],
            estimatedPrice: '₱550',
            eta: '3-4 hours',
            message: 'Available anytime this week. I specialize in these types of repairs.',
          },
        ]);
      } else {
        // Mock standard applicants
        setApplicants([
          {
            ...providers[0],
            estimatedPrice: '₱600/hr',
            eta: '15 mins away',
            message: 'Hi! I can repair your issue right now. I have 6 years of experience.',
          },
          {
            ...providers[1],
            estimatedPrice: '₱500/hr',
            eta: '30 mins away',
            message: 'Available to help you today! Let me know if you need me.',
          },
        ]);
      }
      setIsLoading(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [request.status, request.urgency]);

  const handleBack = () => router.back();

  const assignedWorker = request.selectedWorkerId ? providers.find(p => p.id === request.selectedWorkerId) : null;
  const isBidding = request.urgency === 'Open Bidding';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack} hitSlop={12}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Request Details</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Highlighted Job Summary at the top */}
        <View style={[styles.section, styles.highlightBox]}>
          <AppText variant="h3" weight="bold" style={[styles.sectionTitle, { marginBottom: Spacing['3'] }]}>Request Summary</AppText>
          <JobSummary request={request} showEditButtons={request.status === 'Draft' || request.status === 'Posted'} compact={true} />
        </View>

        {/* Dynamic State Rendering */}
        {request.status === 'Posted' ? (
          <View style={styles.section}>
            <View style={styles.statusAlert}>
              <AppText variant="h4" weight="bold" color={Colors.white}>
                {isBidding ? 'Waiting for Bids' : 'Waiting for Workers'}
              </AppText>
              <AppText variant="caption" color={Colors.white} style={{ opacity: 0.9, marginTop: 4 }}>
                {isBidding ? 'Workers are reviewing your request and will submit offers shortly.' : 'Your request is posted. Workers are reviewing it.'}
              </AppText>
            </View>

            <AppText variant="h3" weight="bold" style={styles.sectionTitle}>
              {isBidding ? `Incoming Offers (${applicants.length})` : `Applicants (${applicants.length})`}
            </AppText>
            
            {isLoading ? (
              <View style={styles.emptyState}>
                <Clock3 size={40} color={Colors.textTertiary} strokeWidth={1.5} />
                <AppText variant="body" weight="semiBold" style={{ marginTop: Spacing['3'] }}>Waiting for {isBidding ? 'bids' : 'applicants'}...</AppText>
                <AppText variant="caption" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing['1'] }}>
                  Nearby verified workers will appear here once they {isBidding ? 'submit an offer' : 'apply'}.
                </AppText>
              </View>
            ) : (
              applicants.map((applicant) => (
                <View key={applicant.id} style={styles.applicantCard}>
                  <View style={styles.applicantHeader}>
                    <Avatar uri={applicant.avatarUri} size={50} />
                    <View style={styles.applicantInfo}>
                      <View style={styles.nameRow}>
                        <AppText variant="body" weight="bold">{applicant.name}</AppText>
                        {applicant.verified && <CheckCircle size={14} color={Colors.verified} strokeWidth={2.5} style={{ marginLeft: 4 }} />}
                      </View>
                      <View style={styles.statsRow}>
                        <Badge label={`${applicant.rating} ★`} variant="warning" />
                        <AppText variant="caption" color={Colors.textSecondary}>• {applicant.reviewCount} jobs</AppText>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <AppText variant="h3" weight="bold" color={Colors.cta}>{applicant.estimatedPrice}</AppText>
                      {isBidding ? (
                        <AppText variant="caption" color={Colors.textSecondary} style={{ marginTop: 2 }}>{applicant.eta}</AppText>
                      ) : (
                        <AppText variant="caption" color={Colors.textSecondary}>{applicant.eta}</AppText>
                      )}
                    </View>
                  </View>

                  <View style={styles.messageBubble}>
                    <AppText variant="bodySm" color={Colors.textSecondary} numberOfLines={2}>
                      "{applicant.message}"
                    </AppText>
                  </View>

                  <View style={styles.actionRow}>
                    <AppButton 
                      label="View Profile" 
                      variant="outline" 
                      size="sm" 
                      style={styles.actionBtn} 
                      onPress={() => router.push(`/provider/${applicant.id}?isApplicant=true` as any)}
                    />
                    <AppButton 
                      label="Message" 
                      size="sm" 
                      style={styles.actionBtn} 
                      onPress={() => router.push(`/chat/${applicant.id}` as any)}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        ) : assignedWorker ? (
          <View style={styles.section}>
            <AppText variant="h3" weight="bold" style={styles.sectionTitle}>Assigned Worker</AppText>
            <ProviderCard provider={assignedWorker} onPress={() => router.push(`/provider/${assignedWorker.id}` as any)} />
            
            <View style={styles.actionRow}>
              <AppButton 
                label="Message Worker" 
                variant="outline"
                style={[styles.actionBtn, { marginTop: Spacing['3'] }]} 
                leftIcon={<MessageSquare size={18} color={Colors.primary} />}
                onPress={() => router.push(`/chat/${assignedWorker.id}` as any)}
              />
              {request.status === 'Completed' && (
                <AppButton 
                  label="Leave Review" 
                  style={[styles.actionBtn, { marginTop: Spacing['3'] }]} 
                  onPress={() => router.push(`/review/${assignedWorker.id}` as any)}
                />
              )}
              {request.status === 'Accepted' && (
                <AppButton 
                  label="Proceed to Payment" 
                  style={[styles.actionBtn, { marginTop: Spacing['3'] }]} 
                  onPress={() => router.push(`/payment` as any)}
                />
              )}
            </View>
          </View>
        ) : null}

      </ScrollView>
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
    paddingBottom: Spacing['4'],
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: 60,
  },
  section: {
    marginBottom: Spacing['6'],
  },
  highlightBox: {
    backgroundColor: Colors.surfaceCard,
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Elevation.sm,
  },
  sectionTitle: {
    marginBottom: Spacing['3'],
  },
  statusAlert: {
    backgroundColor: Colors.warning,
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    marginBottom: Spacing['4'],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['6'],
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  applicantCard: {
    backgroundColor: Colors.surfaceCard,
    padding: Spacing['4'],
    borderRadius: Radius.lg,
    marginBottom: Spacing['3'],
    ...Elevation.sm,
  },
  applicantHeader: {
    flexDirection: 'row',
    marginBottom: Spacing['3'],
  },
  applicantInfo: {
    flex: 1,
    marginLeft: Spacing['3'],
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2'],
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  messageBubble: {
    backgroundColor: Colors.primarySurface,
    padding: Spacing['3'],
    borderRadius: Radius.md,
    marginBottom: Spacing['4'],
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing['3'],
  },
  actionBtn: {
    flex: 1,
  },
});
