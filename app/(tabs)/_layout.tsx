import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Search, CalendarDays, User, Plus } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

const tabIcons: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  index: Home,
  search: Search,
  bookings: CalendarDays,
  profile: User,
};

const tabLabels: Record<string, string> = {
  index: 'Home',
  search: 'Browse',
  bookings: 'Bookings',
  profile: 'Profile',
};

export default function TabLayout() {
  const router = require('expo-router').useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.navActive,
        tabBarInactiveTintColor: Colors.navInactive,
        tabBarStyle: {
          backgroundColor: Colors.navBackground,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          marginVertical: 0,
        },
        tabBarLabelStyle: {
          fontSize: Typography.xs,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tabLabels.index,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: tabLabels.search,
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="request-action"
        options={{
          title: 'New',
          tabBarIcon: ({ color, size }) => <Plus size={size} color={color} strokeWidth={2.5} />,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/request/create');
          },
        })}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: tabLabels.bookings,
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: tabLabels.profile,
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
