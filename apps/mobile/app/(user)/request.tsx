import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { EmptyState, Field, Heading, Screen } from '@/components';

export default function RequestPage() {
  const { draft } = useLocalSearchParams<{ draft?: string }>();
  const [description, setDescription] = useState(draft ?? '');
  return (
    <Screen>
      <Heading
        eyebrow="Booking process entry"
        title="Prepare a service request"
        body="Review any AI-created draft. Category, address, schedule, and budget remain required before submission."
      />
      <Field
        label="Issue description"
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the service needed"
      />
      <EmptyState
        title="Configuration required"
        body="Submission remains unavailable until service categories, address location, and required legal content are configured."
      />
    </Screen>
  );
}
