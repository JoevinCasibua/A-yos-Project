import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Search, CalendarDays, Star, User, Wallet } from 'lucide-react-native';
import { Colors, Typography } from '@/constants/theme';

export default function WorkerTabLayout() {
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
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="verification"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="transactions-history"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <CalendarDays size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color, size }) => <Star size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="booking-request/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="cancel-service/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
