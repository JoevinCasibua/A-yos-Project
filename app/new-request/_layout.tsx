import { Stack, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import { Platform, Pressable } from 'react-native';

export default function NewRequestLayout() {
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
    <Stack screenOptions={{ headerShown: false, headerShadowVisible: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="issue-summary" />
      <Stack.Screen name="urgency" />
      <Stack.Screen name="asap" />
      <Stack.Screen name="this-week" />
      <Stack.Screen name="bidding" />
    </Stack>
  );
}
