import { EmptyState, Heading, Screen } from '@/components';
export default function WorkerReviews() {
  return (
    <Screen>
      <Heading
        eyebrow="Reviews"
        title="Customer feedback"
        body="After completed and paid work, view the customer rating and review. Workers cannot submit feedback through this view."
      />
      <EmptyState
        title="No published feedback"
        body="Administrator-moderated customer feedback appears here."
      />
    </Screen>
  );
}
