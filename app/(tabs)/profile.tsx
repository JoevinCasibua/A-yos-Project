import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ProfileScreen } from '@/components/ProfileScreen';
import { userMenuItems } from '@/constants/workerMockData';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/services/auth';

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
  const {user,verificationStatus,roles}=useAuth();
  const handleSwitchToWorker = useCallback(() => router.replace('/(worker)'), []);
  const handleLogout = useCallback(async () => {await signOut();router.replace('/');}, []);
  const handleMenuPress = useCallback((id: string) => { menuRoutes[id]?.(); }, []);

  return (
    <ProfileScreen
      avatarUri=""
      name={`${user?.user_metadata?.first_name||''} ${user?.user_metadata?.last_name||''}`.trim()||'A-yos Customer'}
      subtitle={user?.email||''}
      badge={{ label: verificationStatus==='approved'?'ID Verified':verificationStatus==='rejected'?'ID Rejected':'ID Pending', variant: verificationStatus==='approved'?'verified':'warning' }}
      stats={[
        { value: '—', label: 'Bookings' },
        { value: '—', label: 'Reviews' },
        { value: roles.includes('worker')?'Yes':'No', label: 'Worker Role' },
      ]}
      menuItems={userMenuItems}
      devLabel="For Development Testing"
      onSwitchAccount={handleSwitchToWorker}
      onLogout={handleLogout}
      onMenuItemPress={handleMenuPress}
    />
  );
}
