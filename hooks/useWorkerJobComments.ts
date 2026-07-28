import { useQuery } from '@tanstack/react-query';
import { jobComments as mockJobComments } from '@/constants/workerMockData';

export function useWorkerJobComments() {
  return useQuery({
    queryKey: ['workers', 'jobComments'],
    queryFn: async () => {
      // TODO: Replace with real API call
      return mockJobComments;
    },
    staleTime: 5 * 60 * 1000,
  });
}
