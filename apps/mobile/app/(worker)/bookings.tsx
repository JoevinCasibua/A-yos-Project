import { EmptyState, Heading, Screen } from '@/components';
export default function WorkerBookings() {
  return (
    <Screen>
      <Heading
        eyebrow="Bookings"
        title="Prepare, travel, serve, complete"
        body="Advance accepted work one canonical status at a time, contact the customer, share live tracking when permitted, and confirm cash received."
      />
      <EmptyState
        title="No worker bookings"
        body="Accepted job posts and their payment-received state appear here."
      />
    </Screen>
  );
}
