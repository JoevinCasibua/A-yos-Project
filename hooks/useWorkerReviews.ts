import { useQuery } from '@tanstack/react-query';
import { getWorkerReviews } from '@/services/worker.service';

// TODO: Remove default mock ID once auth is wired
const MOCK_WORKER_ID = 'w1';

export function useWorkerReviews(workerId: string = MOCK_WORKER_ID) {
  return useQuery({
    queryKey: ['workers', 'reviews', workerId],
    queryFn: () => getWorkerReviews(workerId),
  });
}
