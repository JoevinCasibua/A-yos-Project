import React, { useCallback } from 'react';
import { router } from 'expo-router';
import { ProfileScreen } from '@/components/ProfileScreen';
import { userMenuItems } from '@/constants/workerMockData';

export default function ProfileScreenTab() {
  const handleSwitchToWorker = useCallback(() => router.replace('/(worker)'), []);
  const handleLogout = useCallback(() => router.replace('/'), []);

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
    />
  );
}
