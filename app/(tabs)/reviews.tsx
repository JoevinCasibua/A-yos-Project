import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ReviewsTab } from '@/components/ReviewsTab';
import { fetchReviews } from '@/services/api';
import type { ReviewData } from '@/constants/workerMockData';
import { Spacing } from '@/constants/theme';
import { SectionHeader } from '@/components/SectionHeader';

export default function ReviewsScreen() {
  const [reviews,setReviews]=useState<ReviewData[]>([]);useEffect(()=>{void fetchReviews().then(result=>setReviews(result.data));},[]);
  return (
    <ReviewsTab
      title="Reviews"
      reviews={reviews}
      headerComponent={
        <View style={{ marginBottom: Spacing['4'] }}>
          <SectionHeader title="All Reviews" />
        </View>
      }
    />
  );
}
