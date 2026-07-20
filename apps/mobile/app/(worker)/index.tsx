import { FeatureCard, Heading, Screen } from '@/components';
export default function WorkerDashboard() {
  return (
    <Screen>
      <Heading
        eyebrow="Worker dashboard"
        title="Your service workspace"
        body="Approval is required before accepting jobs. Recommendation priority never overrides skills, availability, schedule, or distance."
      />
      <FeatureCard
        icon="🪪"
        title="Verification status"
        body="Submit identity and professional information, then follow approval or document-request updates."
      />
      <FeatureCard
        icon="🗓️"
        title="Availability"
        body="Maintain service categories, work experience, service area, and available schedule."
      />
      <FeatureCard
        icon="📍"
        title="Active service tracking"
        body="Share booking location only during an authorized active service."
      />
    </Screen>
  );
}
