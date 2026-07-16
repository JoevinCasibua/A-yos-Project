import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, FlatList, ListRenderItem, Pressable, Image } from 'react-native';
import { ChevronRight, Calendar, Clock, MapPin, Navigation, Wrench } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Elevation } from '@/constants/theme';
import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { AppButton } from '@/components/AppButton';
import { fetchBookings } from '@/services/api';

type Booking = { id:string;providerId:string;providerName:string;category:string;avatarUri:string;date:string;time:string;status:'upcoming'|'completed'|'cancelled';address:string;price:string;rating:number;reviewed?:boolean };

const tabs = ['Upcoming', 'Completed', 'Cancelled'];

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings,setBookings]=useState<Booking[]>([]);
  useEffect(()=>{void fetchBookings().then((result)=>setBookings(result.data));},[]);

  const filteredBookings = useMemo(() => {
    let list: Booking[] = [];
    if (activeTab === 'Upcoming') {
      list = bookings.filter((b) => b.status === 'upcoming');
    } else if (activeTab === 'Completed') {
      list = bookings.filter((b) => b.status === 'completed');
    } else if (activeTab === 'Cancelled') {
      list = bookings.filter((b) => b.status === 'cancelled');
    }
    return list;
  }, [activeTab, bookings]);

  const renderItem: ListRenderItem<Booking> = useCallback(
    ({ item }) => (
      <View style={styles.bookingCard}>
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.providerRow}>
            <Avatar uri={item.avatarUri} size={44} />
            <View style={styles.providerInfo}>
              <AppText variant="body" weight="bold">{item.providerName}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>{item.category}</AppText>
            </View>
          </View>
          {item.status === 'upcoming' ? (
            <Badge label="Upcoming" variant="info" />
          ) : item.reviewed ? (
            <Badge label="Reviewed" variant="success" />
          ) : (
            <Badge label="Pending Review" variant="warning" />
          )}
        </View>

        {/* Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Calendar size={15} color={Colors.textSecondary} strokeWidth={2} />
            <AppText variant="caption" color={Colors.textSecondary}>{item.date}</AppText>
          </View>
          <View style={styles.detailItem}>
            <Clock size={15} color={Colors.textSecondary} strokeWidth={2} />
            <AppText variant="caption" color={Colors.textSecondary}>{item.time}</AppText>
          </View>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={15} color={Colors.textSecondary} strokeWidth={2} />
          <AppText variant="caption" color={Colors.textSecondary}>{item.address}</AppText>
        </View>
        
        {/* Replacement Parts Badge */}

        {/* Actions */}
        <View style={styles.cardActions}>
          <AppText variant="h4" weight="bold" color={Colors.cta}>{item.price}</AppText>
          {item.status === 'upcoming' ? (
            <View style={styles.actionBtns}>
              <AppButton label="Track" variant="outline" size="sm" onPress={() => router.push(`/tracking/${item.id}` as any)} leftIcon={<Navigation size={14} color={Colors.cta} strokeWidth={2} />} />
              <AppButton label="View" size="sm" style={{ marginLeft: Spacing['2'] }} onPress={() => router.push(`/provider/${item.providerId}` as any)} />
            </View>
          ) : !item.reviewed ? (
            <AppButton label="Leave Review" size="sm" onPress={() => router.push(`/review/${item.id}` as any)} />
          ) : (
            <AppButton label="Book Again" variant="outline" size="sm" onPress={() => router.push(`/provider/${item.providerId}` as any)} />
          )}
        </View>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Booking) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2" weight="bold">My Bookings</AppText>
        <View style={styles.tabRow}>
          {tabs.map((t) => (
            <Chip
              key={t}
              label={t}
              selected={activeTab === t}
              onPress={() => setActiveTab(t)}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing['3'] }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={48} color={Colors.textTertiary} strokeWidth={1.5} />
            <AppText variant="body" weight="semiBold" align="center" style={{ marginTop: Spacing['4'] }}>
              No {activeTab.toLowerCase()} bookings
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing['1'] }}>
              {activeTab === 'Upcoming' ? 'Browse providers to book a service' : 'Completed bookings will appear here'}
            </AppText>
            {activeTab === 'Upcoming' && (
              <AppButton
                label="Browse Providers"
                variant="outline"
                size="md"
                style={{ marginTop: Spacing['4'] }}
                onPress={() => router.push('/search')}
              />
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white, paddingHorizontal: Spacing['4'],
    paddingTop: Spacing['16'], paddingBottom: Spacing['4'],
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tabRow: { flexDirection: 'row', gap: Spacing['2'], marginTop: Spacing['4'] },
  listContent: { padding: Spacing['4'], paddingBottom: 100 },
  bookingCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing['4'],
    ...Elevation.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['3'], flex: 1 },
  providerInfo: { flex: 1 },
  detailsRow: { flexDirection: 'row', gap: Spacing['4'], marginTop: Spacing['3'] },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing['2'], marginTop: Spacing['2'] },
  cardActions: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: Spacing['4'], paddingTop: Spacing['3'], borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  actionBtns: { flexDirection: 'row' },
  emptyState: { paddingVertical: Spacing['16'], alignItems: 'center', paddingHorizontal: Spacing['6'] },
});
