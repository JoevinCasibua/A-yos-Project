import { EmptyState, Heading, Screen } from '@/components';
export default function BookingsPage() {
  return (
    <Screen>
      <Heading
        eyebrow="Bookings"
        title="Upcoming, ongoing, completed, cancelled"
        body="Each booking follows the canonical lifecycle and exposes cancellation, contact, location, cash payment, receipt, and feedback only when eligible."
      />
      <EmptyState
        title="No bookings"
        body="Bookings appear after an approved worker accepts a submitted request."
      />
    </Screen>
  );
}
