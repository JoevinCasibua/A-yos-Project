import { EmptyState, Heading, Screen } from '@/components';
export default function JobPosts() {
  return (
    <Screen>
      <Heading
        eyebrow="Job Posts"
        title="Matching service requests"
        body="Only approved, available, suitable workers receive authorized request details and may accept or decline with a reason."
      />
      <EmptyState
        title="No matching jobs"
        body="Eligible private requests appear here when category, schedule, service area, and availability match."
      />
    </Screen>
  );
}
