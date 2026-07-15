import React from 'react';
import { ReviewsTab } from '@/components/ReviewsTab';
import { workerReviews } from '@/constants/workerMockData';

export default function WorkerReviewsScreen() {
  return <ReviewsTab title="My Reviews" reviews={workerReviews} />;
}
