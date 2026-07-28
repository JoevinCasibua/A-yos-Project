import { useQuery } from '@tanstack/react-query';
import { getWorkerBookings, getWorkerReviews } from '@/services/worker.service';
import { workerJobs } from '@/constants/workerMockData';

// TODO: Remove default mock ID once auth is wired
const MOCK_WORKER_ID = 'w1';

export function useWorkerJobs() {
  return useQuery({
    queryKey: ['workers', 'jobs'],
    queryFn: async () => {
      // TODO: Replace with real API call
      return workerJobs;
    },
    staleTime: 5 * 60 * 1000,
  });
}
