import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Layout, Spacing, Radius } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { RatingStars } from '@/components/RatingStars';
import { Avatar } from '@/components/Avatar';
import { useRequest } from '@/context/RequestContext';
import { MessageSquare, Clock, ChevronLeft } from 'lucide-react-native';

const MOCK_BIDS = [
  {
    id: 'w1',
    name: 'David Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    reviewCount: 128,
    distance: '1.2 mi',
    bidAmount: 85,
    estimatedTime: '2 hours',
    comment: 'I can swing by tomorrow morning to fix this! Should be a quick job.',
  },
  {
    id: 'w2',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 84,
    distance: '3.5 mi',
    bidAmount: 70,
    estimatedTime: '3-4 hours',
    comment: 'Available anytime this week. I specialize in these types of repairs.',
  },
  {
    id: 'w3',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    rating: 5.0,
    reviewCount: 42,
    distance: '2.1 mi',
    bidAmount: 110,
    estimatedTime: '1 hour',
    comment: 'I have the necessary replacement parts in my truck already.',
  },
];

export default function OpenBidsScreen() {
  const router = useRouter();
  const { request, updateRequest } = useRequest();
  
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);

  const handleAcceptBid = () => {
    if (!selectedBidId) return;
    updateRequest({ 
      status: 'Accepted',
      selectedWorkerId: selectedBidId,
    });
    // The master prompt explicitly says both flows must end at the SAME payment screen
    router.push('/payment');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <ChevronLeft size={24} color={Colors.textPrimary} strokeWidth={2.5} />
        </Pressable>
        <AppText variant="h4" weight="bold" style={styles.headerTitle}>Open Bidding</AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Request Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <AppText variant="h3">{request.category || 'Maintenance Request'}</AppText>
              <AppText variant="caption" style={{ color: Colors.textSecondary, marginTop: 4 }}>
                Posted just now
              </AppText>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <AppText variant="caption" style={{ color: Colors.primary, fontWeight: '600' }}>
                Receiving Offers
              </AppText>
            </View>
          </View>
          <AppText variant="body" style={styles.summaryText} numberOfLines={2}>
            {request.description || request.aiSummary || 'No description provided.'}
          </AppText>
        </View>

        <AppText variant="h3" style={styles.sectionTitle}>
          Incoming Offers ({MOCK_BIDS.length})
        </AppText>

        {/* Bids List */}
        <View style={styles.bidsContainer}>
          {MOCK_BIDS.map((bid) => {
            const isSelected = selectedBidId === bid.id;
            
            return (
              <Pressable 
                key={bid.id} 
                style={[
                  styles.bidCard,
                  isSelected && styles.bidCardSelected
                ]}
                onPress={() => setSelectedBidId(bid.id)}
              >
                <View style={styles.bidHeader}>
                  <View style={styles.workerInfo}>
                    <Avatar uri={bid.avatar} size={48} fallback={<AppText>{bid.name.charAt(0)}</AppText>} />
                    <View style={styles.workerDetails}>
                      <AppText variant="label" style={{ fontWeight: '600' }}>{bid.name}</AppText>
                      <RatingStars rating={bid.rating} reviewCount={bid.reviewCount} size={12} />
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <AppText variant="h2" style={{ color: Colors.cta }}>${bid.bidAmount}</AppText>
                  </View>
                </View>
                
                <View style={styles.bidDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={16} color={Colors.textSecondary} />
                    <AppText variant="caption" style={{ color: Colors.textSecondary, marginLeft: 6 }}>
                      Est. Time: {bid.estimatedTime}
                    </AppText>
                  </View>
                </View>

                <View style={styles.commentBox}>
                  <MessageSquare size={16} color={Colors.primary} style={{ marginTop: 2 }} />
                  <AppText variant="body" style={styles.commentText}>
                    "{bid.comment}"
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton 
          label={selectedBidId ? "Accept Offer" : "Select an Offer"} 
          onPress={handleAcceptBid} 
          disabled={!selectedBidId}
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
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[6],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[3],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing[3],
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  summaryText: {
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: Spacing[4],
  },
  bidsContainer: {
    gap: Spacing[4],
  },
  bidCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bidCardSelected: {
    borderColor: Colors.cta,
    backgroundColor: Colors.surfaceLight,
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workerDetails: {
    marginLeft: Spacing[3],
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  bidDetails: {
    flexDirection: 'row',
    marginBottom: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentBox: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    padding: Spacing[3],
    borderRadius: Radius.md,
  },
  commentText: {
    flex: 1,
    marginLeft: Spacing[2],
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  footer: {
    padding: Layout.screenPadding,
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
