import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { ProfileScreen } from '@/components/ProfileScreen';
import { userMenuItems } from '@/constants/workerMockData';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/services/auth';
import { supabase } from '@/lib/supabase';

const menuRoutes: Record<string, () => void> = {
  payment: () => router.push('/payment'),
  notifications: () => Alert.alert('Notifications', 'Notification settings coming soon.'),
  addresses: () => Alert.alert('Saved Addresses', 'Address management coming soon.'),
  favorites: () => Alert.alert('Favorites', 'Favorites list coming soon.'),
  rewards: () => Alert.alert('Rewards & Points', 'Rewards program coming soon.'),
  help: () => Alert.alert('Help & Support', 'Support center coming soon.'),
  settings: () => Alert.alert('Settings', 'App settings coming soon.'),
};

export default function ProfileScreenTab() {
  const {user,verificationStatus,roles}=useAuth();
  const[counts,setCounts]=useState({bookings:0,reviews:0});
  useEffect(()=>{if(!user)return;void Promise.all([supabase.from('bookings').select('id',{count:'exact',head:true}).eq('customer_id',user.id),supabase.from('reviews').select('id',{count:'exact',head:true}).eq('customer_id',user.id)]).then(([bookings,reviews])=>setCounts({bookings:bookings.count||0,reviews:reviews.count||0}));},[user]);
  const handleSwitchToWorker = useCallback(() => router.replace('/(worker)'), []);
  const handleLogout = useCallback(async () => {await signOut();router.replace('/');}, []);
  const handleMenuPress = useCallback((id: string) => { if(id==='privacy'){router.push('/identity-verification' as never);return;}menuRoutes[id]?.(); }, []);

  return (
    <ProfileScreen
      avatarUri=""
      name={`${user?.user_metadata?.first_name||''} ${user?.user_metadata?.last_name||''}`.trim()||'A-yos Customer'}
      subtitle={user?.email||''}
      badge={{ label: verificationStatus==='approved'?'ID Verified':verificationStatus==='rejected'?'ID Rejected':'ID Pending', variant: verificationStatus==='approved'?'verified':'warning' }}
      stats={[
        { value: counts.bookings, label: 'Bookings' },
        { value: counts.reviews, label: 'Reviews' },
        { value: roles.includes('worker')?'Yes':'No', label: 'Worker Role' },
      ]}
      menuItems={userMenuItems}
      caption={verificationStatus==='rejected'||verificationStatus==='resubmission_required'?'Open Privacy & Security to resubmit your ID.':undefined}
      devLabel={roles.includes('worker')?'Account roles':undefined}
      onSwitchAccount={roles.includes('worker')?handleSwitchToWorker:undefined}
      onLogout={handleLogout}
      onMenuItemPress={handleMenuPress}
    />
  );
}
