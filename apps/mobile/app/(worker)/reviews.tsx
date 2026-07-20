import { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { DataState, EmptyState, FeatureCard, Heading, Screen, StatusBadge } from '@/components';
import { listWorkerReviews } from '@/repository';
import { useSession } from '@/session';
import { useAsyncData } from '@/useAsyncData';

export default function WorkerReviews() {
  const { account } = useSession();
  const load = useCallback(
    () => (account ? listWorkerReviews(account.id) : Promise.resolve([])),
    [account],
  );
  const { data = [], error, loading } = useAsyncData(load);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 30 }}>
        <Heading
          eyebrow="Reviews"
          title="Customer feedback"
          body="Only administrator-published feedback is visible. Workers cannot submit reviews here."
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !data.length ? (
          <EmptyState
            title="No published feedback"
            body="Moderated customer feedback appears here."
          />
        ) : null}
        {data.map((review) => (
          <FeatureCard
            key={review.id}
            icon="⭐"
            title={`${review.stars}/5 stars`}
            body={review.body}
          />
        ))}
        <StatusBadge label="Read only" />
      </ScrollView>
    </Screen>
  );
}
