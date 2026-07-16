import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, CheckCircle, Clock3, MessageSquare } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Layout, Spacing, Radius, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { JobSummary } from '@/components/JobSummary';
import { ProviderCard } from '@/components/ProviderCard';
import { useRequest } from '@/context/RequestContext';
import { fetchPublishedRequest, fetchRecommendations, type WorkerRecommendation } from '@/services/marketplace';
import { fetchProviderById } from '@/services/api';
import type { ProviderData } from '@/components/ProviderCard';

export default function RequestDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { request } = useRequest();
  const[displayRequest,setDisplayRequest]=useState(request);
  
  const [applicants, setApplicants] = useState<WorkerRecommendation[]>([]);
  const [assignedWorker,setAssignedWorker]=useState<ProviderData|null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(request.urgency==='Open Bidding'){setApplicants([]);setIsLoading(false);return;}
    if(!id){setIsLoading(false);return;}let active=true;void fetchRecommendations(id).then(result=>{if(active){setApplicants(result.data||[]);setIsLoading(false);}});return()=>{active=false;};
  }, [id,request.urgency]);
  useEffect(()=>{if(!id)return;void fetchPublishedRequest(id).then(result=>{if(!result.data)return;setDisplayRequest(current=>({...current,category:result.data!.category,description:result.data!.description,hasParts:result.data!.partsKnown??undefined,partsDescription:result.data!.partsDescription||'',urgency:result.data!.urgency,scheduledDate:result.data!.scheduledDate,photos:result.data!.photos,status:result.data!.status,selectedWorkerId:result.data!.assignedWorkerId,location:{latitude:result.data!.latitude,longitude:result.data!.longitude,address:result.data!.address}}));});},[id]);
  useEffect(()=>{if(displayRequest.selectedWorkerId)void fetchProviderById(displayRequest.selectedWorkerId).then(result=>setAssignedWorker(result.data||null));},[displayRequest.selectedWorkerId]);

  const handleBack = () => router.back();

  const isBidding = displayRequest.urgency === 'Open Bidding';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={handleBack} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Request Details</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Highlighted Job Summary at the top */}
        <View style={[styles.section, styles.highlightBox]}>
          <AppText variant="h3" weight="bold" style={[styles.sectionTitle, { marginBottom: Spacing['3'] }]}>Request Summary</AppText>
          <JobSummary request={displayRequest} showEditButtons={displayRequest.status === 'Draft' || displayRequest.status === 'Posted'} compact={true} />
        </View>

        {/* Dynamic State Rendering */}
        {displayRequest.status === 'Posted' || displayRequest.status === 'Searching' ? (
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
                      {applicant.explanation}
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
              {displayRequest.status === 'Completed' && (
                <AppButton 
                  label="Leave Review" 
                  style={[styles.actionBtn, { marginTop: Spacing['3'] }]} 
                  onPress={() => router.push(`/review/${assignedWorker.id}` as any)}
                />
              )}
              {displayRequest.status === 'Accepted' && (
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
  backBtn: {
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
