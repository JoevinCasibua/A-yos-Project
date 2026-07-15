import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ProfileScreen } from '@/components/ProfileScreen';
import { userMenuItems } from '@/constants/workerMockData';

const menuRoutes: Record<string, () => void> = {
  payment: () => router.push('/payment'),
  notifications: () => Alert.alert('Notifications', 'Notification settings coming soon.'),
  addresses: () => Alert.alert('Saved Addresses', 'Address management coming soon.'),
  favorites: () => Alert.alert('Favorites', 'Favorites list coming soon.'),
  rewards: () => Alert.alert('Rewards & Points', 'Rewards program coming soon.'),
  privacy: () => Alert.alert('Privacy & Security', 'Privacy settings coming soon.'),
  help: () => Alert.alert('Help & Support', 'Support center coming soon.'),
  settings: () => Alert.alert('Settings', 'App settings coming soon.'),
};

export default function ProfileScreenTab() {
  const handleSwitchToWorker = useCallback(() => router.replace('/(worker)'), []);
  const handleLogout = useCallback(() => router.replace('/'), []);
  const handleMenuPress = useCallback((id: string) => { menuRoutes[id]?.(); }, []);

  return (
    <ProfileScreen
      avatarUri="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
      name="Alex Johnson"
      subtitle="alex.johnson@email.com"
      badge={{ label: 'Gold Member', variant: 'verified' }}
      stats={[
        { value: '12', label: 'Bookings' },
        { value: '5', label: 'Reviews' },
        { value: '340', label: 'Points' },
      ]}
      menuItems={userMenuItems}
      devLabel="For Development Testing"
      onSwitchAccount={handleSwitchToWorker}
      onLogout={handleLogout}
      onMenuItemPress={handleMenuPress}
    />
  );
}
