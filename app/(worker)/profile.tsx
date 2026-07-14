import React, { useCallback } from 'react';
import { router } from 'expo-router';
import { ProfileScreen } from '@/components/ProfileScreen';
import { workerProfile } from '@/constants/workerData';
import { verificationConfig, workerMenuItems } from '@/constants/workerMockData';
import { Star } from 'lucide-react-native';

export default function WorkerProfileTabScreen() {
  const handleSwitchToUser = useCallback(() => router.replace('/(tabs)'), []);

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
    />
  );
}
