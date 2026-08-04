import React, { useEffect, useState } from 'react';
import { View, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import {
  LayoutDashboard,
  CalendarDays,
  User,
  Wallet,
  MessageSquare,
  Briefcase,
  AlertCircle,
  Wifi,
  MapPin,
  Pause,
  WifiOff,
  MapPinOff,
  TriangleAlert,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useWorkerBookingStore } from '@/store/useWorkerBookingStore';
import { useAuthStore } from '@/store/useAuthStore';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 60;

type PresenceState =
  | 'starting'
  | 'online'
  | 'paused'
  | 'offline'
  | 'permission_denied'
  | 'not_ready'
  | 'error'
  | 'working';

type PresenceBannerConfig = {
  bg: string;
  icon: LucideIcon;
  text: string;
};

const PRESENCE_BANNER: Record<PresenceState, PresenceBannerConfig> = {
  working: {
    bg: theme.colors.warning,
    icon: Briefcase,
    text: 'You are currently working on a job — Tap to view',
  },
  online: {
    bg: theme.colors.success,
    icon: Wifi,
    text: 'Online and receiving requests',
  },
  starting: {
    bg: theme.colors.info,
    icon: MapPin,
    text: 'Starting location sharing…',
  },
  paused: {
    bg: theme.colors.warning,
    icon: Pause,
    text: 'Presence paused',
  },
  offline: {
    bg: theme.colors.textSecondary,
    icon: WifiOff,
    text: 'Offline',
  },
  permission_denied: {
    bg: theme.colors.error,
    icon: MapPinOff,
    text: 'Location permission required',
  },
  not_ready: {
    bg: theme.colors.warning,
    icon: AlertCircle,
    text: 'Complete Service Availability and switch Available for matching on.',
  },
  error: {
    bg: theme.colors.error,
    icon: TriangleAlert,
    text: 'Location heartbeat error',
  },
};

const PRESENCE_CYCLE: PresenceState[] = [
  'online',
  'starting',
  'paused',
  'offline',
  'permission_denied',
  'not_ready',
  'error',
  'working',
];

export default function WorkerTabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isCurrentlyWorking = useWorkerBookingStore((s) => s.isCurrentlyWorking);
  const currentBookingId = useWorkerBookingStore((s) => s.currentBookingId);
  const [presenceIndex, setPresenceIndex] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  const showWorking = isCurrentlyWorking && currentBookingId;
  const config =
    pathname === '/bookings'
      ? showWorking
        ? PRESENCE_BANNER.working
        : PRESENCE_BANNER[PRESENCE_CYCLE[presenceIndex % PRESENCE_CYCLE.length]]
      : null;
  const Icon = config?.icon;

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

      {config && Icon ? (
        <Pressable
          style={[styles.banner, { backgroundColor: config.bg }]}
          onPress={() => setPresenceIndex((i) => (i + 1) % PRESENCE_CYCLE.length)}
        >
          <View style={styles.bannerDotContainer}>
            <View style={styles.bannerDot} />
          </View>
          <Icon size={16} color={theme.colors.surface} />
          <Text style={styles.bannerText}>{config.text}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
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
