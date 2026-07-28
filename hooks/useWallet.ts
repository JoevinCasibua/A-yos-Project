import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, requestPayout } from '@/services/wallet.service';

// TODO: Remove default mock ID once auth is wired
const MOCK_WORKER_ID = 'w1';

export function useWallet(workerId: string = MOCK_WORKER_ID) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['wallet', 'transactions', workerId],
    queryFn: () => getTransactions(workerId),
    enabled: !!workerId,
  });

  const payoutMutation = useMutation({
    mutationFn: ({
      amount,
      methodId,
    }: {
      amount: number;
      methodId: string;
    }) => requestPayout(workerId, amount, methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wallet', 'transactions', workerId],
      });
    },
  });

  return { ...query, requestPayout: payoutMutation };
}
