import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ProfileScreen } from '@/components/ProfileScreen';
import { workerProfile } from '@/constants/workerData';
import { verificationConfig, workerMenuItems } from '@/constants/workerMockData';
import { Star } from 'lucide-react-native';

const menuRoutes: Record<string, () => void> = {
  experience: () => Alert.alert('Work Experience', 'Work history and certifications coming soon.'),
  skills: () => Alert.alert('My Skills', 'Skill management coming soon.'),
  areas: () => Alert.alert('Service Areas', 'Service area settings coming soon.'),
  portfolio: () => Alert.alert('Portfolio', 'Portfolio gallery coming soon.'),
  payouts: () => router.push('/payment'),
  notifications: () => Alert.alert('Notifications', 'Notification settings coming soon.'),
  help: () => Alert.alert('Help & Support', 'Support center coming soon.'),
  settings: () => Alert.alert('Settings', 'App settings coming soon.'),
};

export default function WorkerProfileTabScreen() {
  const handleSwitchToUser = useCallback(() => router.replace('/(tabs)'), []);
  const handleLogout = useCallback(() => router.replace('/'), []);
  const handleMenuPress = useCallback((id: string) => { menuRoutes[id]?.(); }, []);

  const verification = verificationConfig[workerProfile.verificationStatus];

  return (
    <ProfileScreen
      avatarUri={workerProfile.avatarUri}
      name={workerProfile.name}
      subtitle={workerProfile.email}
      badge={verification}
      caption={`${workerProfile.category} · ${workerProfile.yearsExperience} yrs exp`}
      stats={[
        { value: workerProfile.completedJobs, label: 'Jobs Done' },
        { value: workerProfile.rating, label: 'Rating', icon: Star, iconColor: '#F59E0B' },
        { value: workerProfile.earnings, label: 'Earnings' },
      ]}
      menuItems={workerMenuItems}
      devLabel="For Development Testing"
      onSwitchAccount={handleSwitchToUser}
      onLogout={handleLogout}
      onMenuItemPress={handleMenuPress}
    />
  );
}
