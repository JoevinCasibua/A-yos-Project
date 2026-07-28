import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkerProfile, updateWorkerProfile } from '@/services/worker.service';
import type { WorkerProfile } from '@/types';

export function useWorkerProfile(workerId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workers', 'profile', workerId],
    queryFn: () => getWorkerProfile(workerId),
    enabled: !!workerId,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<WorkerProfile>) =>
      updateWorkerProfile(workerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers', 'profile', workerId] });
    },
  });

  return { ...query, updateProfile: mutation };
}
