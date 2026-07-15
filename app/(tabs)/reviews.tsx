import React from 'react';
import { View } from 'react-native';
import { ReviewsTab } from '@/components/ReviewsTab';
import { reviews } from '@/constants/mockData';
import { Spacing } from '@/constants/theme';
import { SectionHeader } from '@/components/SectionHeader';

export default function ReviewsScreen() {
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
