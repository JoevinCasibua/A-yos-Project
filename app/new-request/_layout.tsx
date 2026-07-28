import { Stack } from 'expo-router';

export default function NewRequestLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="issue-summary" />
      <Stack.Screen name="matching" />
      <Stack.Screen name="urgency" />
      <Stack.Screen name="asap" />
      <Stack.Screen name="this-week" />
      <Stack.Screen name="bidding" />
      <Stack.Screen name="success" />
      <Stack.Screen name="radius-config" />
      <Stack.Screen name="budget-config" />
    </Stack>
  );
}
