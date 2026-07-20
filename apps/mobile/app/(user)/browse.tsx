import { useCallback, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  DataState,
  EmptyState,
  FeatureCard,
  Field,
  Heading,
  Screen,
  StatusBadge,
} from '@/components';
import { listApprovedWorkers } from '@/repository';
import { useAsyncData } from '@/useAsyncData';

export default function BrowsePage() {
  const [search, setSearch] = useState('');
  const load = useCallback(() => listApprovedWorkers(), []);
  const { data = [], error, loading } = useAsyncData(load);
  const workers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter((worker) =>
      [worker.display_name, worker.bio ?? '', ...worker.categories].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [data, search]);
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 30 }}>
        <Heading
          eyebrow="Service directory"
          title="Find approved workers"
          body="Search real approved and available professionals by name, skill, or category."
        />
        <Field
          label="Search"
          value={search}
          onChangeText={setSearch}
          placeholder="Plumbing, electrical, worker name…"
        />
        <DataState loading={loading} error={error} />
        {!loading && !error && !workers.length ? (
          <EmptyState
            title="No workers found"
            body="Adjust the search or try again when approved workers become available."
          />
        ) : null}
        {workers.map((worker) => (
          <FeatureCard
            key={worker.account_id}
            icon="🧰"
            title={worker.display_name}
            body={`${worker.categories.join(' · ') || 'Category pending'}\n${worker.years} years · ${worker.reviewCount ? `${worker.rating.toFixed(1)} from ${worker.reviewCount} reviews` : 'No published reviews'}`}
          />
        ))}
        {workers.some((worker) => worker.recommendation_priority) ? (
          <StatusBadge label="Recommended placement never overrides suitability" tone="info" />
        ) : null}
      </ScrollView>
    </Screen>
  );
}
