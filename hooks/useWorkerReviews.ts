import { useQuery } from '@tanstack/react-query';
import { getWorkerReviews } from '@/services/worker.service';

export function useWorkerReviews(workerId: string) {
  return useQuery({
    queryKey: ['workers', 'reviews', workerId],
    queryFn: () => getWorkerReviews(workerId),
    enabled: !!workerId,
  });
}
