import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { FeatureCard, Heading } from '@/components';
import { colors } from '@/theme';

export default function UserHome() {
  const router = useRouter();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 22, gap: 12 }}
    >
      <Heading
        eyebrow="Home"
        title="What needs fixing?"
        body="Start with a service request or ask the optional AI Home Assistant to prepare an editable draft."
      />
      <FeatureCard
        icon="📝"
        title="Send a request"
        body="Choose a service, describe the issue, address, schedule, budget, photos, and notes."
        onPress={() => router.push('/(user)/request')}
      />
      <FeatureCard
        icon="✨"
        title="AI Home Assistant"
        body="Use an issue image or spoken description for analysis and safety guidance."
        onPress={() => router.push('/(user)/ai-assistant')}
      />
      <FeatureCard
        icon="🔔"
        title="Alerts and updates"
        body="Worker messages, payment updates, promotions, and system notifications."
        onPress={() => router.push('/(user)/alerts')}
      />
      <FeatureCard
        icon="🛡️"
        title="Privacy by design"
        body="Requests, location, payment, and identity data are restricted to authorized participants."
      />
    </ScrollView>
  );
}
