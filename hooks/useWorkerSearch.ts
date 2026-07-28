import { useQuery } from '@tanstack/react-query';
import { searchWorkers } from '@/services/worker.service';

export function useWorkerSearch(query: string) {
  return useQuery({
    queryKey: ['workers', 'search', query],
    queryFn: () => searchWorkers(query),
    enabled: query.length > 0,
    staleTime: 30 * 60 * 1000,
  });
}
