import { Redirect, Tabs } from 'expo-router';
import { useSession } from '@/session';
import { colors } from '@/theme';
export default function WorkerLayout() {
  const { account, loading } = useSession();
  if (!loading && account?.role !== 'WORKER') return <Redirect href="/landing" />;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.panel, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="job-posts" options={{ title: 'Job Posts' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="reviews" options={{ title: 'Reviews' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="tracking" options={{ href: null, title: 'Service tracking' }} />
    </Tabs>
  );
}
