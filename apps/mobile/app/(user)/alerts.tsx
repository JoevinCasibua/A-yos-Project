import { EmptyState, Heading, Screen } from '@/components';
export default function AlertsPage() {
  return (
    <Screen>
      <Heading
        eyebrow="Alerts"
        title="Updates and notifications"
        body="Worker messages, booking status, payment updates, promotions, and system notices are grouped here."
      />
      <EmptyState title="No alerts" body="New notifications will appear after delivery." />
    </Screen>
  );
}
