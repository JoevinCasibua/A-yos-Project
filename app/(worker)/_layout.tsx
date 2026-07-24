import React from 'react';
import { View, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { LayoutDashboard, CalendarDays, User, Wallet, MessageSquare, Briefcase } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useWorkerBookingStore } from '@/store/useWorkerBookingStore';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 60;

export default function WorkerTabLayout() {
  const router = useRouter();
  const isCurrentlyWorking = useWorkerBookingStore((s) => s.isCurrentlyWorking);
  const currentBookingId = useWorkerBookingStore((s) => s.currentBookingId);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0.5,
            borderTopColor: theme.colors.border,
            height: TAB_BAR_HEIGHT,
            paddingBottom: Platform.OS === 'ios' ? 25 : 8,
            paddingTop: 6,
            paddingHorizontal: theme.layout.screenPadding,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
          },
          tabBarItemStyle: { paddingVertical: 0, marginVertical: 0 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 4 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            tabBarIcon: ({ color }) => <Wallet size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={24} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen name="search" options={{ href: null }} />
        <Tabs.Screen name="verification" options={{ href: null }} />
        <Tabs.Screen name="transactions-history" options={{ href: null }} />
        <Tabs.Screen name="reviews" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="booking-request/[id]" options={{ href: null }} />
        <Tabs.Screen name="industry-skills" options={{ href: null }} />
        <Tabs.Screen name="cancel-service/[id]" options={{ href: null }} />
        <Tabs.Screen name="work-experience" options={{ href: null }} />
        <Tabs.Screen name="availability" options={{ href: null }} />
        <Tabs.Screen name="portfolio" options={{ href: null }} />
        <Tabs.Screen name="help" options={{ href: null }} />
        <Tabs.Screen name="personal-info" options={{ href: null }} />
        <Tabs.Screen name="payout-methods" options={{ href: null }} />
        <Tabs.Screen name="payout-history" options={{ href: null }} />
        <Tabs.Screen name="service-areas" options={{ href: null }} />
        <Tabs.Screen name="privacy" options={{ href: null }} />
        <Tabs.Screen name="earnings-receipt" options={{ href: null }} />
        <Tabs.Screen name="universal-search" options={{ href: null }} />
        <Tabs.Screen name="rate-setting" options={{ href: null }} />
        <Tabs.Screen name="topup-methods" options={{ href: null }} />
        <Tabs.Screen name="topup-history" options={{ href: null }} />
        <Tabs.Screen name="cash-confirm/[id]" options={{ href: null }} />
        <Tabs.Screen name="report-user/[id]" options={{ href: null }} />
        <Tabs.Screen name="report-payment/[id]" options={{ href: null }} />
        <Tabs.Screen name="reported-booking/[id]" options={{ href: null }} />
      </Tabs>

      {isCurrentlyWorking && currentBookingId && (
        <Pressable
          style={styles.workingBanner}
          onPress={() => router.push(`/(worker)/booking-request/${currentBookingId}?from=dashboard`)}
        >
          <View style={styles.bannerDotContainer}>
            <View style={styles.bannerDot} />
          </View>
          <Briefcase size={16} color={theme.colors.surface} />
          <Text style={styles.bannerText}>
            You are currently working on a job — Tap to view
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  workingBanner: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    elevation: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerDotContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surface,
  },
  bannerText: {
    flex: 1,
    color: theme.colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
});
