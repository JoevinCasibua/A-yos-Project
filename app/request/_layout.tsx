import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { X, ChevronLeft } from 'lucide-react-native';
import { Platform, Pressable } from 'react-native';

export default function RequestLayout() {
  const router = useRouter();

  const HeaderButton = ({ icon: Icon, onPress }: { icon: any, onPress: () => void }) => (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Platform.OS === 'ios' ? -8 : 0,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon size={24} color={Colors.textPrimary} />
    </Pressable>
  );

  return (
    <Stack screenOptions={{ headerShown: true, headerShadowVisible: false }}>
      {/* Modal flow screens */}
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'New Request',
          presentation: 'modal',
          headerLeft: () => <HeaderButton icon={X} onPress={() => router.back()} />,
        }} 
      />
      <Stack.Screen 
        name="ai-summary" 
        options={{ 
          title: 'Issue Summary',
          presentation: 'modal',
          headerLeft: () => <HeaderButton icon={ChevronLeft} onPress={() => router.back()} />,
        }} 
      />
      <Stack.Screen 
        name="urgency" 
        options={{ 
          title: 'Urgency',
          presentation: 'modal',
          headerLeft: () => <HeaderButton icon={ChevronLeft} onPress={() => router.back()} />,
        }} 
      />
      <Stack.Screen 
        name="review" 
        options={{ 
          title: 'Review Post',
          presentation: 'modal',
          headerLeft: () => <HeaderButton icon={ChevronLeft} onPress={() => router.back()} />,
        }} 
      />
      
      {/* Push flow screens */}
      <Stack.Screen 
        name="live-matching" 
        options={{ 
          title: 'Finding Workers',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="tracking/[id]" 
        options={{ 
          headerShown: false,
        }} 
      />
      
      {/* Bidding flow screens */}
      <Stack.Screen 
        name="open-bids" 
        options={{ 
          title: 'Review Offers',
          presentation: 'modal',
          headerLeft: () => <HeaderButton icon={ChevronLeft} onPress={() => router.back()} />,
        }} 
      />
      <Stack.Screen 
        name="booking-confirmation" 
        options={{ 
          headerShown: false,
          presentation: 'modal',
        }} 
      />
    </Stack>
  );
}
