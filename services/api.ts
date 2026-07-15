import { providers, reviews, bookings, serviceCategories } from '@/constants/mockData';
import { workerProfile } from '@/constants/workerData';
import {
  workerReviews,
  workerJobs,
  workerBookings,
} from '@/constants/workerMockData';
import type { ReviewData, JobOpportunity, WorkerBooking } from '@/constants/workerMockData';
import type { WorkerProfile } from '@/constants/workerData';
import type { ProviderData } from '@/components/ProviderCard';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// ─── User API ────────────────────────────────────────────────────────────────

export async function fetchProviders(): Promise<ApiResponse<ProviderData[]>> {
  return { data: providers };
}

export async function fetchProviderById(id: string): Promise<ApiResponse<ProviderData | undefined>> {
  return { data: providers.find((p) => p.id === id) };
}

export async function fetchReviews(): Promise<ApiResponse<ReviewData[]>> {
  return { data: reviews as unknown as ReviewData[] };
}

export async function fetchBookings(): Promise<ApiResponse<typeof bookings>> {
  return { data: bookings };
}

export async function fetchServiceCategories() {
  return { data: serviceCategories };
}

// ─── Worker API ──────────────────────────────────────────────────────────────

export async function fetchWorkerProfile(): Promise<ApiResponse<WorkerProfile>> {
  return { data: workerProfile };
}

export async function fetchWorkerReviews(): Promise<ApiResponse<ReviewData[]>> {
  return { data: workerReviews };
}

export async function fetchWorkerJobs(): Promise<ApiResponse<JobOpportunity[]>> {
  return { data: workerJobs };
}

export async function fetchWorkerBookings(): Promise<ApiResponse<WorkerBooking[]>> {
  return { data: workerBookings };
}

export async function acceptJob(_jobId: string): Promise<ApiResponse<{ success: boolean }>> {
  return { data: { success: true } };
}

export async function startJob(_bookingId: string): Promise<ApiResponse<{ success: boolean }>> {
  return { data: { success: true } };
}

export async function completeJob(_bookingId: string): Promise<ApiResponse<{ success: boolean }>> {
  return { data: { success: true } };
}
