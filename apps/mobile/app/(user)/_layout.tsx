import { Redirect, Tabs } from 'expo-router';
import { useSession } from '@/session';
import { colors } from '@/theme';

export default function UserLayout() {
  const { account, loading } = useSession();
  if (!loading && account?.role !== 'USER') return <Redirect href="/landing" />;
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
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="request" options={{ href: null, title: 'Send request' }} />
      <Tabs.Screen name="ai-assistant" options={{ href: null, title: 'AI Home Assistant' }} />
      <Tabs.Screen name="alerts" options={{ href: null, title: 'Alerts' }} />
      <Tabs.Screen name="tracking" options={{ href: null, title: 'Service tracking' }} />
    </Tabs>
  );
}
