import { EmptyState, Heading, Screen } from '@/components';
export default function BrowsePage() {
  return (
    <Screen>
      <Heading
        eyebrow="Service directory"
        title="Find approved workers"
        body="Search, filter, sort, select a category, and compare the top five suitable workers by skills, schedule, distance, ratings, and availability."
      />
      <EmptyState
        title="No configured categories"
        body="Worker discovery becomes available after an administrator publishes service categories and approved workers are available."
      />
    </Screen>
  );
}
