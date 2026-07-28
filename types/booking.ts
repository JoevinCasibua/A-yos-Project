export type BookingStatus =
  | 'hired'
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'pending_review'
  | 'completed'
  | 'cancelled';

export interface WorkerBooking {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  date: string;
  time: string;
  address: string;
  lat: number;
  lng: number;
  status: BookingStatus;
  price: string;
  hourlyRate: number;
  hasParts?: boolean;
  partsDescription?: string;
  duration?: string;
  cancelledReason?: string;
  cancelledBy?: 'customer' | 'worker';
  serviceType?: string;
  voiceTranscript?: string;
  urgency?: string;
  possibleCause?: string;
  safetyAdvice?: string;
  paymentMethod?: 'cash' | 'online';
  pricingType?: 'hourly' | 'fixed';
  isReported?: boolean;
  reportedReason?: string;
  notes?: string;
}

export interface CancellationReason {
  id: string;
  label: string;
  category: 'customer' | 'worker' | 'job' | 'policy' | 'other';
  jobStages: ('before_traveling' | 'after_arriving' | 'after_inspecting')[];
  requiresInput?: boolean;
}

export interface ReportReason {
  id: string;
  label: string;
  category: 'safety' | 'service' | 'fraud';
}

export interface JobOpportunity {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  category: string;
  description: string;
  location: string;
  distance: string;
  offeredPrice: string;
  urgency: 'normal' | 'urgent';
  postedTime: string;
  imageUrl?: string;
  commentCount: number;
}

export interface JobComment {
  id: string;
  jobId: string;
  author: string;
  avatarUri: string;
  text: string;
  offerMin?: string;
  offerMax?: string;
  postedTime: string;
}

export const statusConfig: Record<BookingStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'error' | 'neutral' }> = {
  hired: { label: 'Hired', variant: 'info' },
  accepted: { label: 'Accepted', variant: 'info' },
  en_route: { label: 'En Route', variant: 'warning' },
  arrived: { label: 'Arrived', variant: 'warning' },
  in_progress: { label: 'In Progress', variant: 'success' },
  pending_review: { label: 'Pending Review', variant: 'neutral' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
};

export const jobStages = [
  { label: 'Before Traveling', value: 'before_traveling' as const },
  { label: 'After Arriving', value: 'after_arriving' as const },
  { label: 'After Inspecting', value: 'after_inspecting' as const },
];
