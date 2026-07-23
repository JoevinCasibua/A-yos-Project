import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { theme } from '../../theme';
import { ArrowLeft, Star, MapPin, CheckCircle2, MessageSquare, Clock, ShieldCheck, Share2 } from 'lucide-react-native';
import { useWorkerStore } from '../../store/useWorkerStore';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/buttons/Button';

const { width } = Dimensions.get('window');

export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getWorkerById, compareList, addToCompare, removeFromCompare } = useWorkerStore();

  const worker = getWorkerById(id as string);
  
  if (!worker) {
    return (
      <Screen safeArea>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color={theme.colors.textPrimary} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={theme.typography.h3}>Worker not found</Text>
        </View>
      </Screen>
    );
  }

  const isComparing = compareList.includes(worker.id);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={worker.coverImage} style={styles.coverImage} contentFit="cover" />
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <ArrowLeft color={theme.colors.textPrimary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Share2 color={theme.colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={worker.avatar} style={styles.avatar} contentFit="cover" />
            <View style={styles.verifiedBadge}>
              <ShieldCheck color={theme.colors.surface} size={14} />
            </View>
          </View>

          <View style={styles.titleRow}>
            <Text style={theme.typography.h2}>{worker.name}</Text>
            <Text style={[theme.typography.h3, { color: theme.colors.primary }]}>{worker.price}</Text>
          </View>
          <Text style={[theme.typography.body1, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md }]}>{worker.skill}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Star color={theme.colors.warning} size={16} fill={theme.colors.warning} />
                <Text style={[theme.typography.h4, { marginLeft: 6 }]}>{worker.rating}</Text>
              </View>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>{worker.reviewsCount} reviews</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Clock color={theme.colors.primary} size={16} />
                <Text style={[theme.typography.h4, { marginLeft: 6 }]}>{worker.experienceYears} yrs</Text>
              </View>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Experience</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <MapPin color={theme.colors.success} size={16} />
                <Text style={[theme.typography.h4, { marginLeft: 6 }]}>{worker.distance}</Text>
              </View>
              <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>Distance</Text>
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={[theme.typography.h4, { marginBottom: theme.spacing.sm }]}>Skills & Services</Text>
          <View style={styles.skillsContainer}>
            {worker.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <CheckCircle2 color={theme.colors.primary} size={14} />
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Portfolio */}
        {worker.portfolioImages.length > 0 && (
          <View style={styles.section}>
            <Text style={[theme.typography.h4, { marginBottom: theme.spacing.sm }]}>Portfolio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portfolioScroll}>
              {worker.portfolioImages.map((img, index) => (
                <Image key={index} source={img} style={styles.portfolioImage} contentFit="cover" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Reviews */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <Text style={theme.typography.h4}>Reviews</Text>
            <Text style={[theme.typography.button, { color: theme.colors.primary, fontSize: 13 }]}>See all</Text>
          </View>
          {worker.reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={{ color: theme.colors.surface, fontWeight: 'bold' }}>{review.author.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <Text style={theme.typography.h4}>{review.author}</Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textTertiary }]}>{review.date}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Star color={theme.colors.warning} size={14} fill={theme.colors.warning} />
                  <Text style={[theme.typography.label, { marginLeft: 4 }]}>{review.rating}</Text>
                </View>
              </View>
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>{review.comment}</Text>
            </View>
          ))}
        </View>

        {/* Safety Reminder */}
        <View style={styles.safetySection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <ShieldCheck color={theme.colors.warning} size={20} />
            <Text style={[theme.typography.h4, { marginLeft: 8 }]}>Safety Reminder</Text>
          </View>
          <View style={styles.safetyList}>
            <View style={styles.safetyItem}>
              <View style={styles.bullet} />
              <Text style={[theme.typography.body2, { flex: 1, color: theme.colors.textSecondary }]}>Verify the worker's identity before allowing entry.</Text>
            </View>
            <View style={styles.safetyItem}>
              <View style={styles.bullet} />
              <Text style={[theme.typography.body2, { flex: 1, color: theme.colors.textSecondary }]}>Keep valuables secure.</Text>
            </View>
            <View style={styles.safetyItem}>
              <View style={styles.bullet} />
              <Text style={[theme.typography.body2, { flex: 1, color: theme.colors.textSecondary }]}>Use the in-app chat for communication.</Text>
            </View>
            <View style={styles.safetyItem}>
              <View style={styles.bullet} />
              <Text style={[theme.typography.body2, { flex: 1, color: theme.colors.textSecondary }]}>Report suspicious behavior immediately.</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || theme.spacing.md }]}>
        <TouchableOpacity 
          style={[styles.compareBtn, isComparing && styles.compareBtnActive]}
          onPress={() => {
            if (isComparing) {
              removeFromCompare(worker.id);
            } else {
              if (compareList.length >= 3) {
                alert('You can only compare up to 3 workers.');
                return;
              }
              addToCompare(worker.id);
            }
          }}
        >
          <Text style={[theme.typography.button, { color: isComparing ? theme.colors.primary : theme.colors.textSecondary, fontSize: 13 }]}>
            {isComparing ? 'Added' : 'Compare'}
          </Text>
        </TouchableOpacity>
        <Button 
          title="Message" 
          variant="outlined" 
          icon={MessageSquare} 
          style={{ flex: 1, marginHorizontal: theme.spacing.sm }} 
          onPress={() => router.push(`/messages/chat?id=${worker.id}`)}
        />
        <Button 
          title="Book Now" 
          style={{ flex: 1 }} 
          onPress={() => router.push(`/tracking/${worker.id}`)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.md },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  notFoundContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  coverContainer: { width: '100%', height: 220, position: 'relative' },
  coverImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: theme.layout.screenPadding },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },

  profileSection: { paddingHorizontal: theme.layout.screenPadding, paddingTop: 60, paddingBottom: theme.spacing.lg, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  avatarWrapper: { position: 'absolute', top: -50, left: theme.layout.screenPadding, zIndex: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: theme.colors.surface },
  verifiedBadge: { position: 'absolute', bottom: 4, right: 4, backgroundColor: theme.colors.primary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.surface },
  
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.md },
  statBox: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.sm, borderRadius: theme.radius.md, alignItems: 'center', marginHorizontal: 4 },
  statIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },

  section: { paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.lg, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight, backgroundColor: theme.colors.surface },
  
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  skillTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.full, marginRight: theme.spacing.sm, marginBottom: theme.spacing.sm },
  skillText: { fontSize: 13, color: theme.colors.primary, marginLeft: 6, fontWeight: '500' },

  portfolioScroll: { paddingRight: theme.layout.screenPadding },
  portfolioImage: { width: 140, height: 140, borderRadius: theme.radius.md, marginRight: theme.spacing.md },

  reviewCard: { backgroundColor: theme.colors.background, padding: theme.spacing.md, borderRadius: theme.radius.lg, marginBottom: theme.spacing.md },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.textSecondary, justifyContent: 'center', alignItems: 'center' },

  safetySection: { paddingHorizontal: theme.layout.screenPadding, paddingVertical: theme.spacing.lg, backgroundColor: '#fffbeb', marginBottom: 20 },
  safetyList: { marginTop: theme.spacing.xs },
  safetyItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.textSecondary, marginTop: 7, marginRight: 10 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.surface, flexDirection: 'row', paddingHorizontal: theme.layout.screenPadding, paddingTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.borderLight, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  compareBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: theme.radius.md, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  compareBtnActive: { backgroundColor: '#e0f2fe' },
});
