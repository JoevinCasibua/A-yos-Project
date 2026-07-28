export type UrgencyLevel = 'ASAP' | 'This Week' | 'Open Bidding';

export type RequestStatus =
  | 'Draft'
  | 'Searching'
  | 'Accepted'
  | 'En_Route'
  | 'Arrived'
  | 'In_Progress'
  | 'Completed'
  | 'Pending_Confirmation'
  | 'Scheduled'
  | 'Posted';

export interface RequestState {
  photos: string[];
  description: string;
  category: string;
  aiSummary: string;
  aiRecommendations: string[];
  confidenceScore: number;
  hasParts?: boolean | null;
  partsDescription?: string;
  urgency: UrgencyLevel | null;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  selectedWorkerId: string | null;
  status: RequestStatus;
  estimatedPriceRange?: string;
  scheduledDate?: Date;
}
