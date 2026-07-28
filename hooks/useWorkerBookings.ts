import { useQuery } from '@tanstack/react-query';
import { getWorkerBookings } from '@/services/worker.service';

// TODO: Remove default mock ID once auth is wired
const MOCK_WORKER_ID = 'w1';

export function useWorkerBookings(workerId: string = MOCK_WORKER_ID) {
  return useQuery({
    queryKey: ['workers', 'bookings', workerId],
    queryFn: () => getWorkerBookings(workerId),
    staleTime: 5 * 60 * 1000,
  });
}
