import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Colors } from '@/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(worker)" options={{ headerShown: false }} />
        <Stack.Screen name="provider/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="booking/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="payment" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="tracking/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="review/[id]" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="worker/index" options={{ headerShown: false, animation: 'slide_from_right' }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" backgroundColor={Colors.white} />
    </SafeAreaProvider>
  );
}
