import { useQuery } from '@tanstack/react-query';
import { getWorkerBookings } from '@/services/worker.service';

export function useWorkerBookings(workerId: string) {
  return useQuery({
    queryKey: ['workers', 'bookings', workerId],
    queryFn: () => getWorkerBookings(workerId),
    enabled: !!workerId,
    staleTime: 5 * 60 * 1000,
  });
}
