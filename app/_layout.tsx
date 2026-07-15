import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Colors } from '@/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RequestProvider } from '@/context/RequestContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <RequestProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="request" options={{ headerShown: false }} />
          <Stack.Screen name="new-request" options={{ headerShown: false }} />
          <Stack.Screen name="(worker)" options={{ headerShown: false }} />
          <Stack.Screen name="provider/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="booking/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="payment" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="order" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="tracking/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="review/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </RequestProvider>
      <StatusBar style="dark" backgroundColor={Colors.white} />
    </SafeAreaProvider>
  );
}
