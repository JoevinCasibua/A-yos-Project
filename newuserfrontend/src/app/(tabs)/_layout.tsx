import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { theme } from '../../theme';
import { Search, Calendar, MessageSquare, User, Plus, Home, FileText } from 'lucide-react-native';

const CreateButton = (props: any) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    // Navigate immediately to request creation flow
    router.push('/new-request/create');
  };

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={(e) => {
        handlePressOut();
      }}
      style={[props.style, styles.createButtonContainer]}
    >
      <Animated.View style={[styles.createButton, { transform: [{ scale: scaleAnim }] }]}>
        <Plus color={theme.colors.surface} size={28} strokeWidth={2.5} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.layout.bottomNavHeight,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        }
      }}>

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarButton: (props) => <CreateButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButtonContainer: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0B63D6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0B63D6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
