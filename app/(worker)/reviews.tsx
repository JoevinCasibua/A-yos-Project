import React, { useEffect, useState } from 'react';
import { ReviewsTab } from '@/components/ReviewsTab';
import type { ReviewData } from '@/constants/workerMockData';
import { fetchWorkerProfile, fetchWorkerReviews } from '@/services/api';

export default function WorkerReviewsScreen() {
  const [reviews,setReviews]=useState<ReviewData[]>([]);useEffect(()=>{void fetchWorkerProfile().then(async profile=>{if(profile.data.id){const result=await fetchWorkerReviews();setReviews(result.data);}});},[]);return <ReviewsTab title="My Reviews" reviews={reviews} />;
}
