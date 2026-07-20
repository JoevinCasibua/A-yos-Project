import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { theme } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react-native';

import { EmptyState } from '../../components/layout/EmptyState';

const BOOKING_TABS = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

const MOCK_BOOKINGS = [
  { id: '1', status: 'Ongoing', service: 'Plumbing Repair', provider: 'Mario Rossi', date: 'Oct 24, 2026', time: '10:00 AM', location: 'Makati City', price: '₱1,250' },
  { id: '2', status: 'Upcoming', service: 'Electrical Inspection', provider: 'Luigi Verdi', date: 'Oct 26, 2026', time: '2:00 PM', location: 'Makati City', price: '₱800' },
  { id: '3', status: 'Completed', service: 'AC Cleaning', provider: 'Pedro Penduko', date: 'Oct 15, 2026', time: '9:00 AM', location: 'Makati City', price: '₱1,500' },
];

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Ongoing');

  const filteredBookings = MOCK_BOOKINGS.filter(b => b.status === activeTab);

  return (
    <Screen safeArea backgroundColor={theme.colors.background}>
      <View style={styles.header}>
        <Text style={theme.typography.h2}>My Bookings</Text>
      </View>

      {/* Custom Tab Bar */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {BOOKING_TABS.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[theme.typography.button, { color: activeTab === tab ? theme.colors.primary : theme.colors.textSecondary }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <EmptyState 
            icon={CalendarIcon} 
            title={`No ${activeTab} Bookings`} 
            description={`You don't have any ${activeTab.toLowerCase()} bookings at the moment. Explore services to book a professional!`}
          />
        ) : (
          filteredBookings.map(booking => (
            <TouchableOpacity 
              key={booking.id} 
              style={styles.bookingCard}
              onPress={() => {
                if (booking.status === 'Ongoing') {
                  router.push(`/tracking/${booking.id}`);
                }
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={theme.typography.h4}>{booking.service}</Text>
                <Text style={[theme.typography.label, { color: theme.colors.primary }]}>{booking.price}</Text>
              </View>
              
              <Text style={[theme.typography.body2, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md }]}>
                Provider: {booking.provider}
              </Text>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <CalendarIcon color={theme.colors.textTertiary} size={16} />
                  <Text style={[theme.typography.caption, styles.detailText]}>{booking.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock color={theme.colors.textTertiary} size={16} />
                  <Text style={[theme.typography.caption, styles.detailText]}>{booking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin color={theme.colors.textTertiary} size={16} />
                  <Text style={[theme.typography.caption, styles.detailText]}>{booking.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.layout.screenPadding },
  tabsContainer: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tabsScroll: { paddingHorizontal: theme.layout.screenPadding },
  tabButton: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, marginRight: theme.spacing.sm, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabButtonActive: { borderBottomColor: theme.colors.primary },
  content: { flex: 1 },
  contentInner: { padding: theme.layout.screenPadding },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing.xxxl },
  bookingCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, marginBottom: theme.spacing.md, ...theme.shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xs },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: theme.spacing.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailText: { color: theme.colors.textSecondary, marginLeft: 4 },
});
